// renders to-do in the DOM
export function renderToDo(toDoObj, order, itemsWrapperEl) {
        const {name, isCompleted, priority, deadline, category, created, hasSubtasks, subtasks} = toDoObj

        const newToDo = document.createElement('div')
        newToDo.classList.add('item')

        newToDo.setAttribute('data-name', name)
        newToDo.setAttribute('data-finished', isCompleted)
        newToDo.setAttribute('data-priority', priority)
        newToDo.setAttribute('data-deadline', deadline)
        newToDo.setAttribute('data-category', category)
        newToDo.setAttribute('data-subtasks', hasSubtasks)

        // Format the creation date      
        const itsDate = `${new Date(created).getDate().toString().padStart(2,0)}.${String(new Date(created).getMonth()+1).padStart(2,0)}.${new Date(created).getFullYear()}`

        const today = `${new Date().getDate().toString().padStart(2,0)}.${String(new Date().getMonth()+1).padStart(2,0)}`
        const todayStyles = deadline === today ? `underlined` : ''

        const nowTime = new Date(`${new Date().getFullYear()}.${new Date().getMonth()+1}.${new Date().getDate()}`).getTime()
        const deadlineDate = (deadline !== null && !deadline.includes(':')) && `${new Date().getFullYear()}.${deadline.split('.').reverse().join('.')}`
        const taskTime = (deadline !== null && !deadline.includes(':')) && new Date(deadlineDate).getTime()
        const overdueStyles = (taskTime && taskTime-nowTime < 0) ? `italic` : ''
        const deadlineContent = overdueStyles ? 'overdue' : deadline || 'null'

        const hasSubtasksStyles = hasSubtasks ? 'with-subtasks' : ''

        const subtasksVisibilityStyles = (toDoObj.hasOwnProperty('isCollapsed') && toDoObj.isCollapsed === true) ? 'hidden' : ''

        // Generate the subtask number if subtasks exist
        // const subtaskNum = !hasSubtasks ? '' : `<td class="item__subtasks-num"><span>num of subs: </span>${subtasks.length}</td>`
        const subtaskNum = ''

        // Map over subtasks and generate HTML rows
        const subtasksEl = subtasks?.map((subtask, i) => {
    return `<tr class="item__subtask" data-finished="${subtask.isCompleted}">
        <td>----</td>
        <td class="item__subtask-number">${order}.${i+1}</td>
        <td class="item__subtask-name" title="${subtask.name}">${subtask.name}</td>
        <td title="${subtask.isCompleted}"><span>finished:</span> ${subtask.isCompleted}</td>
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
        const priorityStyles = (priority === null || priority === 'low') ? `style="opacity: 0.35;"` : priority === 'medium' ? `style="opacity: 0.65;"` : ''
        const categoryStyles = category === null ? `style="opacity: 0.35;"` : ''
        const deadlineStyles = deadline === null ? `style="opacity: 0.35;"` : ''
        // Create the item HTML structure
        newToDo.innerHTML = `
        <div class="item__holder">
        
        <table class="item__wrapper">
                    <tbody>
                    <tr>
                        <td class="item__number">${order}</td>
                        <td class="item__name ${hasSubtasksStyles}" title="${name}">${name}</td>
                        <td class="item__priority" title="priority: ${priority || 'null'}"><span>priority:</span> <span ${priorityStyles}>${priority || 'null'}</span></td>
                        <td class="item__category" title="category: ${category || 'null'}"><span>category:</span> <span ${categoryStyles}>${category || 'null'}</span></td>
    <td class="item__deadline" title="deadline: ${deadline || 'null'}"><span>deadline:</span> <span class="${todayStyles} ${overdueStyles}" ${deadlineStyles}>${deadlineContent}</span></td>
                        <td class="item__has-subtasks" title="subtasks: ${hasSubtasks ? 'true' : 'false'}"><span>subtasks:</span> ${hasSubtasks ? 'true' : 'false'}</td>
                        ${subtaskNum}
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
        itemsWrapperEl.appendChild(newToDo) 
    }