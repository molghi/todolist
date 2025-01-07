import { Logic, Visual } from '../../Controller.js';


// general fn to sort todos:
function sortTodos(value) {
    Logic.pushRecentCommand(value.trim());   // pushing recent command to Model's state
    Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference');   // pushing Model's state to local storage
    Logic.state.isSortMode = true;
    const criterion = value.trim().split(' ')[1]   // for example, getting the 'priority' in the 'sort priority' command

    // routing different scenarios:
    switch (criterion) {
        case 'created':
        case 'default':
        case 'def':
            sortRerenderUI('default');    // 'sortRerenderUI' is a fn to show UI msg, clear the input, remove all todo els from the UI, get the new order and render it
            break;
        case 'name':
            sortRerenderUI('name');
            break
        case 'priority':
            sortRerenderUI('priority');
            break
        case 'category':
            sortRerenderUI('category');
            break
        case 'subtasks':
            sortRerenderUI('subtasks');
            break
        case 'finished':
            sortRerenderUI('finished');
            break
        case 'deadline':
            sortRerenderUI('deadline');
            break
        default:
            sortRerenderUI('else');
            break;
    }

}


// ====================================================================================================================================


// a dependency of 'sortTodos' fn
function sortRerenderUI(criterion) {
    const msgMap = {
        default: `sorted by "created" (default)`,
        name: `sorted by "name" (a to z) (type "sort def" to remove sorting)`,
        priority: `sorted by "priority" (high to low) (type "sort def" to remove sorting)`,
        category: `sorted by "category" (a to z) (type "sort def" to remove sorting)`,
        subtasks: `sorted by "subtasks" (true to false) (type "sort def" to remove sorting)`,
        finished: `sorted by "finished" (false to true) (type "sort def" to remove sorting)`,
        deadline: `sorted by "deadline" (type "sort def" to remove sorting)`,
        else: `sorting error: non-existing criterion (default state returned)`,
    }

    Visual.showSystemMessage(msgMap[criterion])  // showing UI msg
    Visual.clearFormInput()    // clearing the input
    Visual.removeAllTodos()   // removing all todo elements to re-render
    Logic.state.sortModeCriterion = criterion

    if(criterion === 'default') {
        Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1))   // re-rendering all items anew based on the default/unsorted state
        Logic.state.isSortMode = false;   // if it's a default state of table, it is unsorted
    } else if(criterion === 'else') {
        Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1))   // re-rendering all items anew based on the default/unsorted state
        Logic.state.isSortMode = false; 
        Visual.showSystemMessage(msgMap.else)
    } else {
        const newOrder = Logic.sortTodos(criterion)   // getting all todos sorted the way we need it
        newOrder.forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew based on that
    }

}



export default sortTodos; 