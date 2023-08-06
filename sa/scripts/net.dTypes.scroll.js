;(function (o, undefined) {
    'use-strict'
    /**********************************************************************
     * Net communicates with app-services' endpoints per Fetch API,
     * and publishes its app-configured payloads per app-wide event bus.
     * Currently, it may hit endpoints of either PWA or API services.
     * 
     * Net module handles only the unprotected endpoints. 
     * Auth module handles all protected endpoints.
     * 
     * FEATUREs:
     *  - Net listens for messages from Loader and View, 
     *    and fetches resources per ebMsg.uri params. See `setURL(..)`.
     *    MsgList is the resource requested most often.
     *  - Recurringly fetches updates per scheduler that
     *    it launches on View's first-render ebMsg.
     *  - Publishes on `eTypes.Net` per fetch event; 
     *    Actions module listens for and handles payload.
     *  - Publishes an app-configured payload.
     *  - Net is stateless but for its own local (sans o.State()); 
     *    manages its local state per timestamp(s) in response data.
     * 
     * DATA FLOW:
     *  - On ebMsg 'init' (from Loader), 
     *    Net requests Page object from PWA service; 
     *    same URL, but in JSON format, per content negotiation (REST).
     *  - On ebMsg 'newer' (from View on first render), 
     *    Net schedules recurring requests to API service for newer.
     *  - On ebMsg 'older' (from View; either renderer), 
     *    Net requests older messages from API service.
     ********************************************************************/
    const 
        srcID = 'Net'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr     = o.log(srcID, o.log.levels.ERROR)
        ,logDeb     = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus   = o.log(srcID, o.log.levels.FOCUS)
        ,debugOFF   = o.log.debugOFF // ''
        ,profOff    = o.log.profOFF   // ''
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,{  aFetch
            ,aDelay
            ,profile
            ,time2UTC
            ,aModes
            ,dTypes
            ,aScheduleSeq
            ,seqArr
            ,once
            ,UTCtoMsec
            ,time2ISO
            ,nowISO
        } = o
        ,{  service
            ,rootAPI
            ,baseAPI
            ,uriDefault
            ,msgListFull
            ,msgListDiff
        } = o.cfg.net
        ,ajaxDelay = 15 * 1000 // msec
        
        /*******************************************
         * netSchOff : DISABLE SCHEDULED FETCHES
         ******************************************/
        ,netSchOff = false 
        ,ss = o.State().store

        /*******************************************************
         * Net state is local; does not share state with State.
         *******************************************************/
        ,state = {newest: 0, oldest: 0} // oldest not utilized.

        /*****************************************************************
         * net(..) returns a promise of the app object 
         * if Fetch API resolves and has meta,
         * else rejects; caller responsible for catch.
         * 
         * The app object is the decoded response body with added keys: 
         * {dType: dType, mode: aModes.promise, http: resp.meta}. 
         * The resp.meta keys are those of Fetch API and a few more. 
         * 
         * See o.aFetch(..) for details.
         * 
         * https://javascript.info/fetch-api 
         * https://fetch.spec.whatwg.org/#forbidden-header-name
         ****************************************************************/
        ,net = (url, dType) => {
            const 
                // Some headers are FORBIDDEN fetch
                // See spec: https://fetch.spec.whatwg.org/#forbidden-header-name
                reqHeaders = new Headers({
                    // Request resource format (JSON) per CONTENT NEGOTIATION, 
                    // but that SPAWNS ISSUES that are addressed hereunder.
                    // (All but `Accept` are CORS-Unsafe headers.)
                    'Accept': 'application/json' //... Content Negotiation
                    //... per server-side (CORS preflight) list of allowable headers: 
                    //   `Access-Control-Allow-Headers: <CSV-list>`
                    // App caches content at State/Store; we don't want browser to cache: 
                    ,'Cache-Control': 'no-store, max-age=0' 
                    //... this is not as effective as response header. (Do both.) 
                    //    The `max-age=0` setting clears local cache of requested resource.
                    //    Else JSON replaces cached page HTML, 
                    //    because request has same URL (content negotiation). 
                    ,'If-Modified-Since' : time2UTC(state.newest)
                    //... else Chrome inserts the header with time set to that of this (HTML) page.
                    //    So response is headers only (HTTP 304) unless resource 
                    //    (server-side) is newer than (newest in) our Store.
                    // UPDATE : HTTP 204 @ none newer; handled per request params
                })
                //... Request headers can be read: reqHeaders.get('Accept')
                //    https://developer.mozilla.org/en-US/docs/Web/API/Request/Request

                ,params = {
                    headers:    reqHeaders
                    ,method:    'GET'  // *GET, POST, PUT, DELETE, etc.
                    ,mode:      'cors'  // *cors, no-cors (safe only), same-origin (no cors)
                    /***************************************************************
                    * CORS: Some browsers erroneously report CORS requests 
                    * that fail for unrelated reasons, e.g., response timeout, 
                    * as a "Cross-Origin Request Blocked ...". Firefox does that, 
                    * whereas Chrome reports the failed preflight (OPTIONS).
                    ***************************************************************/
                    //,cache: 'no-store'  // *default, no-store, no-cache, reload, force-cache, only-if-cached
                    //... Better handled per explicit header (See above).
                    //,credentials: 'same-origin'  // *same-origin, include, omit 
                    //,redirect: 'follow'  // manual, *follow, error
                    //,referrerPolicy: 'no-referrer'  // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    //,body: JSON.stringify(data)  // must match "Content-Type:" req header.
                }
                ,req = new Request(url, params) 

                ,respHandle = d => {
                    // o.aFetch(..) should always return both body and meta.
                    if (!d.meta) return Promise.reject({
                        why:    'Network meta data is missing.', 
                        what:   d,
                        where:  'aFetch(..)'
                    })
                    /*********************************************************
                     * Map the aFetch(..) return, {body: ???, meta: {..}},
                     * into app-normalized object, {body: {..}, http: {..}}.
                     ********************************************************/
                    d.body          = d.body ? d.body : {}
                    d.body.dType    = dType 
                    d.body.mode     = aModes.promise

                    /**********************************************
                     * Guarantee d.body is an object regardless,
                     * and absorb d.meta into d.body.http,
                     * so d.body forms the expected app object.
                     * 
                     * This handles HTTP 5xx (service down), 
                     * whereof proxy service sends HTML,
                     * whence d.body arrives as a string.
                     *********************************************/
                    o.isObject(d.body)
                        ? d.body.http = d.meta 
                        : d.body = {html: d.body, http: d.meta} 
                        //... d.body.html for dev/test/debug
                    
                    ;(d.meta.status < 400) 
                        ? logDeb('resp @ aFetch(..) : HTTP meta:', d.meta) 
                        : logErr('resp @ aFetch(..) : HTTP meta:', d.meta)
                    
                    delete d.meta
                    
                    return Promise.resolve(d.body)
                }

            return aFetch(req).then(respHandle)
        }
        /***********************************************
         * Renormalize the payload to fit this client.
         * See modules: Action, State, View.
         **********************************************/
        ,renorm = (d) => {
            const prof = profile('renorm()')
            prof.start(profOff)

            if (d.messages) {
                /****************************************************************
                 * Response on Page model request is denomralized (all models), 
                 * and so does not strip any keys. Its only list is d.messages.
                 ***************************************************************/
                d.list = d.messages.list
                d.meta = d.messages.meta
                delete d.messages
            } else {
                if (d.chn_id) {
                    /***********************************************************
                     * Response @ Channel payload (versus MsgList, Page, ...),
                     * renormalize by sub-keying the payload.
                     **********************************************************/
                    d = {channel: d}
                }
            }
            prof.stop()

            return Promise.resolve(d)
        }
        ,publish = (d) => eb.pub(eTypes.Net, {
            data: d,
            mode: aModes.promise
        })//.then(emitted => logFocus('published', emitted))
        /*********************************************************
         * getResource(..) : Fetch ... publish  (promise chain)
         ********************************************************/
        ,getResource = (url, dType) => {
            log(`@ getResource(${dType}) >`,  url)
            net(url, dType)
                .then(renorm)
                .then(publish) 
                // Handle rejected Fetch API response.
                .catch(err => {
                    publish({http: err, mode: aModes.promise})
                    ;(err.status) ? logErr(err) : logErr('Fetch API :', err)
                })
        }
        /*********************************************************************************
         * getMsgListNewest(..)
         * The URL arg abides API signature, sans optional params (t, n) added herein,
         * to request a number of messages (n) newer (t) than our newest (state.newest).
         * E.g., https://swarm.now/api/v1/ml/pub/0ac...c49/1633476641316/-22 .
         *******************************************************************************/
        ,getMsgListNewest = (url, dType) => {
            url = `${url}/${state.newest}/-${msgListDiff ? msgListDiff : 33}`
            getResource(url, dType)
        }
        /*******************************************************
         * Schedule recurring GET requests for NEWER messages:
         * 1*wait, 2*wait, 5*wait, 5*wait, ... (@ true)
         ******************************************************/
        ,onSchedule = once((url) => {//... idempotent ...
            if (netSchOff) return
            logDeb("@ onSchedule(diff) LAUNCH > url >", url)
            const waitSeq = [1, 2, 5].map((t) => (t * ajaxDelay))
            aScheduleSeq(seqArr(waitSeq, 0, true), getMsgListNewest, url, dTypes.diff)
        })
        /*****************************************************************
         * setURL(..) per ebMsg.uri, which is a list of request params: 
         * 0: 'pg'|'ml', 1: 'pub'|'sub'|'chn', 2: xid [, 3: t [, 4: n]]
        *****************************************************************/
        ,setURL = (ebMsg) => {
            const 
                loc = { // Reference (mostly)
                    href: window.location.href                      // "http://localhost:3030/app/login"
                    ,origin: window.location.origin                 // "http://localhost:3030"
                    ,protocol: window.location.protocol             // "http:"
                    ,host: window.location.host                     // "localhost"
                    ,path: window.location.pathname                 // "/app/login"
                    ,slug: (window.location.pathname).substring(1)  // "app/login"
                }
                ,url = ebMsg.uri 
                        ? `${rootAPI}${baseAPI}/${ebMsg.uri.join('/')}` // API mode (JSON)
                        : (loc.slug                                     // PWA mode (JSON)
                            ? `${loc.origin}/${loc.slug}`
                            : `${loc.origin}${uriDefault}`
                        ) 
            log('@ setURL', {ebMsg: ebMsg, url: url})
            return url
        }
        ,wantsRegistry = ['init', 'older', 'newer', 'update', 'channel', 'top']
        /*********************************************
         * Update local state if o.State has a list.
         ********************************************/
        ,updateLocalState = () => (ss.active && ss.active.newest) && (
            (state.newest = ss.active.newest.date || 0),
            (state.oldest = ss.active.oldest.date || 0)
        )

        /****************
         * Entry point 
         **************/
        ,onDemand = (ebMsg) => {

            if (!ebMsg.want) {
                logErr('BAD ebMsg SIGNATURE : ebMsg.want is MISSING')

                return
            }

            // Abort lest ebMsg has a registered want.
            const wants = {}
            wantsRegistry.map(w => (wants[w] = ebMsg.want.includes(w)))
            if (!Object.values(wants).filter(want => (want === true)).length)
                
                return
            
            // On page load
            wants.init && getResource(setURL(ebMsg), dTypes.full)

            // Requests from either message renderer for either newer or older.
            wants.older && (
                (ebMsg.dType === dTypes.full)
                    ? getResource(setURL(ebMsg), dTypes.full) 
                    : ( (ebMsg.dType === dTypes.scroll)
                            ? getResource(setURL(ebMsg), dTypes.scroll) 
                            : getResource(setURL(ebMsg), dTypes.diff)
                    )
            )

            // Ad-hoc requests following message creation; form-msg submittal event 
            wants.newer && getResource(setURL(ebMsg), ebMsg.dType)
            // Schedule recurring diff updates; triggered by View upon first render
            wants.newer && onSchedule(setURL({uri: [ebMsg.uri[0], ebMsg.uri[1], ebMsg.uri[2]]}))

            // Updated message(s) : per View.txn
            wants.update && getResource(setURL(ebMsg), ebMsg.dType)
            
            // Channel : per View.txn
            wants.channel && getResource(setURL(ebMsg), ebMsg.dType)

            // Top : per View.centre
            wants.top && getResource(setURL(ebMsg), ebMsg.dType)

            log('@ onDemand(ebMsg)', {
                wants: [Object.keys(wants).filter(want => (wants[want] && want))].join(' '), 
                dType: ebMsg.dType, 
                  uri: (ebMsg.uri ? `/${ebMsg.uri.join('/')}` : ebMsg.uri),
            })
            return srcID 
        }

    /********
     * Init
     *******/
    baseAPI || logErr('Missing API config.')

    logDeb(debugOFF)
    
    eb.sub(eTypes.Loader, onDemand)
    eb.sub(eTypes.View,   onDemand)
    eb.sub(eTypes.State,  updateLocalState)

})( window[__APP__] = window[__APP__] || {} )
