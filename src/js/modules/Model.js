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
        if(!key || !value) return console.log(`invalid`)
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
        this.state.recentCommands = [...new Set(this.state.recentCommands)]   // removing duplicates if there are any
    }
    
    // ================================================================================================

    pushToDo(todo) {   // pushes a majortask, not a subtask
        this.state.todos.push(todo)
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

    removeTodo(index, type='majortask') {  // removes a task or subtask
        if(type === 'majortask') {
            const itsIndex = +index - 1   // because the indices in the UI start from 1, not 0, so I need to decrement
            if(itsIndex < 0) return console.log(`Negative index`)
            this.state.todos.splice(itsIndex, 1)
        } else {   // <-- it is a subtask
            // 'index' will be 6.4 (for example) (as in the UI, if it's not sorted) while I need it to be 5.3
            const [majortaskIndex, subtaskIndex] = index.split('.')
            if(+majortaskIndex -1 < 0) return console.log(`Negative index`)
            const majortask = this.state.todos.find((todo, i) => i === +majortaskIndex -1)   // locating the majortask of this subtask
            majortask.subtasks.splice(+subtaskIndex -1, 1)
        }
    }

    // ================================================================================================

    getProperIndex(todoName, type='majortask') {    // called when the app state (the table) was sorted to get an index when the table is unsorted
        if(type === 'subtask') { 
            const majortask = this.state.todos.find(todo => {    // locating the majortask of this subtask
                return todo.subtasks.find(sub => sub.name === todoName)
            })
            const majortaskIndex = this.state.todos.findIndex(todo => todo.name === majortask.name)   // locating the index of this majortask
            const subtaskIndex = majortask.subtasks.findIndex(sub => sub.name === todoName)   // locating the index of the subtask
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
    



    getRecentCommand(flag) {   // runs when I type arrow up or down while the input field is focused
        if(flag === 'next') {
            this.state.count++
            if(this.state.count > this.state.recentCommands.length-1) {  // <-- guarding out of bounds case
                this.state.count = 0
            }
        } else {
            this.state.count--
            if(this.state.count < 0) {  // <-- guarding out of bounds case
                this.state.count = this.state.recentCommands.length-1
            }
        }
        return this.state.recentCommands[this.state.count]
    }

    // ================================================================================================

    makeTodoObject(string) {    // returns [command, todoObj]
        const myString = string.toLowerCase().trimStart()
        if(!myString.trimEnd()) return console.log(`nothing was sent`)
        return this.parseCommandString(myString)  // 'parseCommandString' returns [command, todoObj]
    }

    // ================================================================================================

    getTodoObjString(index) {    // returns what to put into the input field when you click on the task/subtask edit btn
        // case: it's a subtask:
        if(index.includes('.')) {
            const [majortaskIndex, subtaskIndex] = index.split('.')
            const todoObj = this.state.todos[Number(majortaskIndex)-1]
            const subtaskObj = todoObj.subtasks[Number(subtaskIndex)-1]
            // returning what to put into the input field:
            return [`edit ${subtaskObj.name}${(subtaskObj.isCompleted===true || subtaskObj.isCompleted===false) ? ` -f ${subtaskObj.isCompleted}` : ''}`, subtaskObj.name]
        } else {   // case: it's a majortask:
            const todoObj = this.state.todos[Number(index)-1]
            const priority = todoObj.priority ? ` --prio ${todoObj.priority}` : ''
            const category = todoObj.category ? ` --cat ${todoObj.category}` : ''
            const deadline = todoObj.deadline ? ` --dead ${todoObj.deadline}` : ''
            const isCompleted = todoObj.isCompleted ? ` --finished ${todoObj.isCompleted}` : ''
            // const subtasks = todoObj.subtasks.length > 0 ? ` --sub ${todoObj.subtasks.map(x => x.name).join(', ')}` : ''
            return [`edit ${todoObj.name}${priority}${category}${deadline}${isCompleted}`, todoObj.name]
        }
    }

    // ================================================================================================

    editTodo(newObj, type='majortask') {     // edits a todo (majortask, subtask) in the state, here.

        if(type==='subtask') {    // if it's a subtask:
            const allTodosWithSubtasks = this.state.todos.filter(todo => todo.hasSubtasks)
            const todoToEdit = allTodosWithSubtasks.find(todo => {       // locating the majortask
                return todo.subtasks.find(subtask => subtask.name===newObj.oldName)
            })
            const subtaskIndex = todoToEdit.subtasks.findIndex(sub => sub.name===newObj.oldName)
            if(newObj.newName) todoToEdit.subtasks[subtaskIndex].name = newObj.newName;
            if(newObj.isCompleted===true || newObj.isCompleted===false) todoToEdit.subtasks[subtaskIndex].isCompleted = newObj.isCompleted;
            return
        }

        // if it's a majortask:
        const indexToEdit = this.state.todos.findIndex(x => x.name === this.state.oldValue)
        const todoToEdit = this.state.todos[indexToEdit]
        for(let i = 0; i < Object.keys(newObj).length; i++) {   // iterating through newObj...
            const newObjKey = Object.keys(newObj)[i]
            if(newObjKey === 'created') continue        // I don't allow it to be edited
            if(newObjKey === 'command') continue        // I don't allow it to be edited
            if(newObjKey === 'id') continue             // I don't allow it to be edited
            if(newObj[newObjKey] === null) continue     // if it's null, no changing as well
            if(newObjKey === 'hasSubtasks') continue    // I don't allow subtasks to be edited this way
            if(newObjKey === 'subtasks') continue       // I don't allow subtasks to be edited this way
            if(newObj[newObjKey] === todoToEdit[newObjKey]) continue     // if two values are the same, no changing
            todoToEdit[newObjKey] = newObj[newObjKey]
            // console.log(`property changed: ${newObjKey}`)
        }
    }

    // ================================================================================================

    parseFilterString(string) {     // parsing flags of a typed command
        const parsedFlags = {}
        if(string.includes('--name') || string.includes('-n ')) {   // seeing if the string had the name flag
            const flag = string.includes('--name') ? '--name' : '-n'   // figuring out what flag was there, long or short
            this.parseFilterStringHelper(string, parsedFlags, flag, 'name')  // calling the helper fn
        }
        if(string.includes('--finished') || string.includes('-f ')) {
            const flag = string.includes('--finished') ? '--finished' : '-f'
            this.parseFilterStringHelper(string, parsedFlags, flag, 'finished')
        }
        if(string.includes('--prio') || string.includes('-p ')) {
            const flag = string.includes('--prio') ? '--prio' : '-p'
            this.parseFilterStringHelper(string, parsedFlags, flag, 'priority')
        }
        if(string.includes('--dead') || string.includes('-d ')) {
            const flag = string.includes('--dead') ? '--dead' : '-d'
            this.parseFilterStringHelper(string, parsedFlags, flag, 'deadline')
        }
        if(string.includes('--cat') || string.includes('-c ')) {
            const flag = string.includes('--cat') ? '--cat' : '-c'
            this.parseFilterStringHelper(string, parsedFlags, flag, 'category')
        }
        if(string.includes('--sub') || string.includes('-s ')) {
            const flag = string.includes('--sub') ? '--sub' : '-s'
            this.parseFilterStringHelper(string, parsedFlags, flag, 'subtasks')
        }
        return parsedFlags
    }

    parseFilterStringHelper(string, parsedFlags, flag, key) {
        let flagValue = string.slice(string.indexOf(flag)+flag.length+1)   // slicing out the flag
        if(flagValue.includes('-')) flagValue = flagValue.slice(0, flagValue.indexOf('-'))   // slicing the next flag out
        if(key==='finished') {
            if(flagValue.trim() === 'true' || flagValue.trim() === 'done') parsedFlags.finished = 'true'
            if(flagValue.trim() === 'false' || flagValue.trim() === 'undone') parsedFlags.finished = 'false'
            return
        }
        if(flagValue.trim()) parsedFlags[key] = flagValue.trim()
    }

    // ================================================================================================

    sortTodos(criterion) {     // returns todos in a new order, which will be rendered
        if(criterion === 'name') { // return sorted alphabetically: from  A to Z
            return JSON.parse(JSON.stringify(this.state.todos)).sort((a,b) => a.name.localeCompare(b.name))   
            // NOTE: JSON.parse-JSON.stringify allows to make a deep copy, which we need because 'sort' changes the original array
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
            const undone = this.state.todos.filter(todo => !todo.isCompleted)
            const done = this.state.todos.filter(todo => todo.isCompleted)
            return [...undone, ...done]
        }
        if(criterion === 'deadline') {  // sort by deadline: from overdue to today to this week --> not the ideal...
            const withDot = this.state.todos.filter(todo => String(todo.deadline).includes('.')).sort((a,b) => a.deadline.localeCompare(b.deadline))
            const withColon = this.state.todos.filter(todo => String(todo.deadline).includes(':')).sort((a,b) => a.deadline.localeCompare(b.deadline))
            const rest = this.state.todos.filter(todo => !String(todo.deadline).includes('.') && !String(todo.deadline).includes(':') && String(todo.deadline) !== 'null')
            const nulls = this.state.todos.filter(todo => String(todo.deadline) === 'null')
            return [...withDot, ...withColon, ...rest, ...nulls]
        }
    }

    // ================================================================================================

    import(dataObj) {   // runs if the file import was successful, meaning it was formatted the way I allow it
        const {accentColor, count, isEditMode, isSortMode, mode, oldValue, sortModeCriterion, commands, flags, todos, recentCommands} = dataObj
        // I only care about 6 things here: accentColor mode oldValue recentCommands sortModeCriterion todos -- anything else won't be changed
        // changing it:
        if(accentColor) this.state.accentColor = accentColor
        if(mode) this.state.mode = mode
        if(oldValue) this.state.oldValue = oldValue
        if(sortModeCriterion) this.state.sortModeCriterion = sortModeCriterion
        if(Array.isArray(recentCommands)) this.state.recentCommands = recentCommands
        if(Array.isArray(todos)) this.state.todos = todos
    }

    // ================================================================================================

    // runs if I clicked on the majortask name that has subtasks: as a result, subtasks will be either shown or hidden and this characteristic will be saved
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

    pushSubtask(index, subtaskObj) {    // pushes a new subtask to a majortask subtasks and changing its 'hasSubtasks' state
        this.state.todos[index-1].subtasks.push(subtaskObj)
        this.state.todos[index-1].hasSubtasks = true
    }

    // ================================================================================================

    getNewSubtaskObj(name) {    // returns a new subtask obj
        return {
            created: new Date().toISOString(),
            id: Date.now(),
            isCompleted: false,
            name: name,
        }
    }

    // ================================================================================================

    // I call it in 'deletionConfirmed' in 'deleting.js' -- in case if I deleted all subtasks, the majortask now must have hasSubtasks = false
    checkSubtasks(indexToRemove, type) {
        if(type === 'subtask') {
            const majortaskProperIndex = +indexToRemove.split('.')[0] -1   // 'proper' meaning decremented by one because in the UI task indices don't start with 0 but 1
            const majortaskObj = Logic.getStateTodos()[majortaskProperIndex]
            if(majortaskObj.subtasks.length === 0) {
                majortaskObj.hasSubtasks = false
            }
        }
    }

    // ================================================================================================

    // I call it when I complete a todo by clicking a btn -- If I mark a todo that has subtasks completed, all of its subtasks are completed as well -- and for similar cases
    checkCompletion(todoObj, type) {
        // NOTE: even if I toggled the completion of a subtask, 'todoObj' is its majortask
        if(!todoObj.hasSubtasks) return   // it has no subtasks, early return

        if(type === 'majortask') {
            if(todoObj.isCompleted === true) return todoObj.subtasks.forEach(sub => sub.isCompleted = true)     // all subtasks are completed
            if(todoObj.isCompleted === false) return todoObj.subtasks.forEach(sub => sub.isCompleted = false)   // all subtasks are uncompleted
        }
        if(type === 'subtask') {
            const allSubtasksCompleted = todoObj.subtasks.every(sub => sub.isCompleted === true)
            const notAllSubtasksCompleted = todoObj.subtasks.some(sub => sub.isCompleted === false)
            if(allSubtasksCompleted) return todoObj.isCompleted = true
            if(notAllSubtasksCompleted) return todoObj.isCompleted = false
        }
    }

}

export default Model