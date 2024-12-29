class View {
    constructor() {
        this.colorUI = `#32CD32` // by default, it's less intense than 'lime'
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

    // handles the click on 'Change UI colour'
    handleActionsClick(handler) {
        document.querySelector('.actions').addEventListener('click', (e) => {
            /* 
            note: if I use an arrow fn as a cb fn of an event listener, 'this' within it points to the instance of the View class
            if I use a regular fn as a cb fn here, 'this' points to the DOM element that was clicked
            if you use 'bind(this)' inside the event listener like 'this.changeUIColors().bind(this)', it will not work because bind returns a new function, but the call to this.changeUIColors() executes before bind can take effect.
            Solution: You should bind the method before you attach it to the event listener, or a use an arrow function without 'bind'.
            Arrow functions basically skip one step, so to speak, and attach 'this' to one level higher than regular functions.
            */
            if(e.target.classList.contains('change-ui-color-btn')) {
                const newColor = this.changeUIColors()
                handler('colorUI', newColor)
            }
        })
    }

    // =======================================================================================================================================

    // changes UI colour
    changeUIColors(color) {
        if(color === 'def' || color === 'default') {
            document.documentElement.style.setProperty('--accent', '#32CD32')
            this.colorUI = '#32CD32'
            return '#32cd32'
        }
        if(!color) {
            this.showSystemMessage('error: no color was passed')
            return null
        }
        if(!this.isValidHTMLColor(color)) {
            this.showSystemMessage(`error: "${color}" is not a valid html color or is too dark!`)
            return null
        }
        document.documentElement.style.setProperty('--accent', color)
        this.colorUI = color
        return color
    }

    // =======================================================================================================================================

    // small helper fn for this.changeUIColors()
    isValidHTMLColor(color) { // returns boolean

        // Create a temporary element to validate the colour:
        const element = document.createElement('div')
        element.style.color = color

        // Temporarily append the element to the document body
        document.body.appendChild(element)

        // PART 1/2: Check if the color is a valid HTML colour
        if (element.style.color === '') {
            return false
        }

        // PART 2/2: Check if the typed colour is not too dark:

        // Get the computed colour in RGB format
        const computedColor = window.getComputedStyle(element).color
        // console.log(`'${computedColor}'`)

        // Remove the temporary element from the document
        document.body.removeChild(element);

        // Extract RGB values using regex
        const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) {
            console.error(`Error parsing RGB from: ${computedColor}`);
            return false; // Invalid format, unexpected result
        }

        // Extract RGB components
        const [r, g, b] = match.slice(1).map(Number);

        // Debug: Log extracted RGB values
        // console.log(`Extracted RGB: r=${r}, g=${g}, b=${b}`);

        // Calculate relative luminance (W3C formula)
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        // Debug: Log computed luminance
        // console.log(`Computed Luminance: ${luminance}`);

        // Define the darkness threshold (for #555)
        // const darknessThreshold = (0.2126 * 85 + 0.7152 * 85 + 0.0722 * 85) / 255;
        const darknessThreshold = 0.1

        // Debug: Log darkness threshold
        // console.log(`Darkness Threshold: ${darknessThreshold}`);

        // Return false if luminance is below the threshold
        return luminance >= darknessThreshold;
    }

    // =======================================================================================================================================

    // runs on app init: we check LS 'colorUI' and if exists, this fn runs
    setAccentColor(color) {
        if(!color) return
        document.documentElement.style.setProperty('--accent', color)
        this.colorUI = color
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

    // const allCurrentItems = Array.from(this.itemsWrapperEl.querySelectorAll('.item')).map(x => x.querySelector('.item__name').textContent.toLowerCase())
    // if(allCurrentItems.includes(formInputValue.toLowerCase())) return alert('You have already added this todo!')
    
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
        const {name, isCompleted, priority, deadline, category, created, hasSubtasks, subtasks} = toDoObj

        const newToDo = document.createElement('div')
        newToDo.classList.add('item')

        // Format the creation date
        const itsDate = `${new Date(created).getFullYear()}:${new Date(created).getMonth()+1}:${new Date(created).getDate().toString().padStart(2,0)}`

        // Generate the subtask number if subtasks exist
        const subtaskNum = !hasSubtasks ? '' : `<td class="item__subtasks-num"><span>num of subs: </span>${subtasks.length}</td>`

        // Map over subtasks and generate HTML rows
        const subtasksEl = subtasks?.map((subtask, i) => {
    return `<tr class="item__subtask">
        <td>----</td>
        <td>${i+1}.</td>
        <td title="${subtask.name}">${subtask.name}</td>
        <td title="${subtask.isCompleted}"><span>completed:</span> ${subtask.isCompleted}</td>
        <td class="item__subtask-btns">
            <button class="item__subtask-btn item__subtask-btn--complete" title="Complete">
                <i class="fa-solid fa-circle-check"></i>
            </button>
            <button class="item__subtask-btn item__subtask-btn--edit" title="Edit">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="item__subtask-btn item__subtask-btn--remove" title="Delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    </tr>`;
}).join('')

        // Create the item HTML structure
        newToDo.innerHTML = `
        <div class="item__holder">
        
        <table class="item__wrapper">
                    <tbody>
                    <tr>
                        <td class="item__number">${order}</td>
                        <td class="item__name" title="${name}">${name}</td>
                        <td class="item__priority" title="priority: ${priority || 'unset'}"><span>priority:</span> ${priority || 'unset'}</td>
                        <td class="item__category" title="category: ${category || 'unset'}"><span>category:</span> ${category || 'unset'}</td>
                        <td class="item__deadline" title="deadline: ${deadline || 'unset'}"><span>deadline:</span> ${deadline || 'unset'}</td>
                        <td class="item__has-subtasks" title="subtasks: ${hasSubtasks ? 'yes' : 'none'}"><span>subtasks:</span> ${hasSubtasks ? 'yes' : 'none'}</td>
                        ${subtaskNum}
                        <td class="item__is-completed" title="completed: ${isCompleted}"><span>completed:</span> ${isCompleted}</td>
                        <td class="item__date" title="creation date: ${itsDate}"><span>created:</span> ${itsDate}</td>
                    </tr>
                    </tbody>
                </table>

                        <div class="item__btns">
                            <button class="item__btn item__btn--complete" title="Complete">
                                <i class="fa-solid fa-circle-check"></i>
                            </button>
                            <button class="item__btn item__btn--edit" title="Edit">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="item__btn item__btn--remove" title="Delete">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                        </div>

                        ${hasSubtasks ? `<div class="item__subtasks-holder">
                            <table>
                                <tbody>
                                    ${subtasksEl}
                                </tbody>
                            </table>
                        </div>` : ''}
                        
                        `
        this.itemsWrapperEl.appendChild(newToDo) 
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
            this.changeH2('edit mode') // changing H2
            this.changeFormBtn('edit mode') // changing form btn: + Add --> Edit
            const valueToEdit = e.target.closest('.item').querySelector('.item__name').textContent
            this.formInput.value = valueToEdit // bringing the value to form
            this.formInput.focus()
            this.highlightTodo('highlight', e.target.closest('.item')) // highlight it visually
            handler(valueToEdit)
        })
    }

    // =======================================================================================================================================

    // changes H2 to reflect the current mode (Adding/Editing)
    changeH2(mode) {
        if(mode==='edit mode') {
            this.h2.textContent = `Edit Your To-Do`
        } else {
            this.h2.textContent = `Add Your New To-Do`
        }
    }

    // =======================================================================================================================================

    // changes form btn to reflect the current mode (Adding/Editing)
    changeFormBtn(mode) {
        if(mode==='edit mode') {
            this.formBtn.innerHTML = `Edit`
        } else {
            this.formBtn.innerHTML = `<i class="fa-solid fa-plus"></i>
Add`
        }
    }

    // =======================================================================================================================================

    // highlights a todo (in editing)
    highlightTodo(toggle, el) {
        if(toggle === 'highlight') {
            el.classList.add('highlight')
        } else { // de-highlight
            document.querySelectorAll('.item').forEach(x => x.classList.remove('highlight'))
        }
    }

    // =======================================================================================================================================

    // updates a todo (after form submit in editing)
    updateTodoElement(el, value) { 
        el.querySelector('.item__name').textContent = value
        el.querySelector('.item__name').setAttribute('title', value)
    }

    // =======================================================================================================================================

    // changing the UI back to Adding mode: change H2, change form btn, and dehighlight all todos
    removeEditingMode() {
        this.changeH2('adding mode') 
        this.changeFormBtn('adding mode')
        this.highlightTodo('dehighlight')
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
        ['input', 'keydown'].forEach(ev => {
            this.formInput.addEventListener(ev, (e) => {
                if(ev === 'keydown') {
                    if(e.code === 'KeyZ' && e.metaKey) { // tracking the undo operation
                        setTimeout(() => { // I need timeout with 1ms to wait until the undo operation of ctrl+Z is over
                            if(this.formInput.value.slice(2).includes('> ')) {
                                const sliced = this.formInput.value.slice(2) // slicing the first '> ' out
                                const extraPrefixIndex = sliced.indexOf('> ')
                                if (extraPrefixIndex !== -1) { // Detect extra prefixes
                                    this.formInput.value = '> ' + sliced.slice(extraPrefixIndex + 2); // Remove extras
                                }
                            }
                        }, 10) // the flickering in the input happens because of this 10ms, which I must have so the browser could bring back the before-the-change/deletion value before I capture it -- else I capture the input value before the browser brings it back (and it's effectively null) -- I guess I will have to put up with that... which is a little annoying
                    }
                }
                if(this.formInput.value.length < 3 || !this.formInput.value.startsWith('> ')) {
                    const currentContent = this.formInput.value.slice(2) // Preserve existing content beyond the prefix
                    this.formInput.value = '> ' + currentContent
                    this.shiftCursorToTheEndNow()
                    this.shiftCursorToTheEndAfterPasting()
                } 
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
        this.formInput.value = value
    }

    // =======================================================================================================================================

    removeAllTodos() {
        while(this.itemsWrapperEl.firstChild) { 
                this.itemsWrapperEl.removeChild(this.itemsWrapperEl.firstChild)
            }
    }

    // =======================================================================================================================================
}

export default View