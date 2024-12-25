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
    changeUIColors() {
        const newColor = prompt("Enter a new UI colour:")
        if(!newColor) return 
        if(!this.isValidHTMLColor(newColor)) return alert(`${newColor} is not a valid HTML colour!`)
        document.documentElement.style.setProperty('--accent', newColor)
        this.colorUI = newColor
        console.log(`UI colour now: ${newColor}`)
        return newColor
    }

    // =======================================================================================================================================

    // small helper fn for this.changeUIColors()
    isValidHTMLColor(color) { // returns boolean
        const element = document.createElement('div')
        element.style.color = color
        return element.style.color !== ''
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
            const formInputValue = this.formEl.elements.forminput.value.trim()
            if(!formInputValue) return
            handler(formInputValue) // key and value to update Model aka local storage
        })
    }

    // const allCurrentItems = Array.from(this.itemsWrapperEl.querySelectorAll('.item')).map(x => x.querySelector('.item__name').textContent.toLowerCase())
    // if(allCurrentItems.includes(formInputValue.toLowerCase())) return alert('You have already added this todo!')
    
    // =======================================================================================================================================

    // clears form input
    clearFormInput() {
        this.formEl.elements.forminput.value = '' // clear the input
    }

    // =======================================================================================================================================
    
    // renders to-do in the DOM
    renderToDo(toDoName) {
        const newToDo = document.createElement('div')
        newToDo.classList.add('item')
        newToDo.innerHTML = `<div class="item__name" title="${toDoName}">${toDoName}</div>
                        <div class="item__btns">
                            <button class="item__btn item__btn--edit" title="Edit">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="item__btn item__btn--remove" title="Delete">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>`
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
            const text = e.target.closest('.item').querySelector('.item__name').textContent
            const choice = confirm(`Are you certain you want to delete this todo?\n\n${text}`)
            if(!choice) return
            e.target.closest('.item').remove() // remove from DOM
            this.renderTodosNumber(document.querySelectorAll('.item').length) // update 'Todos:'
            handler(text)
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
}

export default View