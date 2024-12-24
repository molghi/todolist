'use strict'

import '../styles/main.scss'
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src 

import Model from './modules/Model.js'  
import View from './modules/View.js'  

const Logic = new Model()
const Visual = new View()

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

    runEventListeners() 
}
init()


function runEventListeners() {
    Visual.handleActionsClick(Logic.saveToLS) // handles the click on 'Change UI colour'
    Visual.handleKeyPresses(Logic.saveToLS) // to change the UI color by pressing the tilda key
    Visual.formSubmit(pushTodos) // creating new todos, in DOM and local storage
    Visual.handleFiltering()
}


function pushTodos(newToDoValue) { // happens on form submission: 'formSubmit' calls this fn with formInputValue
    if(!newToDoValue) return
    Logic.pushToDo(newToDoValue) // push to Model's state
    Logic.pushTodosToLS() // push to local storage
    Visual.renderTodosNumber(JSON.parse(Logic.getFromLS('todos')).length)  // render how many of them I have
}



/* CRUD functionality:
Create
Read
Update
Delete */