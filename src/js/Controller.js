'use strict'

import '../styles/main.scss'

import Model from './modules/Model.js';
import View from './modules/View.js';

// controller dependencies:
import addItem from './modules/controller-dependencies/addItem.js';
import { editItem, editTodoByBtn } from './modules/controller-dependencies/editingItems.js';
import filterTodos from './modules/controller-dependencies/filterTodos.js';
import sortTodos from './modules/controller-dependencies/sortTodos.js';
import changeColor from './modules/controller-dependencies/changeColor.js';
import { autocompleteValue, persistSubtasksVisibility, arrowKeysHandler, completeTodoByBtn } from './modules/controller-dependencies/smallFunctions.js';
import { deleteItem, deleteTodoByBtn, deleteTodos } from './modules/controller-dependencies/deleting.js';
import { exportTodos, importFile } from './modules/controller-dependencies/importExport.js';

import favicon from '../img/favicon.ico';

const Logic = new Model()
const Visual = new View()


// =======================================================================================================================================

// on app start:
function init() {

    const myState = Logic.getFromLS('state')

    if(myState) { // if local storage for state is not empty...
        const fetchedState = JSON.parse(myState)
        // console.log(`fetchedState`,fetchedState)
        fetchedState.todos.forEach((toDo, i) => {
            Visual.renderToDo(toDo, i+1) // render each todo
            Logic.pushToDo(toDo) // push to Model's state
        }) 
        // console.log(`LogicState`, Logic.getState())
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

// running event listeners:
function runEventListeners() {
    Visual.formSubmit(handleFormSubmit) // 'handleFormSubmit' is a general router fn -- 'formSubmit' calls 'handleFormSubmit' with the string of the typed command
    Visual.handleArrowKeys(arrowKeysHandler) // arrow keys handler
    Visual.formatInput() // to make sure that '> ' at the beginning of the input is undeletable
    Visual.deUppercaseInput() // I allow no uppercase to be typed in
    Visual.shiftCursorToTheEndAfterPasting()  // happens upon the 'paste' event: shifts the cursor in the input field to the end of what's in the input field
    Visual.handleCompletingTodo(completeTodoByBtn)
    Visual.trackTabPress(autocompleteValue)
    Visual.handleEditingTodo(editTodoByBtn) 
    Visual.handleRemovingTodo(deleteTodoByBtn) 
    
    Visual.handleTogglingSubtasks(persistSubtasksVisibility)
    Visual.handleEditingSubtask(editSubtaskByBtn)
    Visual.handleDeletingSubtask(deleteSubtaskByBtn) 
}

// =======================================================================================================================================

// general router function:
function handleFormSubmit(value, type='') { 
    // 'value' here is the string of the typed command with the first '> ' sliced out
    let command, todoObj
    command = value.includes(' ') ? value.slice(0, value.indexOf(' ')).trim() : value

    if(value.includes(`are you sure you want to delete`)) {
        value = value.slice(value.lastIndexOf(' ')+1)
        let indexToRemove
        if(Visual.itemToDelete.classList.contains('item')) indexToRemove = Visual.itemToDelete?.querySelector('.item__number')?.textContent
        if(Visual.itemToDelete.classList.contains('item__subtask')) indexToRemove = Visual.itemToDelete?.querySelector('.item__subtask-number')?.textContent
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

    if(!command) {  
        Visual.showSystemMessage('error: no command received')
        Visual.clearFormInput()
        return
    }

    if(command === 'add') {
        [command, todoObj] = Logic.makeTodoObject(value)
        addItem(command, todoObj, value)
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

    if(command === 'manual' || command === 'man') {
        toggleManual()
        return
    }
    
    Visual.clearFormInput()
    Visual.showSystemMessage('error: command does not exist, type "manual" or "man" to see the manual')
}

// =======================================================================================================================================

function editSubtaskByBtn(subtaskName, subtaskIndexUI) {       // 🔴 move from here to the Edit module
    /* what must happen:
    - bring all of this subtask into input:      edit 6.1 -n hoover -f true
    - focus input
    */
    const subtaskEl = [...document.querySelectorAll('.item__subtask-name')].find(x => x.textContent === subtaskName)?.closest('.item__subtask')
    const subtaskFinishedText = subtaskEl.querySelector('.item__subtask-finished').textContent.split(':')[1].trim()
    Visual.setInputValue(`edit ${subtaskIndexUI} -n ${subtaskName} -f ${subtaskFinishedText}`)
    Visual.focusInput()
}

// =======================================================================================================================================

function deleteSubtaskByBtn(subtaskName) {
    // console.log(subtaskName)
    Visual.setInputValue(`are you sure you want to delete "${subtaskName}"? type y/n: `)
    Visual.focusInput()
}

// =======================================================================================================================================

function toggleManual() {
    console.log(`heres your manual`)
    Visual.toggleManual()
}

// =======================================================================================================================================

// Exporting instances so other modules can use them:
export { Logic, Visual, handleFormSubmit };