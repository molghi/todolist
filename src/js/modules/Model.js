// model dependencies:
import LS from './model-dependencies/Storage.js'  // working with local storage
import { setFlags } from './model-dependencies/setFlags.js'  
import { parseCommandString } from './model-dependencies/parseCommandString.js'  



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
        recentCommands: ['add do workout --prio high --cat other --dead today', 
                        'add food shopping -p medium -c food -d today -s buy apples, buy bananas, buy oats, buy cheese, buy juice', 
                        'add home chores -p high -c other -d 20:00 -s vacuum clean, dust off', 
                        'manual'],
        count: 0,
        accentColor: '#32CD32',
        mode: ''
    }



    // ================================================================================================
    // ================================================================================================
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

    pushRecentCommand(command) {
        this.state.recentCommands.push(command)
        this.state.recentCommands = [...new Set(this.state.recentCommands)] // removing duplicates if there are any
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

    setEditMode(booleanFlag) {
        this.state.isEditMode = booleanFlag
    }

    // ================================================================================================

    removeTodo(index, type='majortask') {
        if(type === 'majortask') {
            const itsIndex = +index - 1
            if(itsIndex < 0) return console.log(`Negative index`)
            this.state.todos.splice(itsIndex, 1)
        } else { // it is a subtask
            // console.log(index) // it'll be 6.4 (for example) (as in the UI, if it's not sorted) while I need it to be 5.3
            const [majortaskIndex, subtaskIndex] = index.split('.')
            if(+majortaskIndex -1 < 0) return console.log(`Negative index`)
            const majortask = this.state.todos.find((todo, i) => i === +majortaskIndex -1)
            majortask.subtasks.splice(+subtaskIndex -1, 1)
        }
    }

    // ================================================================================================

    getProperIndex(todoName, type='majortask') {
        if(type === 'subtask') {
            const majortask = this.state.todos.find(todo => {
                return todo.subtasks.find(sub => sub.name === todoName)
            })
            const majortaskIndex = this.state.todos.findIndex(todo => todo.name === majortask.name)
            const subtaskIndex = majortask.subtasks.findIndex(sub => sub.name === todoName)
            return `${majortaskIndex}.${subtaskIndex}`
        }
        return this.state.todos.findIndex(x => x.name === todoName)
    }

    // ================================================================================================

    setFlags(flagLong, flagShort, object, property, params) {
        setFlags(flagLong, flagShort, object, property, params);    // I import it above
    }

    // ================================================================================================

    parseCommandString(string) {
        return parseCommandString(string, this.state.commands, this.setFlags);    // I import it above
    }


    // ================================================================================================
    // ================================================================================================
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

    makeTodoObject(string) {
        const myString = string.toLowerCase().trimStart()
        if(!myString.trimEnd()) return console.log(`nothing was sent`)
        return this.parseCommandString(myString)  // 'parseCommandString' returns [command, todoObj]
    }

    // ================================================================================================

    getTodoObjString(index) {
        // case: it's a subtask:
        if(index.includes('.')) {
            const [majortaskIndex, subtaskIndex] = index.split('.')
            const todoObj = this.state.todos[Number(majortaskIndex)-1]
            const subtaskObj = todoObj.subtasks[Number(subtaskIndex)-1]
            return [`edit ${subtaskObj.name}${(subtaskObj.isCompleted===true || subtaskObj.isCompleted===false) ? ` -f ${subtaskObj.isCompleted}` : ''}`, subtaskObj.name]
        }
        const todoObj = this.state.todos[Number(index)-1]
        const priority = todoObj.priority ? ` --prio ${todoObj.priority}` : ''
        const category = todoObj.category ? ` --cat ${todoObj.category}` : ''
        const deadline = todoObj.deadline ? ` --dead ${todoObj.deadline}` : ''
        const isCompleted = todoObj.isCompleted ? ` --finished ${todoObj.isCompleted}` : ''
        // const subtasks = todoObj.subtasks.length > 0 ? ` --sub ${todoObj.subtasks.map(x => x.name).join(', ')}` : ''
        return [`edit ${todoObj.name}${priority}${category}${deadline}${isCompleted}`, todoObj.name]
    }

    // ================================================================================================

    editTodo(newObj, type='majortask') {
        console.log(newObj)
        if(type==='subtask') {
            const allTodosWithSubtasks = this.state.todos.filter(todo => todo.hasSubtasks)
            const todoToEdit = allTodosWithSubtasks.find(todo => {
                return todo.subtasks.find(subtask => subtask.name===newObj.oldName)
            })
            const subtaskIndex = todoToEdit.subtasks.findIndex(sub => sub.name===newObj.oldName)
            if(newObj.newName) todoToEdit.subtasks[subtaskIndex].name = newObj.newName, console.log(`subtask name was changed`);
            if(newObj.isCompleted===true || newObj.isCompleted===false) todoToEdit.subtasks[subtaskIndex].isCompleted = newObj.isCompleted, console.log(`subtask isCompleted was changed`);
            return
        }

        const indexToEdit = this.state.todos.findIndex(x => x.name === this.state.oldValue)
        const todoToEdit = this.state.todos[indexToEdit]
        for(let i = 0; i < Object.keys(newObj).length; i++) { // iterating through newObj...
            const newObjKey = Object.keys(newObj)[i]
            if(newObjKey === 'created') continue        // I don't allow it to be edited
            if(newObjKey === 'command') continue        // I don't allow it to be edited
            if(newObjKey === 'id') continue             // I don't allow it to be edited
            if(newObj[newObjKey] === null) continue     // if it's null, no reassigning as well
            if(newObjKey === 'hasSubtasks') continue    // I don't allow subtasks to be edited this way
            if(newObjKey === 'subtasks') continue       // I don't allow subtasks to be edited this way
            // if(newObjKey === 'subtasks' && newObj.subtasks.length === todoToEdit.subtasks.length) continue    // if subtasks length is the same, no reassigning
            if(newObj[newObjKey] === todoToEdit[newObjKey]) continue                                          // if two values are the same, no reassigning
            todoToEdit[newObjKey] = newObj[newObjKey]
            console.log(`this property was changed: ${newObjKey}`)
        }
    }

    // ================================================================================================

    parseFilterString(string) {
        const parsedFlags = {}
        if(string.includes('--name') || string.includes('-n ')) {
            const flagLength = string.includes('--name') ? '--name' : '-n'
            this.parseFilterStringHelper(flagLength, 'name')
        }
        if(string.includes('--finished') || string.includes('-f ')) {
            const flagLength = string.includes('--finished') ? '--finished' : '-f'
            this.parseFilterStringHelper(flagLength, 'finished')
        }
        if(string.includes('--prio') || string.includes('-p ')) {
            const flagLength = string.includes('--prio') ? '--prio' : '-p'
            this.parseFilterStringHelper(flagLength, 'priority')
        }
        if(string.includes('--dead') || string.includes('-d ')) {
            const flagLength = string.includes('--dead') ? '--dead' : '-d'
            this.parseFilterStringHelper(flagLength, 'deadline')
        }
        if(string.includes('--cat') || string.includes('-c ')) {
            const flagLength = string.includes('--cat') ? '--cat' : '-c'
            this.parseFilterStringHelper(flagLength, 'category')
        }
        if(string.includes('--sub') || string.includes('-s ')) {
            const flagLength = string.includes('--sub') ? '--sub' : '-s'
            this.parseFilterStringHelper(flagLength, 'subtasks')
        }
        return parsedFlags
    }

    parseFilterStringHelper(flagLength, key) {
        let flagValue = string.slice(string.indexOf(flagLength)+flagLength.length+1)
        if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))
        if(key==='finished') {
            if(flagValue.trim() === 'true' || flagValue.trim() === 'done') parsedFlags.finished = 'true'
            if(flagValue.trim() === 'false' || flagValue.trim() === 'undone') parsedFlags.finished = 'false'
            return
        }
        if(flagValue.trim()) parsedFlags[key] = flagValue.trim()
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
            return [...withDot, ...withColon, ...rest, ...nulls]
        }
    }

    // ================================================================================================

    import(dataObj) {
        const {accentColor, count, isEditMode, isSortMode, mode, oldValue, sortModeCriterion, commands, flags, todos, recentCommands} = dataObj
        // I care about 6 things here: accentColor mode oldValue   recentCommands sortModeCriterion todos
        if(accentColor) this.state.accentColor = accentColor
        if(mode) this.state.mode = mode
        if(oldValue) this.state.oldValue = oldValue
        if(sortModeCriterion) this.state.sortModeCriterion = sortModeCriterion
        if(Array.isArray(recentCommands)) this.state.recentCommands = recentCommands
        if(Array.isArray(todos)) this.state.todos = todos
    }

    // ================================================================================================

    setSubtasksVisibility(todoName, state) {
        const todoToChange = this.state.todos.find(todo => todo.name === todoName)
        if(state === 'hidden') {
            todoToChange.isCollapsed = true
        }
        if(state === 'shown') {
            todoToChange.isCollapsed = false
        }
    }

    // ================================================================================================

    pushSubtask(index, subtaskObj) {
        const trueIndex = index-1
        this.state.todos[trueIndex].subtasks.push(subtaskObj)
        this.state.todos[trueIndex].hasSubtasks = true
    }

}

export default Model