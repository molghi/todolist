import LS from './Storage'  // working with local storage

class Model {
    state = {
        todos: []
    }

    constructor() {
    }

    saveToLS(key, value, type='primitive') {
        if(!key || !value) return
        LS.save(key, value)
    }

    getFromLS(key) {
        return LS.get(key)
    }

    pushToDo(todo) {
        this.state.todos.push(todo)
    }

    pushTodosToLS() {
        this.saveToLS('todos', JSON.stringify(this.state.todos), 'array')
    }
}

export default Model