// f06yBEAST 
// Service Worker scoped per file location,
// so root, /, is global scope
// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
// @ MDN
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers 
;(() => {

    const
        noLOG = false //... no logging if true.
        ,log = (msg, flag = false) => {
            if (noLOG) return 
            const title = msg.title
            delete msg.title
            if (typeof msg.url === 'string') {
                msg.url = msg.url.replace(location.origin, '')
            }
            flag ? console.error(title, msg) : console.log(title, msg)
        }
        ,logErr = msg => log(msg, true)
        /**********************************
         * Change 'name' to purge cache.
         *********************************/
        ,appCaches = [ 
            {
                name: "shell-etag-2",
                type: "shell",
                urls: [
                    "/scripts/bundle.min.js",
                    "/styles/bundle.min.css"
                ]
            },
            {
                name: "content-etag-1",
                type: "content",
                urls: [
                    "/"
                ]
            }
        ]
        ,cache404 = '/app/404'
        ,cacheOffline = '/app/offline'
    // CACHE FUNCTIONs
    // function cacheNamePerType(t) {
    //  const _index = appCaches.findIndex(function (ac) {
    //      return ac.type === t
    //  })
    //  return appCaches[_index].name
    //  }
    //console.log(cacheNamePerType('shell'))

    /************
     * Install
     ***********/
    self.addEventListener('install', ev => {
        ev.waitUntil(caches.keys()
            .then(keysList => {
                return Promise.all(appCaches.map(ac => {
                        // If this cache key is not in caches (SW object), 
                        // then create it and add all its urls
                        if (keysList.indexOf(ac.name) === -1) {
                            caches.open(ac.name)
                                .then(cache => {
                                    log({
                                        title: 'CACHEd',
                                        cache: ac.name,
                                    })
                                    // Fail silently on all cache except 'shell'
                                    if (ac.type === 'shell') {
                                        return cache.addAll(ac.urls)
                                    } else {
                                        cache.addAll(ac.urls)
                                    }
                                }).catch(reason => {
                                    return Promise.reject({
                                        title: 'FAILed @ INSTALL',
                                        cache: ac.name,
                                        err: reason,
                                    })
                                })
                        } else { 
                            log({
                                title: 'FOUND : already-cached',
                                cache: ac.name,
                            })
                            return true
                        }
                    }
                ))
                .then(() => {
                    log({
                        title: 'INSTALLed',
                        cache:appCaches,
                    })
                    return self.skipWaiting() //... activate NOW
                })
                .catch(logErr)
            })
        )
    })
 
    // ACTIVATE/UPDATE
    //================
    self.addEventListener('activate', ev => {
        // Protect all newly installed caches; delete all others, per name(s).
        const whiteList = appCaches.map(ac => ac.name)
        ev.waitUntil(
            caches.keys()
                .then(keysList => {
                    return Promise.all(
                        keysList.map(key => {
                            if (whiteList.indexOf(key) === -1) {
                                log({
                                    title: 'DELETEd CACHE @',
                                    cache: key,
                                })
                                return caches.delete(key)
                            }
                        })
                    )
                })
                .catch(reason => {
                    return Promise.reject({
                        title: 'FAILed @ Activate/Update',
                        err: reason,
                    })
                })
        )
        .then(() => {
            log({
                title: 'ACTIVATEd',
                cacheWhitelist: whiteList,
            })
            return self.clients.claim()
        })
        .catch(logErr)
    })
    
    /**************************************************************************
     * Fetch 
     * 
     * Aside from handling fetch, this event listener is used by browsers to
     * validate PWA functionality. If absent or faux (caches nothing), 
     * then browser vendors might not allow the Add2HomeScreen button popup.
     **************************************************************************/
    self.addEventListener('fetch', ev => {
        log({
            title: 'Fetch INTERCEPTed @',
            url: ev.request.url,
        })
        ev.respondWith( 
            caches.match(ev.request)
                .then(resp => {
                // STRATEGY: 'Cache falling back to network'  
                // https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network
                
                    // try CACHE 
                    if (resp) {
                        log({
                            title: 'FETCHed from CACHE @',
                            url: resp.url
                        })
                        return resp // from CACHE
                    } 
                    // if NOT in CACHE, then FETCH from NET 
                    log({
                        title: 'Try NET @',
                        url: ev.request.url,
                    })
                    return fetch(ev.request) //'ev.request.clone()' ???
                        .then(resp => {
                            // on FAIL [of fetch from NET] ...
                            if(!resp || resp.status !== 200 || resp.type !== 'basic') { 
                                logErr({
                                    title: 'FAILed @ NET',
                                    status: resp.status,
                                    req: ev.request.url,
                                    resp: resp.url,
                                    text: resp.statusText,
                                    type: resp.type,
                                })
                                if (resp.status === 404) {
                                    return caches.match(cache404) // if FAIL 404
                                }
                                return resp // if FAIL other than 404
                            }
                            
                            // On SUCCESS of fetch from NET, 
                            // ADD it to transient CACHE 
                            log({
                                title: 'FETCHed from NET',
                                url: ev.request.url,
                            })
                            const dynamicCache = 'content'
                            return caches.open(dynamicCache)
                                .then(cache => {
                                    // Exclude 'some' page from cache.
                                    if (ev.request.url.indexOf('some') < 0) { 
                                        cache.put(ev.request.url, resp.clone())
                                        .then(() => {  
                                            log({
                                                title: 'ADDed to CACHE',
                                                cache: dynamicCache, 
                                                url: ev.request.url,
                                            })
                                        }).catch(reason => {
                                            logErr({
                                                title: 'FAILed @ CACHE',
                                                cache: dynamicCache,
                                                req: ev.request.url,
                                                resp: resp.url,
                                                err: reason,
                                            })
                                        })
                                    }
                                return resp //... from NET
                            })
                            
                    })
                    .catch(reason => { // if fetch() FAILed
                        logErr({
                            title: 'FAILed @ FETCH',
                            err: reason,
                            req: ev.request.url,
                            resp: resp.url,
                        })
                        throw error // https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
                    }) // END CACHE MATCH
            })
            // IF offline AND url is NOT in cache
            .catch(() => caches.match(cacheOffline))
        )
    })

})()


