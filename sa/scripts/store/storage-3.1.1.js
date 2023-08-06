;(function (o, undefined) {
    "use strict"
    // Wrap Storage APIs (localStorage, sessionStorage) v0.3.1.1
    // ================================================
    // WANT: set/get/rem that handle every data type (value) per string keys.
    // HAVE: Storage API only handles string values.

    //o.set = (k, o) => localStorage.setItem(k, o) //=> undefined
    //o.get = (k) => localStorage.getItem(k)

    // SOLN: Wrap native APIs; stringify on set IIF obj, and parse on get IIF apropos. 

    // ALSO WANT: validation on get/set/rem
    // SOLN: validate and return whatever is apropos.

    const setObj = (k, o) => {
        if (typeof k !== 'string') return false
        if (typeof o !== 'string') o = JSON.stringify(o)
        localStorage.setItem(k, o)
        const success = localStorage.getItem(k) 
        return success ? true : false 
    }

    const getObj = (k) => {    
        var o = localStorage.getItem(k),
            x // Handle both string (ANY) and stringified JSON (e.g., AJAX payload).
        try {x = JSON.parse(o)} // TODO: JSON|HTML|SVG (per DOMParser).
        catch(e) {}
        return o = x ? x : o 
    }

    // Hereby, set/get handle all (value) data types, incl. AJAX payloads.
    // All stored as string:string (k:v) pairs; parsed as apropos to POJO on get.
    o.Storage = {}
    o.Storage.set = setObj
    o.Storage.get = getObj

    o.Storage.getKeys = () => {
        const keys = []
        for (var i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i))
        }
        return keys
    }

    o.Storage.getAll = () => { // Returns all as POJO.
        const stored = {}
        for(var i =0; i < localStorage.length; i++){
            stored[localStorage.key(i)] = getObj(localStorage.key(i))
        }
        return stored
    }

    // Takes key or keys (CSV); returns array of (valid) keys removed.
    o.Storage.rem = (...keys) => { 
        const validKeysRemoved = []
        keys.map((k) => {
            if (localStorage.getItem(k)) validKeysRemoved.push(k) 
            localStorage.removeItem(k)
        })
        return validKeysRemoved
    }

    // Delete all data in Storage (local + session).
    o.Storage.clear = () => localStorage.clear() || sessionStorage.clear()

//})( window.$ = window.$ || {} )
})( window[__APP__] = window[__APP__] || {} )

