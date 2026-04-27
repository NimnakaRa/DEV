let userInput = prompt("What would you like to do");
const toDoList = []

while (userInput !== 'quit') {
    if (userInput === 'new') {
        let newToDo = prompt('Enter new To-Do');
        toDoList.push(newToDo);
        console.log(`${newToDo} added to the list`);
    }
    if (userInput === 'list') {
        console.log('********');
        for (let i = 0; i < toDoList.length; i++) {
            console.log(`[${i}]: ${toDoList[i]}`);
        }
        console.log('********');
    }
    if (userInput === 'delete') {
        let deleteIndex = prompt('Enter index of deleted To-Do');
        console.log(`${toDoList[deleteIndex]} Has been deleted`);
        toDoList.splice(deleteIndex, 1);
    }
    userInput = prompt("What would you like to do now");
}

console.log('YOU HAVE QUIT')