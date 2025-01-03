import { Logic, Visual } from '../../Controller.js';

function addItem(command, todoObj) {

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

export default addItem;