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
    const accentColor = Logic.getFromLS('colorUI')
    if(accentColor) {
        Visual.setAccentColor(accentColor)
    }

    const myState = Logic.getFromLS('state')
    if(myState) { // if local storage for state is not empty...
        const fetchedState = JSON.parse(myState)
        console.log(`fetchedState`,fetchedState)
        fetchedState.todos.forEach(toDo => {
            Visual.renderToDo(toDo) // render each todo
            Logic.pushToDo(toDo) // push to Model's state
        }) 
        console.log(`LogicState`, Logic.getState())
        // Visual.renderTodosNumber(fetchedTodos.length) // and render how many of them I have
    }

    // Visual.toggleExtraFeatures()
    Visual.focusInput()
    runEventListeners() 
    Visual.shiftCursorToTheEndNow()
}
init()

// =======================================================================================================================================

function runEventListeners() {
    // Visual.handleActionsClick(Logic.saveToLS) // handles the click on 'Change UI colour'
    // Visual.handleKeyPresses(Logic.saveToLS) // to change the UI color by pressing the tilda key
    // Visual.handleFiltering()
    // Visual.handleRemovingAllTodos(deleteTodos)
    Visual.handleRemovingTodo(deleteTodo) 
    Visual.handleEditingTodo(editTodo) 
    Visual.formSubmit(handleFormSubmit) // 'handleFormSubmit' is a general fn; 'formSubmit' calls 'handleFormSubmit' with the string of the typed command
    Visual.handleArrowKeys(arrowKeysHandler)
    Visual.shiftCursorToTheEndAfterPasting()
    Visual.formatInput()
    Visual.deUppercaseInput()
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

function handleFormSubmit(value) { // value here is the string of the typed command with the first '> ' sliced out
    console.log(value)

    if(Logic.state.isEditMode) { // editing 
        const indexToChange = Logic.getStateTodos().indexOf(Logic.getOldValue())
        Visual.updateTodoElement(document.querySelector(`.item:nth-child(${indexToChange+1})`), value)
        Logic.getStateTodos()[indexToChange] = value
        Logic.pushTodosToLS() // push to local storage
        Visual.removeEditingMode() // change H2, change form btn, and dehighlight all todos
        Visual.clearFormInput()
        Logic.setEditMode(false)
    } else { // not editing
        const [command, todoObj] = Logic.makeTodoObject(value)
        if(!command) {  
            Visual.showSystemMessage(todoObj.msg)
        }
        if(command === 'add') { 
            todoObj.order = Logic.getStateTodos().length+1  // adding its number (maybe it's not necessary)
            Logic.pushToDo(todoObj)  // pushing todo to Model's state
            Logic.pushRecentCommand(todoObj.command) // pushing recent command to Model's state
            Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
            const actionString = Visual.setDoneAction(command, todoObj)  // this is to show system message (see next line)
            Visual.showSystemMessage(actionString) // showing system message in the UI (underneath the input)
            Visual.renderToDo(todoObj)   // creating a DOM element and appending it
        } 
        if(command === 'changecol' || command === 'cc') { 
            const color = value.includes(' ') ? value.slice(value.indexOf(' ')+1) : null
            const colorUI = Visual.changeUIColors(color)
            if(colorUI) { // if it exists, if it's not null
                Visual.showSystemMessage(`changed ui color to: ${colorUI === '#32cd32' ? 'default' : colorUI}`)
                console.log(`UI colour now: ${colorUI}`)
            } 
        }
        console.log(`received other command, not 'add' -- '${command}'`)
        Visual.clearFormInput()
        // pushTodos(value)
    }
}

// =======================================================================================================================================

function pushTodos(newToDoValue) { // happens on form submission: 'handleFormSubmit' calls this fn with formInputValue
    if(!newToDoValue) return
    Logic.pushToDo(newToDoValue) // push to Model's state
    Logic.pushTodosToLS() // push to local storage
    // Visual.renderTodosNumber(JSON.parse(Logic.getFromLS('todos')).length)  // render how many of them I have
    Visual.toggleExtraFeatures()
}

// =======================================================================================================================================

function deleteTodos() {
    Logic.removeTodos() // model state sets to []
    Logic.removeItemFromLS(`todos`) // local storage remove whats stored under that key
}

// =======================================================================================================================================

function deleteTodo(todoText) {
    Logic.removeTodo(todoText) // removing from Model state
    Logic.pushTodosToLS() // push to local storage
}

// =======================================================================================================================================

function editTodo(valueToEdit) {
    Logic.setOldValue(valueToEdit)
    Logic.setEditMode(true) // we clicked the Edit btn so the mode is Edit now...
}
