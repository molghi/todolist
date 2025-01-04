import { Logic, Visual, handleFormSubmit } from '../../Controller.js';

/* NOTE: 
    the delete command must look like so: 'del 1' or 'delete 1' or 'del 1.1'
*/

// =======================================================================================================================================

// delete one todo
function deleteItem(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state

    if(Logic.state.mode === 'delete') {
        if(value === 'n' || value === 'no') {
            Visual.showSystemMessage(`deletion was cancelled`)
            Visual.clearFormInput()
            Logic.state.mode = ''
            return
        }
        if(value === 'y' || value === 'yes') {
            deletionConfirmed(Visual.deletionItemType)
            return 
        }
        Visual.clearFormInput()
        Visual.showSystemMessage(`answer was not recognised`)
        Logic.state.mode = ''
        return
    }

    const afterCommand = value.includes(' ') ? value.slice(value.indexOf(' ')+1).trim() : null   // what it is: command sliced out, only the index here (or null)

    if(!afterCommand) return Visual.showSystemMessage(`error: no value passed to delete`);

    // case: it's a majortask deletion, not subtask (the full command was something like: 'del 5')
    if(!afterCommand.includes('.')) {
        if(!document.querySelector('.item__number')) {
            Visual.showSystemMessage(`error: no tasks to delete`)
            return Visual.clearFormInput()
        }
        Visual.itemToDelete = Array.from(document.querySelectorAll('.item__number')).find(x => x.textContent === afterCommand)?.closest('.item')
        if(!Visual.itemToDelete) {
            Visual.showSystemMessage(`error: no such item to delete`)
            return Visual.clearFormInput()
        }
        Visual.deletionItemType = 'majortask'
    } 
    else { // <-- case: it's a subtask deletion
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
    itemNameToDelete = Visual.itemToDelete.querySelector('.item__name')?.textContent
    if(afterCommand.includes('.')) itemNameToDelete = Visual.itemToDelete.querySelector('.item__subtask-name').textContent;
    Visual.setInputValue(`are you sure you want to delete "${itemNameToDelete}"? type y/n: `)
    Visual.shiftCursorToTheEndNow()
}


// =======================================================================================================================================


// a helper fn for 'deleteItem': runs if I type 'yes' or 'y' to the prompt of deleting
function deletionConfirmed(type='majortask') {
    let indexToRemove, deletedName

    if(type === 'subtask') {
        // console.log(`subtask deletion confirmed`)
        type = 'subtask'
        indexToRemove = Visual.itemToDelete.querySelector('.item__subtask-number').textContent
        deletedName = Visual.itemToDelete.querySelector('.item__subtask-name').textContent
    } else {   // <-- case: it's a majortask
        type = 'majortask'
        indexToRemove = Visual.itemToDelete.querySelector('.item__number').textContent
        deletedName = Visual.itemToDelete.querySelector('.item__name').textContent
    }
    // console.log(indexToRemove, deletedName) // 6.4 mop the floor

        if(Logic.state.isSortMode) {
            let properIndex = Logic.getProperIndex(deletedName, type)
            if(Number.isInteger(properIndex)) properIndex += 1;    // if it's an integer, then it was a majortask, not a subtask
            else properIndex = properIndex.split('.').map(x => +x +1).join('.')    // making it match what's in the UI (if it is not sorted)
            indexToRemove = properIndex
        }
        Visual.itemToDelete.remove()
        Logic.removeTodo(indexToRemove, type)
        rerenderMajortask(indexToRemove, type) // in case if I deleted all subtasks: the majortask now must have hasSubtasks = false
        Logic.state.mode = ''
        Visual.showSystemMessage(`"${deletedName}" was deleted successfully`)
        Visual.clearFormInput()
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.removeAllTodos()  // removing all items to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        
        if(Logic.state.isSortMode)  {
            Logic.state.isSortMode = false
            sortTodos(`sort ${Logic.state.sortModeCriterion}`)
        }
    
}


// =======================================================================================================================================

// in case if I deleted all subtasks: the majortask now must have hasSubtasks = false
function rerenderMajortask(indexToRemove, type) {
    if(type === 'subtask') {
        const majortaskProperIndex = +indexToRemove.split('.')[0] -1
        const majortaskObj = Logic.getStateTodos()[majortaskProperIndex]
        if(majortaskObj.subtasks.length === 0) {
            majortaskObj.hasSubtasks = false
        }
    }
}

// =======================================================================================================================================


// delete one todo by clicking the delete btn:
function deleteTodoByBtn(todoName) {
    Visual.setInputValue(`are you sure you want to delete "${todoName}"? type y/n: `)    // prompting first
    // getting that todo element which has the name that matches 'todoName':
    Visual.itemToDelete = [...document.querySelectorAll('.item')].find(x => x.querySelector('.item__name').textContent === todoName) 
    handleFormSubmit(document.querySelector('.form-input').value, `click event`)  // calling 'handleFormSubmit' with the value of the input field
}


// =======================================================================================================================================


// deleting all todos with the 'clearall' command:
function deleteTodos(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state

    // first, I prompt to see if I want them all deleted or not:
    if(value.startsWith('clearall')) {
        Visual.setInputValue('delete all of your todos? careful! type y/n: ')
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
        Visual.showSystemMessage('deletion was cancelled')
        Visual.clearFormInput()    // clearing the input field
        return
    }

    // case: what I typed wasn't 'y', 'yes', 'n' or 'no', so I show a UI message and clear the input:
    Visual.showSystemMessage('answer was not recognised')
    Visual.clearFormInput()    // clearing the input field
}



export { deleteItem, deleteTodoByBtn, deleteTodos }