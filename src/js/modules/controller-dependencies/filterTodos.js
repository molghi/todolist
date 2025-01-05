import { Logic, Visual } from '../../Controller.js';

function filterTodos(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage

    const valueWithoutCommand = value.includes(' ') ? value.slice(value.indexOf(' ')+1) : null  // if 'value' has no whitespace, pass null; else slice the command out
    
    // case: if the 'value' has no whitespace, meaning it was something like 'fil'
    if(!valueWithoutCommand) {
        Visual.showSystemMessage('error: filter called with no value')
        Visual.clearFormInput()
        return
    }

    // case: showing (or unhiding) all todos (clearing any filter)
    if(valueWithoutCommand === 'all') {
        [...document.querySelectorAll('.item')].forEach(x => Visual.toggleTodo(x, 'show')) // showing all
        Visual.showSystemMessage('filter cleared')
        Visual.clearFormInput()
        return
    }
    
    // case: if the 'value' with command sliced out didn't start with any flag, meaning it was something like 'fil buy butter'  (it must be 'fil -n buy butter')
    if(!valueWithoutCommand.trim().startsWith('-')) {
        Visual.showSystemMessage('error: you must use flags and their values to filter, example: "fil -n buy milk -c food"')
        Visual.clearFormInput()
        return
    }

    const parsedFlags = Logic.parseFilterString(valueWithoutCommand)      // 'parsedFlags' is an object of flags looking like: {priority: 'high'}

    // case: changing 'today' and 'tomorrow' in parsedFlags.deadline (if it is there) to dates like '05.01' and '06.01' so it could filter right:
    const today = String(new Date().getDate()).padStart(2,0) + '.' + String(new Date().getMonth()+1).padStart(2,0)
    const tomorrow = String(new Date().getDate()+1).padStart(2,0) + '.' + String(new Date().getMonth()+1).padStart(2,0)
    if(parsedFlags.hasOwnProperty('deadline') && parsedFlags.deadline === 'today') parsedFlags.deadline = today
    if(parsedFlags.hasOwnProperty('deadline') && parsedFlags.deadline === 'tomorrow') parsedFlags.deadline = tomorrow

    // case: if the flags passed do not exist (command was sth like 'fil -k high') or if I passed a flag but no value like 'fil -p'
    if(Object.keys(parsedFlags).length === 0) {
        Visual.showSystemMessage('error: filtering returned no results')
        Visual.clearFormInput()
        return
    }

    // case: if the sorting mode is on, reset it, remove all todos in the UI and render them again: 
    if(Logic.state.isSortMode) {
        Logic.state.isSortMode = false
        Logic.state.sortModeCriterion = 'default'
        Visual.removeAllTodos()     // removing all todos in the UI (to re-render)
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all todos anew
    }
    
    const allTodoEls = [...document.querySelectorAll('.item')]  // getting all todo elements in the UI

    const todosSatisfyingCondition = allTodoEls.filter(todoInUI => {    // getting all todo elements in the UI that satisfy the filtering condition 
        const temp = []
        Object.entries(parsedFlags).forEach(entryArr => {
            return todoInUI.getAttribute(`data-${entryArr[0]}`)?.includes(`${entryArr[1]}`) && temp.push(todoInUI)
        })
        if (temp.length === Object.keys(parsedFlags).length) return todoInUI
    })
    
    // case: if the todos that satisfy the filtering condition were not found, print error:
    if(todosSatisfyingCondition.length === 0) {
        Visual.showSystemMessage('error: filtering returned no results')
        Visual.clearFormInput()
        return
    }
    
    [...document.querySelectorAll('.item')].forEach(x => Visual.toggleTodo(x, 'show')) // showing/unhiding all todos in the UI (in case if some were hidden with the prev filtering)
    const todosNotSatisfyingCondition = allTodoEls.filter(todo => !todosSatisfyingCondition.includes(todo))  // getting all todos that don't satisfy the filtering condition 
    todosNotSatisfyingCondition.forEach(x => Visual.toggleTodo(x)) // hiding the todos that don't satisfy the filtering condition
    const flagsString = Object.keys(parsedFlags).join(', ')  // concatting passed flags to show the UI message
    Visual.showSystemMessage(`filtered by ${flagsString} (type "fil all" to remove filter)`)  // showing the UI message
    Visual.clearFormInput() // clearing the input field
}


// ================================================================================================



export default filterTodos;