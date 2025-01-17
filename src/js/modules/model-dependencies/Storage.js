// to work with local storage
class LS {

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
    }

    // get how many items are stored there
    get length() {
        console.log(`items in local storage:`, localStorage.length)
    }
}

// export default LS
export default new LS()  // I export and instantiate it right here, so I don't have to instantiate it where I import it