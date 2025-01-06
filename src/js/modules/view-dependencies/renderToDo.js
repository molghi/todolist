// renders to-do in the DOM
export function renderToDo(toDoObj, order, itemsWrapperEl) {
    const {name, isCompleted, priority, deadline, category, created, hasSubtasks, subtasks} = toDoObj

    const newToDo = document.createElement('div')   // topmost wrapper of the todo to render
    newToDo.classList.add('item') 

    newToDo.setAttribute('data-name', name)
    newToDo.setAttribute('data-finished', isCompleted)
    newToDo.setAttribute('data-priority', priority)
    newToDo.setAttribute('data-deadline', deadline)
    newToDo.setAttribute('data-category', category)
    newToDo.setAttribute('data-subtasks', hasSubtasks)

    // Formatting the creation date nicely:
    const itsDate = `${new Date(created).getDate().toString().padStart(2,0)}.${String(new Date(created).getMonth()+1).padStart(2,0)}.${new Date(created).getFullYear()}`

    const today = `${new Date().getDate().toString().padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
    const todayStyles = deadline === today ? `underlined` : ''    // if the deadline is today, it'll be underlined (underlined is a css class)

    // deadline settings:
    const nowTime = new Date(`${new Date().getFullYear()}.${new Date().getMonth()+1}.${new Date().getDate()}`).getTime()
    const deadlineDate = (deadline !== null && !deadline.includes(':')) && `${new Date().getFullYear()}.${deadline.split('.').reverse().join('.')}`
    const taskTime = (deadline !== null && !deadline.includes(':')) && new Date(deadlineDate).getTime()
    const overdueStyles = (taskTime && taskTime-nowTime < 0) ? `italic` : ''    // if it's overdue, it'll be in cursive/italic
    const deadlineContent = overdueStyles ? 'overdue' : deadline || 'null'      // if it's overdue, it'll say 'overdue' else it'll show the deadline
    if(deadlineContent==='overdue') newToDo.setAttribute('data-deadline', 'overdue');   // if it's overdue, resetting this attr to later filter items correctly
        
    // other style settings:
    const hasSubtasksStyles = hasSubtasks ? 'with-subtasks' : ''    // if it has subtasks, this css class will be assigned
    const subtasksVisibilityStyles = (toDoObj.hasOwnProperty('isCollapsed') && toDoObj.isCollapsed === true) ? 'hidden' : ''   // showing or collapsing the subtasks (hidden is a css class)
    const priorityStyles = (priority === null || priority === 'low') ? `style="opacity: 0.35;"` : priority === 'medium' ? `style="opacity: 0.65;"` : ''   // if the priority is null or low, it'll be dim; if it's medium, it'll be brighter
    const categoryStyles = category === null ? `style="opacity: 0.35;"` : ''   // if category is null, it'll be dimmer
    const deadlineStyles = deadline === null ? `style="opacity: 0.35;"` : ''   // if deadline is null, it'll be dimmer

    // Map over subtasks and generate HTML rows:
    const subtasksEl = getSubtasksMarkup(subtasks, order)

    // Making an obj of everything I need in rendering:
    const myObj = {order, hasSubtasksStyles, name, priority, priorityStyles, category, categoryStyles, deadline, todayStyles, overdueStyles, deadlineStyles, deadlineContent, hasSubtasks, isCompleted, itsDate, subtasksVisibilityStyles, subtasksEl}

    // Create the item HTML structure
    newToDo.innerHTML = getTaskMarkup(myObj)
    
    itemsWrapperEl.appendChild(newToDo) 
}


// ==========================================================================================================================================



// a dependency of renderToDo:      returns a string of HTML elements
function getSubtasksMarkup(subtasks, order) {
    return subtasks?.map((subtask, i) => {
        return `<tr class="item__subtask" data-finished="${subtask.isCompleted}">
            <td>&nbsp;&nbsp;↳</td>
            <td class="item__subtask-number">${order}.${i+1}</td>
            <td class="item__subtask-name" title="${subtask.name}">${subtask.name}</td>
            <td class="item__subtask-finished" title="${subtask.isCompleted}"><span>finished:</span> ${subtask.isCompleted}</td>
            <td class="item__subtask-btns">
                <button class="item__subtask-btn item__subtask-btn--complete" title="Complete">
                    <i class="fa-solid fa-circle-check"></i>
                </button>
                <button class="item__subtask-btn item__subtask-btn--edit" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="item__subtask-btn item__subtask-btn--remove" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('')
}



// ==========================================================================================================================================


// a dependency of renderToDo:    returns a string of HTML elements
function getTaskMarkup({order, hasSubtasksStyles, name, priority, priorityStyles, category, categoryStyles, deadline, todayStyles, overdueStyles, deadlineStyles, deadlineContent, hasSubtasks, isCompleted, itsDate, subtasksVisibilityStyles, subtasksEl}) {
    return `<div class="item__holder">
    
    <table class="item__wrapper">
        <tbody>
        <tr>
            <td class="item__number">${order}</td>
            <td class="item__name ${hasSubtasksStyles}" title="${name}"><span>${name}</span></td>
            <td class="item__priority" title="priority: ${priority || 'null'}"><span>priority:</span> <span ${priorityStyles}>${priority || 'null'}</span></td>
            <td class="item__category" title="category: ${category || 'null'}"><span>category:</span> <span ${categoryStyles}>${category || 'null'}</span></td>
            <td class="item__deadline" title="deadline: ${deadline || 'null'}"><span>deadline:</span> <span class="${todayStyles} ${overdueStyles}" ${deadlineStyles}>${deadlineContent}</span></td>
            <td class="item__has-subtasks" title="subtasks: ${hasSubtasks ? 'true' : 'false'}"><span>subtasks:</span> ${hasSubtasks ? 'true' : 'false'}</td>
            <td class="item__is-completed" title="finished: ${isCompleted}"><span>finished:</span> ${isCompleted}</td>
            <td class="item__date" title="creation date: ${itsDate}"><span>created:</span> ${itsDate}</td>
        </tr>
        </tbody>
    </table>

    <div class="item__btns">
        <button class="item__btn item__btn--complete" title="Complete">
            <i class="fa-solid fa-circle-check"></i>
        </button>
        <button class="item__btn item__btn--edit" title="Edit">
            <i class="fa-solid fa-pen"></i>
        </button>
        <button class="item__btn item__btn--remove" title="Delete">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
    </div>

    ${hasSubtasks ? `<div class="item__subtasks-holder ${subtasksVisibilityStyles}">
        <table>
            <tbody>
                ${subtasksEl}
            </tbody>
        </table>
    </div>` : ''}
    `
}