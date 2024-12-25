import LS from './Storage'  // working with local storage

class Model {
    state = {
        todos: [],
        isEditMode: false,
        oldValue: ''  // I need it in Editing mode
    }

    getOldValue() {
        return this.state.oldValue
    }

    setOldValue(val) {
        this.state.oldValue = val
    }

    saveToLS(key, value, type='primitive') {
        if(!key || !value) return
        LS.save(key, value)
    }

    getFromLS(key) {
        return LS.get(key)
    }

    removeItemFromLS(key) {
        return LS.remove(key)
    }

    pushToDo(todo) {
        this.state.todos.push(todo)
    }

    pushTodosToLS() {
        this.saveToLS('todos', JSON.stringify(this.state.todos), 'array')
    }

    removeTodos() {
        this.state.todos = []
    }

    getStateTodos() {
        return this.state.todos
    }

    removeTodo(todoText) {
        const itsIndex = this.state.todos.indexOf(todoText)
        if(itsIndex<0) return console.log(`Not found`)
        this.state.todos.splice(itsIndex, 1)
    }

    setEditMode(booleanFlag) {
        this.state.isEditMode = booleanFlag
    }
}

export default Model