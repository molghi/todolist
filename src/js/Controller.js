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

    // Visual.handleFiltering()
    // Visual.handleRemovingAllTodos(deleteTodos)
    Visual.handleEditingTodo(editTodoByBtn) 
    Visual.handleRemovingTodo(deleteTodoByBtn) 
}

// =======================================================================================================================================

function arrowKeysHandler(command, activeEl) {
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

function handleFormSubmit(value, type='') { // value here is the string of the typed command with the first '> ' sliced out
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
    
    Visual.clearFormInput()
    Visual.showSystemMessage('error: command does not exist, type "manual" or "man" to see the manual')
}

// =======================================================================================================================================

function addItem(command, todoObj) {
    Logic.pushToDo(todoObj)  // pushing todo to Model's state
    Logic.pushRecentCommand(todoObj.command) // pushing recent command to Model's state
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    const actionString = Visual.setDoneAction(command, todoObj)  // this is to show system message (see next line)
    Visual.showSystemMessage(actionString) // showing system message in the UI (underneath the input)
    const index = Logic.getState().todos.length
    Visual.renderToDo(todoObj, index)   // creating a DOM element and appending it
}

// =======================================================================================================================================

function changeColor(value) {
    const color = value.includes(' ') ? value.slice(value.indexOf(' ')+1) : null
    const colorUI = Visual.changeUIColors(color)
    if(colorUI) { // if it exists, if it's not null
        Visual.showSystemMessage(`changed ui color to: ${colorUI === '#32cd32' ? 'default' : colorUI}`)
        Logic.changeAccentColor(colorUI)  // pushing it to Model's state
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    } 
}

// =======================================================================================================================================

// delete one todo
function deleteItem(value) {
    // console.log(value, ',', Logic.state.mode)
    if(Logic.state.mode === 'delete') {
        if(value === 'n' || value === 'no') {
            Visual.showSystemMessage(`deletion was cancelled`)
            Visual.clearFormInput()
            Logic.state.mode = ''
            return
        }
        if(value === 'y' || value === 'yes') {
            const indexToRemove = Visual.itemToDelete.querySelector('.item__number').textContent
            const deletedName = Visual.itemToDelete.querySelector('.item__name').textContent
            Visual.itemToDelete.remove()
            Logic.removeTodo(indexToRemove)
            Logic.state.mode = ''
            Visual.showSystemMessage(`"${deletedName}" was deleted successfully`)
            Visual.clearFormInput()
            Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
            Visual.removeAllTodos()  // removing all items to re-render
            Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
            return 
        }
        Visual.clearFormInput()
        Visual.showSystemMessage(`answer was not recognised`)
        Logic.state.mode = ''
        return
    }
    // console.log(value)
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

// delete one todo by btn
function deleteTodoByBtn(todoName) {
    Visual.setInputValue(`> are you sure you want to delete "${todoName}"? type y/n: `)
    Visual.itemToDelete = Array.from(document.querySelectorAll('.item')).find(x => x.querySelector('.item__name').textContent === todoName)
    handleFormSubmit(document.querySelector('.form-input').value, `click event`)
}

// =======================================================================================================================================

// delete all todos
function deleteTodos(value) {
    if(value === 'y' || value === 'yes') {
        Visual.removeAllTodos()
        Logic.removeTodos() // Model state.todos = []
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.showSystemMessage('all todos were deleted')
        Visual.clearFormInput()
        return
    }
    if(value === 'n' || value === 'no') {
        Visual.showSystemMessage('deletion was cancelled')
        Visual.clearFormInput()
        return
    }
    if(value.startsWith('clearall')) {
        Visual.setInputValue('> delete all of your todos? careful! type y/n: ')
        return
    }
    Visual.showSystemMessage('answer was not recognised')
    Visual.clearFormInput()
}

// =======================================================================================================================================

function pushTodos(newToDoValue) { // happens on form submission: 'handleFormSubmit' calls this fn with formInputValue
    if(!newToDoValue) return
    Logic.pushToDo(newToDoValue) // push to Model's state
    Logic.pushTodosToLS() // push to local storage
    Visual.toggleExtraFeatures()
}

// =======================================================================================================================================

function editTodoByBtn(valueToEdit) {
    // console.log(`click click`)
    // console.log(valueToEdit)
    const itsIndexUI = [...document.querySelectorAll('.item__name')].find(x => x.textContent === valueToEdit)?.previousElementSibling.textContent
    // console.log(itsIndexUI)
    editItem(`edit ${itsIndexUI}`)
    Visual.focusInput()
    // Logic.setOldValue(valueToEdit)
    // Logic.setEditMode(true) // we clicked the Edit btn so the mode is Edit now...
}

// =======================================================================================================================================

function editItem(value) {
    console.log(value)
    let params, name
    let valueMinusCommand = value.slice(value.indexOf('edit ')+5).trim()

    if(valueMinusCommand.includes(' ')) { // then it is either 'edit 3 -p high' or 'edit buy bread -c food -p high'
        valueMinusCommand = valueMinusCommand.slice(0, valueMinusCommand.indexOf(' '))
        params = value.slice(value.indexOf(valueMinusCommand)+1+valueMinusCommand.length)
    }

    if(!valueMinusCommand) {
        Visual.showSystemMessage('error: edit called with no value')
        Visual.clearFormInput()
        return
    }
    
    if(Number.isNaN(Number(valueMinusCommand))) {
        // console.log(`it wasn't an index after 'edit' -- it was a todo name -- meaning I am submitting the value having edited it and I need to capture it`)
        // check if such a name exists in the UI
        const allTodoNames = [...document.querySelectorAll('.item__name')].map(itemEl => itemEl.textContent)
        name = value.slice(value.indexOf(' '), value.indexOf('-') > 0 ? value.indexOf('-') : value.length).trim()
        params = value.slice(value.indexOf(name)+name.length+1)
        if(!allTodoNames.includes(Logic.getOldValue())) return Visual.showSystemMessage('error: name to edit was not found')
        // console.log(`must parse this new value (make an obj out of it): ${value}`)
        const [command, todoObj] = Logic.parseCommandString(value)
        // console.log(command, todoObj)
        Logic.editTodo(todoObj)
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        return
    }

    console.log(value)
    console.log(valueMinusCommand)
    console.log(params)
    console.log(name)

    // validate input
    const allItemNumbers = [...document.querySelectorAll('.item__number')].map(itemEl => itemEl.textContent)
    if(!allItemNumbers.includes(valueMinusCommand)) {
        Visual.showSystemMessage('error: item index does not exist')
        Visual.clearFormInput()
        return
    }


    if(!params) {
        // example: I type 'edit 3' ... OR! I click on the edit btn
        console.log(`no params, bringing all of it into the input`)
        // Logic.setEditMode(true)   // (edit mode on) 
        const [todoObjString, todoNameOld] = Logic.getTodoObjString(valueMinusCommand) // to bring this entire todo to the input 
        Logic.setOldValue(todoNameOld) // in case if I change the name to a new one, to be able to find it
        Visual.setInputValue(todoObjString)
        // edit it there and submit 
        // Logic.setEditMode(false)   // (edit mode off)
        // parse it
        // change it in the state/LS, and re-render UI
    } else {
        // example: I type 'edit 3 -p medium' ...
        console.log(`params are there, no bringing to the input`)
        const itsName = [...document.querySelectorAll('.item__number')].find(x => x.textContent === valueMinusCommand)?.nextElementSibling.textContent
        const properCommand = value.replace(valueMinusCommand, itsName)
        Logic.setOldValue(itsName) // in case if I change the name to a new one, to be able to find it
        const [command, todoObj] = Logic.parseCommandString(properCommand) 
        Logic.editTodo(todoObj)
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        // Logic.setEditMode(true)   // (edit mode on) 
        // no bringing to the input happens
        // submit, parse it, change the priority of the 3rd todo to medium (or read flags and modify todoObj), 
        // Logic.setEditMode(false)   // (edit mode off)
        // change it in the state/LS, and re-render UI
    }
}