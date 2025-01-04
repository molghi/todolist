
export function parseCommandString(string, stateCommands, setFlags) { 
        let command

        // case: it is a subtask:
        if(string.includes(', subtask')) {  
            return parsingSubtask(string, command)
        }

        command = string.split(' ')[0]  // getting the pure command
        const todoObj = {}

        // case: the command didn't start with 'add' of 'edit'
        if(command !== 'add' && command !== 'edit') return [command, null]

        // case: there is no such a command to execute
        if(!stateCommands.includes(command)) { 
            command = null
            todoObj.msg = `command does not exist, type "manual" or "man" to see the manual`
            return [command, todoObj]
        }

        // setting defaults:
        todoObj.isCompleted = false
        todoObj.hasSubtasks = false
        todoObj.subtasks = []
        todoObj.priority = null
        todoObj.deadline = null
        todoObj.category = null
        todoObj.created = new Date().toISOString()
        todoObj.id = Date.now()
        todoObj.command = string
        
        // setting name:
        const [name, msg] = parseName(string, command)
        if(!name) {
            command = null
            todoObj.msg = msg
            todoObj.name = null
            return [command, todoObj]
        } else {
            todoObj.name = name
        }
        

        // setting params:
        string.indexOf('-') < 0 ? todoObj.params = null : todoObj.params = string.slice(string.indexOf('-'))
        

        // setting other flags:
        setFlags('--name', '-n ', todoObj, 'name', todoObj.params)

        setFlags('--finished', '-f ', todoObj, 'isCompleted', todoObj.params)

        setFlags('--prio', '-p ', todoObj, 'priority', todoObj.params)
        
        setFlags('--dead', '-d ', todoObj, 'deadline', todoObj.params)
        
        setFlags('--cat', '-c ', todoObj, 'category', todoObj.params)
        
        setFlags('--sub', '-s ', todoObj, 'subtasks', todoObj.params)

        return [command, todoObj]
    }


// ========================================================================================================================

// a helper fn for 'parseCommandString'
function parsingSubtask(string, command) {
    console.log(`parsing subtask`)
    /* 
    CASES:
        edit 6.1 -n hello world -f true -- ALL GOOD
        edit 6.1 -n hello world -f false -- ALL GOOD
        edit 6.1 -n hello -f true -- ALL GOOD
        edit 6.1 -n hello -- ALL GOOD
        edit 6.1 -f true -- ALL GOOD
        edit 6.1 -f true -n hello -- ALL GOOD
        edit 6.1 -f true -n hello world -- ALL GOOD
        edit 6.6 -f true -n hello world -- ALL GOOD
    */
    // the only things that are editable in a subtask are 'name' (-n) and 'isCompleted' (-f)
    string = string.slice(0, string.indexOf(', subtask')) // slicing out ', subtask'
    command = string.split(' ')[0]
    string = string.slice(command.length+1) // slicing out command; example: hoover -n hello  or  hoover -n hello world -f true
    let newName, isCompleted, flagLengthName, flagLengthCompleted, flagName, flagCompleted
    flagLengthName      = string.includes('--name') ? '--name'.length : string.includes('-n') ? '-n'.length : null
    flagLengthCompleted = string.includes('--finished') ? '--finished'.length : string.includes('-f') ? '-f'.length : null
    flagName = (flagLengthName && flagLengthName===2) ? '-n' : (flagLengthName && flagLengthName > 2) ? '--name' : null
    flagCompleted = (flagLengthCompleted && flagLengthCompleted===2) ? '-f' : (flagLengthCompleted && flagLengthCompleted > 2) ? '--finished' : null
    // const oldName = string.slice(0, string.indexOf('-')).trim()
    const stringSplitted = string.split('-').filter(x => x.trim().length>0)
    const oldName = stringSplitted[0].trim()
    if(flagLengthName) {
        newName = stringSplitted.find(x => x.startsWith('n ') || x.startsWith('name ')).trim()
        newName.startsWith('name ') ? newName = newName.slice(newName.indexOf('name ')+5) : newName = newName.slice(newName.indexOf('n ')+2)
    }
    if(flagLengthCompleted) {
        isCompleted = stringSplitted.find(x => x.startsWith('f ') || x.startsWith('finished ')).trim()
        isCompleted.startsWith('finished ') ? isCompleted = isCompleted.slice(isCompleted.indexOf('finished ')+9) : isCompleted = isCompleted.slice(isCompleted.indexOf('f ')+2)
    }
    // console.log(string) // example: hoover -n hello
    return [command, {oldName, newName, isCompleted: isCompleted==='true' ? true : isCompleted==='false' ? false : undefined }]
}


// ========================================================================================================================

// a helper fn for 'parseCommandString'
// returns an array: name value and msg value
function parseName(string, parsedCommand) { 
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
