'use strict'

import '../styles/main.scss'

import Model from './modules/Model.js'  
import View from './modules/View.js'  

const Logic = new Model()
const Visual = new View()
let oldValue

function init() {
    const accentColor = Logic.getFromLS('colorUI')
    if(accentColor) {
        Visual.setAccentColor(accentColor)
    }

    const myTodos = Logic.getFromLS('todos')
    if(myTodos) { // if local storage for todos is not empty...
        const fetchedTodos = JSON.parse(myTodos)
        fetchedTodos.forEach(toDo => {
            Visual.renderToDo(toDo) // render each todo
            Logic.pushToDo(toDo) // push to Model's state
        }) 
        Visual.renderTodosNumber(fetchedTodos.length) // and render how many of them I have
    }

    Visual.toggleExtraFeatures()
    runEventListeners() 
}
init()


function runEventListeners() {
    Visual.handleActionsClick(Logic.saveToLS) // handles the click on 'Change UI colour'
    Visual.handleKeyPresses(Logic.saveToLS) // to change the UI color by pressing the tilda key
    // Visual.formSubmit(pushTodos) // creating new todos, in DOM and local storage
    Visual.handleFiltering()
    Visual.handleRemovingAllTodos(deleteTodos)
    Visual.handleRemovingTodo(deleteTodo) 
    Visual.handleEditingTodo(editTodo) 
    Visual.formSubmit(handleFormSubmit) // creating new todos, in DOM and local storage
}

function handleFormSubmit(value) {
    if(Logic.state.isEditMode) { // editing
        // console.log('old/now:',oldValue)
        // console.log('new/change to:',value)
        const indexToChange = Logic.state.todos.indexOf(oldValue)
        Visual.updateTodoElement(document.querySelector(`.item:nth-child(${indexToChange+1})`), value)
        // document.querySelector(`.item:nth-child(${indexToChange+1})`).querySelector('.item__name').textContent = value
        // document.querySelector(`.item:nth-child(${indexToChange+1})`).querySelector('.item__name').setAttribute('title', value)
        Logic.state.todos[indexToChange] = value
        Logic.pushTodosToLS() // push to local storage
        Visual.changeH2('adding mode')
        Visual.changeFormBtn('adding mode')
        Visual.clearFormInput()
        Visual.highlightTodo('dehighlight')
        Logic.setEditMode(false)
    } else { // adding
        Visual.renderToDo(value)   // creating a DOM element and appending it -- rendering
        Visual.clearFormInput()    // clear the input
        pushTodos(value)
    }
}

function pushTodos(newToDoValue) { // happens on form submission: 'formSubmit' calls this fn with formInputValue
    if(!newToDoValue) return
    Logic.pushToDo(newToDoValue) // push to Model's state
    Logic.pushTodosToLS() // push to local storage
    Visual.renderTodosNumber(JSON.parse(Logic.getFromLS('todos')).length)  // render how many of them I have
    Visual.toggleExtraFeatures()
}


function deleteTodos() {
    Logic.removeTodos() // model state sets to []
    Logic.removeItemFromLS(`todos`) // local storage remove whats stored under that key
    console.log(`All todos were deleted.`)
}

function deleteTodo(todoText) {
    Logic.removeTodo(todoText) // removing from Model state
    Logic.pushTodosToLS() // push to local storage
}

function editTodo(valueToEdit) {
    oldValue = valueToEdit
    Logic.setEditMode(true)
}


/* CRUD functionality:
Create
Read
Update
Delete */