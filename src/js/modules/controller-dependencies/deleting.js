import { Logic, Visual } from '../../Controller.js';

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
            let indexToRemove = Visual.itemToDelete.querySelector('.item__number').textContent
            const deletedName = Visual.itemToDelete.querySelector('.item__name').textContent
            if(Logic.state.isSortMode) {
                const properIndex = Logic.getProperIndex(deletedName) + 1
                indexToRemove = properIndex
            }       
            Visual.itemToDelete.remove()
            Logic.removeTodo(indexToRemove)
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
            return 
        }
        Visual.clearFormInput()
        Visual.showSystemMessage(`answer was not recognised`)
        Logic.state.mode = ''
        return
    }

    const afterCommand = value.includes(' ') ? value.slice(value.indexOf(' ')+1).trim() : null
    if(!afterCommand) {
        return Visual.showSystemMessage(`error: no value passed to delete`)
    }
    if(!document.querySelector('.item__number')) {
        Visual.showSystemMessage(`error: no tasks to delete`)
        return Visual.clearFormInput()
    }
    Visual.itemToDelete = Array.from(document.querySelectorAll('.item__number')).find(x => x.textContent === afterCommand)?.closest('.item')

    if(!Visual.itemToDelete) {
        Visual.showSystemMessage(`error: no such item to delete`)
        return Visual.clearFormInput()
    }
    const itemNameToDelete = Visual.itemToDelete.querySelector('.item__name').textContent
    Visual.setInputValue(`> are you sure you want to delete "${itemNameToDelete}"? type y/n: `)
    Visual.shiftCursorToTheEndNow()
}

// =======================================================================================================================================

// delete one todo by clicking the delete btn:
function deleteTodoByBtn(todoName) {
    Visual.setInputValue(`> are you sure you want to delete "${todoName}"? type y/n: `)    // prompting first
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
        Visual.setInputValue('> delete all of your todos? careful! type y/n: ')
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