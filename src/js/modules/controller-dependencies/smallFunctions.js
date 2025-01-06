import { Logic, Visual } from '../../Controller.js';

// ================================================================================================

// autocompleting a command:
function autocompleteValue(value) {
    if(!value) return
    const command = Logic.getCommands().find(command => command.startsWith(value))   // getting the 1st command that satisfies the condition
    if(!command) return 
    Visual.setInputValue(`${command} `)  // setting the value of the input field
}

// ================================================================================================

// showing or hiding the subtasks of a task if you click on the task name:
function persistSubtasksVisibility(todoName, state) {
    Logic.setSubtasksVisibility(todoName, state)   // so the collapsed state could persist after page refresh
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference')   // pushing Model's state to local storage
}

// ================================================================================================

// bringing up the previous or next command IF the input field is active, by pressing Up and Down arrow keys:
function arrowKeysHandler(command, activeEl) {
    if(command === 'show previous command') activeEl.value = '> ' + Logic.getRecentCommand('prev')    // changing the value of Visual.formInput
    if(command === 'show next command') activeEl.value = '> ' + Logic.getRecentCommand('next')

    setTimeout(() => {
        Visual.formInput.setSelectionRange(Visual.formInput.value.length, Visual.formInput.value.length)   // shifting the caret (blinking cursor) in the input to the end
    }, 10);
}

// ================================================================================================

// completing a todo by clicking a btn:
function completeTodoByBtn(indexToEdit, type='majortask') {
    if(type===`subtask`) {
        const [majortaskIndex, subtaskIndex] = indexToEdit.split('.')
        const majortaskToComplete = Logic.getStateTodos().find((x,i) => i === majortaskIndex-1)    // getting the majortask that has this subtask to complete
        majortaskToComplete.subtasks[subtaskIndex-1].isCompleted = !majortaskToComplete.subtasks[subtaskIndex-1].isCompleted  // toggling the completion of this subtask
        Logic.checkCompletion(majortaskToComplete, 'subtask')  // If I mark a todo that has subtasks completed, all of its subtasks are completed as well -- and for similar cases
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.removeAllTodos() // removing all elements to re-render
        Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Visual.toggleCompletionStyles(indexToEdit, majortaskToComplete.subtasks[subtaskIndex-1].isCompleted)  // if completed, add styles that show it is completed
    } else {
        const todo = Logic.getStateTodos().find((x,i) => i === indexToEdit-1)    // getting the majortask that has this subtask to complete
        todo.isCompleted = !todo.isCompleted   // toggling completion 
        Logic.checkCompletion(todo, 'majortask') // If I mark a todo that has subtasks completed, all of its subtasks are completed as well -- and for similar cases
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
        Visual.removeAllTodos()  // removing all elements to re-render
        Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
    }
}


// ================================================================================================

export {autocompleteValue, persistSubtasksVisibility, arrowKeysHandler, completeTodoByBtn}