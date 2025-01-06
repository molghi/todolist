import { Logic, Visual, handleFormSubmit } from '../../Controller.js';

// NOTE:  the delete command must look like so: 'del 1' or 'delete 1' or 'del 1.1'


// =======================================================================================================================================

// delete one todo
function deleteItem(value) {   // 'value' is the entire command string                    a few things could be optimised here, that checking in the middle
    Logic.pushRecentCommand(value.trim())  // pushing recent command to Model's state

    if(Logic.state.mode === 'delete') {  // this runs when I typed my answer to the prompt of deletion
        if(value === 'n' || value === 'no') {   // case: if I typed 'n' or 'no', it cancels the deletion
            Visual.showSystemMessage(`deletion was cancelled`)
            Visual.clearFormInput()
            return Logic.state.mode = ''
        }
        if(value === 'y' || value === 'yes') {   // case: if I typed 'y' or 'yes', it executes the deletion
            return deletionConfirmed(Visual.deletionItemType)
        }
        // case: what I typed was not 'n', 'no', 'y' or 'yes':
        Visual.showSystemMessage(`answer was not recognised`)
        Visual.clearFormInput()
        return Logic.state.mode = ''
    }

    const afterCommand = value.includes(' ') ? value.slice(value.indexOf(' ')+1).trim() : null   // if 'value' has whitespace, I slice the command word out; else return null

    if(!afterCommand) return Visual.showSystemMessage(`error: no index passed to delete`);   // if there was no whitespace in the command

    // checking if there are such majortasks/subtasks to delete:
    // case: it's a majortask deletion, not subtask (the full command was something like: 'del 5')
    if(!afterCommand.includes('.')) {
        if(!document.querySelector('.item__number')) {     // effectively, if there is no elements at all
            Visual.showSystemMessage(`error: no tasks to delete`)   // showing UI error msg
            return Visual.clearFormInput()  // clearing the input
        }
        Visual.itemToDelete = Array.from(document.querySelectorAll('.item__number')).find(x => x.textContent === afterCommand)?.closest('.item')  // finding the item (the entire element) to delete by its index
        if(!Visual.itemToDelete) {    // if there isn't any
            Visual.showSystemMessage(`error: no such item to delete`)   // showing UI error msg 
            return Visual.clearFormInput()   // clearing the input
        }
        Visual.deletionItemType = 'majortask'
    } else { // <-- case: it's a subtask deletion, same logic
        if(!document.querySelector('.item__subtask-number')) {
            Visual.showSystemMessage(`error: no subtasks to delete`)
            return Visual.clearFormInput()
        }
        Visual.itemToDelete = Array.from(document.querySelectorAll('.item__subtask-number')).find(x => x.textContent === afterCommand)?.closest('.item__subtask')
        if(!Visual.itemToDelete) {
            Visual.showSystemMessage(`error: no such subtask to delete`)
            return Visual.clearFormInput()
        }
        Visual.deletionItemType = 'subtask'
    }

    let itemNameToDelete
    itemNameToDelete = Visual.itemToDelete.querySelector('.item__name')?.textContent   // getting the name of the item to delete
    if(afterCommand.includes('.')) itemNameToDelete = Visual.itemToDelete.querySelector('.item__subtask-name').textContent;
    Visual.setInputValue(`are you sure you want to delete "${itemNameToDelete}"? type y/n: `)    // prompting first
    Visual.shiftCursorToTheEndNow()   //  shifting the caret to the end of the input field
}


// =======================================================================================================================================


// I use it in 'deleteItem': runs if I type 'yes' or 'y' to the prompt of deleting
function deletionConfirmed(type='majortask') {
    let indexToRemove, deletedName
    let classBeginning = 'item__'   // css class name for majortask deletions
    if(type === 'subtask') classBeginning = 'item__subtask-';   // css class name for subtask deletions
    else type = 'majortask';
    indexToRemove = Visual.itemToDelete.querySelector(`.${classBeginning}number`).textContent   // getting the index of the item to remove, like 6.4
    deletedName = Visual.itemToDelete.querySelector(`.${classBeginning}name`).textContent       // getting the name of the item to remove

    if(Logic.state.isSortMode) {     // if the sort mode is on
        let properIndex = Logic.getProperIndex(deletedName, type)    // getting the proper index of the item to delete (when it is not sorted)
        if(Number.isInteger(properIndex)) properIndex += 1;          // if it's an integer, then it was a majortask, not a subtask
        else properIndex = properIndex.split('.').map(x => +x +1).join('.')    // here it's a subtask; making it match what's in the UI (if it is not sorted)
        indexToRemove = properIndex
    }

    Visual.itemToDelete.remove()     // removing from the DOM
    Logic.removeTodo(indexToRemove, type)    // removing from the Model state
    Logic.checkSubtasks(indexToRemove, type)  // in case if I deleted all subtasks: the majortask now must have hasSubtasks = false
    Logic.state.mode = ''
    Visual.showSystemMessage(`"${deletedName}" was deleted successfully`)    // showing UI msg
    Visual.clearFormInput()    // clearing the form input
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    Visual.removeAllTodos()  // removing all items to re-render
    Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        
    if(Logic.state.isSortMode)  {     // if the sort mode is on
        Logic.state.isSortMode = false
        sortTodos(`sort ${Logic.state.sortModeCriterion}`)    // restoring that sorted state in the UI
    }
}


// =======================================================================================================================================


// delete one todo by clicking the delete btn:
function deleteTodoByBtn(todoName) {
    Visual.setInputValue(`are you sure you want to delete "${todoName}"? type y/n: `);    // prompting first, setting the input value
    Visual.itemToDelete = [...document.querySelectorAll('.item')].find(x => x.querySelector('.item__name').textContent === todoName); // getting that todo element from the UI that has the name that is the same as 'todoName'
    handleFormSubmit(document.querySelector('.form-input').value, `click event`)   // calling 'handleFormSubmit' with the value of the input field   (not ideal, somewhat of a circular dependency/calling here)
}


// =======================================================================================================================================


// deleting all todos with the 'clearall' command:
function deleteTodos(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
    
    // first, I prompt to see if I want them all deleted or not:
    if(value.startsWith('clearall')) {
        Visual.setInputValue('delete all of your todos? careful! type y/n: ')    // setting the input value
        return
    }
    
    // case: I want them all deleted (I typed 'y' or 'yes'):
    if(value === 'y' || value === 'yes') {
        Visual.removeAllTodos()    // removing all from the UI
        Logic.removeTodos()       // Model state.todos sets to []
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.showSystemMessage('all todos were deleted')  // showing a message in the UI
        Visual.clearFormInput()    // clearing the input field
        return
    }
    
    // case: I don't want them all deleted (I typed 'n' or 'no'):
    if(value === 'n' || value === 'no') {
        Visual.showSystemMessage('deletion was cancelled')    // showing a message in the UI
        Visual.clearFormInput()    // clearing the input field
        return
    }
    
    // case: what I typed wasn't 'y', 'yes', 'n' or 'no', so I show a UI message and clear the input:
    Visual.showSystemMessage('answer was not recognised')    // showing a message in the UI
    Visual.clearFormInput()    // clearing the input field
}


// =======================================================================================================================================


function deleteSubtaskByBtn(subtaskName) {    // delete a subtask by btn
    Visual.setInputValue(`are you sure you want to delete "${subtaskName}"? type y/n: `)    // setting the input value
    Visual.focusInput()   // focusing the input
}

// =======================================================================================================================================

export { deleteItem, deleteTodoByBtn, deleteTodos, deleteSubtaskByBtn }