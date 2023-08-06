/** 
    The `Cookies` object of 'js.cookies' stores values as URL-encoded strings under a string key; set(k,v), and URL-decodes on `get(k)`. Our wrapper, `o.Cookies` object, validates on `set()` and `del()`, and returns POJO on `get()`; normalizing the API to that of our synchronous storage API. 

    However, cookies are browser-limited to about 4096 KB per key. 
    TODO: Extend this synthetically for our app by internally segregating AJAX return objects into their subkeys, and the `messages` key further into its constituent array element objects. Storing and retreiving transparently as one object.
 */


;(function(o, undefined){
    'use-strict'
    // Wrap js.cookies API (document.cookie) 
    // =====================================
    /** Proxy of `document.cookie` to abide one API 
    *   handling all synchronous client storage APIs.
    *   FEATUREs:
    *       - Stringify on set iif apropos.
    *       - Return POJO on get; parse iif apropos. 
    *       - Validate on set; return boolean 
    *       - Validate on del; return array of (valid) keys deleted.
    */
    // TODO: Replace JSON.parse() with DOMParser to handle JSON|HTML|SVG.
    if (typeof Cookies === 'undefined') return false

    // Pull window.Cookies into app namespace, setting the global to undefined.
    // https://github.com/js-cookie/js-cookie#namespace-conflicts
    const CookiesJS = Cookies.noConflict()

    const srcID = 'cookies'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,_expires = 3               // Days 
        ,_path = '/'
        ,_domain = o.cfg.net.domain // undefined triggers HostOnly (per browser policy)
        ,_sameSite = 'strict'       // No CORS
        ,_secure = o.cfg.auth.TLS   // HTTPS only.
    o.Cookies = {}

    o.Cookies.set = (k, o, 
        expires = _expires, 
        path = _path, 
        domain = _domain, 
        sameSite = _sameSite, 
        secure = _secure 
    ) => {
        if (k === '') return false
        if (typeof k !== 'string') return false
        if (typeof o === 'undefined') return false

        // WTF happening @ api.js ??? SIZE limit; 2550 okay; 2753 FAILs
        if (typeof o !== 'string') o = JSON.stringify(o) // Not necessary ? Works sans @ Firefox.
        //log(o.length) // 2550 okay; 2753 FAILs
        // Units of `<string>.length` are UTF-16 (ES6), 
        // which is a VARIABLE-LENGTH encoding scheme.
        // Cookie limit (per cookie) is per browser, but ~ 4096 bytes. 
    
        CookiesJS.set(k, o, { 
            expires: expires, 
            path: path, 
            domain: domain, 
            sameSite: sameSite,
            secure: secure
        })
        return CookiesJS.get(k) ? true : false 
    }

    o.Cookies.get = (k) => { // all if sans k
        const x = CookiesJS.get(k)
        var v 
        // Handle both string (ANY) and stringified JSON (e.g., AJAX payload).
        if (typeof x === 'string') {
            try {v = JSON.parse(x)} 
            catch(e) {v = x}
        } else {
            v = {}
            if (typeof x === 'object') {
                Object.keys(x).map(key=> {
                    try { v[key] = JSON.parse(x[key]) }
                    catch(e) { v[key] = x[key] }
                })
            }
            if (Object.keys(v).length === 0) v = false 
        }
        return v // undefined iif key not exist or natively.
    }
    o.Cookies.keys = () => Object.keys(CookiesJS.get())

    o.Cookies.del = (...keys) => { // all if sans keys
        if (typeof keys[0] === 'undefined') keys = []
        const validKeysRemoved = []
        keys = keys.length ? keys : Object.keys(CookiesJS.get())
        ;[...keys].map(k => {
            if (CookiesJS.get(k)) validKeysRemoved.push(k) 
            CookiesJS.remove(k, { 
                path: _path, 
                domain: _domain,
                secure: _secure, 
                sameSite: _sameSite
            })//... MUST use SAME ATTRIBUTES as when set.
        })
       return validKeysRemoved
    }

})( window[__APP__] = window[__APP__] || {} ) 
