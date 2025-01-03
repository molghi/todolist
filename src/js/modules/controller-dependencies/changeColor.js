import { Logic, Visual } from '../../Controller.js';

// changing the UI color:
function changeColor(value) {
    Logic.pushRecentCommand(value.trim()) // pushing recent command to Model's state
    const color = value.includes(' ') ? value.slice(value.indexOf(' ')+1) : null   // if 'value' (an entire command) has no whitespace, pass null; else slice the command word out
    const colorUI = Visual.changeUIColors(color)   // changing the color
    if(colorUI) { // if it's not null
        Visual.showSystemMessage(`changed ui color to: ${colorUI === '#32cd32' ? 'default' : colorUI}`)    // showing UI message
        Logic.changeAccentColor(colorUI)     // pushing it to Model's state
        Logic.saveToLS('state', JSON.stringify(Logic.getState()), 'reference') // pushing Model's state to local storage
    } 
}

export default changeColor;