'use strict'

import '../styles/main.scss'
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src 

import Model from './modules/Model.js'  
import View from './modules/View.js'  
import KeyCommands from './modules/KeyCommands.js'  // to do sth by typing certain keys
import LS from './modules/Storage.js'  // to work with local storage

function init() {
    const Logic = new Model()
    const Visual = new View()
    
    console.log(`hello from Controller`)
    
}
init()
