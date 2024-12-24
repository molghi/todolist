// to do sth by typing certain keys

class KeyCommands {
    constructor() {
        console.log(`Hello from the KeyCommands module!`)
        this.listen()
    }

    listen() {
        document.addEventListener('keydown', function(event) {   // 'keypress' is deprecated
        if (event.code === 'KeyZ') {
            const newCol = prompt("Enter a new UI colour:")
            if(!newCol) return 
            document.documentElement.style.setProperty('--accent', newCol)
            console.log(`UI colour now: ${newCol}`)
        }
    })
    }
}

export default new KeyCommands()  // I export and instantiate it right here, so I don't have to instantiate it where I import it 