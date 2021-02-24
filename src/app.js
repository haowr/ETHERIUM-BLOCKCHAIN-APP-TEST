

App = {

    contracts: {},
    loading: false,
    load: async() =>{

        //Load Web3 Library.....
        await App.loadWeb3(),
        await App.loadAccount(),
        await App.loadContract(),
        await App.render()

    },
 // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
        web3.eth.defaultAccount = web3.eth.accounts[0]
//personal.unlockAccount(web3.eth.defaultAccount)
        } else {
        window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
        } catch (error) {
            // User denied account access...
        }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async() =>{
      console.log(web3.eth.accounts)

        App.account = web3.eth.accounts[0]//ACCOUNT CONNECTED TO IN METAMASK //
        console.log(App.account)

    },

    loadContract: async()=>{

        const todoList = await $.getJSON('TodoList.json')
        //LOAD/CREATE/'TRUFFLE CONTRACT'// 
        //.JS REPRESENTATION OF SMARTCONTRACT 'TODOLIST.SOL'//
        App.contracts.TodoList = TruffleContract(todoList)
        //MAKES IT SO THAT WE'RE ABLE TO INTERACT WITH THE SMART CONTRACT .SOL FILE
        // W JAVASCRIPT//
        App.contracts.TodoList.setProvider(App.web3Provider)
        // MAKES IT SO THAT WE'RE ABLE TO CONNECT TO THE BLOCKCHAIN AND COMMUNICATE WITH IT. SEND RECIEVE DATA.
        App.todoList = await App.contracts.TodoList.deployed()
        //GET BLOCKCHAIN DATA WE DEPLOYED...
        console.log(todoList)

    },
    render: async () => {
        // Prevent double render
        if (App.loading) {
          return
        }
    
        // Update app loading state
        App.setLoading(true)
    
        // Render Account
        $('#account').html(App.account)
    
        // Render Tasks
        await App.renderTasks()
    
        // Update loading state
        App.setLoading(false)
      },
    

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },
  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },
  createTask: async()=>{

    App.setLoading(true)
    const content = $('#newTask').val()
    await App.todoList.createTask(content)
    window.location.reload()

  }

     

}


// When loaded run.. //
$(()=>{
        $(window).load(()=>{

            App.load()
            console.log("App Loaded..")
        })
})