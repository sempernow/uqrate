;(function(o, undefined){
    'use strict'
    /****************************************************************
     * o.Store(..) exposes the application storage API. 
     * By default, it self-configures to best available per client.
     * It creates an app-wide singleton per namespace.
     * I.e., each named-store invocation, o.Store('foo', ...), 
     * points to one (the first invoked) app-wide Store object
     * accessible thereafter from any module, by o.Store('foo').
     * 
     * Key collisions can occur at certain shared facilities,
     * e.g, idb stores are namespaced, yet cookie stores are not.
     * 
     * Internally, Store utilizes wrappers that normalize 
     * the native (or elsewhere wrapped) APIs into one 
     * common API per (a)synchrony. 
     * 
     * RETURN:
     * 
     *  {
     *      name: <NAMESPACE>
     *      api: 'none'|'cookie'|'storage'|'idb'|'sql'|'cache'
     *      set: set(k,v)
     *      get: get(k)
     *      del: del(k)
     *      keys: keys()
     *  }
     *
     * FEATURES:
     * 
     *  - Stringify on set if apropos.
     *  - Return POJO on get; parse if apropos. 
     *  - Validate on set; return boolean 
     *  - Validate on del; return array of keys (valid) deleted.
     *
     * USAGE:
     * 
     *  const state = o.Store('foo', 'cookie,idb')
     *  
     *  - Allowed-APIs list applies only to 1st 'foo' invocation.
     *  - Sans args, o.Store(), returns 'state' store 
     *    utilizing client's best avilable storage facility.
     ***************************************************************/
    const srcID = 'Store'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,clone = o.clone

    // Expose 
    o.Store = (() => {
        // Define and return a namespaced singleton,
        // given its list of acceptable client-storage facilities.
        const init = (storeName, ...apis) => {
            const 
                allAPIs = 'none,cookie,storage,idb,sql,cache'.split(',')
                ,stores = { 
                    /****************************************************
                     * Client-storage APIs (proxy/wrapper)
                     * 
                     * Validate per facility;
                     * return the normalized API if valid, else false.
                     ***************************************************/
        
                    // ====================
                    // ===  SYNCH APIs  ===
                    // ====================
                    none: () => { //return false
                        const nstor = {}
                        // ,parse = (x) => {
                        //     if (typeof x !== 'string') return x
                        //     try {return JSON.parse(x)} // TODO: +DOMParser
                        //     catch(e) {return {data: x, err: e}}
                        // }
                        // ,clone = o => parse(JSON.stringify(o))  
        
                        return { // TODO: handle parse IIF apropos.
                            api: 'none',
                            set: (k, v) => (typeof k === 'string') && (nstor[k] = clone(v)),
                            get: (k)    => k ? clone(nstor[k]) : clone(nstor),
                            del: (...k) => [...k].map(k => delete nstor[k]),
                            keys: () => Object.keys(nstor)
                        }
                    }
                    ,cookie: () => { //return false
                        if (typeof o.Cookies === 'undefined') return false
                        o.Cookies.set('validate', '1')
                        if (typeof o.Cookies.get('validate') === 'undefined') return false 
                        o.Cookies.del('validate')
                        //... Triggers browser `SameSite` parameter check; logs a bogus warning: 
                        //... 'Some cookies are misusing the recommended “SameSite“ attribute'.
        
                        return {
                            api: 'cookie',
                            set: (k, v) => o.Cookies.set(k, v),
                            get: (k)    => o.Cookies.get(k),
                            del: (...k) => o.Cookies.del(...k),
                            keys: () => o.Cookies.keys()
                        }
                    }
                    ,storage: () => { //return false
                        if (typeof o.Storage === 'undefined') return false
                        o.Storage.set('validate', 1)
                        if (typeof o.Storage.get('validate') === 'undefined') return false 
                        o.Storage.del('validate')
        
                        return {
                            api: 'storage',
                            set: (k, v) => o.Storage.set(k, v),
                            get: (k)    => o.Storage.get(k),
                            del: (...k) => o.Storage.del(...k),
                            keys: () => o.Storage.keys()
                        }
                    } 
                    // =====================
                    // ===  ASYNCH APIs  ===
                    // =====================
                    ,idb: () => { //return false
                        if (typeof o.IDB === 'undefined') return false
                        const idb = o.IDB(storeName)
        
                        return {
                            api: 'idb',
                            set: (k, v) => idb.set(k, v),
                            get: (k)    => idb.getO(k),
                            del: (k)    => idb.del(k),
                            keys: ()    => idb.keys()
                        }
                    }  
                    ,sql: () => {
                        return false
                    }   
                    ,cache: () => {
                        return false
                    }   
                }

            /*****************************************************************
             * Return best store facility available (validated per `stores`),
             * either from those of the reference list passed in, 
             * or from default list of all such Web APIs.
             ****************************************************************/
            return ((apis) => {
                apis = apis.length ? apis : allAPIs
                const 
                    api = apis[apis.length-1]
                    ,_isValid = (api) => stores[api]()

                var best = undefined
                ;(stores.hasOwnProperty(api) && _isValid(api)) 
                    && (best = _isValid(api))
                    || apis.map((xAPI) => (stores.hasOwnProperty(xAPI))
                            && (_isValid(xAPI) !== false) 
                                && (best = _isValid(xAPI))
                    )
    
                const 
                    m = {}
                    ,_store = best || stores['none']()
    
                _store.name = storeName
    
                // mode (property) is the store facility's synchrony
                o.toContextIndexed(allAPIs.join(), m)
                ;(m[_store.api.toUpperCase()] < m['IDB'])
                    ? (_store.mode = 'synch') 
                    : (_store.mode = 'async')
    
                return _store 
    
            })(apis)
        }
        // Keep (first and only) invocation of init(ns, ...) per namespace; ss[ns] .
        const ss = {}

        // Return a function that returns the namespaced singleton.
        return function (ns = 'state', ...apis) {
            // Return namespaced singleton if exist, else create and return it.
            return ss[ns] ? ss[ns] : (ss[ns] = init(ns, ...apis))
        }
    })()

    // ==================
    // ===  DEV/TEST  ===
    // ==================

    logDeb(o.log.debugOFF)
    ;(()=>{
        logDeb('@ TEST ::', o.Store('auth', 'storage', 'idb'))

        const store = o.Store()
        logDeb(o.log.debugOFF)
        logDeb('api >', store.api, store.mode)
        ;(store.mode === 'synch') 
            ? logDeb('get() >', store.get()) 
            : store.get().then((x) => logDeb('get() >', x))
    })//()

    function testStore() {
        const log = o.log(srcID, o.log.levels.DEBUG) 
            ,{ // Destructure
                set,
                get,
                del,
                keys,
                api,
                foo
            } = store,
            j = [{
                a: 1,
                b: 2
            }, {
                c: 'foo',
                d: 'bar'
            }]

        
        ;(store.mode === 'synch')
            ? testSynch()
            : testAsync()

        function testAsync() {             
            (() => { 
                //del().then(rtn => log('del():', rtn))
                set('obj1',j).then(rtn =>log('set(obj1,j):', rtn))
                get().then(rtn =>log('get():', rtn)) // Array of the objects
                get('obj1').then(rtn =>log('get(obj1):', rtn))
                //get()['obj1'].then(rtn =>log('get()[obj1]', rtn))
                set('bogus').then(rtn =>log('set(bogus):', rtn))
                get('bogus').then(rtn =>log('get(bogus):', rtn))
                del('bogus').then(rtn =>log('del(bogus):', rtn))

                //set('obj2',j).then(rtn =>log('set(obj2,j):', rtn))
                set('obj2','{ ☧ &x2627;;; \\\/ 웃 &#xc6c3; / Oops! ™ ,,,')
                //set('obj2',"foo")
                //set('obj2',{x:'{ ☧ &x2627;;; \\\/ 웃 &#xc6c3; / Oops! ™ ,,,'})
                    .then(rtn =>log('set obj2 ::', rtn))
                    .catch(logErr)

                keys().then(rtn=>log('keys()', rtn))
                get().then(rtn =>log('get():', rtn))
                del('obj1').then(rtn => log('del(obj1):', rtn))
                keys().then(rtn=>log('keys()', rtn))
                //del().then(rtn => log('del():', rtn))
            })()

            ;(() => { 
                // Unlike SYNCH API, must parse on get if data is stringified:
                const s = "[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"
                set('s', s)
                //get().then(rtn => log('get()', rtn))

                // Schedule the delete relative to the get ...
                const wait = 90 // minimum, else del() happens before get()
                    ,aScheduleDel = o.aSchedulerP(wait+5, del) 
                    // ... 90 to let all of the above happen
                    ,aScheduleGet = o.aSchedulerP(wait, get)
                    // ... get() 2ms before del()

                aScheduleDel().then(x =>log(aScheduleDel.fn, x))
                aScheduleGet().then(x =>log(aScheduleGet.fn, x))

                //o.aDelay(900,del)
                //o.aDelay(1,get)
                //set('obj2',j).then(rtn =>log('set(obj2,j):', rtn))
                //get('obj1').then(rtn =>log('get(obj1):', rtn))
                //get('bogus').then(rtn =>log('get(bogus):', rtn))
            })//()
        }

        function testSynch() { 
            console.groupCollapsed('===  set/get/del/get  ===')
            log('set obj1 ::', set('obj1',j))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get()) // Object of the objects
            log('get bogus ::', get('bogus'))
            log('del bogus ::', del('bogus'))
            log('del obj1 ::', del('obj1'))
            log('get obj1 ::', get('obj1'))

            console.groupEnd()
            
            console.groupCollapsed('===  set/get/keys  ===')
            log('set obj1 ::', set('obj1',j))
            log('set bad key ::', set({},'key is obj; not allowed per Storage API'))
            log('set obj2 ::', set('obj2','{ ☧ &x2627;;; \\\/ 웃 &#xc6c3; / Oops! ™ ,,,'))
            log('get(\'obj2\') ::', get('obj2'))
            log('get()[\'obj2\'] ::', get()['obj2'])
            log('get() ::', get())
            log('keys() ::', keys())


            console.groupEnd()

            //log('=== set/get @ a pre-stringified object ::',"\n",' "[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"')
            console.groupCollapsed('=== set/get @ a pre-stringified object ::',"\n", '"[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"')

            log('set objX', set('objX',"[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"))
            log('get objX ::', get('objX')) 
            console.groupEnd()

            console.groupCollapsed('===  del(obj1, bogus, obj2)  ===')
            log('get() ::', get())
            log('del(obj1, bogus, obj2) ::', del('obj1', 'bogus', 'obj2'))
            //log('del() ::', del())
            log('get() ::', get())
            del()
            console.groupEnd()

            console.groupCollapsed('===  set()/get()  ===')
            log('del() ::', del())
            log('set() ::', set())
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',"")/get()  ===')
            log('set(\'obj1\',"") ::', set('obj1',""))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',{})/get()  ===')
            log('set(\'obj1\', {}) ::', set('obj1',{}))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',[])/get()  ===')
            log('set(\'obj1\', []) ::', set('obj1',[]))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',)/get()  ===')
            log('set(\'obj1\',) ::', set('obj1'))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()
        }

        // @ Cookies        // See api.js
        //log('set',set('data',{a:1,b:2}))
        //j.messages = j.messages.slice(0,8) // limit < 2753 (UTF-16 Units)

        // ;(api === 'idb') // See api.js
        //     ? (
        //         set('data', j).then(x => log('set @',api, '::', x))
        //         ,get('data', j).then(x => log('get @',api, '::', x))
        //     )
        //     : (
        //         log('set @',api, '::', set('data', j))
        //         ,log('get @',api, '::', get('data', j))            
        //     )
    }

})( window[__APP__] = window[__APP__] || {} )
