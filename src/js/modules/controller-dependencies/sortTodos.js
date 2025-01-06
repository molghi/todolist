import { Logic, Visual } from '../../Controller.js';

function sortTodos(value) {             // I can rewrite all IF's here in a better way
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    Logic.state.isSortMode = true
    const criterion = value.trim().split(' ')[1]

    if(criterion === 'created' || criterion === 'default' || criterion === 'def') {  
        Visual.showSystemMessage('sorted by "created" (default)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.isSortMode = false
        Logic.state.sortModeCriterion = 'default'
    }
    else if(criterion === 'name') {
        Visual.showSystemMessage('sorted by "name" (a to z) (type "sort def" to remove sorting)') 
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('name')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'name'
    }
    else if(criterion === 'priority') {                      
        Visual.showSystemMessage('sorted by "priority" (high to low) (type "sort def" to remove sorting)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('priority')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'priority'
    }
    else if(criterion === 'category') {
        Visual.showSystemMessage('sorted by "category" (a to z) (type "sort def" to remove sorting)') 
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('category')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'category'
    }
    else if(criterion === 'subtasks') {   
        Visual.showSystemMessage('sorted by "subtasks" (true to false) (type "sort def" to remove sorting)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('subtasks')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'subtasks'
    }
    else if(criterion === 'finished') {   
        Visual.showSystemMessage('sorted by "finished" (false to true) (type "sort def" to remove sorting)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('finished')
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'finished'
    } 
    else if(criterion === 'deadline') {
        Visual.showSystemMessage('sorted by "deadline" (type "sort def" to remove sorting)')
        // console.log(`sort by deadline: from overdue to today to this week`)      // not really done
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        const newOrder = Logic.sortTodos('deadline')
        console.log(newOrder)
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'deadline'
    }
    else {
        Visual.showSystemMessage('sorting error: non-existing criterion (default state returned)')
        Visual.clearFormInput()
        Visual.removeAllTodos() // removing all to re-render
        Logic.getState().todos.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
        Logic.state.sortModeCriterion = 'default'
    }
}

export default sortTodos; 