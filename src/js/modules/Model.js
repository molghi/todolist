import LS from './Storage'  // working with local storage

class Model {
    state = {
        todos: [],
        isEditMode: false,
        isSortMode: false,
        sortModeCriterion: 'default',
        oldValue: '',  // I need it in Editing mode
        commands: ['add', 'edit', 'delete', 'del', 'filter', 'fil', 'changecol', 'cc', 'manual', 'man', 'import', 'export', 'clearall', 'sort'],
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
        count: 0,
        accentColor: '#32CD32',
        mode: ''
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

    changeAccentColor(color) {
        this.state.accentColor = color
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
        if(command !== 'add' && command !== 'edit') return [command, null]

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
        // console.log(string, parsedCommand)
        if(string === parsedCommand) return [null, 'error: no task name was passed']
        if(string.slice(4).trim().startsWith('-')) return [null, 'error: no task name was passed']
        if(parsedCommand === 'add' || parsedCommand === 'edit') {
            const indexOfFirstSpace = string.indexOf(' ') > 0 ? string.indexOf(' ') : string.length
            const indexOfFirstFlag = string.indexOf('-') > 0 ? string.indexOf('-') : string.length
            const name = string.slice(indexOfFirstSpace, indexOfFirstFlag).trim()
            console.log(`name: '${name}'`)
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
                object[property] = flagValue === 'true' ? true : false
                return
            }
            if(property === 'deadline') { // deadline is a special case #3
                console.log(flagValue)
                if(flagValue === 'today') flagValue = `${String(new Date().getDate()).padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
                if(flagValue === 'tomorrow') flagValue = `${String(new Date().getDate()+1).padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
                object[property] = flagValue === '' ? null : flagValue
                return
            }
            object[property] = flagValue === '' ? null : flagValue
        } 

    }

    // ================================================================================================

    pushRecentCommand(command) {
        this.state.recentCommands.push(command)
    }

    // ================================================================================================

    getCommands() {
        return this.state.commands
    }

    // ================================================================================================
    
    getFlags() {
        return this.state.flags
    }

    // ================================================================================================

    setOldValue(val) {
        this.state.oldValue = val
    }

    // ================================================================================================

    saveToLS(key, value, type='primitive') {
        if(!key || !value) return
        LS.save(key, value)
    }
    
    // ================================================================================================

    getFromLS(key) {
        return LS.get(key)
    }
    
    // ================================================================================================

    removeItemFromLS(key) {
        return LS.remove(key)
    }
    
    // ================================================================================================

    pushToDo(todo) {
        this.state.todos.push(todo)
    }
    
    // ================================================================================================

    pushTodosToLS() {
        this.saveToLS('todos', JSON.stringify(this.state.todos), 'array')
    }
    
    // ================================================================================================

    removeTodos() {
        this.state.todos = []
    }

    // ================================================================================================

    getStateTodos() {
        return this.state.todos
    }

    // ================================================================================================

    removeTodo(index) {
        // console.log(this.state.todos.map(x => x.name).join(', '))
        const itsIndex = +index - 1
        // console.log(itsIndex)
        if(itsIndex<0) return console.log(`Negative index`)
        this.state.todos.splice(itsIndex, 1)
        // console.log(this.state.todos.map(x => x.name).join(', '))
    }

    // ================================================================================================

    setEditMode(booleanFlag) {
        this.state.isEditMode = booleanFlag
    }

    // ================================================================================================

    getTodoObjString(index) {
        const todoObj = this.state.todos[Number(index)-1]
        const priority = todoObj.priority ? ` --prio ${todoObj.priority}` : ''
        const category = todoObj.category ? ` --cat ${todoObj.category}` : ''
        const deadline = todoObj.deadline ? ` --dead ${todoObj.deadline}` : ''
        const isCompleted = todoObj.isCompleted ? ` --finished ${todoObj.isCompleted}` : ''
        const subtasks = todoObj.subtasks.length > 0 ? ` --sub ${todoObj.subtasks.map(x => x.name).join(', ')}` : ''
        return [`edit ${todoObj.name}${priority}${category}${deadline}${isCompleted}${subtasks}`, todoObj.name]
    }

    // ================================================================================================

    editTodo(newObj) {
        // console.log(this.state.oldValue)
        // console.log(newObj)
        const indexToEdit = this.state.todos.findIndex(x => x.name === this.state.oldValue)
        const todoToEdit = this.state.todos[indexToEdit]
        for(let i = 0; i < Object.keys(newObj).length; i++) { // iterating through newObj...
            const newObjKey = Object.keys(newObj)[i]
            if(newObjKey === 'created') continue        // I don't allow it to be edited
            if(newObjKey === 'command') continue        // I don't allow it to be edited
            if(newObjKey === 'id') continue             // I don't allow it to be edited
            if(newObj[newObjKey] === null) continue     // if it's null, no reassigning as well
            if(newObjKey === 'subtasks' && newObj.subtasks.length === todoToEdit.subtasks.length) continue    // if subtasks length is the same, no reassigning
            if(newObj[newObjKey] === todoToEdit[newObjKey]) continue                                          // if two values are the same, no reassigning
            todoToEdit[newObjKey] = newObj[newObjKey]
            console.log(`this property was changed: ${newObjKey}`)
        }
        // console.log(this.state.todos)
    }

    // ================================================================================================

    parseFilterString(string) {
        const parsedFlags = {}
        if(string.includes('--name') || string.includes('-n ')) {
            const flagLength = string.includes('--name') ? '--name' : '-n'
            let flagValue = string.slice(string.indexOf(flagLength)+flagLength.length+1)
            if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))
            if(flagValue.trim()) parsedFlags.name = flagValue.trim()
        }
        if(string.includes('--finished') || string.includes('-f ')) {
            const flagLength = string.includes('--finished') ? '--finished' : '-f'
            let flagValue = string.slice(string.indexOf(flagLength)+flagLength.length+1)
            if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))
            if(flagValue.trim() === 'true' || flagValue.trim() === 'done') parsedFlags.finished = 'true'
            if(flagValue.trim() === 'false' || flagValue.trim() === 'undone') parsedFlags.finished = 'false'
        }
        if(string.includes('--prio') || string.includes('-p ')) {
            const flagLength = string.includes('--prio') ? '--prio' : '-p'
            let flagValue = string.slice(string.indexOf(flagLength)+flagLength.length+1)
            if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))
            if(flagValue.trim()) parsedFlags.priority = flagValue.trim()
        }
        if(string.includes('--dead') || string.includes('-d ')) {
            const flagLength = string.includes('--dead') ? '--dead' : '-d'
            let flagValue = string.slice(string.indexOf(flagLength)+flagLength.length+1)
            if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))
            if(flagValue.trim()) parsedFlags.deadline = flagValue.trim()
        }
        if(string.includes('--cat') || string.includes('-c ')) {
            const flagLength = string.includes('--cat') ? '--cat' : '-c'
            let flagValue = string.slice(string.indexOf(flagLength)+flagLength.length+1)
            if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))
            if(flagValue.trim()) parsedFlags.category = flagValue.trim()
        }
        if(string.includes('--sub') || string.includes('-s ')) {
            const flagLength = string.includes('--sub') ? '--sub' : '-s'
            let flagValue = string.slice(string.indexOf(flagLength)+flagLength.length+1)
            if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))
            if(flagValue.trim()) parsedFlags.subtasks = flagValue.trim()
        }
        return parsedFlags
    }

    // ================================================================================================

    sortTodos(criterion) {
        if(criterion === 'name') { // return sorted alphabetically: from  A to Z
            return JSON.parse(JSON.stringify(this.state.todos)).sort((a,b) => a.name.localeCompare(b.name))   // JSON.parse- JSON.stringify allow to make a deep copy
        }
        if(criterion === 'category') { // return sorted alphabetically: from  A to Z
            return JSON.parse(JSON.stringify(this.state.todos)).sort((a,b) => String(a.category).localeCompare(String(b.category)))
        }
        if(criterion === 'priority') {  // sort by priority: from high to low/null
            const highs = this.state.todos.filter(todo => String(todo.priority) === 'high')
            const mediums = this.state.todos.filter(todo => String(todo.priority).startsWith('med'))
            const lows = this.state.todos.filter(todo => String(todo.priority) === 'low')
            const rest = this.state.todos.filter(todo => String(todo.priority) !== 'high' && !String(todo.priority).startsWith('med') && String(todo.priority) !== 'low')
            return [...highs, ...mediums, ...lows, ...rest]
        }
        if(criterion === 'subtasks') {  // sort by subtasks: from those who have subtasks to those who don't
            const subtasks = this.state.todos.filter(todo => todo.hasSubtasks)
            const noSubtasks = this.state.todos.filter(todo => !todo.hasSubtasks)
            return [...subtasks, ...noSubtasks]
        }
        if(criterion === 'finished') { // sort by finished: from undone to done
            const done = this.state.todos.filter(todo => todo.isCompleted)
            const undone = this.state.todos.filter(todo => !todo.isCompleted)
            return [...undone, ...done]
        }



        if(criterion === 'deadline') {  // sort by deadline: from overdue to today to this week
            const withDot = this.state.todos.filter(todo => String(todo.deadline).includes('.')).sort((a,b) => a.deadline.localeCompare(b.deadline))
            const withColon = this.state.todos.filter(todo => String(todo.deadline).includes(':')).sort((a,b) => a.deadline.localeCompare(b.deadline))
            const rest = this.state.todos.filter(todo => !String(todo.deadline).includes('.') && !String(todo.deadline).includes(':') && String(todo.deadline) !== 'null')
            const nulls = this.state.todos.filter(todo => String(todo.deadline) === 'null')
            return [...withColon, ...withDot, ...rest, ...nulls]


            // const todays = this.state.todos.filter(todo => String(todo.deadline).includes('today'))
            // const tomorrows = this.state.todos.filter(todo => String(todo.deadline) === 'tomorrow')
            // const rest = this.state.todos.filter(todo => !String(todo.deadline).includes('today') && String(todo.deadline) !== 'tomorrow' && String(todo.deadline) !== 'null')
            // const nulls = this.state.todos.filter(todo => String(todo.deadline) === 'null')
            // return [...todays, ...tomorrows, ...rest, ...nulls]
        }

        
        
    }

    // ================================================================================================

    getProperIndex(todoName) {
        return this.state.todos.findIndex(x => x.name === todoName)
    }

}

export default Model