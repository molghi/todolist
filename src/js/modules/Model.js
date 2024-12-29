import LS from './Storage'  // working with local storage

class Model {
    state = {
        todos: [],
        isEditMode: false,
        oldValue: '',  // I need it in Editing mode
        commands: ['add', 'edit', 'delete', 'del', 'filter', 'fil', 'changecol', 'cc', 'manual', 'man', 'import', 'export', 'clearall'],
        flags: [
            '--name', // name
            '-n',
            '--finished', // isCompleted
            '-f',
            '--prio', // priority
            '-p',
            '--dead', // deadline
            '-d',
            '--cat', // category
            '-c',
            '--sub', // push to 'subtasks' and hasSubtasks=true
            '-s',
        ],
        recentCommands: ['add do workout --prio high --cat other --dead today', 'add food shopping -p medium -c food -s buy apples, buy bananas, buy oats, buy cheese, buy juice', 'add home chores -p high -c other -d 20:00 -s vacuum clean, dust off', 'manual'],
        count: 0
    }

    // ================================================================================================
    
    getRecentCommand(flag) {
        if(flag === 'next') {
            this.state.count++
            if(this.state.count > this.state.recentCommands.length-1) {
                this.state.count = 0
            }
            return this.state.recentCommands[this.state.count]
        }
        this.state.count--
        if(this.state.count < 0) {
            this.state.count = this.state.recentCommands.length-1
        }
        return this.state.recentCommands[this.state.count]
    }

    // ================================================================================================

    getState() {
        return this.state
    }

    // ================================================================================================

    getOldValue() {
        return this.state.oldValue
    }

    // ================================================================================================

    makeTodoObject(string) {
        const myString = string.toLowerCase().trimStart()
        if(!myString.trimEnd()) return console.log(`nothing was sent`)
        return this.parseCommandString(myString)  // 'parseCommandString' returns [command, todoObj]
    }

    // ================================================================================================
    
    parseCommandString(string) {
        let command = string.split(' ')[0]
        const todoObj = {}
        if(command !== 'add') return [command, null]

        if(!this.state.commands.includes(command)) {
            command = null
            todoObj.msg = `command does not exist, type "manual" or "man" to see the manual`
            return [command, todoObj]
        }

        todoObj.isCompleted = false
        todoObj.hasSubtasks = false
        todoObj.subtasks = []
        todoObj.priority = null
        todoObj.deadline = null
        todoObj.category = null
        todoObj.created = new Date().toISOString()
        todoObj.id = Date.now()
        todoObj.command = string
        
        const [name, msg] = this.parseName(string, command)
        if(!name) {
            command = null
            todoObj.msg = msg
            todoObj.name = null
            return [command, todoObj]
        } else {
            todoObj.name = name
        }
        
        string.indexOf('-') < 0 ? todoObj.params = null : todoObj.params = string.slice(string.indexOf('-'))

        this.setFlags('--name', '-n ', todoObj, 'name', todoObj.params)

        this.setFlags('--finished', '-f ', todoObj, 'isCompleted', todoObj.params)

        this.setFlags('--prio', '-p ', todoObj, 'priority', todoObj.params)
        
        this.setFlags('--dead', '-d ', todoObj, 'deadline', todoObj.params)
        
        this.setFlags('--cat', '-c ', todoObj, 'category', todoObj.params)
        
        this.setFlags('--sub', '-s ', todoObj, 'subtasks', todoObj.params)

        return [command, todoObj]
    }


    // ================================================================================================

    parseName(string, parsedCommand) { // returns an array: name value and msg value
        if(string === parsedCommand) return [null, 'error: no task name was passed']
        if(string.slice(4).startsWith('-')) return [null, 'error: no task name was passed']
        if(parsedCommand === 'add') {
            const indexOfFirstSpace = string.indexOf(' ') > 0 ? string.indexOf(' ') : string.length
            const indexOfFirstFlag = string.indexOf('-') > 0 ? string.indexOf('-') : string.length
            const name = string.slice(indexOfFirstSpace, indexOfFirstFlag).trim()
            console.warn(`name: '${name}'`)
            if(!name) return [null, 'error']
            return [name, null]
        }
        return [null, null]
    }

    // ================================================================================================

    setFlags(flagLong, flagShort, object, property, params) {
        let flagLength, flagValue

        if(params?.includes(flagLong) || params?.includes(flagShort)) {
            flagLength = params.includes(flagLong) ? flagLong.length : 2
            if(flagLength===2) {
                let temp = params.slice(params.indexOf(flagShort)+flagLength+1)
                if(temp.startsWith('-')) return flagValue = null  // in case if there is a flag but it has no value like -p here: add buy milk -p -c food
                flagValue = temp.slice(0, temp.indexOf('-')-1 <0 ? temp.length : temp.indexOf('-')-1)
            } else {
                let temp = params.slice(params.indexOf(flagLong)+flagLength+1)
                if(temp.startsWith('-')) return flagValue = null  // in case if there is a flag but it has no value like -p here: add buy milk -p -c food
                flagValue = temp.slice(0, temp.indexOf('-')-1 <0 ? temp.length : temp.indexOf('-')-1)
            }
            if(property === 'subtasks') { // subtasks is a special case #1
                flagValue.split(',').forEach(subtask => object.subtasks.push({
                    name: subtask.trim(),
                    isCompleted: false,
                    created: new Date().toISOString(),
                    id: Date.now(),
                    // I think subtasks will have no priority, deadline or category
                }))
                object.subtasks.length > 0 ? object.hasSubtasks = true : object.hasSubtasks = false
                return
            }
            if(property === 'isCompleted') { // isCompleted is a special case #2
                object[property] = Boolean(flagValue)
                return
            }
            object[property] = flagValue === '' ? null : flagValue
        } 

    }

    // ================================================================================================

    pushRecentCommand(command) {
        this.state.recentCommands.push(command)
    }

    getCommands() {
        return this.state.commands
    }
    getFlags() {
        return this.state.flags
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