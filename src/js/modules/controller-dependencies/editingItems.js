import { Logic, Visual } from '../../Controller.js';

function editItem(value) {
    // 'value' here is the command string
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state

    let params, name, properIndex
    let valueMinusCommand = value.slice(value.indexOf('edit ')+5).trim()

    // case: if the sorting mode is on, I need to get the proper index:
    if(Logic.state.isSortMode) {
        const valueAtIndex = [...document.querySelectorAll('.item__number')].find(x => x.textContent === valueMinusCommand.slice(0,valueMinusCommand.indexOf(' '))).nextElementSibling.textContent
        properIndex = Logic.getProperIndex(valueAtIndex) + 1
        valueMinusCommand = valueMinusCommand.slice(valueMinusCommand.indexOf(' ')+1)
        valueMinusCommand = `${properIndex} ` + valueMinusCommand
    }

    // case: if the command was either like 'edit 3 -p high' or 'edit buy bread -c food -p high' :
    if(valueMinusCommand.includes(' ')) {   
        valueMinusCommand = valueMinusCommand.slice(0, valueMinusCommand.indexOf(' '))
        params = value.slice(value.indexOf(valueMinusCommand)+1+valueMinusCommand.length)
    }

    // case: if there was no value after 'edit', I show error :
    if(!valueMinusCommand) {
        Visual.showSystemMessage('error: edit called with no value')
        Visual.clearFormInput()
        return
    }
    
    // case: runs after I brought the entire todo to the input and now I am submitting it :
    if(Number.isNaN(Number(valueMinusCommand))) {  
        // check if such a name exists in the UI
        const allTodoNames = [...document.querySelectorAll('.item__name')].map(itemEl => itemEl.textContent)
        const allSubtaskNames = [...document.querySelectorAll('.item__subtask-name')].map(itemEl => itemEl.textContent)
        name = value.slice(value.indexOf(' '), value.indexOf('-') > 0 ? value.indexOf('-') : value.length).trim()
        params = value.slice(value.indexOf(name)+name.length+1)
        console.log(Logic.getOldValue())
        if(!allTodoNames.includes(Logic.getOldValue()) && !allSubtaskNames.includes(Logic.getOldValue())) {
            Visual.showSystemMessage('error: name to edit was not found')
            return 
        }

        const itsIndex = [...document.querySelectorAll('.item__name'), ...document.querySelectorAll('.item__subtask-name')].find(x => x.textContent === valueMinusCommand)?.previousElementSibling.textContent
        if(itsIndex.includes('.')) value += ', subtask'
        const [command, todoObj] = Logic.parseCommandString(value)
        console.log(todoObj)

        // performing a small check first to ensure that we're not editing to have any duplicates after:
        const existingNames = Logic.getStateTodos().map(todo => todo.name)
        existingNames.splice(existingNames.indexOf(todoObj.name), 1)
        if(existingNames.includes(todoObj.name)) {
            Visual.showSystemMessage(`error: todo is already on the list`)
            return
        }

        // case: it's a subtask
        if(todoObj.hasOwnProperty('oldName')) { 
            console.log(`it's a subtask`, command, todoObj)

            // performing a small check first to ensure that we're not editing to have any duplicates after:
            const siblingSubtasksHolderEl = [...document.querySelectorAll('.item__subtask-name')].find(x => x.textContent === todoObj.oldName)?.closest('.item__subtasks-holder')
            const existingNames = [...siblingSubtasksHolderEl.querySelectorAll('tbody tr')].map(x => x.querySelector('.item__subtask-name').textContent)
            existingNames.splice(existingNames.indexOf(todoObj.oldName), 1)
            if(existingNames.includes(todoObj.oldName)) {
                Visual.showSystemMessage(`error: todo is already on the list`)
                return
            }
            Logic.editTodo(todoObj, 'subtask')
            Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
            Visual.clearFormInput()
            Visual.removeAllTodos() // removing all to re-render
            Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
            Visual.showSystemMessage(`subtask edited successfully`)
            // additional steps to do if we're in the sorting mode:  re-rendering according to the existing sorting criterion
            if(Logic.state.isSortMode) {
                sortTodos(`sort ${Logic.state.sortModeCriterion}`)
            }
            return
        }

        Logic.editTodo(todoObj)
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Visual.showSystemMessage(`value edited successfully`)
        return
    }

    // small check to ensure that an index exists in the UI
    const allItemNumbers = [...document.querySelectorAll('.item__number')].map(itemEl => itemEl.textContent)
    const allSubtaskNumbers = [...document.querySelectorAll('.item__subtask-number')].map(itemEl => itemEl.textContent)
    if(!allItemNumbers.includes(valueMinusCommand) && !allSubtaskNumbers.includes(valueMinusCommand)) {
        Visual.showSystemMessage('error: item index does not exist')
        Visual.clearFormInput()
        return
    }

    // case: I typed 'edit 3' :    (OR! I clicked on the edit btn)
    if(!params) {
        console.log(`no params, bringing all of it into the input`)
        const [todoObjString, todoNameOld] = Logic.getTodoObjString(valueMinusCommand) // to bring this entire todo to the input 
        Logic.setOldValue(todoNameOld) // in case if I change the name to a new one, to be able to find it
        Visual.setInputValue(todoObjString)
    } 
    
    // case: I typed sth like 'edit 3 -p medium' :
    else {   
        console.log(`params are there, no bringing to the input`)
        let itsName = [...document.querySelectorAll('.item__number')].find(x => x.textContent === valueMinusCommand)?.nextElementSibling.textContent
        
        if(valueMinusCommand.includes('.')) { // case: if the command was 'edit 3.1 -p medium', meaning to change a subtask
            itsName = [...document.querySelectorAll('.item__subtask-number')].find(x => x.textContent === valueMinusCommand)?.nextElementSibling.textContent
        }

        let properCommand = value.replace(valueMinusCommand, itsName)

        // additional steps to do if we're in the sorting mode:  getting proper index
        if(Logic.state.isSortMode) {
            properCommand = properCommand.slice(properCommand.indexOf('edit')+5) // slicing out 'edit '
            const index = properCommand.slice(0, properCommand.indexOf(' '))
            itsName = [...document.querySelectorAll('.item__number')].find(x => x.textContent === index)?.nextElementSibling.textContent
            if(valueMinusCommand.includes('.')) { // case: if the command was 'edit 3.1 -p medium', meaning to change a subtask
                itsName = [...document.querySelectorAll('.item__subtask-number')].find(x => x.textContent === index)?.nextElementSibling.textContent
            }
            properCommand = properCommand.slice(properCommand.indexOf(' ')).trim() // slicing out index
            properCommand = `edit ${properIndex} ${properCommand}`
        }

        Logic.setOldValue(itsName) // in case if I change the name to a new one, to be able to find it
        // console.log(properCommand) // example: edit hoover -n vacuum clean
        if(valueMinusCommand.includes('.')) properCommand += ', subtask'
        const [command, todoObj] = Logic.parseCommandString(properCommand) 
        

        // case: it's a subtask
        if(todoObj.hasOwnProperty('oldName')) { 
            console.log(`it's a subtask`, command, todoObj)

            // performing a small check first to ensure that we're not editing to have any duplicates after:
            const siblingSubtasksHolderEl = [...document.querySelectorAll('.item__subtask-name')].find(x => x.textContent === todoObj.oldName)?.closest('.item__subtasks-holder')
            const existingNames = [...siblingSubtasksHolderEl.querySelectorAll('tbody tr')].map(x => x.querySelector('.item__subtask-name').textContent)
            existingNames.splice(existingNames.indexOf(todoObj.oldName), 1)
            if(existingNames.includes(todoObj.oldName)) {
                Visual.showSystemMessage(`error: todo is already on the list`)
                return
            }
            Logic.editTodo(todoObj, 'subtask')
            Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
            Visual.clearFormInput()
            Visual.removeAllTodos() // removing all to re-render
            Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
            Visual.showSystemMessage(`subtask edited successfully`)
            // additional steps to do if we're in the sorting mode:  re-rendering according to the existing sorting criterion
            if(Logic.state.isSortMode) {
                sortTodos(`sort ${Logic.state.sortModeCriterion}`)
            }
            return
        }


        // performing a small check first to ensure that we're not editing to have any duplicates after:
        const existingNames = Logic.getStateTodos().map(todo => todo.name)
        existingNames.splice(existingNames.indexOf(todoObj.name), 1)
        if(existingNames.includes(todoObj.name)) {
            Visual.showSystemMessage(`error: todo is already on the list`)
            return
        }
        
        Logic.editTodo(todoObj)
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Visual.showSystemMessage(`value edited successfully`)

        // additional steps to do if we're in the sorting mode:  re-rendering according to the existing sorting criterion
        if(Logic.state.isSortMode) {
            sortTodos(`sort ${Logic.state.sortModeCriterion}`)
        }
    }
}




// ==========================================================================================================================================




function editTodoByBtn(valueToEdit) {
    // it runs if I clicked on the edit btn of some todo: now I need to get its index from the UI:
    const itsIndexInUI = [...document.querySelectorAll('.item__name')].find(x => x.textContent === valueToEdit)?.previousElementSibling.textContent   
    editItem(`edit ${itsIndexInUI}`)   // calling the 'editItem' fn 
    Visual.focusInput()   // bringing focus to the input field
}


export {editItem, editTodoByBtn};