;(function(o, undefined){
    'use strict'
    /***********************************************************************
     * o.AuthStore(..) is the token store for:
     * `Authentication: Bearer <TOKEN>`.
     * 
     * It is a namespaced, limited-APIs invocation of o.Store(..).
     * Its facilities of mixed synchrony are normalized to one async API.
     * Nominally, its storage facility is Indexed DB; 
     * Local Storage is fallback.
     **********************************************************************/
    const srcID = 'AuthStore'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,_store = () => {
            const x = o.Store('auth', 'storage', 'idb')
            switch (x.mode) {
                case 'synch':
                    return {
                        mode: x.mode,
                        api: x.api,
                        set: (k,v)  => Promise.resolve(x.set(k, v)),
                        get: (k)    => Promise.resolve(x.get(k)),
                        del: (...k) => Promise.resolve(x.del(...k)),
                        keys: ()    => Promise.resolve(x.keys())
                    }
                case 'async':
                    return x
                }
        }

    o.AuthStore = () => _store() //o.Store('auth', 'storage', 'idb')

})( window[__APP__] = window[__APP__] || {} )
