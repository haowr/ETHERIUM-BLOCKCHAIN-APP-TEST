pragma solidity^0.5.0;

contract TodoList{

    uint public taskCount = 0;

    //"STRUCT(STRUCTURE)"//
    // A WAY TO MODEL THE TASK //
    // SOLIDITY ALLOWS US TO DEFINE OWN DATA TYPES //
    // STATIC TYPED LANGUAGE SOLIDTY //
    struct Task {

        uint id;
        string content;
        bool completed;

    }

    // acccess the storage of the blockchain //

    // create state variable //
    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed

    );
    // now we have a way to create new tasks and place them in the database..//
    constructor() public {

        createTask("Check out dappuniversity.com");

    }
    //a way to put the task struct inside the mapping//

    function createTask(string memory _content) public{

        taskCount ++;
        tasks[taskCount] = Task(taskCount,_content,false);
        //BROADCAST AN EVENT THAT THE TASK WAS CREATED // 
        emit TaskCreated(taskCount,_content,false);


    }

}