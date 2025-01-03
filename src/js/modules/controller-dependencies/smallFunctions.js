import { Logic, Visual } from '../../Controller.js';

function autocompleteValue(value) {
    if(!value) return
    const command = Logic.getCommands().find(command => command.startsWith(value))   // getting the 1st command that satisfies the condition
    if(!command) return 
    Visual.setInputValue(`${command} `)  // setting the value of the input field
}

// ================================================================================================

function persistSubtasksVisibility(todoName, state) {
    Logic.setSubtasksVisibility(todoName, state) // so the collapsed state could persist after page re-fresh
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
}

// ================================================================================================

// bringing up the previous or next command if the input field is active, by pressing Up and Down arrow keys:
function arrowKeysHandler(command, activeEl) {
    // if(activeEl.value !== '> ') return
    if(command === 'show previous command') {
        activeEl.value = '> ' + Logic.getRecentCommand('prev')
    }
    if(command === 'show next command') {
        activeEl.value = '> ' + Logic.getRecentCommand('next')
    }
    setTimeout(() => {
        Visual.shiftCursorToTheEndNow()
    }, 10);
}

// ================================================================================================

function completeTodoByBtn(indexToEdit, type='majortask') {
    if(type===`subtask`) {
        const [majortaskIndex, subtaskIndex] = indexToEdit.split('.')
        const todo = Logic.getState().todos.find((x,i) => i === majortaskIndex-1)
        todo.subtasks[subtaskIndex-1].isCompleted = !todo.subtasks[subtaskIndex-1].isCompleted
        // console.log(todo.subtasks.map(x => x.isCompleted))
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        const allSubtaskEl = [...document.querySelectorAll('.item__subtask')].find(x => x.querySelector('td:nth-child(2)').textContent === indexToEdit)
        if(todo.subtasks[subtaskIndex-1].isCompleted) allSubtaskEl.querySelector('td:nth-child(3)').classList.add('finished')
        else allSubtaskEl.querySelector('td:nth-child(3)').classList.remove('finished')
        return 
    }
    const todo = Logic.getState().todos.find((x,i) => i === indexToEdit-1)
    todo.isCompleted = !todo.isCompleted
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    Visual.removeAllTodos() // removing all to re-render
    Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
}

export {autocompleteValue, persistSubtasksVisibility, arrowKeysHandler, completeTodoByBtn}