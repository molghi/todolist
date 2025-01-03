import { Logic, Visual } from '../../Controller.js';

// export Model state as JSON:
function exportTodos() {
    Logic.pushRecentCommand(`export`) // pushing recent command to Model's state

    const myData = Logic.getState()
    const now = new Date()
    const nowString = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}--${now.getHours()}-${now.getMinutes()}`
    const filename = `my-data-${nowString}.json`

    const json = JSON.stringify(myData, null, 2); // Converting data to JSON: Converts the JavaScript object 'myData' into a formatted JSON string. The 'null, 2' arguments ensure the output is pretty-printed with 2-space indentation for readability.
    const blob = new Blob([json], { type: 'application/json' }); // Creating a blob: Creates a binary large object (Blob) containing the JSON string, specifying the MIME type as 'application/json' to ensure it's recognised as a JSON file.
    const url = URL.createObjectURL(blob); // Creating a download URL: Generates a temporary URL pointing to the Blob, enabling it to be downloaded as a file by associating it with a download link.

    // Create an invisible anchor element for downloading
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the URL

    Visual.clearFormInput()
    Visual.showSystemMessage('data was exported successfully')
}

// =======================================================================================================================================

// import JSON file:
function importFile() {
    Logic.pushRecentCommand(`import`) // pushing recent command to Model's state

    const fileInputEl = document.querySelector('.file-input')
    fileInputEl.click()


    fileInputEl.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return console.log(`no file`);

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result); // Parse JSON if that's the expected format
                const isValidImport = isCorrectInput(data)
                if(!isValidImport) {
                    Visual.showSystemMessage('error: invalid import')
                    Visual.clearFormInput()
                    return
                }
                Logic.import(data)  // taking that imported 'data' object and assigning its props to Model
                Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
                Visual.removeAllTodos() // removing all todo elements to re-render
                Logic.getStateTodos().forEach((todo, i) => Visual.renderToDo(todo, i+1)) // re-rendering all items anew, UI
                if(Logic.getState().accentColor) {
                    Visual.changeUIColors(Logic.getState().accentColor)
                }
                Visual.showSystemMessage('import was successful')
                Visual.clearFormInput()
            } catch (error) {
                console.error('error: invalid json');
                Visual.showSystemMessage('error: invalid json')
                Visual.clearFormInput()
            }
        };
        reader.readAsText(file); // Read the file as text
    });
}

// =======================================================================================================================================

// maybe I can move to another file
function isCorrectInput(dataObj) {
    let checkPassed = true

    if(!dataObj.hasOwnProperty('todos')) checkPassed = false, console.log(`no todos`);
    if(!dataObj.hasOwnProperty('recentCommands')) checkPassed = false, console.log(`no recentCommands`);
    if(!dataObj.hasOwnProperty('commands')) checkPassed = false, console.log(`no commands`);
    if(!dataObj.hasOwnProperty('flags')) checkPassed = false, console.log(`no flags`);
    if(!dataObj.hasOwnProperty('isEditMode')) checkPassed = false, console.log(`no isEditMode`);
    if(!dataObj.hasOwnProperty('isSortMode')) checkPassed = false, console.log(`no isSortMode`);
    if(!dataObj.hasOwnProperty('sortModeCriterion')) checkPassed = false, console.log(`no sortModeCriterion`);
    if(!dataObj.hasOwnProperty('oldValue')) checkPassed = false, console.log(`no oldValue`);
    if(!dataObj.hasOwnProperty('count')) checkPassed = false, console.log(`no count`);
    if(!dataObj.hasOwnProperty('accentColor')) checkPassed = false, console.log(`no accentColor`);
    if(!dataObj.hasOwnProperty('mode')) checkPassed = false, console.log(`no mode`);

    if(!Array.isArray(dataObj.commands)) checkPassed = false, console.log(`commands is not an array`);
    if(!Array.isArray(dataObj.flags)) checkPassed = false, console.log(`flags is not an array`);
    if(!Array.isArray(dataObj.recentCommands)) checkPassed = false, console.log(`recentCommands is not an array`);
    if(!Array.isArray(dataObj.todos)) checkPassed = false, console.log(`todos is not an array`);
    
    if(typeof dataObj.accentColor !== 'string') checkPassed = false, console.log(`accentColor is not a string`);
    if(typeof dataObj.mode !== 'string') checkPassed = false, console.log(`mode is not a string`);
    if(typeof dataObj.oldValue !== 'string') checkPassed = false, console.log(`oldValue is not a string`);
    if(typeof dataObj.sortModeCriterion !== 'string') checkPassed = false, console.log(`sortModeCriterion is not a string`);
    
    if(typeof dataObj.count !== 'number') checkPassed = false, console.log(`count is not a number`);
    
    if(typeof dataObj.isEditMode !== 'boolean') checkPassed = false, console.log(`isEditMode is not a boolean`);
    if(typeof dataObj.isSortMode !== 'boolean') checkPassed = false, console.log(`isSortMode is not a boolean`);

    if(dataObj.todos.length > 0) {
        dataObj.todos.forEach(todo => {
            if(!todo.hasOwnProperty('name')) checkPassed = false, console.log(`todo in todos has no name`);
            if(!todo.hasOwnProperty('category')) checkPassed = false, console.log(`todo in todos has no category`);
            if(!todo.hasOwnProperty('command')) checkPassed = false, console.log(`todo in todos has no command`);
            if(!todo.hasOwnProperty('created')) checkPassed = false, console.log(`todo in todos has no created`);
            if(!todo.hasOwnProperty('deadline')) checkPassed = false, console.log(`todo in todos has no deadline`);
            if(!todo.hasOwnProperty('hasSubtasks')) checkPassed = false, console.log(`todo in todos has no hasSubtasks`);
            if(!todo.hasOwnProperty('id')) checkPassed = false, console.log(`todo in todos has no id`);
            if(!todo.hasOwnProperty('isCompleted')) checkPassed = false, console.log(`todo in todos has no isCompleted`);
            if(!todo.hasOwnProperty('params')) checkPassed = false, console.log(`todo in todos has no params`);
            if(!todo.hasOwnProperty('priority')) checkPassed = false, console.log(`todo in todos has no priority`);
            if(!todo.hasOwnProperty('subtasks')) checkPassed = false, console.log(`todo in todos has no subtasks`);
            if(!Array.isArray(todo.subtasks)) checkPassed = false, console.log(`todo.subtasks is not an array`);
            if(typeof todo.command !== 'string') checkPassed = false, console.log(`todo.command is not a string`);
            if(typeof todo.created !== 'string') checkPassed = false, console.log(`todo.created is not a string`);
            if(typeof todo.name !== 'string') checkPassed = false, console.log(`todo.name is not a string`);
            if(typeof todo.id !== 'number') checkPassed = false, console.log(`todo.id is not a number`);
            if(typeof todo.hasSubtasks !== 'boolean') checkPassed = false, console.log(`todo.hasSubtasks is not a boolean`);
            if(typeof todo.isCompleted !== 'boolean') checkPassed = false, console.log(`todo.isCompleted is not a boolean`);
        })
    }

    return checkPassed
}



export { exportTodos, importFile }