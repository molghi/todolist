'use strict'

import '../styles/main.scss'

import Model from './modules/Model.js'  
import View from './modules/View.js'  
import favicon from '../img/favicon.ico'

const Logic = new Model()
const Visual = new View()

// =======================================================================================================================================

// on app start:
function init() {

    const myState = Logic.getFromLS('state')

    if(myState) { // if local storage for state is not empty...
        const fetchedState = JSON.parse(myState)
        console.log(`fetchedState`,fetchedState)
        fetchedState.todos.forEach((toDo, i) => {
            Visual.renderToDo(toDo, i+1) // render each todo
            Logic.pushToDo(toDo) // push to Model's state
        }) 
        console.log(`LogicState`, Logic.getState())
        if(fetchedState.accentColor) {
            Logic.changeAccentColor(fetchedState.accentColor)
            Visual.changeUIColors(fetchedState.accentColor)
        }
    }

    Visual.focusInput()
    runEventListeners() 
    Visual.shiftCursorToTheEndNow()
}
init()

// =======================================================================================================================================

function runEventListeners() {
    Visual.formSubmit(handleFormSubmit) // 'handleFormSubmit' is a general router fn -- 'formSubmit' calls 'handleFormSubmit' with the string of the typed command
    Visual.handleArrowKeys(arrowKeysHandler) // arrow keys handler
    Visual.formatInput() // to make sure that '> ' at the beginning of the input is undeletable
    Visual.deUppercaseInput() // I allow no uppercase to be typed in
    Visual.shiftCursorToTheEndAfterPasting()  // happens upon the 'paste' event: shifts the cursor in the input field to the end of what's in the input field
    Visual.handleCompletingTodo(completeTodoByBtn)
    Visual.trackTabPress(autocompleteValue)

    // Visual.handleFiltering()
    // Visual.handleRemovingAllTodos(deleteTodos)
    Visual.handleEditingTodo(editTodoByBtn) 
    Visual.handleRemovingTodo(deleteTodoByBtn) 
}

// =======================================================================================================================================

// bringing up the previous or next command if the input field is active, by pressing Up and Down arrow keys:
function arrowKeysHandler(command, activeEl) {
    // if(activeEl.value !== '> ') return
    if(command === 'show previous command') {
        activeEl.value = '> ' + Logic.getRecentCommand('prev')
    }
    if(command === 'show next command') {
        activeEl.value = '> ' + Logic.getRecentCommand('next')
    }
    setTimeout(() => {
        Visual.shiftCursorToTheEndNow()
    }, 10);
}

// =======================================================================================================================================

// general router function:
function handleFormSubmit(value, type='') { 
    // 'value' here is the string of the typed command with the first '> ' sliced out
    let command, todoObj
    command = value.includes(' ') ? value.slice(0, value.indexOf(' ')).trim() : value

    if(value.includes(`are you sure you want to delete`)) {
        value = value.slice(value.lastIndexOf(' ')+1)
        const indexToRemove = Visual.itemToDelete?.querySelector('.item__number').textContent
        if(!value) value = `delete ${indexToRemove}`
        Logic.state.mode = 'delete'
        if(type==='click event') { // if deletion was triggered through pressing the item's delete button:
            Logic.state.mode = ''
            Visual.focusInput()
        }
        command = 'delete'
    }

    if(value.includes('delete all of your todos')) {
        value = value.slice(value.lastIndexOf(' ')+1)
        console.log(value)
        command = 'clearall'
    }

    // console.log(value, ',', command)

    if(!command) {  
        Visual.showSystemMessage('error: no command received')
        Visual.clearFormInput()
        return
    }

    if(command === 'add') {
        [command, todoObj] = Logic.makeTodoObject(value)
        addItem(command, todoObj)
        Visual.clearFormInput()
        return
    }

    if(command === 'edit') {
        editItem(value)
        return
    }

    if(command === 'changecol' || command === 'cc') { 
        changeColor(value)
        Visual.clearFormInput()
        return
    }

    if(command === 'delete' || command === 'del' || Logic.state.mode === 'delete') {
        deleteItem(value)
        return
    }

    if(command === 'clearall') {
        deleteTodos(value)
        return
    }

    if(command === 'filter' || command === 'fil') {
        filterTodos(value)
        return
    }

    if(command === 'sort') {
        sortTodos(value)
        return
    }

    if(command === 'export') {
        exportTodos()
        return
    }

    if(command === 'import') {
        importFile()
        return
    }
    
    Visual.clearFormInput()
    Visual.showSystemMessage('error: command does not exist, type "manual" or "man" to see the manual')
}

// =======================================================================================================================================

// adding a todo:
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

// =======================================================================================================================================

// changing the UI color:
function changeColor(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
    const color = value.includes(' ') ? value.slice(value.indexOf(' ')+1) : null   // if 'value' (an entire command) has no whitespace, pass null; else slice the command word out
    const colorUI = Visual.changeUIColors(color)   // changing the color
    if(colorUI) { // if it's not null
        Visual.showSystemMessage(`changed ui color to: ${colorUI === '#32cd32' ? 'default' : colorUI}`)    // showing UI message
        Logic.changeAccentColor(colorUI)     // pushing it to Model's state
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    } 
}

// =======================================================================================================================================

// delete one todo
function deleteItem(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state

    if(Logic.state.mode === 'delete') {
        if(value === 'n' || value === 'no') {
            Visual.showSystemMessage(`deletion was cancelled`)
            Visual.clearFormInput()
            Logic.state.mode = ''
            return
        }
        if(value === 'y' || value === 'yes') {
            let indexToRemove = Visual.itemToDelete.querySelector('.item__number').textContent
            const deletedName = Visual.itemToDelete.querySelector('.item__name').textContent
            if(Logic.state.isSortMode) {
                const properIndex = Logic.getProperIndex(deletedName) + 1
                indexToRemove = properIndex
            }       
            Visual.itemToDelete.remove()
            Logic.removeTodo(indexToRemove)
            Logic.state.mode = ''
            Visual.showSystemMessage(`"${deletedName}" was deleted successfully`)
            Visual.clearFormInput()
            Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
            Visual.removeAllTodos()  // removing all items to re-render
            Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
            if(Logic.state.isSortMode)  {
                Logic.state.isSortMode = false
                sortTodos(`sort ${Logic.state.sortModeCriterion}`)
            }
            return 
        }
        Visual.clearFormInput()
        Visual.showSystemMessage(`answer was not recognised`)
        Logic.state.mode = ''
        return
    }

    const afterCommand = value.includes(' ') ? value.slice(value.indexOf(' ')+1).trim() : null
    if(!afterCommand) {
        return Visual.showSystemMessage(`error: no value passed to delete`)
    }
    if(!document.querySelector('.item__number')) {
        Visual.showSystemMessage(`error: no tasks to delete`)
        return Visual.clearFormInput()
    }
    Visual.itemToDelete = Array.from(document.querySelectorAll('.item__number')).find(x => x.textContent === afterCommand)?.closest('.item')

    if(!Visual.itemToDelete) {
        Visual.showSystemMessage(`error: no such item to delete`)
        return Visual.clearFormInput()
    }
    const itemNameToDelete = Visual.itemToDelete.querySelector('.item__name').textContent
    Visual.setInputValue(`> are you sure you want to delete "${itemNameToDelete}"? type y/n: `)
    Visual.shiftCursorToTheEndNow()
}

// =======================================================================================================================================

// delete one todo by clicking the delete btn:
function deleteTodoByBtn(todoName) {
    Visual.setInputValue(`> are you sure you want to delete "${todoName}"? type y/n: `)    // prompting first
    // getting that todo element which has the name that matches 'todoName':
    Visual.itemToDelete = [...document.querySelectorAll('.item')].find(x => x.querySelector('.item__name').textContent === todoName) 
    handleFormSubmit(document.querySelector('.form-input').value, `click event`)  // calling 'handleFormSubmit' with the value of the input field
}

// =======================================================================================================================================

// deleting all todos with the 'clearall' command:
function deleteTodos(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state

    // first, I prompt to see if I want them all deleted or not:
    if(value.startsWith('clearall')) {
        Visual.setInputValue('> delete all of your todos? careful! type y/n: ')
        return
    }

    // case: I want them all deleted (I typed 'y' or 'yes'):
    if(value === 'y' || value === 'yes') {
        Visual.removeAllTodos()    // removing all from the UI
        Logic.removeTodos()       // Model state.todos sets to []
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.showSystemMessage('all todos were deleted')  // showing a message in the UI
        Visual.clearFormInput()    // clearing the input field
        return
    }

    // case: I don't want them all deleted (I typed 'n' or 'no'):
    if(value === 'n' || value === 'no') {
        Visual.showSystemMessage('deletion was cancelled')
        Visual.clearFormInput()    // clearing the input field
        return
    }

    // case: what I typed wasn't 'y', 'yes', 'n' or 'no', so I show a UI message and clear the input:
    Visual.showSystemMessage('answer was not recognised')
    Visual.clearFormInput()    // clearing the input field
}

// =======================================================================================================================================

// unused fn:
function pushTodos(newToDoValue) { // happens on form submission: 'handleFormSubmit' calls this fn with formInputValue
    if(!newToDoValue) return
    Logic.pushToDo(newToDoValue) // push to Model's state
    Logic.pushTodosToLS() // push to local storage
    Visual.toggleExtraFeatures()
}

// =======================================================================================================================================

function editTodoByBtn(valueToEdit) {
    // it runs if I clicked on the edit btn of some todo: now I need to get its index from the UI:
    const itsIndexInUI = [...document.querySelectorAll('.item__name')].find(x => x.textContent === valueToEdit)?.previousElementSibling.textContent   
    editItem(`edit ${itsIndexInUI}`)   // calling the 'editItem' fn 
    Visual.focusInput()   // bringing focus to the input field
}

// =======================================================================================================================================

function editItem(value) {
    // 'value' here is the command string
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state

    let params, name, properIndex
    let valueMinusCommand = value.slice(value.indexOf('edit ')+5).trim()

    // case: if the sorting mode is on, I need to get the proper index:
    if(Logic.state.isSortMode) {
        const valueAtIndex = [...document.querySelectorAll('.item__number')].find(x => x.textContent === valueMinusCommand.slice(0,valueMinusCommand.indexOf(' '))).nextElementSibling.textContent
        properIndex = Logic.getProperIndex(valueAtIndex) + 1
        valueMinusCommand = valueMinusCommand.slice(valueMinusCommand.indexOf(' ')+1)
        valueMinusCommand = `${properIndex} ` + valueMinusCommand
    }

    // case: if the command was either like 'edit 3 -p high' or 'edit buy bread -c food -p high' :
    if(valueMinusCommand.includes(' ')) {   
        valueMinusCommand = valueMinusCommand.slice(0, valueMinusCommand.indexOf(' '))
        params = value.slice(value.indexOf(valueMinusCommand)+1+valueMinusCommand.length)
    }

    // case: if there was no value after 'edit', I show error :
    if(!valueMinusCommand) {
        Visual.showSystemMessage('error: edit called with no value')
        Visual.clearFormInput()
        return
    }
    
    // case: runs after I brought the entire todo to the input and now I am submitting it :
    if(Number.isNaN(Number(valueMinusCommand))) {  
        // check if such a name exists in the UI
        const allTodoNames = [...document.querySelectorAll('.item__name')].map(itemEl => itemEl.textContent)
        name = value.slice(value.indexOf(' '), value.indexOf('-') > 0 ? value.indexOf('-') : value.length).trim()
        params = value.slice(value.indexOf(name)+name.length+1)
        if(!allTodoNames.includes(Logic.getOldValue())) {
            Visual.showSystemMessage('error: name to edit was not found')
            return 
        }
        const [command, todoObj] = Logic.parseCommandString(value)

        // performing a small check first to ensure that we're not editing to have any duplicates after:
        const existingNames = Logic.getStateTodos().map(todo => todo.name)
        if(existingNames.includes(todoObj.name)) {
            Visual.showSystemMessage(`error: todo is already on the list`)
            return
        }

        Logic.editTodo(todoObj)
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Visual.showSystemMessage(`value edited successfully`)
        return
    }

    // small check to ensure that an index exists in the UI
    const allItemNumbers = [...document.querySelectorAll('.item__number')].map(itemEl => itemEl.textContent)
    if(!allItemNumbers.includes(valueMinusCommand)) {
        Visual.showSystemMessage('error: item index does not exist')
        Visual.clearFormInput()
        return
    }

    // case: I typed 'edit 3' :    (OR! I clicked on the edit btn)
    if(!params) {
        console.log(`no params, bringing all of it into the input`)
        const [todoObjString, todoNameOld] = Logic.getTodoObjString(valueMinusCommand) // to bring this entire todo to the input 
        Logic.setOldValue(todoNameOld) // in case if I change the name to a new one, to be able to find it
        Visual.setInputValue(todoObjString)
    } 
    
    else {   // case: I typed 'edit 3 -p medium' 
        console.log(`params are there, no bringing to the input`)
        let itsName = [...document.querySelectorAll('.item__number')].find(x => x.textContent === valueMinusCommand)?.nextElementSibling.textContent
        let properCommand = value.replace(valueMinusCommand, itsName)

        // additional steps to do if we're in the sorting mode:  getting proper index
        if(Logic.state.isSortMode) {
            properCommand = properCommand.slice(properCommand.indexOf('edit')+5) // slicing out 'edit '
            const index = properCommand.slice(0, properCommand.indexOf(' '))
            itsName = [...document.querySelectorAll('.item__number')].find(x => x.textContent === index)?.nextElementSibling.textContent
            properCommand = properCommand.slice(properCommand.indexOf(' ')).trim() // slicing out index
            properCommand = `edit ${properIndex} ${properCommand}`
        }

        Logic.setOldValue(itsName) // in case if I change the name to a new one, to be able to find it
        const [command, todoObj] = Logic.parseCommandString(properCommand) 
        
        // performing a small check first to ensure that we're not editing to have any duplicates after:
        const existingNames = Logic.getStateTodos().map(todo => todo.name)
        if(existingNames.includes(todoObj.name)) {
            Visual.showSystemMessage(`error: todo is already on the list`)
            return
        }
        
        Logic.editTodo(todoObj)
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Visual.showSystemMessage(`value edited successfully`)

        // additional steps to do if we're in the sorting mode:  re-rendering according to the existing sorting criterion
        if(Logic.state.isSortMode) {
            sortTodos(`sort ${Logic.state.sortModeCriterion}`)
        }
    }
}

// =======================================================================================================================================

function filterTodos(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
    const valueWithoutCommand = value.includes(' ') ? value.slice(value.indexOf(' ')+1) : null  // if 'value' has no whitespace, pass null; else slice the command out
    
    // case: if the 'value' has no whitespaces, meaning it was something like 'fil'
    if(!valueWithoutCommand) {
        Visual.showSystemMessage('error: filter called with no value')
        Visual.clearFormInput()
        return
    }

    // case: showing or unhiding all todos (clearing the filter)
    if(valueWithoutCommand === 'all') {
        [...document.querySelectorAll('.item')].forEach(x => Visual.toggleTodo(x, 'show')) // showing all
        Visual.showSystemMessage('filter cleared')
        Visual.clearFormInput()
        return
    }
    
    // case: if the 'value' with command sliced out didn't start with any flag, meaning it was something like 'fil buy butter'  (it must be 'fil -n buy butter')
    if(!valueWithoutCommand.trim().startsWith('-')) {
        Visual.showSystemMessage('error: you must use flags to filter, example: "fil -n buy milk -c food"')
        Visual.clearFormInput()
        return
    }

    const parsedFlags = Logic.parseFilterString(valueWithoutCommand)

    // case: if the flags passed do not exist???
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

    const todosSatisfyingCondition = allTodoEls.filter(todoInUI => {    // getting all todo elements that satisfy the filtering condition 
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

// =======================================================================================================================================

function completeTodoByBtn(indexToEdit, type='majortask') {
    if(type===`subtask`) {
        const [majortaskIndex, subtaskIndex] = indexToEdit.split('.')
        const todo = Logic.getState().todos.find((x,i) => i === majortaskIndex-1)
        todo.subtasks[subtaskIndex-1].isCompleted = !todo.subtasks[subtaskIndex-1].isCompleted
        // console.log(todo.subtasks.map(x => x.isCompleted))
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        const allSubtaskEl = [...document.querySelectorAll('.item__subtask')].find(x => x.querySelector('td:nth-child(2)').textContent === indexToEdit)
        if(todo.subtasks[subtaskIndex-1].isCompleted) allSubtaskEl.querySelector('td:nth-child(3)').classList.add('finished')
        else allSubtaskEl.querySelector('td:nth-child(3)').classList.remove('finished')
        return 
    }
    const todo = Logic.getState().todos.find((x,i) => i === indexToEdit-1)
    todo.isCompleted = !todo.isCompleted
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    Visual.removeAllTodos() // removing all to re-render
    Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
}

// =======================================================================================================================================

function sortTodos(value) {             // I can rewrite all IF's here in a better way
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
    Logic.state.isSortMode = true
    const criterion = value.trim().split(' ')[1]

    if(criterion === 'created' || criterion === 'default' || criterion === 'def') {  
        Visual.showSystemMessage('sorted by "created" (default)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.isSortMode = false
        Logic.state.sortModeCriterion = 'default'
    }
    else if(criterion === 'name') {
        Visual.showSystemMessage('sorted by "name" (a to z) (type "sort def" to remove sorting)') 
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('name')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'name'
    }
    else if(criterion === 'priority') {                      
        Visual.showSystemMessage('sorted by "priority" (high to low) (type "sort def" to remove sorting)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('priority')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'priority'
    }
    else if(criterion === 'category') {
        Visual.showSystemMessage('sorted by "category" (a to z) (type "sort def" to remove sorting)') 
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('category')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'category'
    }
    else if(criterion === 'subtasks') {   
        Visual.showSystemMessage('sorted by "subtasks" (true to false) (type "sort def" to remove sorting)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('subtasks')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'subtasks'
    }
    else if(criterion === 'finished') {   
        Visual.showSystemMessage('sorted by "finished" (false to true) (type "sort def" to remove sorting)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('finished')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'finished'
    } 
    else if(criterion === 'deadline') {
        Visual.showSystemMessage('sorted by "deadline" (type "sort def" to remove sorting)')
        console.log(`sort by deadline: from overdue to today to this week`)      // not really done
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('deadline')
        console.log(newOrder)
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'deadline'
    }
    else {
        Visual.showSystemMessage('sorting error: non-existing criterion (default state returned)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'default'
    }
}

// =======================================================================================================================================

function autocompleteValue(value) {
    if(!value) return
    const command = Logic.getCommands().find(command => command.startsWith(value))   // getting the 1st command that satisfies the condition
    if(!command) return 
    Visual.setInputValue(`${command} `)  // setting the value of the input field
}

// =======================================================================================================================================

// export Model state as JSON:
function exportTodos() {
    Logic.pushRecentCommand(`export`) // pushing recent command to Model's state

    const myData = Logic.getState()
    const now = new Date()
    const nowString = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}--${now.getHours()}-${now.getMinutes()}`
    const filename = `my-data-${nowString}.json`

    const json = JSON.stringify(myData, null, 2); // Converting data to JSON: Converts the JavaScript object 'myData' into a formatted JSON string. The 'null, 2' arguments ensure the output is pretty-printed with 2-space indentation for readability.
    const blob = new Blob([json], { type: 'application/json' }); // Creating a blob: Creates a binary large object (Blob) containing the JSON string, specifying the MIME type as 'application/json' to ensure it's recognised as a JSON file.
    const url = URL.createObjectURL(blob); // Creating a download URL: Generates a temporary URL pointing to the Blob, enabling it to be downloaded as a file by associating it with a download link.

    // Create an invisible anchor element for downloading
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the URL

    Visual.clearFormInput()
    Visual.showSystemMessage('data was exported successfully')
}

// =======================================================================================================================================

// import JSON file:
function importFile() {
    Logic.pushRecentCommand(`import`) // pushing recent command to Model's state

    const fileInputEl = document.querySelector('.file-input')
    fileInputEl.click()


    fileInputEl.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return console.log(`no file`);

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result); // Parse JSON if that's the expected format
                const isValidImport = isCorrectInput(data)
                if(!isValidImport) {
                    Visual.showSystemMessage('error: invalid import')
                    Visual.clearFormInput()
                    return
                }
                Logic.import(data)  // taking that imported 'data' object and assigning its props to Model
                Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
                Visual.removeAllTodos() // removing all todo elements to re-render
                Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
                if(Logic.getState().accentColor) {
                    Visual.changeUIColors(Logic.getState().accentColor)
                }
                Visual.showSystemMessage('import was successful')
                Visual.clearFormInput()
            } catch (error) {
                console.error('error: invalid json');
                Visual.showSystemMessage('error: invalid json')
                Visual.clearFormInput()
            }
        };
        reader.readAsText(file); // Read the file as text
    });
}

// =======================================================================================================================================

// maybe I can move to another file
function isCorrectInput(dataObj) {
    let checkPassed = true

    if(!dataObj.hasOwnProperty('todos')) checkPassed = false, console.log(`no todos`);
    if(!dataObj.hasOwnProperty('recentCommands')) checkPassed = false, console.log(`no recentCommands`);
    if(!dataObj.hasOwnProperty('commands')) checkPassed = false, console.log(`no commands`);
    if(!dataObj.hasOwnProperty('flags')) checkPassed = false, console.log(`no flags`);
    if(!dataObj.hasOwnProperty('isEditMode')) checkPassed = false, console.log(`no isEditMode`);
    if(!dataObj.hasOwnProperty('isSortMode')) checkPassed = false, console.log(`no isSortMode`);
    if(!dataObj.hasOwnProperty('sortModeCriterion')) checkPassed = false, console.log(`no sortModeCriterion`);
    if(!dataObj.hasOwnProperty('oldValue')) checkPassed = false, console.log(`no oldValue`);
    if(!dataObj.hasOwnProperty('count')) checkPassed = false, console.log(`no count`);
    if(!dataObj.hasOwnProperty('accentColor')) checkPassed = false, console.log(`no accentColor`);
    if(!dataObj.hasOwnProperty('mode')) checkPassed = false, console.log(`no mode`);

    if(!Array.isArray(dataObj.commands)) checkPassed = false, console.log(`commands is not an array`);
    if(!Array.isArray(dataObj.flags)) checkPassed = false, console.log(`flags is not an array`);
    if(!Array.isArray(dataObj.recentCommands)) checkPassed = false, console.log(`recentCommands is not an array`);
    if(!Array.isArray(dataObj.todos)) checkPassed = false, console.log(`todos is not an array`);
    
    if(typeof dataObj.accentColor !== 'string') checkPassed = false, console.log(`accentColor is not a string`);
    if(typeof dataObj.mode !== 'string') checkPassed = false, console.log(`mode is not a string`);
    if(typeof dataObj.oldValue !== 'string') checkPassed = false, console.log(`oldValue is not a string`);
    if(typeof dataObj.sortModeCriterion !== 'string') checkPassed = false, console.log(`sortModeCriterion is not a string`);
    
    if(typeof dataObj.count !== 'number') checkPassed = false, console.log(`count is not a number`);
    
    if(typeof dataObj.isEditMode !== 'boolean') checkPassed = false, console.log(`isEditMode is not a boolean`);
    if(typeof dataObj.isSortMode !== 'boolean') checkPassed = false, console.log(`isSortMode is not a boolean`);

    if(dataObj.todos.length > 0) {
        dataObj.todos.forEach(todo => {
            if(!todo.hasOwnProperty('name')) checkPassed = false, console.log(`todo in todos has no name`);
            if(!todo.hasOwnProperty('category')) checkPassed = false, console.log(`todo in todos has no category`);
            if(!todo.hasOwnProperty('command')) checkPassed = false, console.log(`todo in todos has no command`);
            if(!todo.hasOwnProperty('created')) checkPassed = false, console.log(`todo in todos has no created`);
            if(!todo.hasOwnProperty('deadline')) checkPassed = false, console.log(`todo in todos has no deadline`);
            if(!todo.hasOwnProperty('hasSubtasks')) checkPassed = false, console.log(`todo in todos has no hasSubtasks`);
            if(!todo.hasOwnProperty('id')) checkPassed = false, console.log(`todo in todos has no id`);
            if(!todo.hasOwnProperty('isCompleted')) checkPassed = false, console.log(`todo in todos has no isCompleted`);
            if(!todo.hasOwnProperty('params')) checkPassed = false, console.log(`todo in todos has no params`);
            if(!todo.hasOwnProperty('priority')) checkPassed = false, console.log(`todo in todos has no priority`);
            if(!todo.hasOwnProperty('subtasks')) checkPassed = false, console.log(`todo in todos has no subtasks`);
            if(!Array.isArray(todo.subtasks)) checkPassed = false, console.log(`todo.subtasks is not an array`);
            if(typeof todo.command !== 'string') checkPassed = false, console.log(`todo.command is not a string`);
            if(typeof todo.created !== 'string') checkPassed = false, console.log(`todo.created is not a string`);
            if(typeof todo.name !== 'string') checkPassed = false, console.log(`todo.name is not a string`);
            if(typeof todo.id !== 'number') checkPassed = false, console.log(`todo.id is not a number`);
            if(typeof todo.hasSubtasks !== 'boolean') checkPassed = false, console.log(`todo.hasSubtasks is not a boolean`);
            if(typeof todo.isCompleted !== 'boolean') checkPassed = false, console.log(`todo.isCompleted is not a boolean`);
        })
    }

    return checkPassed
}