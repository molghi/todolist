'use strict'

import '../styles/main.scss'

import Model from './modules/Model.js';
import View from './modules/View.js';

// controller dependencies:
import addItem from './modules/controller-dependencies/addItem.js';
import { editItem, editTodoByBtn, editSubtaskByBtn } from './modules/controller-dependencies/editingItems.js';
import filterTodos from './modules/controller-dependencies/filterTodos.js';
import sortTodos from './modules/controller-dependencies/sortTodos.js';
import changeColor from './modules/controller-dependencies/changeColor.js';
import { autocompleteValue, persistSubtasksVisibility, arrowKeysHandler, completeTodoByBtn } from './modules/controller-dependencies/smallFunctions.js';
import { deleteItem, deleteTodoByBtn, deleteTodos, deleteSubtaskByBtn } from './modules/controller-dependencies/deleting.js';
import { exportTodos, importFile } from './modules/controller-dependencies/importExport.js';

import favicon from '../img/favicon.ico';

const Logic = new Model()    // handles logic
const Visual = new View()    // handles the visuals


// =======================================================================================================================================

// runs on app start:
function init() {

    const myState = Logic.getFromLS('state')   // fetching from local storage

    if(myState) { 
        const fetchedState = JSON.parse(myState)
// console.log(`fetchedState`,fetchedState)
        if(fetchedState.todos.length > 0) {
            fetchedState.todos.forEach((toDo, i) => {
                Visual.renderToDo(toDo, i+1)   // render each in the UI
                Logic.pushToDo(toDo)   // push to Model's state
            }) 
        }
// console.log(`LogicState`, Logic.getState())
        if(fetchedState.accentColor) {
            Logic.changeAccentColor(fetchedState.accentColor)
            Visual.changeUIColors(fetchedState.accentColor)
        }
        if(fetchedState.recentCommands.length > 0) {
            fetchedState.recentCommands.forEach(com => Logic.pushRecentCommand(com))
        }
    }

    Visual.focusInput()    // focusing the input field
    runEventListeners() 
    Visual.shiftCursorToTheEndNow()   // in the input field
}
init()

// =======================================================================================================================================

// running event listeners:
function runEventListeners() {
    Visual.formSubmit(handleFormSubmit)   // 'handleFormSubmit' is a general router fn -- 'formSubmit' calls 'handleFormSubmit' with the string of the typed command
    Visual.handleArrowKeys(arrowKeysHandler)   // arrow keys handler: bringing up the previous or next command in the input
    Visual.formatInput()  // to make sure that '> ' at the beginning of the input is undeletable
    Visual.deUppercaseInput()   // I allow no uppercase 
    Visual.shiftCursorToTheEndAfterPasting()  // happens upon the 'paste' event: shifts the cursor in the input field to the end of what's in the input field
    Visual.handleCompletingTodo(completeTodoByBtn)  // handles completing of a task or subtask by clicking the complete btn
    Visual.trackTabPress(autocompleteValue)  // tracks if Tab was pressed while the input was focused: autocompleting a command
    Visual.handleEditingTodo(editTodoByBtn)  // handles clicking on the edit btn of any todo
    Visual.handleRemovingTodo(deleteTodoByBtn)  // handles clicking on the delete btn of any todo
    Visual.handleTogglingSubtasks(persistSubtasksVisibility)  // handles showing or hiding the subtasks of a task if you click on the task name
    Visual.handleEditingSubtask(editSubtaskByBtn)  // handles clicking on the edit btn of any subtask
    Visual.handleDeletingSubtask(deleteSubtaskByBtn)  // handles clicking on the delete btn of any subtask
}

// =======================================================================================================================================

// general router function:
function handleFormSubmit(value, type='') { 
    // 'value' here is the string of the typed command with the first '> ' sliced out

    let command, todoObj
    command = value.includes(' ') ? value.slice(0, value.indexOf(' ')).trim() : value   // slicing out the pure command like 'add' or 'edit' or 'del'

    // case: if it's a simple deletion of one todo:
    if(value.includes(`are you sure you want to delete`)) {
        value = value.slice(value.lastIndexOf(' ')+1)  // this is the answer: y or n
        let indexToRemove  // index of what must be removed (obtained from the UI elements)
        if(Visual.itemToDelete.classList.contains('item')) indexToRemove = Visual.itemToDelete?.querySelector('.item__number')?.textContent
        if(Visual.itemToDelete.classList.contains('item__subtask')) indexToRemove = Visual.itemToDelete?.querySelector('.item__subtask-number')?.textContent
        if(!value) value = `delete ${indexToRemove}`
        Logic.state.mode = 'delete'
        if(type==='click event') { // if deletion was triggered by pressing item's delete button
            Logic.state.mode = ''
            Visual.focusInput()
        }
        command = 'delete'
    }

    // case: if it's a deletion of all todos: (clearall)
    if(value.includes('delete all of your todos')) {
        value = value.slice(value.lastIndexOf(' ')+1)  // this is the answer: y or n
        command = 'clearall'
    }

    if(!command) {  
        Visual.showSystemMessage('error: no command received')
        Visual.clearFormInput()
        return
    }

    if(command === 'delete' || command === 'del' || Logic.state.mode === 'delete') {
        deleteItem(value)
        return
    }

    // routing:
    switch (command) {
        case 'add':
            [command, todoObj] = Logic.makeTodoObject(value)
            addItem(command, todoObj, value)
            Visual.clearFormInput()
            break;
        case 'edit':
            editItem(value)
            break;
        case 'changecol':
        case 'cc':
            changeColor(value)
            Visual.clearFormInput()
            break;
        case 'clearall':
            deleteTodos(value)
            break;
        case 'filter':
        case 'fil':
            filterTodos(value)
            break;
        case 'sort':
            sortTodos(value)
            break;
        case 'export':
            exportTodos()
            break
        case 'import':
            importFile()
            break
        case 'manual':
        case 'man':
            Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
            Visual.toggleManual()
            break
        default:
            Visual.clearFormInput()
            Visual.showSystemMessage('error: command does not exist, type "manual" or "man" to see the manual')
            break;
    }

}

// =======================================================================================================================================

// Exporting instances so other modules can use them:
export { Logic, Visual, handleFormSubmit };