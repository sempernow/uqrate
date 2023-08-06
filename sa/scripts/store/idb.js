;(function (o, undefined) {
    'use strict'
    /**************************************************************************
     *  Proxy of IndexedDB to abide one API for all async storage APIs.
     *  Wraps idb-keyval API, which wraps IndexedDB API.
     *
     *  REQUIREs: idb-keyval-iife.js : idbKeyval. 
     * 
     *  FEATUREs:
     *  - Return POJO on get; parse IIF apropos.
     *  - Validate on set; return boolean.
    ***************************************************************************/
    if (!window.indexedDB) return false 
    if (typeof idbKeyval   === 'undefined') return false

    // Pull window.idbKeyval into app namespace; set the global to undefined.
    const _IDB = window.idbKeyval 
    window.idbKeyval = undefined

    const srcID = 'idb'
        //,log = (arg, ...args) => console.log(arg, ...args)
        //,logErr = (arg, ...args) => console.log(arg, ...args)
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        //,idb = _IDB // per 'idb-keyval-iife.js'
        ,idb = _IDB // per 'idb-keyval-iife.js'

        ,idbx = (store) => {
            const aParse = (x) => { 
                // Parse `x` to POJO if JSON-string, else return (promise of) `x` unchanged.
                if (typeof x !== 'string') return Promise.resolve(x)
                try      {return Promise.resolve(JSON.parse(x))}
                catch(e) {return Promise.resolve(x)}
            } //... presume no malformed JSON input.
    
            return {
                keys: () => idb.keys(store)

                // Return (promise of) VALUE if k, else ARRAY of all stored k-v pairs; val(s) parsed IIF apropos.
                ,get: (k) => { 
                    if (k)  return idb.get(k, store).then(aParse)
                    if (!k) return o.IDB.getA()
                },

                // Return (promise of) VALUE if k, else ARRAY of all stored k-v pairs; val(s) parsed IIF apropos.
                getA: (k) => { 
                    if (k)  return idb.get(k, store).then(aParse)
                    if (!k) return idb.keys(store).then(keys =>{
                        return _PromiseArray(keys) // ... array of all stored k-v pair objects.
                    })
                },

                // Return (promise of) VALUE if k, else OBJECT of all stored k-v pairs; val(s) parsed IIF apropos.
                getO: (k) => { 
                    // Returns array (of promises) of all stored k-v pairs; val(s) parsed IIF apropos.
                    const _PromiseArray = (keys) => {
                        return Promise.all(
                            keys.map(k => 
                                idb.get(k, store)
                                    .then(aParse)
                                    .catch(err => logErr('@ get0', err))
                                )
                        )
                    }
                    if (k)  return idb.get(k, store).then(aParse)
                    if (!k) return idb.keys(store).then(keys =>{
                        return _PromiseArray(keys)
                                .then(a => a.map((v,i) => {
                                        return {[keys[i]]: v}
                                    })
                                )
                    }).then(a => a.reduce((stored, o) => {
                                const k = Object.keys(o)[0] 
                                stored[k] = o[k]
                                return stored 
                            }, {})
                        )
                },

                set: (k, v) => { // Validates.
                    if (!k) return Promise.resolve(false)
                    //logErr(k,v)
                    v = JSON.stringify(v) //... hack to solve ...
                    // DOMException: Failed to execute 'put' on 'IDBObjectStore': Request object could not be cloned.
                    return idb.set(k, v, store)
                            .then(()=>idb.get(k, store))
                            .then(vGot => vGot ? true : false)
                            .catch(err => logErr('@ set', err))
                },
            
                del: (k) => { // NO validation.
                    k ? idb.del(k, store) : idb.clear(store)
                    return Promise.resolve(true)
                } 
            }
        }

        o.IDB = (name = 's') => {
            const new1 = new idb.Store(`db-${name}`, `store-${name}`)
            return idbx(new1)
        }

//})( window.$ = window.$ || {} )
})( window[__APP__] = window[__APP__] || {} )

