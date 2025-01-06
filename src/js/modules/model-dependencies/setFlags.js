
export function setFlags(flagLong, flagShort, object, property, params) {
    /* explanation and examples:
    I use this fn in 'parseCommandString' file/fn -- it sets the values of various flags and writes it to the 'object' which is 'todoObj' in 'parseCommandString'
        flagLong can be '--name'
        flagShort can be '-n '
        object is todoObj
        property can be 'name'
        params is todoObj.params
    */
    let flagLength, flagValue

    if(params?.includes(flagLong) || params?.includes(flagShort)) {   // if params has flagLong or flagShort
        flagLength = params.includes(flagLong) ? flagLong.length : 2  // setting the length of the flag

        if(flagLength===2) { // if it's a short flag
            let temp = params.slice(params.indexOf(flagShort)+flagLength+1)  // slice 'params' from after this flag and whitespace to the end
            if(temp.startsWith('-')) return flagValue = null  // in case if there is a flag but it has no value like '-p' in this command: 'add buy milk -p -c food'
            flagValue = temp.slice(0, temp.indexOf('-')-1 < 0 ? temp.length : temp.indexOf('-')-1)  // slicing from the beginning up to the next '-' if it exists there, or to the end if it doesn't
        } else { // if it's a long flag, same manipulations, only with the long flag:
            let temp = params.slice(params.indexOf(flagLong)+flagLength+1)
            if(temp.startsWith('-')) return flagValue = null  
            flagValue = temp.slice(0, temp.indexOf('-')-1 < 0 ? temp.length : temp.indexOf('-')-1)
        }

        if(property === 'subtasks') { // subtasks is a special case #1
            flagValue.split(',').forEach(subtask => object.subtasks.push({    // we split by a comma and push new subtask objects to the 'object.subtasks'
                name: subtask.trim(),
                isCompleted: false,
                created: new Date().toISOString(),
                id: Date.now(),
                // subtasks will have no priority, deadline or category
            }))
            object.subtasks.length > 0 ? object.hasSubtasks = true : object.hasSubtasks = false   // setting the 'hasSubtasks' value
            return
        }

        if(property === 'isCompleted') { // isCompleted is a special case #2
            object[property] = flagValue === 'true' ? true : false    // we need booleans assigned here
            return
        }

        if(property === 'deadline') { // deadline is a special case #3
            // if it spelled out 'today', then make it today with new Date:
            if(flagValue === 'today') flagValue = `${String(new Date().getDate()).padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
            // if it spelled out 'tomorrow', then make it tomorrow with new Date:
            if(flagValue === 'tomorrow') flagValue = `${String(new Date().getDate()+1).padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
            object[property] = flagValue === '' ? null : flagValue
            return
        }

        object[property] = flagValue === '' ? null : flagValue

    }

}