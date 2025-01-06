import { Logic, Visual } from '../../Controller.js';

// =====================================================================================================================================================

function addItem(command, todoObj, value) {   // 'value' is the entire command string, 'command' is a pure command like just 'add' or 'edit'

    if(Number.isInteger(+value.split(' ')[1])) {   // if it's a number --> for cases when there is something like 'add 1 hi', which is adding a subtask to the 1st majortask
        // adding a subtask here:
        return addSubtask(todoObj, value)
    }

    // performing a small check first to ensure we're not adding any duplicates:
    const existingNames = Logic.getStateTodos().map(todo => todo.name)
    if(existingNames.includes(todoObj.name)) return Visual.showSystemMessage(`error: todo is already on the list`);

    Logic.pushToDo(todoObj)  // pushing todo to Model's state
    Logic.pushRecentCommand(todoObj.command) // pushing recent command to Model's state
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    const actionString = Visual.setDoneAction(command, todoObj)  // this is to show system message in the next line
    Visual.showSystemMessage(actionString) // showing system message in the UI 

    // if the sorting mode is on:
    if(Logic.state.isSortMode) {
        Visual.removeAllTodos()   // removing all todo elements to re-render
        Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1))  // re-rendering all todo elements anew
        sortTodos(`sort ${Logic.state.sortModeCriterion}`)    // restoring the state that was before the re-render
        return
    }

    const index = Logic.getStateTodos().length
    Visual.renderToDo(todoObj, index)   // creating a DOM element and appending it (rendering a todo)
}


// =====================================================================================================================================================


// a dependency of 'addItem' here -- command: 'add 10 subtask 1' or 'add 10 subtask 2, subtask 3'
function addSubtask(todoObj, fullCommand) {
    const indexInUI = fullCommand.split(' ')[1]   // index of a majortask, as it is in the UI now
    let name = fullCommand.split(' ').slice(2).join(' ').trim()   // slicing out the pure command ('add') and the index of a majortask from 'fullCommand'

    // case: I am adding more than one subtask: 'add 10 subtask 2, subtask 3'
    if(name.includes(',')) { 
        const subtasksToAdd = name.split(',').map(x => x.trim())  // making those subtasks an array
        subtasksToAdd.forEach(sub => addSubtask({}, `add ${indexInUI} ${sub}`))    // calling this fn recursively
        return
    }

    const subtaskObj = Logic.getNewSubtaskObj(name)   // 'Logic.getNewSubtaskObj' returns an obj with keys: created, id, isCompleted, and name
    
    // performing a small check first to ensure we're not adding any duplicates:
    if(Logic.getStateTodos()[+indexInUI -1].hasSubtasks === true) {   // if the majortask has subtasks...
        const existingSubtaskNames = Logic.getStateTodos()[+indexInUI -1].subtasks.map(sub => sub.name)   // getting an array of just the names of those subtasks
        if(existingSubtaskNames.includes(name)) {     // ... and those subtasks already have the one with the same name, show error.
            return Visual.showSystemMessage(`error: subtask is already on the list`)
        }
    }

    Logic.pushSubtask(indexInUI, subtaskObj)  // pushing subtask to Model's state
    Logic.pushRecentCommand(fullCommand) // pushing recent command to Model's state
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    Visual.showSystemMessage(`added subtask "${name}"`) // showing system message in the UI 
    Visual.removeAllTodos()   // removing all todo elements to re-render
    Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1))  // re-rendering all todo elements anew
    
    // if the sorting mode is on:
    if(Logic.state.isSortMode) sortTodos(`sort ${Logic.state.sortModeCriterion}`);   // restoring the state how it was sorted before the re-render
}

// =====================================================================================================================================================

export default addItem;