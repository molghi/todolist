// view dependencies:
import { renderToDo } from './view-dependencies/renderToDo.js';
import { changeUIColors, isValidHTMLColor, setAccentColor } from './view-dependencies/colorManipulations.js';


class View {
    constructor() {
        this.colorUI = `#32cd32` // by default; it's less intense than 'lime'
        this.formEl = document.querySelector('form')
        this.itemsWrapperEl = document.querySelector('.items__wrapper')
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

    // to be able to press tilda and change UI colours:
    handleKeyPresses(handler) {
        document.addEventListener('keydown', (e) => {      // 'keypress' is deprecated
        if (e.code === 'Backquote') {  // if it's tilda
            const newColor = this.changeUIColors()  // this fn returns the new UI color and we need it to update our state/local storage
            handler('colorUI', newColor)
        }
    })
    }

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

    showSystemMessage(msgString) {
        this.systemMsgEl.innerHTML = msgString
    }

    // =======================================================================================================================================

    // clears form input
    clearFormInput() {
        this.formEl.elements.forminput.value = '> ' // clear the input
    }

    // =======================================================================================================================================
    
    // renders to-do in the DOM
    renderToDo(toDoObj, order) {
        renderToDo(toDoObj, order, this.itemsWrapperEl);    // I import it above
    }

    // =======================================================================================================================================

    handleTogglingSubtasks(handler) {
        this.itemsWrapperEl.addEventListener('click', (e) => {
            if(!e.target.classList.contains('with-subtasks')) return
            const subtasksBoxEl = e.target.closest('.item').querySelector('.item__subtasks-holder')
            subtasksBoxEl.classList.toggle('hidden')
            const state = subtasksBoxEl.classList.contains('hidden') ? 'hidden' : 'shown'
            const todoName = e.target.closest('.item').querySelector('.item__name').textContent
            handler(todoName, state)
        })
    }

    // =======================================================================================================================================
    
    // renders "Todos: [number]" in the UI
    renderTodosNumber(number) {
        this.todosNumberEl.textContent = number
    }

    // =======================================================================================================================================

    // handles the filter input:
    handleFiltering() {
        this.filterInput.addEventListener('input', (e) => {
            const filterInputValue = this.filterInput.value.toLowerCase()
            const allTodoEls = document.querySelectorAll('.item')
            allTodoEls.forEach(todoEl => {
                const todoText = todoEl.querySelector('.item__name').textContent.toLowerCase()
                if(!todoText.includes(filterInputValue)) {
                    todoEl.classList.add('hidden')
                } else {
                    todoEl.classList.remove('hidden')
                }
            })
            const todosSatisfyingCriterion = Array.from(document.querySelectorAll('.item')).filter(x => !x.classList.contains('hidden')).length
            this.renderTodosNumber(todosSatisfyingCriterion)
            if(!filterInputValue) this.renderTodosNumber(document.querySelectorAll('.item').length)
        })
    }

    // =======================================================================================================================================

    // handles clicking on the Remove All Todos btn
    handleRemovingAllTodos(handler) {
        this.clearBtn.addEventListener('click', (e) => {
            const choice = confirm(`This will delete all of your todos. Are you certain?`)
            if(!choice) return
            while(this.itemsWrapperEl.firstChild) { 
                this.itemsWrapperEl.removeChild(this.itemsWrapperEl.firstChild) // remove all from DOM
            } 
            this.renderTodosNumber(0) // set Todos: to 0
            this.toggleExtraFeatures()
            handler()
        })
    }

    // =======================================================================================================================================

    // hides or shows Filter, 'Todos:' and the clear btn if there are no todos
    toggleExtraFeatures() {
        if(!this.itemsWrapperEl.firstChild) {
            this.filterBlock.classList.add('hidden')
            this.titleBlock.classList.add('hidden')
            this.clearBtn.classList.add('hidden')
        } else {
            this.filterBlock.classList.remove('hidden')
            this.titleBlock.classList.remove('hidden')
            this.clearBtn.classList.remove('hidden')
        }
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
            // this.changeH2('edit mode') // changing H2
            // this.changeFormBtn('edit mode') // changing form btn: + Add --> Edit
            const valueToEdit = e.target.closest('.item').querySelector('.item__name').textContent
            // this.formInput.value = valueToEdit // bringing the value to form
            // this.formInput.focus()
            // this.highlightTodo('highlight', e.target.closest('.item')) // highlight it visually
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

    // updates a todo (after form submit in editing)
    updateTodoElement(el, value) { 
        el.querySelector('.item__name').textContent = value
        el.querySelector('.item__name').setAttribute('title', value)
    }

    // =======================================================================================================================================

    focusInput() {
        this.formInput.focus()
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

    shiftCursorToTheEndNow() { 
        const length = this.formInput.value.length
        this.formInput.setSelectionRange(length, length) // I set the cursor to the end of the input using 'selectionStart' and 'selectionEnd' properties, or the 'setSelectionRange' method
    }

    // =======================================================================================================================================

    // to make sure that '> ' at the beginning of the input is undeletable
    formatInput() {
        const input = this.formInput;
        ['input', 'keydown', 'paste'].forEach(ev => {

            input.addEventListener(ev, (e) => {
                if(ev === 'keydown') {  // if it's an 'keydown' event:
                    if(e.code === 'KeyZ' && e.metaKey) { // tracking the undo operation
                        setTimeout(() => { // I need timeout with 1ms to wait until the undo operation of ctrl+Z is over
                            if(input.value.slice(2).includes('> ')) {
                                const sliced = input.value.slice(2) // slicing the first '> ' out
                                const extraPrefixIndex = sliced.indexOf('> ')
                                if (extraPrefixIndex !== -1) { // Detect extra prefixes
                                    input.value = '> ' + sliced.slice(extraPrefixIndex + 2); // Remove extras
                                }
                            }
                        }, 10) // the flickering in the input happens because of this 10ms, which I must have so the browser could bring back the before-the-change/deletion value before I capture it -- else I capture the input value before the browser brings it back (and it's effectively null) -- I guess I will have to put up with that... which is a little annoying
                    }
                }

                // if it's an 'input' event:
                if(ev === 'input') {
                // If the input is empty or has only the prefix, reset it
                    if (input.value === '' || input.value === '>') {
                        input.value = '> ';
                    }
                    // Ensure the input always starts with "> "
                    if (!input.value.startsWith('> ')) {
                        input.value = '> ' + input.value.trimStart();
                    }
                    // Move the cursor to the end of the input
                    input.setSelectionRange(input.value.length, input.value.length);
                }

                // Handle paste events specifically
                if(ev === 'paste') {
                    const pastedText = (e.clipboardData || window.clipboardData).getData('text'); // Retrieves the text data being pasted. `e.clipboardData` is a modern browser API providing access to clipboard content during a paste event. '.getData('text')' extracts the plain text content from the clipboard.
                    input.value = '> ' + pastedText.trim();
                    e.preventDefault(); // Stops the default paste behaviour of the browser
                    input.setSelectionRange(input.value.length, input.value.length); // Moves the blinking cursor (caret) to the end of the input field after updating its value
                }

                // if(input.value.length < 3 || !input.value.startsWith('> ')) {
                //     let currentContent
                //     console.log(input.value)
                //     currentContent = input.value.slice(2) // Preserve existing content beyond the prefix
                //     input.value = '> ' + currentContent
                //     this.shiftCursorToTheEndNow()
                //     this.shiftCursorToTheEndAfterPasting()
                // } 

            })
        })
    }

    // =======================================================================================================================================
    
    // I allow no uppercase to be typed in
    deUppercaseInput() {
        this.formInput.addEventListener('input', (e) => {
            this.formInput.value = this.formInput.value.toLowerCase()
        })
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

    toggleTodo(todoEl, flag='hide') {
        if(flag==='show') {
            return todoEl.classList.remove('hidden')
        }
        todoEl.classList.add('hidden')
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
}

export default View