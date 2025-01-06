// view dependencies:
import { renderToDo } from './view-dependencies/renderToDo.js';
import { formatInput } from './view-dependencies/formatInput.js';
import { changeUIColors, isValidHTMLColor, setAccentColor } from './view-dependencies/colorManipulations.js';
import { manual } from './view-dependencies/manualHtml';


class View {
    constructor() {
        this.colorUI = `#32cd32` // by default; it's less intense than 'lime'
        this.formEl = document.querySelector('form')
        this.sectionContainer = document.querySelector('.container')
        this.itemsWrapperEl = document.querySelector('.items__wrapper')
        this.itemsTopmostEl = document.querySelector('.items')
        this.todosNumberEl = document.querySelector('.items__title span')
        this.filterInput = document.querySelector('.filter-input')
        this.clearBtn = document.querySelector('.clear-btn')
        this.filterBlock = document.querySelector('.filter')
        this.titleBlock = document.querySelector('.items__title')
        this.h2 = document.querySelector('h2')
        this.formInput = document.querySelector('.form-input')
        this.formBtn = document.querySelector('.form-btn')
        this.systemMsgEl = document.querySelector('.system-message span:nth-child(2)')
        this.itemToDelete = ''
        this.deletionItemType = 'majortask'
        this.manualEl = ''
        this.fileInputEl = document.querySelector('.file-input')
    }

    // =======================================================================================================================================

    // changes UI colour, returns a colour string
    changeUIColors(color) {
        return changeUIColors(color, this.colorUI, this.showSystemMessage);   // I import it above;   
        // NOTE: I call this View's method the same as the function I'm calling here to avoid renaming everywhere where I use this method in other files
    }

    // =======================================================================================================================================

    // small helper fn for changeUIColors: checks if the typed colour was a correct html colour and that it wasn't too dark; returns boolean
    isValidHTMLColor(color) { 
        isValidHTMLColor(color);    // I import it above
    }

    // =======================================================================================================================================

    // runs on app init: we check LS 'colorUI' and if exists, this fn runs
    setAccentColor(color) {
        setAccentColor(color, this.colorUI);  // I import it above
    }

    // =======================================================================================================================================

    showSystemMessage(msgString) {    // shows a message that's under the input field
        this.systemMsgEl.innerHTML = msgString
    }

    // =======================================================================================================================================

    clearFormInput() {   // clears form input
        this.formEl.elements.forminput.value = '> '
    }

    // =======================================================================================================================================

    // a fn to make sure that '> ' at the beginning of the input is undeletable
    formatInput() {
        formatInput(this.formInput);    // I import it above
    }

    // =======================================================================================================================================
    
    // renders a to-do in the DOM
    renderToDo(toDoObj, order) {
        renderToDo(toDoObj, order, this.itemsWrapperEl);    // I import it above
    }

    // =======================================================================================================================================

    focusInput() {     // focuses the input field
        this.formInput.focus()
    }

    // =======================================================================================================================================

    setInputValue(value) {     // sets the value of the input field
        this.formInput.value = `> ${value}`
    }

    // =======================================================================================================================================

    removeAllTodos() {     // removes all todo els (majortasks and subtasks)
        while(this.itemsWrapperEl.firstChild) { 
                this.itemsWrapperEl.removeChild(this.itemsWrapperEl.firstChild)
            }
    }

    // =======================================================================================================================================

    updateTodoElement(el, value) {   // updates a todo (after form submit in editing)       do I use it anywhere?...
        el.querySelector('.item__name').textContent = value
        el.querySelector('.item__name').setAttribute('title', value)
    }

    // =======================================================================================================================================
    
    deUppercaseInput() {   // because I allow no uppercase to be typed
        this.formInput.addEventListener('input', (e) => {
            this.formInput.value = this.formInput.value.toLowerCase()
        })
    }

    // =======================================================================================================================================

    toggleTodo(todoEl, flag='hide') {     //  do I use it anywhere?...
        if(flag==='show') {
            return todoEl.classList.remove('hidden')
        }
        todoEl.classList.add('hidden')
    }



    // =======================================================================================================================================
    // =======================================================================================================================================
    // =======================================================================================================================================



    formSubmit(handler) {  // form submit handler
        this.formEl.addEventListener('submit', (e) => {
            e.preventDefault()
            const formInputValue = this.formEl.elements.forminput.value.slice(2)   // slicing out '> '
            if(!formInputValue) return
            handler(formInputValue.trim())  // to update Model and local storage
        })
    }

    // =======================================================================================================================================

    handleTogglingSubtasks(handler) {    // runs when I click on a majortask that has subtasks: subs will be hidden or shown
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.with-subtasks')) return
            const subtasksBoxEl = e.target.closest('.item').querySelector('.item__subtasks-holder')
            subtasksBoxEl.classList.toggle('hidden')     // hide or show those subs
            const state = subtasksBoxEl.classList.contains('hidden') ? 'hidden' : 'shown'
            const todoName = e.target.closest('.item').querySelector('.item__name').textContent
            handler(todoName, state)  // to update Model and local storage
        })
    }

    // =======================================================================================================================================

    handleRemovingTodo(handler) {   // handles clicking on the delete btn of any todo (majortask)
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__btn--remove')) return
            const todoName = e.target.closest('.item').querySelector('.item__name').textContent
            handler(todoName)
        })
    }

    // =======================================================================================================================================

    handleEditingTodo(handler) {    // handles clicking on the edit btn of any todo (majortask)
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__btn--edit')) return
            const valueToEdit = e.target.closest('.item').querySelector('.item__name').textContent
            handler(valueToEdit)
        })
    }

    // =======================================================================================================================================

    handleCompletingTodo(handler) {     // handles clicking on the complete btn of any todo (majortask or subtask)
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__btn--complete') && !e.target.closest(`.item__subtask-btn--complete`)) return
            let indexToEdit, type
            if(e.target.closest('.item__btn--complete')) {  // if it was a majortask
                indexToEdit = e.target.closest('.item').querySelector('.item__number').textContent
                type = 'majortask'
            }
            if(e.target.closest('.item__subtask-btn--complete')) {  // if it was a subtask
                indexToEdit = e.target.closest('.item__subtask').querySelector('td:nth-child(2)').textContent
                type = 'subtask'
            }
            handler(indexToEdit, type)
        })
    }

    // =======================================================================================================================================

    handleArrowKeys(handler) {     // handles pressing the arrow up or arrow down keys while the form input is focused
        document.addEventListener('keydown', (e) => {
            if(e.code === 'ArrowUp' && document.activeElement.classList.contains('form-input')) {
                handler(`show previous command`, document.activeElement)
            }
            if(e.code === 'ArrowDown' && document.activeElement.classList.contains('form-input')) {
                handler(`show next command`, document.activeElement)
            }
        })
    }

    // =======================================================================================================================================
    
    shiftCursorToTheEndAfterPasting() {     // upon pasting, shifts the cursor in the input field to the end of what's in the input field
        this.formInput.addEventListener('paste', (e) => {   // I need the 'paste' event
            setTimeout(() => { // I need 'setTimeout' to allow the paste operation to complete before manipulating the cursor position
                this.shiftCursorToTheEndNow()
            }, 0)
        })
    }

    // =======================================================================================================================================

    shiftCursorToTheEndNow() {    // shifts the cursor in the input field to the end of what's in the input field
        // const length = this.formInput.value.length
        // this.formInput.setSelectionRange(length, length) 
        if(this.formInput.selectionStart < 2) this.formInput.setSelectionRange(2, 2);
        // NOTE: I can set the cursor to the end of the input using 'selectionStart' and 'selectionEnd' properties, or the 'setSelectionRange' method
    }

    // =======================================================================================================================================

    trackTabPress(handler) {    // handles pressing the tab key while the form input is focused: runs in autocompleting a typed command
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Tab' && document.activeElement.classList.contains('form-input')) {
                e.preventDefault()
                const sliced = this.formInput.value.slice(2)   // '> ' sliced out
                if(sliced.includes(' ')) return handler(null)
                if(sliced.startsWith('-')) return handler(null)
                return handler(sliced)
            }
        })
    }

    // =======================================================================================================================================

    setDoneAction(command, todoObj) {     // retuns what will be pasted into the input field; shows the action that was just executed
        let actionDone 
        if(command === 'add') actionDone = 'added'
        if(command === 'edit') actionDone = 'edited'
        if(command?.startsWith('del')) actionDone = 'deleted'
        const actionString = `${actionDone} "${todoObj.name}"! <span>priority: ${todoObj.priority}, category: ${todoObj.category}, deadline: ${todoObj.deadline}, subtasks: ${todoObj.hasSubtasks}</span>` 
        return actionString   
    }

    // =======================================================================================================================================

    handleEditingSubtask(handler) {     // handles pressing the edit btn of a subtask
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__subtask-btn--edit')) return
            const subtaskEl = e.target.closest('.item__subtask')
            const name = subtaskEl.querySelector('.item__subtask-name').textContent
            const index = subtaskEl.querySelector('.item__subtask-number').textContent
            handler(name, index)
        })
    }

    // =======================================================================================================================================

    handleDeletingSubtask(handler) {     // handles pressing the delete btn of a subtask
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__subtask-btn--remove')) return
            const subtaskEl = e.target.closest('.item__subtask')
            this.itemToDelete = subtaskEl
            this.deletionItemType = 'subtask'
            const name = subtaskEl.querySelector('.item__subtask-name').textContent
            handler(name)
        })
    }

    // =======================================================================================================================================

    // toggleManual's dependency; needed as a separate fn so the removeEventListener could remove it then
    hideManual = (e) => {
        /* NOTE:
        I cannot use '.bind(this)' in the event listener in 'toggleManual' (if I want to remove that listener later) because 'bind' returns a new function. And this way the add and remove event listeners will not point to the same function that must be removed.
        I must have the function that I want to remove defined separately.
        And I must use the arrow function which basically jumps over one layer of 'this', meaning attached to the event listener, 'this' will point not to the element that has this event listener but to one layer above, which in this case is this class of View, the enclosing entity (here, class).
        */
        if(e.code !== 'Escape') return   // if I pressed Esc, the manual will be hidden and the input will be focused again (I blur it in toggleManual)
        this.toggleManual('hide')
        this.clearFormInput()
        this.focusInput()
    }

    // =======================================================================================================================================

    toggleManual(flag='show') {    // showing or hiding the manual
        if(flag==='hide') { // case: hiding
            document.querySelector('.manual-wrapper').remove()   // removing (effectively hiding) the manual
            this.manualEl = ''
            this.itemsTopmostEl.classList.remove('hidden')    // unhiding .items
            this.showSystemMessage('manual was closed')
            document.removeEventListener('keydown', this.hideManual)
        } else { // case: showing
            const manualWrapper = document.createElement('div')   // creating the topmost manual div
            manualWrapper.classList.add('manual-wrapper')
            this.manualEl = manualWrapper
            this.clearFormInput()
            this.formInput.blur()
            this.showSystemMessage('showing the manual (press esc to hide it)')
            manualWrapper.innerHTML = manual();   // I import 'manual()' above
            this.sectionContainer.appendChild(manualWrapper)   // rendering it in the DOM
            this.itemsTopmostEl.classList.add('hidden')       // hiding .items
        }
        document.addEventListener('keydown', this.hideManual)
    }

    // =======================================================================================================================================

    //  I use it in 'completeTodoByBtn' in 'smallFunctions.js'
    toggleCompletionStyles(indexToEdit, isCompleted) {
        const entireSubtaskEl = [...document.querySelectorAll('.item__subtask')].find(x => x.querySelector('td:nth-child(2)').textContent === indexToEdit) // finding that subtask element the index element of which has the same content as 'indexToEdit'
        if(isCompleted) entireSubtaskEl.querySelector('td:nth-child(3)').classList.add('finished') // if this subtask is completed, add styles to the name element of this subtask
        else entireSubtaskEl.querySelector('td:nth-child(3)').classList.remove('finished')  // else remove styles
    }

}

export default View