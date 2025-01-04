import { Logic, Visual } from '../../Controller.js';

// =====================================================================================================================================================

function addItem(command, todoObj, value) {

    if(Number.isInteger(+value.split(' ')[1])) {   // means: if it's a number -->  for cases when there is something like: add 1 hi  (which is adding a subtask to the 1st majortask)
        // adding a subtask here:
        console.log(`adding a subtask`)
        addSubtask(todoObj, value)
        return
    }

    // performing a small check first to ensure that we're not adding any duplicates:
    const existingNames = Logic.getStateTodos().map(todo => todo.name)
    if(existingNames.includes(todoObj.name)) {
        Visual.showSystemMessage(`error: todo is already on the list`)
        return
    }

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


// command: 'add 10 subtask 1' (DONE) or 'add 10 subtask 2, subtask 3' (DONE)
function addSubtask(todoObj, fullCommand) {
    const indexInUI = fullCommand.split(' ')[1] // index of a majortask, as it is in the UI
    let name = fullCommand.split(' ').slice(2).join(' ').trim()

    // case: I am adding more than one subtask: 'add 10 subtask 22, subtask 33'
    if(name.includes(',')) { 
        // console.log(`adding more than one subtask`)
        const subtasksToAdd = name.split(',').map(x => x.trim())
        subtasksToAdd.forEach(sub => addSubtask({}, `add ${indexInUI} ${sub}`))    // calling this fn recursively
        return
    }

    const subtaskObj = {
        created: new Date().toISOString(),
        id: Date.now(),
        isCompleted: false,
        name,
    }
    
    // performing a small check first:
    if(Logic.getStateTodos()[+indexInUI -1].hasSubtasks) {   // if the majortask has subtasks...
        const existingSubtaskNames = Logic.getStateTodos()[+indexInUI -1].subtasks.map(sub => sub.name)
        if(existingSubtaskNames.includes(name)) {     // ... and those subtasks already have the one with the same name, show error    (small protection against duplicates)
            Visual.showSystemMessage(`error: subtask is already on the list`)
            return
        }
    }

    Logic.pushSubtask(indexInUI, subtaskObj)  // pushing subtask to Model's state
    Logic.pushRecentCommand(fullCommand) // pushing recent command to Model's state
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    Visual.showSystemMessage(`added subtask "${name}"`) // showing system message in the UI 

    Visual.removeAllTodos()   // removing all todo elements to re-render
    Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1))  // re-rendering all todo elements anew
    
    // if the sorting mode is on:
    if(Logic.state.isSortMode) {
        sortTodos(`sort ${Logic.state.sortModeCriterion}`)    // restoring the state that was before the re-render
    }
}

// =====================================================================================================================================================

export default addItem;