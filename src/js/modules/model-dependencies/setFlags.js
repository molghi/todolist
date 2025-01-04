
export function setFlags(flagLong, flagShort, object, property, params) {
        let flagLength, flagValue

        if(params?.includes(flagLong) || params?.includes(flagShort)) {
            flagLength = params.includes(flagLong) ? flagLong.length : 2

            if(flagLength===2) {
                let temp = params.slice(params.indexOf(flagShort)+flagLength+1)
                if(temp.startsWith('-')) return flagValue = null  // in case if there is a flag but it has no value like -p here: add buy milk -p -c food
                flagValue = temp.slice(0, temp.indexOf('-')-1 < 0 ? temp.length : temp.indexOf('-')-1)
            } else {
                let temp = params.slice(params.indexOf(flagLong)+flagLength+1)
                if(temp.startsWith('-')) return flagValue = null  // in case if there is a flag but it has no value like -p here: add buy milk -p -c food
                flagValue = temp.slice(0, temp.indexOf('-')-1 < 0 ? temp.length : temp.indexOf('-')-1)
            }

            if(property === 'subtasks') { // subtasks is a special case #1
                flagValue.split(',').forEach(subtask => object.subtasks.push({
                    name: subtask.trim(),
                    isCompleted: false,
                    created: new Date().toISOString(),
                    id: Date.now(),
                    // subtasks will have no priority, deadline or category
                }))
                object.subtasks.length > 0 ? object.hasSubtasks = true : object.hasSubtasks = false
                return
            }

            if(property === 'isCompleted') { // isCompleted is a special case #2
                object[property] = flagValue === 'true' ? true : false
                return
            }

            if(property === 'deadline') { // deadline is a special case #3
                if(flagValue === 'today') flagValue = `${String(new Date().getDate()).padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
                if(flagValue === 'tomorrow') flagValue = `${String(new Date().getDate()+1).padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
                object[property] = flagValue === '' ? null : flagValue
                return
            }

            object[property] = flagValue === '' ? null : flagValue
        } 

    }