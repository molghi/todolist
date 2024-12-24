class View {
    constructor() {
        this.colorUI = `#32CD32` // by default, it's less intense than 'lime'
        this.formEl = document.querySelector('form')
        this.itemsWrapperEl = document.querySelector('.items__wrapper')
        this.todosNumberEl = document.querySelector('.items__title span')
        this.filterInput = document.querySelector('.filter-input')
    }

    // =======================================================================================================================================

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

    changeUIColors() {
        const newColor = prompt("Enter a new UI colour:")
        if(!newColor) return 
        document.documentElement.style.setProperty('--accent', newColor)
        this.colorUI = newColor
        console.log(`UI colour now: ${newColor}`)
        return newColor
    }

    // =======================================================================================================================================

    setAccentColor(color) {
        if(!color) return
        document.documentElement.style.setProperty('--accent', color)
        this.colorUI = color
    }

    // =======================================================================================================================================

    handleKeyPresses(handler) {
        document.addEventListener('keydown', (e) => {      // 'keypress' is deprecated
        if (e.code === 'Backquote') {  // if it's tilda
            const newColor = this.changeUIColors()  // this fn returns the new UI color and we need it to update our state/local storage
            handler('colorUI', newColor)
        }
    })
    }

    // =======================================================================================================================================

    formSubmit(handler) {
        this.formEl.addEventListener('submit', (e) => {
            e.preventDefault()
            const formInputValue = this.formEl.elements.forminput.value.trim()
            this.renderToDo(formInputValue) // creating a DOM element and appending it -- rendering
            this.formEl.elements.forminput.value = '' // clear the input
            handler(formInputValue) // key and value to update Model aka local storage
        })
    }
    
    // =======================================================================================================================================
    
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
    
    renderTodosNumber(number) {
        this.todosNumberEl.textContent = number
    }

    // =======================================================================================================================================

    handleFiltering() {
        this.filterInput.addEventListener('input', function(e) {
            const filterInputValue = this.value
            const allTodoEls = document.querySelectorAll('.item')
            allTodoEls.forEach(todoEl => {
                const todoText = todoEl.querySelector('.item__name').textContent
                if(!todoText.includes(filterInputValue)) {
                    todoEl.classList.add('hidden')
                } else {
                    todoEl.classList.remove('hidden')
                }
            })
        })
    }

    // =======================================================================================================================================
}

export default View