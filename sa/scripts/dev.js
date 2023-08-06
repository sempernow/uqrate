// ===  DEV/TEST ===
;(function(o, undefined){
    'use strict'
    const 
        srcID = 'LABS'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logWarn = o.log(srcID, o.log.levels.WARN)
        ,css = o.css
        ,cookieDel = (...k) => o.Cookies.del(...k)
        ,cookieGet = (k)    => o.Cookies.get(k)
        ,cookieSet = (k, v, days) => o.Cookies.set(k, v, days = 1)
        ,buttonGroup = o.css('main section')
        ,buttons = o.cssAll('BUTTON', buttonGroup)
        ,target = o.css('#target')
        ,createButtons = (fns) => [...Object.keys(fns)].map(btn => 
            o.toDOM(buttonGroup,`<button id="${btn}"><code>${btn}()</code></button>`)
        )
        // Call the button's function on click.
        ,addButtonListeners = (fns) => buttonGroup 
            && buttonGroup.addEventListener('click', (e) => {
                    const 
                        btn = e.target.closest('BUTTON')
                        ,x = btn.textContent.replace('()', '')
                    if (typeof fns[x] === 'function') fns[x]()
            }
        )

    // ==============
    // ===  LABS  ===
    // ==============

    ;(() => {})//()
    ;(() => {})//()
    ;(() => {})//()
    ;(() => {})//()
    ;(() => {// sequencing
        const 
            d = (d) => d
            ,main = o.css('MAIN')
            ,button = o.create('BUTTON')
            ,doClick = (ev) => logFocus('ev.target:', ev.target)

        button.id = 'foo'
        button.innerHTML = 'CLIK IT'
        o.append(main, button)

        button.addEventListener('click', o.throttle(2000, doClick))


        logFocus(200,d(200))
        logFocus(100,d(100))

        Promise.resolve((logFocus('sequentially'),o.Delay(2000)))
        //new Promise(o.Delay(5000))
            .then((x) => o.aDelay(300,()=>logFocus(3,x)))
            .then((x) => o.aDelay(200,()=>logFocus(2,x)))
            .then((x) => o.aDelay(100,()=>logFocus(1,x)))


    })//()
    ;(() => { // DOM @ msg-list
        const 
            main = o.css('MAIN')
            ,bogusEl = o.create('BOGUS') // used to parse string : See thread(..) : stripAnchor(..)
            /*************************************************************
             * Channel host may return summary wrapped in anchor. 
             * We want the innerHTML in that case, so parse and extract.
             ************************************************************/
            ,stripAnchor = s => { //... strip anchor
                bogusEl.innerHTML = s
                const a = o.css('A', bogusEl)
                if (a) return a.innerHTML 
                return s
            }
            ,summary = '<a href="https://fify.news">This is the summary</a>'
            ,stripped = stripAnchor(summary)

        logFocus('=== DOM @ msg-list : ', summary)
        o.toDOM(main, `<div>${stripped}</div>`) 


    })//()
    ;(() => { // Referer : document.referrer
        // TL;DR : Site sends Referer header cross origin if from link @ sender's page.
        // TEST  : https://fify.news/index.dev.html links to this page per anchor click
        //         whereupon we report : Referer: https://fify.news/
        logFocus(window.location,{
            domain: document.domain,
            URL: document.URL,
            documnetURI: document.documentURI,
            lastModified: document.lasModified,
            referrer: document.referrer,
            location: window.location,
            top: window.top,
            parent: window.parent,
            opener: window.opener,
            embedded: (window !== window.top),
        })
        o.toDOM(target, `<h1>Referer: <code>${document.referrer}</code></h1>`)
    })//()
    ;(() => {// @ IFRAME : postMessage(..)
        'use-strict'
        window.addEventListener('load', () => {
            const page = o.Page()
            if (!page.embedded) return
            const 
                log = (arg, ...args) => console.log(`[iframe]`, arg, ...args)
                ,target = document.querySelector('#view')
                ,message = () => ({
                    data: 'Hello from IFRAME',
                    date: Date.now(),
                    height: target.clientHeight
                })
                ,main = o.css('MAIN')

            log(page.URL, page)
            
            false && (//... @ DEV/TEST
                target.innerHTML = `
                    <h1><code>location: ${page.location}</code></h1>
                    <h1><code>top: ${page.top}</code></h1>
                    <h1><code>referrer: ${page.referrer}</code></h1>
                `
            )

            // Init : send message to parent
            o.aDelay(900, () =>{
                page.parent.postMessage(message(), page.parent)
            })

            // Dynamically message content-height changes
            main.addEventListener('click', (ev) => {
                o.aDelay(600, () =>{
                    page.parent.postMessage(message(), page.parent)
                })
            })

            // Listen for messages from parent
            window.addEventListener("message", (ev) => {
                if (ev.origin !== `https://${page.domain}`) return
                
                log('@ IFRAME : msg from PARENT:', {
                    source: ev.source,  // https://swarm.now/%EC%9B%83uzer-1/dev-1 (Parent)
                    origin: ev.origin,  // "https://swarm.now"
                    target: ev.target,  // https://swarm.now/%EC%9B%83uzer-1/dev-3 (This iframe)
                    data: ev.data,
                })
                // Send message : source to origin
                //ev.source.postMessage(message(), ev.origin)
            }, false)

        })
    })//()
    ;(() => { // aFetch(..) : /a/{mode}/apply

        const apply = (mode, jForm) => {
            const 
                params = {
                    method: 'POST'
                    ,body: JSON.stringify(jForm)
                    ,credentials: "include"
                }
                ,url = o.urlAOA(`/a/${mode}/apply`)
                ,req = new Request(url, params)
                ,respHandle = (resp) => (resp.meta && resp.meta.status === 202) || Promise.reject(resp)
                ,keyCSRF = o.cfg.auth.keyCSRF

            logDeb('apply(..) :', {url: url, payload: jForm})

            cookieSet(keyCSRF, jForm.csrf)
            return o.aFetch(req) //... fail @ HTTP 100 : Offline (111), NetworkError ...
            //return fetch(req)
                    .then(logFocus)
                    // .then(respHandle)
                    .catch(logErr)
        }
        apply('reset', {email: 'admin@sempernow.com', csrf: '123abc'})
    })//()
    ;(() => {// PayPal
        /****************************************************************************
         * PayPal : Checkout : Standard Payment 
         * https://developer.paypal.com/docs/business/checkout/set-up-standard-payments/
         * 
         * BUG : Logger err : CORS blocks @ Firefox NOT Chrome
         * https://www.sandbox.paypal.com/xoplatform/logger/api/logger
         * REF: https://github.com/paypal/paypal-checkout-components/issues/1232
         * 
         * BUYER @ Sandox PERSONAL ACCOUNT
         * ===============================
         * user: sb-kilja6221330@personal.example.com 
         * pass: sc4Q#z+S 
         ***************************************************************************/
         o.PayPal = (tokens) => {
            if (!window.hasOwnProperty('paypal')) {
                logErr('FAIL @ PayPal script')
                return 
            }
            const 
                ctnrID = 'paypal-button-container'
                ,ctnr = o.css(`#${ctnrID}`)

            paypal.Buttons({

                style: {
                    shape: 'pill',
                    color: 'silver',
                    layout: 'vertical',
                    label: 'checkout',
                },

                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: "USD",
                                value: tokens
                            }
                        }]
                    })
                }

                ,onApprove: function (data, actions) {
                    return actions.order.capture().then(function (orderData) {

                        // Log the payment-capture result
                        logDeb('PayPal : Capture : result:', orderData, JSON.stringify(orderData, null, 2))

                        // Inform @ DOM
                        ctnr.innerHTML = ''
                        ctnr.innerHTML = '<h3>Success! See <a href="/app/account">Account</a> page.</h3>'
                        // Or redirect
                        false && actions.redirect('/app/account')
                    })
                }

                ,onError: function (err) {
                    logErr('PayPal ERR:', err)
                }

            // DOM : Checkout
            }).render(`#${ctnrID}`) 
        }
        //o.PayPal(5)
        window.addEventListener('load', () => o.PayPal(5))
    })//()
    ;(() => {// Badges : o.cfg.view.badgeList : data/badges/badges.go
        const 
            getGlyphs = (dec) => o.cfg.view.badgeList
                .filter(o => (dec & Math.pow(2, +o.bit))) //... []Object(s)
                    .map(o => o.glyph)                    //... []Glyph(s)

            ,doBadges = (f) => {
                logFocus(
                    f(1), //... [ "¶"]
                    f(2), //... [ "⸿"]
                    f(3), //... [ "⸿", "¶"]
                ) 
                logFocus(f(4106))  // ["🦊", "🦅", "⸿" ]
                logFocus(f(73736)) // [ "🐲", "🐉", "🦅" ]
            }

        // Get array of badge objects per bitmask value.
        doBadges(getGlyphs)           
        doBadges(o.getGlyphs)           
        doBadges(o.getBadges)           
        doBadges(o.makeBadgeNodes)
        o.makeBadgeNodes(5555).map(el => o.toDOM(target,el))
    })///()
    ;(() => {// Seq
        const 
            seq125 = o.seq125
            ,arrSeq = o.arrSeq
            ,seq = seq125(1, 2)

        //arrSeq(22,1).map((i)=>logFocus(i, seq()))

        o.aScheduleSeq(o.seq125(), () => logFocus(o.nowUTC()))

    })//()
    ;(() => {// arrsConcat() vs map()
        o.bMode = o.bModes.TEST
        const 
            {   arrsConcat
                ,profile
            } = o
            ,size = 100000
            ,ac = () => {
                const 
                    prof = profile('cat')
                    ,a = [...Array(size).keys()]
                    ,b = [...Array(size).keys()]

                prof.start()
                arrsConcat(a, b)
                prof.stop()
                log('cat', a)
            }
            ,mp = () => {
                const 
                    prof = profile('map')
                    ,a = [...Array(size).keys()]
                    ,b = [...Array(size).keys()]

                prof.start()
                b.map(el => a.push(el))
                prof.stop()
                log('map', a)
            }
        mp(); ac()
        ac(); mp()
    })//()
    ;(() => {// AOA 
        const 
            debugOFF = o.log.debugOFF // ''
            ,profOff = o.log.profOFF   // ''
            ,get = o.aFetch
            ,root = o.cfg.net.rootAPI
            ,base = o.cfg.net.baseAPI
    
            ,jForm = {
                handle: 'foosdgf21bar'
                ,email: 'dwsgdsgzz@bar.com'
                ,pass: 'abcd1234'
                ,pass_confirm: 'abcd1234'
                ,roles: ["NONE"]
            }
            ,hdrs = new Headers({
                //'Content-Type': 'application/json'
            })
            ,params = {
                method: 'GET'
                //,headers: hdrs
                //,body: JSON.stringify(jForm)
            }
            //,url = `${window.location.origin}/${base}/liveness`
            ,url = `${root}${base}/liveness`
            ,req = new Request(url, params)
            ,ct = (resp) => resp.headers.get('Content-Type')

        //logFocus('HERE')
        get(req).then(logDeb).catch(logErr)
        //get(url).then(logDeb).catch(logErr)
        //get(`${window.location.origin}/${base}/u/all`).then(logDeb).catch(logErr)
    })()
    ;(() => {// DATE/TIME
        const 
            t = 1616243012114

            logErr(
                o.toTimes(t)
                ,o.toTimesMsec(t,t)
                ,o.time2ISO(t)
                ,o.time2UTC(t)
                ,o.nowISO()
                ,o.UTCtoMsec(o.nowUTC())
                ,o.UTCtoMsec(o.nowISO())
            )
    })//()
    ;(() => {// ancestor(..) 
        const 
            debugOFF = o.log.debugOFF // ''
            ,profOff = o.log.profOFF   // ''
            ,toDOM = o.toDOM
            ,css = o.css
            ,cssAll = o.cssAll
            ,mainNode = css('main')
            ,aDelay = o.aDelay
            ,maxPer = 5
            ,waitPer = 500
            ,lorem = o.filltext
            ,ancestor = (subject, selector) => { 
                if (!subject) return false
                return subject.closest(selector)  
            } //... 95% per CanIUse.com 

        // Insert the test nodes
        toDOM(css('MAIN'),`
        <div class=thread>
            <em>thread</em>
            <div class=msg>new-msg</div>
            <div class=thread>
                <em>sub-thread</em>
                <div class=msg>reply-msg</div>
            </div>
        </div>
        `)

        // Declare subject and target
        const 
            subject = cssAll('.msg')
            // Note access NodeList as if array; 
            // must convert to array only to iterate over it.
            ,got = ancestor(subject[1], '.thread')

        logErr(subject[0], got)
        
        toDOM(mainNode,`<div>ancestor class: <code>${got.textContent}</code></div>`)

    })//()
    ;(() => {// Cancellable asynch ...
        const 
            foo = ()=>log(srcID,11,22)
            ,aDelay = o.aDelay
            ,aScheduler = o.aScheduler
            ,aSchedulerP = o.aSchedulerP

        const
            idDel = aDelay(1000, log, 1, 'aDelay')
            ,idSch = aScheduler(1000, log)(1, 'aScheduler')
            // Attach two to the same AbortController
            ,idScP1 = aSchedulerP(300, log, aSchedulerP.signal)(1, 'aSchedulerP')
            ,idScP2 = aSchedulerP(1000, log, aSchedulerP.signal)(2, 'aSchedulerP')
            // Define one with its own AbortController
            ,ctrl = new AbortController
            ,signal = ctrl.signal 
            ,idScP3 = aSchedulerP(400, log, signal)(3, 'aSchedulerP')
            ,idScP4 = aSchedulerP(400, log)(4, 'aSchedulerP (Sans signal)')

        idDel
        idSch
        idScP1.then(log).catch(logErr) // Cancellable per `ctrl.abort()`
        idScP2.then(log).catch(logErr) // Cancellable per `ctrl.abort()`
        idScP3.then(log).catch(logErr) // Cancellable per `ctrl.abort()`
        idScP4.then(log).catch(logErr) // Cancellable per `ctrl.abort()`
        
        true && (
            clearTimeout(idDel)
            ,clearTimeout(idSch) 
            ,aDelay(200, ()=>aSchedulerP.abort()) 
            //... Change to 500 and P1 fires before the abort signal
        )

        true && (
            ctrl.abort()
        )
    })//()
    ;(() => {// AuthStore
        const 
            srcID = 'DEV'
            ,log = o.log(srcID, o.log.levels.INFO)
            ,logErr = o.log(srcID, o.log.levels.ERROR)
            ,logDeb = o.log(srcID, o.log.levels.DEBUG)
            ,logFocus= o.log(srcID, o.log.levels.FOCUS)
            ,aDelay = o.aDelay
            ,css = o.css
            ,buttonGroup = css('main section')
            ,signup  = () => logDeb('@ signup')
            ,login   = () => logDeb('@ login')
            ,authReq = () => logDeb('@ authReq')
            ,reload  = () => window.location.reload()
            ,x = {signup: signup, login: login, authReq: authReq, reload: reload}
            ,s1 = o.Store('state', 'idb')
            ,s2 = o.AuthStore()
            //... Store APIs should be ignored, 
            //... as the namespaced (defaults) singletons are already instantiated.
            ,parseJWT = o.parseJWT

        ;(buttonGroup) && buttonGroup
            .addEventListener('click', (e) => {
                const f = e.target.innerHTML.replace('()','')
                if (typeof x[f] === 'function') x[f]()
            })

        // AuthStore
        aDelay(1000, ()=> {
            log(s1.name, 'keys:', s1.keys(), 'get()', s1.get())
            log(s2.name, 'keys:') 
            s2.keys().then(log)
            s2.get().then(jwt => {
                const 
                    ta = parseJWT(jwt.ta),
                    tr = parseJWT(jwt.tr)
                log(
                    'ta: header >', ta.header, 'ta.payload >',ta.payload, 
                )
                log(
                    'tr.header >', tr.header, 'tr.payload >', tr.payload
                )
            })
        })
        //logFocus(`EB()`, o.EB().id, o.EB().id, o.EB().eTypes()) 
    })//()
    ;(() => {// AuthStore :: Normalize synch (storage) and async (idb) APIs
        const 
            srcID = 'DEV'
            ,log = o.log(srcID, o.log.levels.INFO)
            ,logErr = o.log(srcID, o.log.levels.ERROR)
            ,logDeb = o.log(srcID, o.log.levels.DEBUG)
            ,logFocus= o.log(srcID, o.log.levels.FOCUS)
            ,aDelay = o.aDelay

            ,buttonGroup = o.css('main section')

            ,_store = () => {
                const x = o.Store('dev', 'storage', 'idb')
                switch (x.mode) {
                    case 'synch':
                        return {
                            mode: x.mode,
                            api: 'storage',
                            set: (k,v)  => Promise.resolve(x.set(k, v)),
                            get: (k)    => Promise.resolve(x.get(k)),
                            del: (...k) => Promise.resolve(x.del(...k)),
                            keys: ()    => Promise.resolve(x.keys())
                        }
                    case 'async':
                        return x
                    }
            }
            //,store = o.Store('dev', 'storage')
            ,store = _store()

            ,reload  = () => window.location.reload()
            ,x = {reload: reload}

        ;(buttonGroup) && buttonGroup
            .addEventListener('click', (e) => {
                const f = e.target.innerHTML.replace('()','')
                if (typeof x[f] === 'function') x[f]()
            })

        logDeb(store)

        store.set('foo', '22222222')
            .then(()=>store.get('foo'))
            .then(x => logDeb('isNumber', !isNaN(x), x))
            .then(logErr)
    })//()
    ;(() => {// Auth
        const 
            aDelay = o.aDelay
            ,base64Encode = o.base64Encode
            ,botsToken = '26961ba0-50dd-487b-b6b7-5772a9e0bdb8'
            ,user = 'UserTest'
            ,pass = `gophersnow`
            ,obfuscate = o.cfg.auth.obfuscate
            
            // DOM : LAB meta 
            ,signup = () => logDeb('@ signup')
            ,login = () => auth.Basic(user, pass)
                            .then(at => {
                                logDeb((at ? at : 'Already logged in.'))
                            })
                            .catch(logErr)

            ,refresh = () => auth.Token.refreshAccess().then(logFocus).catch(logErr)
            ,accessGet = () => auth.AccessGet().then(logFocus).catch(logErr)
            ,logout = () => auth.Login()
                                .then((x) => logDeb('@ logout:', x))
                                .catch((x) => logErr('@ logout:', x))

            ,auth = o.Auth()
            ,authReq = () => auth.SubRecordGet()//.then(logDeb).catch(logErr)
            ,reload  = () => window.location.reload()
            ,f = {
                //signup: signup, 
                login: login, 
                authReq: authReq, 
                refresh: refresh, 
                accessGet: accessGet, 
                reload: reload, 
                logout: logout
            }

        // Hide buttons having no function (f).
        ;[...buttons].map(btn => 
            (Object.keys(f).indexOf(btn.id) < 0) 
                && (btn.style.display = "none"))

        // Call the button's function on click.
        ;(buttonGroup) && buttonGroup
        .addEventListener('click', (e) => {
            const 
                btn = e.target.closest('BUTTON'),
                x = btn.textContent.replace('()','')
            if (typeof f[x] === 'function') f[x]()
        })

        logWarn('obfuscate:', obfuscate,'| Login FAILs here @ true; requires /login endpoint.')
        
        ;(()=>{// DEV : o.Auth() : Methods
            aDelay(0, ()=> {
                const bogusKey = 'bogus'
                //auth.Token.get(bogusKey).then(tkn => log(`get(${bogusKey})`, tkn))
                //auth.Token.getValid(bogusKey).then(tkn => log(`getValid(${bogusKey})`, tkn))
                auth.Token.show(bogusKey).then(tkn => log(`show(${bogusKey})`, tkn))
                auth.Token.getTTL(bogusKey).then(tkn => log(`getTTL(${bogusKey})`, Math.floor(tkn/60),'minutes', tkn%60, 'sec'))
            })
        })//()
        ;(()=>{// DEV : o.Auth() : Methods
            aDelay(1, ()=>{
                const validKey = auth.Token.A
                //auth.Token.get(validKey).then(tkn => log(`get(${validKey})`, tkn))
                auth.Token.show(validKey).then(tkn => log(`show(${validKey})`, tkn))
                auth.Token.getTTL(validKey).then(tkn => log(`getTTL(${validKey})`, Math.floor(tkn/60),'minutes', tkn%60, 'sec'))
            })
        })//()
        ;(()=>{// DEV : o.Auth() : Methods
            aDelay(2, ()=> {
                const validKey = auth.Token.R
                //auth.Token.get(validKey).then(tkn => log(`get(${validKey})`, tkn))
                //auth.Token.show(validKey).then(tkn => log(`show(${validKey})`, tkn))
                //auth.Token.getTTL(validKey).then(tkn => log(`getTTL(${validKey})`, Math.floor(tkn/60),'minutes', tkn%60, 'sec'))
                //auth.Token.Refresh(validKey).then(logDeb).catch(logErr)
                //auth.StatusGet().then(logFocus)
                //auth.GetA().then(logFocus)
                auth.StatusGet().then(as => {
                    logDeb('Access:',  Math.floor(as.a.TTL()/60), 'min', as.a.TTL()%60, 'sec')
                    logDeb('Refresh:', Math.floor(as.r.TTL()/60), 'min', as.r.TTL()%60, 'sec')
                })
                auth.Authorized().then(is => logDeb('Authorized', is))
                auth.Authenticated().then(is => logDeb('Authenticated', is))
            })
        })//()

    })//()
    ;(() => {// Unicode / UTF-*
        // https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#31-escape-sequences
        const 
            buttonGroup = o.css('main section')
            ,reload  = () => window.location.reload()
            ,w = {
                signup: signup, 
                login: login, 
                authReq: authReq, 
                refresh: refresh, 
                reload: reload, 
                logout: logout
            }
            //,unicodeCodePoint = '\u{1F607}' //😇
            ,unicodeCodePoint = '\u{1F432}' //🐲
            ,badgeTest = {hex: '\u{2629}'} //☩ 
            //... MUST HARDCODE EVERYTHING.

        logDeb('Unicode Escape Sequence', '\uD83D\uDE07')
        logDeb('Code point escape sequence', '\u{1F607}')
        logDeb('encodeURIComponent', encodeURIComponent('\u{1F607}'))
        logDeb('decodeURIComponent', decodeURIComponent(encodeURIComponent('\u{1F607}')))
        logDeb('Code point escape sequence', unicodeCodePoint)
        logDeb('encodeURIComponent', encodeURIComponent(unicodeCodePoint))
        logDeb('decodeURIComponent', decodeURIComponent(encodeURIComponent(unicodeCodePoint)))
        logDeb('Code point escape sequence', badgeTest.hex)
        logDeb('encodeURIComponent', encodeURIComponent(badgeTest.hex))
        logDeb('decodeURIComponent', decodeURIComponent(encodeURIComponent(badgeTest.hex)))

        // On button click, call w[method] declared in the button's text.
        buttonGroup && buttonGroup.addEventListener('click', (e) => {
            const button = o.ancestor(e.target, 'BUTTON') || o.create('GHOST')
                ,f = button.textContent.replace('()', '')
            if (typeof w[f] === 'function') 
                w[f]()
        })
    })//()
    ;(() => {// new Request(...)
        var req
        try {
            const 
                url = '/////'
                ,reqHeaders = new Headers({
                    'X-Custom-Header': 'foo' 
                })
                ,params = {
                }
        req = new Request(url, params) 
        log(req)
     } catch (err){ 
        req = 22
        logErr('Request is FUBAR:', err)
     }
        
    })//()
    ;(() => {// Cookie
        const
            keyA    = o.cfg.auth.keyTknAccess
            ,keyR    = o.cfg.auth.keyTknRefresh
            ,keyOA   = o.cfg.auth.keyOA
            ,keyCSRF = o.cfg.auth.keyCSRF
            ,credFetch = (verb, url, body = undefined) => {
                //logFocus('body @ input', body)
                const 
                    csrf = o.rand(15) //... regardless
                    ,hdrs = new Headers({
                        //'Authorization': `Bearer ${tkn}`,
                        'X-CSRF-Token': csrf, 
                        //... entirely orthogonal to that of body.
                        //    (Validations under the two modes are orthogonal.)
                    })
                    ,init = {
                        method: verb,
                        headers: hdrs,
                        credentials: (body && body.csrf) ? "include" : "same-origin", 
                        //credentials: "include", 
                        //credentials: 'include', 
                        //... Creds required (if body.csrf) to send CSRF cookie.
                        body: body ? JSON.stringify(body) : undefined
                        //... CALLER is RESPONSIBILE for inserting CSRF token into body.
                    }
                    ,req = new Request(url, init)
                    ,readCookies = () => {
                        logFocus(keyCSRF, cookieGet(keyCSRF))
                        logFocus(keyOA, cookieGet(keyOA))
                    }
                    ,cleanup = r => (body && body.csrf && o.aDelay(200, () => cookieDel(keyCSRF)), r)
                    ,onErr = (err) => {
                        logErr('req:', url, keyCSRF, (body && body.csrf), req)
                        logErr(err)
                    }
                
                body && body.csrf && cookieSet(keyCSRF, body.csrf)

                return o.aFetch(req)
                        .then(readCookies)
                        .then(cleanup)
                        .catch(onErr)

            }
            ,b = {key1:'the body', csrf: o.rand(22)}
            ,reload  = () => window.location.reload()

            // ,set = o.urlAOA('/setcookie')
            // ,get = o.urlAOA('/getcookie')
            // ,del = o.urlAOA('/delcookie')

            ,set = o.urlPWA('/ops/setcookie')
            ,get = o.urlPWA('/ops/getcookie')
            ,del = o.urlPWA('/ops/delcookie')


            ,setCookie = () => credFetch('POST', set, b)
            ,getCookie = () => credFetch('GET', get, undefined)
            ,delCookie = () => credFetch('GET', del, undefined)

            ,fns = {
                reload: reload, 
                setCookie: setCookie,
                getCookie: getCookie,
                delCookie: delCookie,
            }

            ,cookieDel = (...k) => o.Cookies.del(...k)
            ,cookieGet = (k)    => o.Cookies.get(k)
            ,cookieSet = (k, v, days) => o.Cookies.set(k, v, days = 1)

        createButtons(fns)
        addButtonListeners(fns)

        //o.Auth().Token.get(o.Auth().Token.A).then(tkn => logFocus('a:', tkn))
    
    })//()
    ;(()=>{// A2HS
        const 
            header = css('header')
            ,pwaPrompt = 'beforeinstallprompt'
            ,state = {defer: undefined}
            ,peek = true // true @ TEST (preview)
    
        if (!header) return
    
        // Append/declare aBtn at header
        o.toDOM(header, `<button class="a2hs">Install : Add to home screen?</button>`)
        const aBtn = css('.a2hs')
        !peek && (aBtn.style.display = 'none')
    
        window.addEventListener(pwaPrompt, (ev) => {
            ev.preventDefault()
            state.defer = ev
            aBtn.style.display = 'block'
    
            aBtn.addEventListener('click', (e) => {
                aBtn.style.display = 'none'
                state.defer.prompt()
                state.defer.userChoice.then((u) => {
                    if (u.outcome === 'accepted') {
                        log('user ACCEPTED')
                    } else {
                        log('user REJECTED')
                    }
                    state.defer = null
                })
            })
        })
    })//()
})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
)
