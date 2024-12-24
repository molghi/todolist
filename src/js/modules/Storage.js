// to work with local storage
class LS {
    constructor() {
        // this.save('name', 'John')
        // this.save('hobbies', JSON.stringify(['cooking', 'running', 'sleeping']))
        // this.get('name')
        // this.remove('name')
        // this.clear()
        // this.length
    }

    // save to local storage
    save(key, item, type='primitive') {
        if(type==='primitive') {
            localStorage.setItem(key, item)
        } else { // it is an array
            localStorage.setItem(key, item)
        }
    }

    // get from local storage
    get(item) {
        return localStorage.getItem(item)
    }

    // remove from local storage
    remove(item) {
        localStorage.removeItem(item)
    }

    // clear everything in local storge
    clear() {
        localStorage.clear()
        console.log(`local storage is clear now`)
    }

    // get how many items are stored there
    get length() {
        console.log(`items in local storage:`, localStorage.length)
    }
}

export default new LS()  // I export and instantiate it right here, so I don't have to instantiate it where I import it
// export default LS