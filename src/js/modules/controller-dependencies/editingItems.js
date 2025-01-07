import { Logic, Visual } from '../../Controller.js';


// general fn to edit items:
function editItem(value) {   // 'value' here is the entire command string
    Logic.pushRecentCommand(value.trim())   // pushing recent command to Model's state

    let params, name, properIndex
    const allMajortaskIndexEls = [...document.querySelectorAll('.item__number')]
    const allSubtaskIndexEls = [...document.querySelectorAll('.item__subtask-number')]
    let valueMinusCommand = value.slice(value.indexOf('edit ')+5).trim()  // slicing the command word ('edit') out

    // case: if there was no value after 'edit', I show error :
    if(!valueMinusCommand) {
        Visual.showSystemMessage('error: edit called with no value')
        return Visual.clearFormInput()
    }

    // case: if the sorting mode is on, I need to get the proper index:
    if(Logic.state.isSortMode) setProperIndex(valueMinusCommand, allMajortaskIndexEls, properIndex);

    // case: if the command was either like 'edit 3 -p high' or 'edit buy bread -c food -p high' :
    if(valueMinusCommand.includes(' ')) {   
        valueMinusCommand = valueMinusCommand.slice(0, valueMinusCommand.indexOf(' '))   // getting just the index
        params = value.slice(value.indexOf(valueMinusCommand) + valueMinusCommand.length + 1)   // setting params, which are everything after the name: the flags and their values
    }
    
    // case: runs after I brought the entire todo to the input and now I am submitting it :
    if(Number.isNaN(Number(valueMinusCommand))) return submittingTheEdited(name, value, params);

    // small check to ensure that an index exists in the UI
    const allItemNumbers = allMajortaskIndexEls.map(itemEl => itemEl.textContent)
    const allSubtaskNumbers = allSubtaskIndexEls.map(itemEl => itemEl.textContent)
    if(!allItemNumbers.includes(valueMinusCommand) && !allSubtaskNumbers.includes(valueMinusCommand)) {
        Visual.showSystemMessage('error: item index does not exist')
        return Visual.clearFormInput()
    }

    if(!params) {  // <-- case: I typed 'edit 3' or I clicked on the edit btn: no params were passed, bringing all of it into the input
        const [todoObjString, todoNameOld] = Logic.getTodoObjString(valueMinusCommand)  // to bring this entire todo to the input 
        Logic.setOldValue(todoNameOld)  // in case if I change the name to a new one, to be able to find it
        Visual.setInputValue(todoObjString)  // setting the input value
    } 
    else {  // <-- case: I typed sth like 'edit 3 -p medium' :  params are there, no bringing to the input
        editBehindTheScenes(value, valueMinusCommand, allMajortaskIndexEls, allSubtaskIndexEls)
    }
}

// ===================================================================================================================================================

// a dependency of 'editItem':
function setProperIndex(valueMinusCommand, allMajortaskIndexEls, properIndex) {
    const indexFromCommand = valueMinusCommand.slice(0,valueMinusCommand.indexOf(' '))  // slicing the index out of 'valueMinusCommand'
    const itemName = allMajortaskIndexEls.find(indexEl => indexEl.textContent === indexFromCommand).nextElementSibling.textContent   // finding the name of this item by its index
    properIndex = Logic.getProperIndex(itemName) + 1  // getting the proper index and incrementing it because in the UI indices start from 1, not 0
    valueMinusCommand = valueMinusCommand.slice(valueMinusCommand.indexOf(' ')+1)  // slicing the index out
    valueMinusCommand = `${properIndex} ` + valueMinusCommand  // putting the proper index there
}

// ===================================================================================================================================================

// a dependency of 'editItem':
function submittingTheEdited(name, value, params) {  // 'value' here is the entire command string
    const allMajortaskNameEls = [...document.querySelectorAll('.item__name')]
    const allSubtaskNameEls = [...document.querySelectorAll('.item__subtask-name')]
    
    // check if such a name exists in the UI:
    const allTodoNames = allMajortaskNameEls.map(nameEl => nameEl.textContent)
    const allSubtaskNames = allSubtaskNameEls.map(nameEl => nameEl.textContent)
    name = value.slice(value.indexOf(' '), value.indexOf('-') > 0 ? value.indexOf('-') : value.length).trim()
    params = value.slice(value.indexOf(name)+name.length+1)
    if(!allTodoNames.includes(Logic.getOldValue()) && !allSubtaskNames.includes(Logic.getOldValue())) return Visual.showSystemMessage('error: name to edit was not found');

    const itsIndex = [...allMajortaskNameEls, ...allSubtaskNameEls].find(nameEl => nameEl.textContent === valueMinusCommand)?.previousElementSibling.textContent  //  getting its index from the UI
    if(itsIndex.includes('.')) value += ', subtask'
    const [command, todoObj] = Logic.parseCommandString(value)   // forming an object of props that were changed

    // performing a small check first to ensure that we're not editing to have any duplicates after:
    const existingNames = Logic.getStateTodos().map(todo => todo.name)
    existingNames.splice(existingNames.indexOf(todoObj.name), 1)
    if(existingNames.includes(todoObj.name)) return Visual.showSystemMessage(`error: todo is already on the list`);

    if(todoObj.hasOwnProperty('oldName')) {   // <-- case: it's a subtask
        // performing a small check first to ensure that we're not editing to have any duplicates after:
        const subtasksHolderEl = allSubtaskNameEls.find(nameEl => nameEl.textContent === todoObj.oldName)?.closest('.item__subtasks-holder')
        const existingNames = [...subtasksHolderEl.querySelectorAll('tbody tr')].map(x => x.querySelector('.item__subtask-name').textContent)
        existingNames.splice(existingNames.indexOf(todoObj.oldName), 1)
        if(existingNames.includes(todoObj.oldName)) return Visual.showSystemMessage(`error: todo is already on the list`);
        
        Logic.editTodo(todoObj, 'subtask')  // editing a subtask in Model state
        Visual.showSystemMessage(`subtask edited successfully`)  // showing UI msg
        if(Logic.state.isSortMode) sortTodos(`sort ${Logic.state.sortModeCriterion}`);  // additional steps to do if the sorting mode is on: re-rendering according to the prev set sorting criterion
        return
    } else {
        Logic.editTodo(todoObj)   // editing a majortask in the Model state
        Visual.showSystemMessage(`value edited successfully`)
    }

    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference')   // pushing Model's state to local storage
    Visual.clearFormInput()  // clear the input
    Visual.removeAllTodos()  // removing all to re-render
    Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
}

// ===================================================================================================================================================

// a dependency of 'editItem':
function editSubtask(todoObj) {
    // performing a small check first to ensure that we're not editing to have any duplicates after:
    const subtasksHolderEl = [...document.querySelectorAll('.item__subtask-name')].find(subNameEl => subNameEl.textContent === todoObj.oldName)?.closest('.item__subtasks-holder')
    const existingNames = [...subtasksHolderEl.querySelectorAll('tbody tr')].map(sub => sub.querySelector('.item__subtask-name').textContent)
    existingNames.splice(existingNames.indexOf(todoObj.oldName), 1)
    if(existingNames.includes(todoObj.oldName)) return Visual.showSystemMessage(`error: todo is already on the list`);

    Logic.editTodo(todoObj, 'subtask')    // edit subtask in Model state
    const majorTaskName = subtasksHolderEl.previousElementSibling.querySelector('.item__name').textContent  // to check the completion of a todo
    const todoToCheckCompletion = Logic.getStateTodos().find(todo => todo.name === majorTaskName)  // to check the completion of a todo
    Logic.checkCompletion(todoToCheckCompletion, 'subtask')  // If I mark a todo that has subtasks completed, all of its subtasks are completed as well -- and for similar cases
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    Visual.clearFormInput()  // clear the input
    Visual.removeAllTodos() // removing all to re-render
    Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew
    Visual.showSystemMessage(`subtask edited successfully`) // showing UI msg

    if(Logic.state.isSortMode) sortTodos(`sort ${Logic.state.sortModeCriterion}`); // additional steps to do if the sorting mode is on: re-rendering according to the prev set sorting criterion
}

// ===================================================================================================================================================

// a dependency of 'editItem':   runs in this case: I typed sth like 'edit 3 -p medium' :  params are there, no bringing to the input
function editBehindTheScenes(value, valueMinusCommand, allMajortaskIndexEls, allSubtaskIndexEls) {
    let itsName = allMajortaskIndexEls.find(indexEl => indexEl.textContent === valueMinusCommand)?.nextElementSibling.textContent   // finding its name by its index
        
    if(valueMinusCommand.includes('.')) {   // case: if the command was 'edit 3.1 -p medium', meaning changing a subtask
        itsName = allSubtaskIndexEls.find(x => x.textContent === valueMinusCommand)?.nextElementSibling.textContent
    }

    let properCommand = value.replace(valueMinusCommand, itsName)  // example: edit hoover -n vacuum clean

    // additional steps to do if we're in the sorting mode:  getting proper index
    if(Logic.state.isSortMode) {
        properCommand = properCommand.slice(properCommand.indexOf('edit')+5) // slicing out 'edit '
        const index = properCommand.slice(0, properCommand.indexOf(' '))   // slicing to get just the index
        itsName = allMajortaskIndexEls.find(indexEl => indexEl.textContent === index)?.nextElementSibling.textContent   // getting its name by its index
        if(valueMinusCommand.includes('.')) { // case: if the command was 'edit 3.1 -p medium', meaning to change a subtask
            itsName = allSubtaskIndexEls.find(indexEl => indexEl.textContent === index)?.nextElementSibling.textContent
        }
        properCommand = properCommand.slice(properCommand.indexOf(' ')).trim()  // slicing out index
        properCommand = `edit ${properIndex} ${properCommand}`
    }

    Logic.setOldValue(itsName)  // in case if I change the name to a new one, to be able to find it
    if(valueMinusCommand.includes('.')) properCommand += ', subtask'
    const [command, todoObj] = Logic.parseCommandString(properCommand) 
        
    // case: it's a subtask
    if(todoObj.hasOwnProperty('oldName')) return editSubtask(todoObj);

    // performing a small check first to ensure that we're not editing to have any duplicates after:
    const existingMajortaskNames = Logic.getStateTodos().map(todo => todo.name)
    existingMajortaskNames.splice(existingMajortaskNames.indexOf(todoObj.name), 1)
    if(existingMajortaskNames.includes(todoObj.name)) return Visual.showSystemMessage(`error: todo is already on the list`);
        
    Logic.editTodo(todoObj)   // editing in the Model state
    const todoToCheckCompletion = Logic.getStateTodos().find(todo => todo.name === todoObj.name)
    Logic.checkCompletion(todoToCheckCompletion, 'majortask') // If I mark a todo that has subtasks completed, all of its subtasks are completed as well -- and for similar cases
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference')  // pushing Model's state to local storage
    Visual.clearFormInput() // clear the input
    Visual.removeAllTodos() // removing all to re-render
    Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew
    Visual.showSystemMessage(`value edited successfully`)  // showing UI msg

    if(Logic.state.isSortMode) sortTodos(`sort ${Logic.state.sortModeCriterion}`)  // additional steps to do if we're in the sorting mode: re-rendering according to the prev set sorting criterion
}

// ===================================================================================================================================================

// editing a todo (majortask) by pressing a btn -- runs if I clicked on the edit btn of some todo
function editTodoByBtn(valueToEdit) {
    const itsIndexInUI = [...document.querySelectorAll('.item__name')].find(nameEl => nameEl.textContent === valueToEdit)?.previousElementSibling.textContent   // getting its index from the UI
    editItem(`edit ${itsIndexInUI}`)   // calling the 'editItem' fn 
    Visual.focusInput()   // focusing the input field 
}

// ===================================================================================================================================================

// editing a subtask by pressing a btn:
function editSubtaskByBtn(subtaskName, subtaskIndexUI) {
    const subtaskEl = [...document.querySelectorAll('.item__subtask-name')].find(nameEl => nameEl.textContent === subtaskName)?.closest('.item__subtask') // finding the entire subtask element by the subtask name
    const subtaskFinishedText = subtaskEl.querySelector('.item__subtask-finished').textContent.split(':')[1].trim() // getting the value of its 'finished' flag
    Visual.setInputValue(`edit ${subtaskIndexUI} -n ${subtaskName} -f ${subtaskFinishedText}`)  // bringing all of this subtask into input:  like   edit 6.1 -n hoover -f true
    Visual.focusInput()  // focus the input
}


export {editItem, editTodoByBtn, editSubtaskByBtn};