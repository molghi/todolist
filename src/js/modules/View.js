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
    }

    // =======================================================================================================================================

    // changes UI colour
    changeUIColors(color) {
        return changeUIColors(color, this.colorUI, this.showSystemMessage);   // I import it above;   
        // I call this View's method the same as the function I'm calling here to avoid renaming everywhere where I use this method in other files
    }

    // =======================================================================================================================================

    // small helper fn for changeUIColors()
    isValidHTMLColor(color) { // returns boolean
        isValidHTMLColor(color);    // I import it above
    }

    // =======================================================================================================================================

    // runs on app init: we check LS 'colorUI' and if exists, this fn runs
    setAccentColor(color) {
        setAccentColor(color, this.colorUI);  // I import it above
    }

    // =======================================================================================================================================

    showSystemMessage(msgString) {
        this.systemMsgEl.innerHTML = msgString
    }

    // =======================================================================================================================================

    // clears form input
    clearFormInput() {
        this.formEl.elements.forminput.value = '> ' // clear the input
    }

    // =======================================================================================================================================

    // to make sure that '> ' at the beginning of the input is undeletable
    formatInput() {
        formatInput(this.formInput);    // I import it above
    }

    // =======================================================================================================================================
    
    // renders to-do in the DOM
    renderToDo(toDoObj, order) {
        renderToDo(toDoObj, order, this.itemsWrapperEl);    // I import it above
    }

    // =======================================================================================================================================

    focusInput() {
        this.formInput.focus()
    }

    // =======================================================================================================================================

    setInputValue(value) {
        this.formInput.value = `> ${value}`
    }

    // =======================================================================================================================================

    removeAllTodos() {
        while(this.itemsWrapperEl.firstChild) { 
                this.itemsWrapperEl.removeChild(this.itemsWrapperEl.firstChild)
            }
    }

    // =======================================================================================================================================

    // updates a todo (after form submit in editing)
    updateTodoElement(el, value) { 
        el.querySelector('.item__name').textContent = value
        el.querySelector('.item__name').setAttribute('title', value)
    }

    // =======================================================================================================================================
    
    // I allow no uppercase to be typed in
    deUppercaseInput() {
        this.formInput.addEventListener('input', (e) => {
            this.formInput.value = this.formInput.value.toLowerCase()
        })
    }

    // =======================================================================================================================================

    toggleTodo(todoEl, flag='hide') {
        if(flag==='show') {
            return todoEl.classList.remove('hidden')
        }
        todoEl.classList.add('hidden')
    }



    // =======================================================================================================================================
    // =======================================================================================================================================
    // =======================================================================================================================================




    // form submit handler
    formSubmit(handler) {
        this.formEl.addEventListener('submit', (e) => {
            e.preventDefault()
            const formInputValue = this.formEl.elements.forminput.value.slice(2)
            if(!formInputValue) return
            handler(formInputValue.trim()) // key and value to update Model aka local storage
        })
    }

    // =======================================================================================================================================

    handleTogglingSubtasks(handler) {
        this.itemsWrapperEl.addEventListener('click', (e) => {
            // if(!e.target.classList.contains('with-subtasks')) return
            if(!e.target.closest('.with-subtasks')) return
            const subtasksBoxEl = e.target.closest('.item').querySelector('.item__subtasks-holder')
            subtasksBoxEl.classList.toggle('hidden')
            const state = subtasksBoxEl.classList.contains('hidden') ? 'hidden' : 'shown'
            const todoName = e.target.closest('.item').querySelector('.item__name').textContent
            handler(todoName, state)
        })
    }

    // =======================================================================================================================================

    // handles clicking on the delete btn of any todo
    handleRemovingTodo(handler) {
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__btn--remove')) return
            const todoName = e.target.closest('.item').querySelector('.item__name').textContent
            handler(todoName)
        })
    }

    // =======================================================================================================================================

    // handles clicking on the edit btn of any todo
    handleEditingTodo(handler) {
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__btn--edit')) return
            const valueToEdit = e.target.closest('.item').querySelector('.item__name').textContent
            handler(valueToEdit)
        })
    }

    // =======================================================================================================================================

    handleCompletingTodo(handler) {
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__btn--complete') && !e.target.closest(`.item__subtask-btn--complete`)) return
            let indexToEdit, type
            if(e.target.closest('.item__btn--complete')) {
                indexToEdit = e.target.closest('.item').querySelector('.item__number').textContent
                type = 'majortask'
            }
            if(e.target.closest('.item__subtask-btn--complete')) {
                indexToEdit = e.target.closest('.item__subtask').querySelector('td:nth-child(2)').textContent
                type = 'subtask'
            }
            handler(indexToEdit, type)
        })
    }

    // =======================================================================================================================================

    handleArrowKeys(handler) {
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
    
    // shifts the cursor in the input field to the end of what's in the input field
    shiftCursorToTheEndAfterPasting() { 
        this.formInput.addEventListener('paste', (e) => {   // I need the 'paste' event
            setTimeout(() => { // I need 'setTimeout' to allow the paste operation to complete before manipulating the cursor position
                this.shiftCursorToTheEndNow()
            }, 0)
        })
    }

    // =======================================================================================================================================

    shiftCursorToTheEndNow() { 
        const length = this.formInput.value.length
        this.formInput.setSelectionRange(length, length) // I set the cursor to the end of the input using 'selectionStart' and 'selectionEnd' properties, or the 'setSelectionRange' method
    }

    // =======================================================================================================================================

    trackTabPress(handler) {
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

    setDoneAction(command,todoObj) {
        let actionDone 
        if(command === 'add') actionDone = 'added'
        if(command === 'edit') actionDone = 'edited'
        if(command?.startsWith('del')) actionDone = 'deleted'
        const actionString = `${actionDone} "${todoObj.name}"! <span>priority: ${todoObj.priority}, category: ${todoObj.category}, deadline: ${todoObj.deadline}, subtasks: ${todoObj.hasSubtasks}</span>` 
        return actionString   
    }

    // =======================================================================================================================================

    handleEditingSubtask(handler) {
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.closest('.item__subtask-btn--edit')) return
            const subtaskEl = e.target.closest('.item__subtask')
            const name = subtaskEl.querySelector('.item__subtask-name').textContent
            const index = subtaskEl.querySelector('.item__subtask-number').textContent
            handler(name, index)
        })
    }

    // =======================================================================================================================================

    handleDeletingSubtask(handler) {
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

    // toggleManual's dependency:
    hideManual = (e) => {
        /* NOTE:
        I cannot use '.bind(this)' in the event listener in 'toggleManual' (if I want to remove that listener later) because 'bind' returns a new function. And this way the add and remove event listeners will not point to the same function that must be removed.
        I must have the function that I want to remove defined separately.
        And I must use the arrow function which basically jumps over one layer of 'this', meaning attached to the event listener, 'this' will point not to the element that has this event listener but to one layer above, which in this case is this class of View, the enclosing entity (here, class).
        */
        // if(e.code !== 'KeyQ' && e.code !== 'Escape') return
        if(e.code !== 'Escape') return
        this.toggleManual('hide')
        this.clearFormInput()
        this.focusInput()
    }

    // =======================================================================================================================================

    toggleManual(flag='show') {
        if(flag==='hide') {
            document.querySelector('.manual-wrapper').remove()   // removing (effectively hiding) the manual
            this.manualEl = ''
            this.itemsTopmostEl.classList.remove('hidden')    // unhiding .items
            this.showSystemMessage('manual was closed')
            document.removeEventListener('keydown', this.hideManual)
        } else {
            const manualWrapper = document.createElement('div')   // creating the topmost manual div
            manualWrapper.classList.add('manual-wrapper')
            this.manualEl = manualWrapper
            this.clearFormInput()
            this.showSystemMessage('showing the manual (press esc to hide it)')
            manualWrapper.innerHTML = manual();   // I import 'manual' above
            this.sectionContainer.appendChild(manualWrapper)   // rendering it in the DOM
            this.itemsTopmostEl.classList.add('hidden')       // hiding .items
            this.formInput.blur()
        }
        document.addEventListener('keydown', this.hideManual)
    }

    // =======================================================================================================================================

    

    /* --forbid typing in the input (only permit if it's Q); --if it was Q or Esc, remove manual and show all items

    so what i want to do is:
    show the manual -- but when it's shown, track what key I press: 
        if it was q or esc, i hide the manual. 
        if it was anything but q or esc, clear the input field. 

    don't write code, explain conceptually. it's a little tricky to figure out or maybe it's just too late in the night:
    I pass a command to input -- once I recognise it, I run a fn that shows the manual and hides the UI elements;
    in this state when I am showing the manual, I want to track what key is being pressed: if it was Q or Esc, I hide the manual and show the UI
    how to do it? I am a little slow today. 
    should I have another fn with the event listener attached to the document as well as another one attached to my input?
    and then in that fn where I show the manual, at the end of it I would call that another fn with the listeners, eh?
    */

    // =======================================================================================================================================
}

export default View