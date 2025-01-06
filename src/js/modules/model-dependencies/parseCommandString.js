
//  I use this fn in 'makeTodoObject' in Model and in 'editingItems' file -- it returns an array of a pure command string and an object
export function parseCommandString(string, stateCommands, setFlags) {   
    let command 
    const todoObj = {}

    // case: it is a subtask:
    if(string.includes(', subtask')) return parsingSubtask(string, command);  // 'parsingSubtask' returns an array of a pure command string and an object

    command = string.split(' ')[0]  // getting the pure command, like just 'add' or 'edit'

    // case: the command didn't start with 'add' of 'edit'
    if(command !== 'add' && command !== 'edit') return [command, null]

    // case: there is no such a command to execute
    if(!stateCommands.includes(command)) { 
        command = null
        todoObj.msg = `command does not exist, type "manual" or "man" to see the manual`
        return [command, todoObj]
    }

    // setting defaults:
    todoObj.isCompleted = false;
    todoObj.hasSubtasks = false;
    todoObj.subtasks = [];
    todoObj.priority = null;
    todoObj.deadline = null;
    todoObj.category = null;
    todoObj.created = new Date().toISOString();
    todoObj.id = Date.now();
    todoObj.command = string;
        
    // setting name:
    const [name, msg] = parseName(string, command)   // 'parseName' returns an array: name value and msg value
    if(!name) {
        todoObj.name = null
        command = null
        todoObj.msg = msg
        return [command, todoObj]
    } else {
        todoObj.name = name
    }
        
    // setting params:
    string.indexOf('-') < 0 ? todoObj.params = null : todoObj.params = string.slice(string.indexOf('-'))
        
    // setting other flags:    'setFlags' sets the values of various flags and writes it to 'todoObj'
    setFlags('--name', '-n ', todoObj, 'name', todoObj.params)
    setFlags('--finished', '-f ', todoObj, 'isCompleted', todoObj.params)
    setFlags('--prio', '-p ', todoObj, 'priority', todoObj.params)
    setFlags('--dead', '-d ', todoObj, 'deadline', todoObj.params)
    setFlags('--cat', '-c ', todoObj, 'category', todoObj.params)
    setFlags('--sub', '-s ', todoObj, 'subtasks', todoObj.params)

    return [command, todoObj]
}


// ========================================================================================================================

// a helper fn for 'parseCommandString' -- returns an array of a pure command string and an object
function parsingSubtask(string, command) {
    // the only things that are editable in a subtask are 'name' (-n or --name) and 'isCompleted' (-f or --finished)
    string = string.slice(0, string.indexOf(', subtask'))  // slicing out ', subtask'
    command = string.split(' ')[0]  // getting the pure command, like just 'add' or 'edit'
    string = string.slice(command.length+1) // slicing out the pure command

    let newName, isCompleted, flagLengthName, flagLengthCompleted, flagName, flagCompleted
    flagLengthName = string.includes('--name') ? '--name'.length : string.includes('-n') ? '-n'.length : null   // getting the length of the name flag
    flagLengthCompleted = string.includes('--finished') ? '--finished'.length : string.includes('-f') ? '-f'.length : null   // getting the length of the finished flag
    flagName = (flagLengthName && flagLengthName===2) ? '-n' : (flagLengthName && flagLengthName > 2) ? '--name' : null   // if flagLengthName is not null and is 2, set it to '-n'...
    flagCompleted = (flagLengthCompleted && flagLengthCompleted===2) ? '-f' : (flagLengthCompleted && flagLengthCompleted > 2) ? '--finished' : null   // same logic

    const stringSplitted = string.split('-').filter(x => x.trim().length > 0) 
    const oldName = stringSplitted[0].trim()  // getting the old name (in editing)
    if(flagLengthName) {  // if there was the name flag
        newName = stringSplitted.find(x => x.startsWith('n ') || x.startsWith('name ')).trim() // setting the name
        newName.startsWith('name ') ? newName = newName.slice(newName.indexOf('name ')+5) : newName = newName.slice(newName.indexOf('n ')+2)   // slicing out 'name ' or 'n ' to get the flag value without the flag itself
    }
    if(flagLengthCompleted) {
        isCompleted = stringSplitted.find(x => x.startsWith('f ') || x.startsWith('finished ')).trim() // same logic
        isCompleted.startsWith('finished ') ? isCompleted = isCompleted.slice(isCompleted.indexOf('finished ')+9) : isCompleted = isCompleted.slice(isCompleted.indexOf('f ')+2)
    }

    return [command, {oldName, newName, isCompleted: isCompleted==='true' ? true : isCompleted==='false' ? false : undefined }]
}


// ========================================================================================================================

// a helper fn for 'parseCommandString' -- I use it when I set the value of 'todoObj.name' (a majortask) -- returns an array: name value and msg value (error) (both primitives)
function parseName(string, parsedCommand) {  
    // 'string' is the entire command string; 'parsedCommand' is a pure command, like just 'add' or 'edit'
    if(string === parsedCommand) return [null, 'error: no task name was passed']
    if(string.slice(4).trim().startsWith('-')) return [null, 'error: no task name was passed']  // if after the pure command there was no task name but the flag right away

    if(parsedCommand === 'add' || parsedCommand === 'edit') {
        const indexOfFirstSpace = string.indexOf(' ') > 0 ? string.indexOf(' ') : string.length  // getting the index of the first whitespace
        const indexOfFirstFlag = string.indexOf('-') > 0 ? string.indexOf('-') : string.length   // getting the index of the first flag
        const name = string.slice(indexOfFirstSpace, indexOfFirstFlag).trim()
        if(!name) return [null, 'error'];
        return [name, null]
    }

    return [null, null]
}
