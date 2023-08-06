;(function (o, undefined) {
    'use-strict'
    /**********************************************************************************
     * View consumes State logs per state-published cursor, o.State.logs[cursor],
     * passing that indexed obj (got) to all renderers; o.View.components[key](got).
     *********************************************************************************/
    const 
        srcID = 'View'
        ,log = o.log(srcID)
        ,logWarn = o.logWarn(srcID)
        ,logErr = o.logErr(srcID)
        ,logDeb = o.logDeb(srcID)
        ,logFocus = o.logFocus(srcID)
        ,debugOFF = ''//o.log.debugOFF  // ''
        ,profOFF = o.log.profOFF    // ''
        ,prof = o.profile('View')
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,state = o.State()
        ,keys = {} 
        ,view = {
            log:      id => o.log(`${srcID}/${id}`)
            ,logDeb:   id => o.logDeb(`${srcID}/${id}`)
            ,logErr:   id => o.logErr(`${srcID}/${id}`)
            ,logFocus: id => o.logFocus(`${srcID}/${id}`)
            ,msglistHeader: o.css('#channel main h4') || o.create('GHOST')
            ,msglistNode: o.css('#msg-list')
            /*******************************************************************
             * Components/Renderers
             * 
             * Each view.components[key] is a DOM handler (renderer); 
             * an IIFE returning a closure over its init params. 
             * Thereafter, each is invoked per state, at entrypoint func,
             * and operates on its state-obj data (if its key exists therein). 
             * 
             * Such may be inlined (here) or declared in other app module(s):
             * keys = o.View().components, keys['foo'] = (()=>{..})()
             ******************************************************************/
            ,components: keys
            /********************************************************* 
             * Validate each component and its state.log[i] per key 
             ********************************************************/
            ,validate: {
                // Validate DOM component (once per init)
                node: (node, name) => {
                    if (!node) {
                        logDeb( `'${name}' : HTML node NOT EXIST.`)
                        return false
                    }
                    return true
                },
                /********************************************************
                 * Validate component data (current state log) per key, 
                 * so each component renderer is bypassed 
                 * at current state lest its key exists therein.
                 *******************************************************/
                key: (data, key) => {
                    if (!data.hasOwnProperty(key)) {
                        return false 
                    } else { 
                        if (typeof data[key] === 'undefined') return false
                    }
                    return true
                }
            }
            /************************************************************
             * Garbage collector deletes all keys of current-state obj,
             * except for saves, which is a CSV list of key names. 
             * The convention is to retain at least the primary keys, 
             * which reveal the state's spawn.
             ***********************************************************/
            ,gc: (obj, ...saves) => !!o.aDelay(2000, () => 
                Object.keys(obj).map(key => saves.includes(key) || delete obj[key]) 
                ,obj, ...saves
            )
            ,banner: (x) => x ? `${o.cfg.view.banners}/${x}` : `${o.cfg.view.banners}/ghost-1778x500.png`
            /******************************************************
             * Set avatar per 1st letter of word; its equivalent
             * MATHEMATICAL Bold FRAKTUR CAPITAL LETTER (MBF)
             *****************************************************/
            //,avatars = o.cfg.view.avatars
            ,avatar: (x) => x ? `${o.cfg.view.avatars}/${x}` : `${o.cfg.view.avatars}/user-x-00.png`
            //,avatar: (x) => `/sa/media/avatars/${x}`
            //... TODO : Align assets directories of cdn.uqrate.org and uqrate.org
            // https://cdn.uqrate.org/media/avatars/user-x-00.png
            ,avatarMBF: (word = 'A') => `${o.cfg.view.avatars}/unicode/mbf/cap-${word.substring(0,1).toLowerCase()}.svg`
            //,avatarMBF: (word = 'A') => `/sa/media/avatars/unicode/mbf/cap-${(word.substring(0,1)).toUpperCase()}.svg`
            //,avatarMBF: (word = 'A') => 'https://uqrate.org/logo-512.png' //  CSP
            //,avatarMBF: (word = 'A') => `https://cdn.uqrate.org/media/avatars/user-x-00.png`
            //,avatarMBF: (word = 'A') => `https://cdn.uqrate.org/media/avatars/crown.svg`
             /*************************************************
             * Set avatar per random MBF (Unicode) letter;
             * per code point of LATIN CAPITAL LETTER (ASCII)
             *************************************************/
            ,avatarMBFRand: () => `/sa/media/avatars/unicode/mbf/cap-${String.fromCharCode(65 + o.randInt(25))}.svg`
            ,avatarMBFStr: (word = 'A') => `
                <svg 
                    viewBox="0 -15.5 13 20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <style>
                            @font-face {
                                font-family: 'symbola-mbf';
                                font-weight: normal;
                                font-style: normal;
                                src: url('symbola-mbf.woff') format('woff');
                            }
                            .sbmf {
                                font-family: symbola-mbf;
                                fill: #333;
                            }
                        </style> 
                    </defs>
                    <text class="smbf">${(word.substring(0,1)).toUpperCase()}</text>
                </svg>
            `//... this does not mock img.src, which is what we want; 
            //     a standin until we allow for user-avatar (png, webp, ...) uploads.

            /***********************
             * Operational params
             **********************/
            // pToken button is hidden until sufficient qTokens accumulate.
            ,minMsgQ4P: o.cfg.view.msgs.minQ4P
            ,dtThrottle: 1000

            // Calibrate per viewport; 150 px is ~ 1 short message, nominally.
            ,headerSite: o.css('header>section.site')
            ,unitHeight: (this.headerSite && Math.round(2.1 * this.headerSite.scrollHeight)) || 150
            ,cfgMsgs: o.cfg.view.msgs
            
            //svgsPath: o.cfg.view.svgsPath,
            //avatars: o.cfg.view.avatars,
            ,dtReplayRender: 10
        }
        /***************************************************************
         * ENTRYPOINT function is invoked per published-state event,
         * taking the state's cursor, and passing o.State.logs[cursor] 
         * object as argument to all View components (keys).
         **************************************************************/
        ,render = (i) => {
            // Get the state logs data (object) at this index (i).
            const got = !isNaN(i) ? state.get(i) : state.get()
            // Fire all render handlers, passing to each the state object.
            Object.keys(view.components).map(key => view.components[key](got))
            logDeb('#',state.cursor, "@ render > mode:", got.mode)
        }

    // TEMPLATE : Component/Renderer example
    keys.foo = (() => {
        const 
            cName = 'foo'
            ,cSelector = `#${cName}`
            ,cNode = o.css(cSelector)

        // @ init : close over whatevs at this node.
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        const 
            auth = o.Auth()
            ,eb = o.EB()
            ,eTypes = eb.eTypes()
            ,state = o.State()
            ,keys = view.components
            ,logDeb = view.logDeb(cName)
            ,debugOFF = o.log.debugOFF  // ''
            ,logErr = view.logErr(cName)
            ,logFocus = view.logFocus(cName)
    
        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... handle/render if component key (cName) exists in this state log.
        }
    })()

    // INIT 
    o.View = () => view

    // LISTEN 
    eb.sub(eTypes.State, render) 

    // DEV/TEST
    true && (prof.start(profOFF), logDeb(debugOFF))
    //view.msglistHeader.textContent = `Messages @ ${o.nowUTC().substring(0,22)} GMT`

    //logFocus('=== view:',view)
    
})( window[__APP__] = window[__APP__] || {} )

/*********************************************************************************
 * Components (DOM handlers) are modularized for extraction to separate file(s).
 ********************************************************************************/

// View : COMPONENT (template)
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'COMPONENT' //... rather is per-state data key; NOT 1:1 map to DOM component
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,keys = view.components

    keys[cName] = (() => {
        // @ init : close over whatevs at this node.
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        const 
            auth = o.Auth()
            ,eb = o.EB()
            ,eTypes = eb.eTypes()
            ,logDeb = view.logDeb(cName)
            ,logErr = view.logErr(cName)
            ,logFocus = view.logFocus(cName)
        
        // @ Asynch listeners/handlers here
        // ...

        // @ render
        // Handler per content of this (cName) data key 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... handle/render if component key (cName) exists in this state log.
        }
    })()
//... To make keys[..] available app-wide, uncomment the invocation, 
//    thereby injecting this module's content into the app object (window namespace):
})//(window[__APP__] = window[__APP__] || {}) 

// View : http
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'http'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,state = o.State()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,log = view.log(cName)
        ,logDeb = view.logDeb(cName)
        ,debugOFF = o.log.debugOFF  // ''
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)

    logDeb(debugOFF)

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        /***********************************************************
         * Render a transient HTTP-status text to the target node.
         **********************************************************/
        const  // @ init
            /************************************************************* 
             * Track http-component state (hstate):
             * - Notify only on diff-to-diff HTTP code change or on 200.
             * - Collect timeout ids for cancellation across states.
             ************************************************************/
            hstate = {http: {}, last: '', cursor: 0, length: 0, ids: []}

            // Transient FX :: Add/Remove per hstate.
            ,transientFX = (ns, mode) => {

                if (mode === 0) return //... abort if replay.

                ;((ns.http.status === 200) && (ns.cursor !== 0)) 
                    ? ( (ns.length)
                            ? (cNode.textContent = `Messages: ${ns.length}`)
                            //: (cNode.textContent = `Message(s)`)
                            //: (cNode.textContent = `${ns.http.statusText.substring(0,11)} (${ns.http.status})`)
                            : (cNode.textContent = `${ns.http.statusText} (${ns.http.status})`)
                    )
                    //: (cNode.textContent = `${ns.http.statusText.substring(0,11)} (${ns.http.status})`)
                    : (cNode.textContent = `${ns.http.statusText} (${ns.http.status})`)

                // Transient FX :: Add
                cNode.classList.add('transient') 

                // Style per code category (HTTP Nnn), per (dataset API) value @ `data-net=<value>` 
                ;((199 < ns.http.status) && ( ns.http.status < 305))
                    ? (cNode.dataset.net = '')
                    : ( (ns.http.status < 200) 
                        ? (cNode.dataset.net = 'info')
                        : (cNode.dataset.net = 'fail')
                    ) 

                // Transient FX :: Remove
                ns.ids.push(o.aDelay(o.cfg.view.timeTransientFX, () => {
                    cNode.classList.remove('transient')
                    cNode.textContent = ''
                    cNode.dataset.net = ''
                }))//... collecting IDs of these delayed transients.
            }

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            if (!(data.http && data.http.status)) return 

            hstate.http   = data.http
            hstate.cursor = state.cursor
            hstate.length = (data.msg_list && data.msg_list.list.length) || 0

            // If http status is unchanged, then abort unless new content (HTTP 200).
            // If notify, then first cancel all (probably one) prior transient(s).
            ;((hstate.last !== hstate.http.status) || (hstate.http.status === 200)) 
                && ( hstate.ids.map(id => clearTimeout(id))
                    ,hstate.ids.length = 0
                    ,cNode.classList.remove('transient')
                    ,o.aDelay(222, transientFX, hstate, data.mode)
                )

            // Reckon new state, then garbage collect.
            hstate.last = hstate.http.status

            logDeb({
                code: data.http.status,
                text: data.http.statusText, 
                url:  data.http.req ? data.http.req.url : '???', 
            })

            ;( debugOFF && (hstate.http.status === 200) ) ? view.gc(data.http) : true

            return
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : channel : timeline|slug|thread channel
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'channel'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,keys = view.components

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 

        const 
            eb = o.EB()
            ,eTypes = eb.eTypes()
            ,logDeb = view.logDeb(cName)
            ,logErr = view.logErr(cName)
            ,logFocus = view.logFocus(cName)
            ,ghost = o.create('GHOST')
            ,chnMenu = o.css('#channel-header SECTION.menu')
            ,owner = o.css('#owner')
            ,aboutOwner = o.css('#owner .upper .about')
            ,chnButtons = o.css('#owner .channel .buttons')
            ,sponsor = !owner ? ghost : o.cssAll('.sponsor>div', owner)
            ,qTokens = !owner ? ghost : o.css('.sponsor span[data-title="qToken', owner)
            ,subers  = !owner ? ghost : o.css('.about .stats table[data-followers] td', owner)
            /*****************************************************************************
             * If auth-user is channel owner and view is not Single-thread, 
             * then show 'New Message' button (formMsgNew), which is hidden by default, 
             * else hide channel menu ('Outgoing', '+Incomming').
             ***************************************************************************/
            ,formMsgNew = o.css('#form-msg-new') 
            ,doShowIf = (oid) => (as) => (as.sub === oid) 
                            ? ((formMsgNew && !o.css('#article')) && formMsgNew.classList.remove('hide'))
                            : (chnMenu && chnMenu.classList.add('hide'))
            /***************************************************
             * (Re)Read DOM as message list renders;
             * scroll to hash-marked message if/when rendered.
             * 
             * TODO : Handle @ msg-list render loop;
             * scroll to message whenever it's rendered.
             **************************************************/
            ,goToHash = () => { 
                const 
                    validSelector = window.location.hash && isNaN(+window.location.hash.substring(1))
                    ,target = validSelector && o.css(`${window.location.hash}`)
                    ,yTarget = target ? target.getBoundingClientRect().top : 0
                
                if (!target) return

                window.scrollTo({
                    top: window.pageYOffset + yTarget - (20 + 40),
                    left: 0,
                    behavior: 'smooth'
                })
                o.aDelay(1000, () => window.removeEventListener('scroll', goToHash))
            }

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
    
            // @ /sub channel, show only a subset of #owner els
            if (data.channel.slug === 'sub') {
                aboutOwner.classList.add('hide')
                chnButtons.classList.add('hide')
            } else {
                //(Re)Set counts dynamically
                //  @ qTokens count 
                data.channel.tokens_q 
                    && o.setText(qTokens, data.channel.tokens_q.toLocaleString('en-US'))
                // @ Followers count 
                sc = (+data.channel.subers_free + +data.channel.subers_paid)
                o.setText(subers, sc.toLocaleString('en-US'))
            }
            // show/hide elements per auth-user status
            formMsgNew && eb.sub(eTypes.Auth, doShowIf(data.channel.owner_id))

            false && view.gc(data[cName], 'chn_id', 'slug')
            //... retain only what's required for net requests

            /*********************************************
             * Scroll to message whenever it's rendered.
             * TODO : Handle @ msg-list render loop;
             ********************************************/
            data.list && o.aDelay(1000, goToHash)
            data.list && window.addEventListener('scroll', goToHash)
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : owner : timeline channel
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'owner'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)
        ,state = {update: undefined}

    /*********************************************
     * Set #owner elements and FX
     * per either auth-status or state-log event.
     ********************************************/
    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        const 
            ghost = o.create('GHOST')
            ,badgesNode = o.css('.badges', cNode) || ghost
            ,chnID = o.css('#channel').dataset.channelId || ''
            //,subs = o.cssAll('#owner .upper .about .stats h3') || []
            //,subing = o.cssAll('#owner .upper .about .stats h3[data-following] span')[1] || ghost
            ,owner = o.id('#owner')
            ,avatar = o.css('#owner .upper img.avatar') || ghost
            ,banner = o.css('#owner .upper img.banner') || ghost

            ,state = {invalid: true, virgin: true}

            /***************************************************
             * FX : Set Follow/Unfollow and such per auth.user
             **************************************************/
            ,doAuthStatusFX = (as) => {
                const subed = []
                as.user && (
                    o.arrsConcat(subed, as.user.subed_paid),
                    o.arrsConcat(subed, as.user.subed_free)
                )
                const
                    follow = o.css('#owner .upper .channel .buttons .follow span[data-title]') || ghost
                    ,actxn = subed.filter(cid => (cid === chnID)).length 
                                ? 'Unfollow' : 'Follow'

                follow.dataset.title = actxn
                follow.textContent = actxn
            }

        // Listen to auth-status events (changes)
        eb.sub(eTypes.Auth, doAuthStatusFX) 

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            // Idempotent per owner.date_update 
            if (state.update === data.owner.date_update) return false

            // Set avatar per first letter of owner's display name
            //avatar.src && (avatar.src = view.avatarMBF(data.owner.display)) 
            // avatar.src &&  data.owner.avatar 
            //     ? (avatar.src = `/sa/media/avatars/${data.owner.avatar}`) 
            //     : (avatar.src = view.avatarLatin(data.owner.display)) 
            // avatar.src = data.owner.avatar 
            //                 ? `/sa/media/avatars/${data.owner.avatar}`
            //                 : view.avatarMBF(data.owner.handle)

            avatar.src = data.owner.avatar 
                ? view.avatar(data.owner.avatar) 
                : view.avatarMBF(data.owner.handle)

            banner.src = view.banner(data.owner.banner) 

            // Show owner badges, if any, else hide element.
            badgesNode 
                && data.owner.badges 
                    ? o.toDOM(badgesNode, o.makeBadgeNodes(data.owner.badges).join(' '))
                    : badgesNode.classList.add('hide')

            // Show Followers/Following count(s) if any, else hide, per count.
            // subs[0] 
            //     && !(+(subs[0].dataset.followers)) && (subs[0].classList.add('hide'))
            // subs[1] 
            //     && !(+(subs[0].dataset.following)) && (subs[1].classList.add('hide'))

            // Show Followers count if any; one-way unhide.
            // data.owner.subing && (o.setText(subing, 
            //         data.owner.subing.toLocaleString('en-US')
            //     )
            // )

            // Set idempotence flag
            state.update = data.owner.date_update

            false && view.gc(data[cName], 'user_id') 
            return true
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : msgListMenu
;(function (o, undefined) {
    'use-strict'
 
    // Abort if @ app/Centre page; its #msg-list-menu handled at other view key. 
    if (o.css('#centre')) return 

   // @ init
    const 
        cName = 'msgListMenu'
        ,cSelector = `#msg-list-menu`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)
        ,ss = o.State().store

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        /*****************************************************************************
         * This clickable msg-list menu is static, 
         * so its event handler is attached and closed over upon init. 
         * All dynamics are handled per event therein; no per-data doings here. 
         * Events (message-render requests) are published for Actions handler,
         * which sets mode and such, and then publishes for State.
         *****************************************************************************/
        const 
            msgListMenu = o.css('#msg-list-menu')
            ,menu = o.cssAll('li', msgListMenu) 
            ,newest = 'Newest'
            ,oldest = 'Oldest'
            ,reqChron   = menu[0]
            ,reqThreads = menu[1]
            ,reqToggle  = menu[2]
            
            /******************************************************
             * 2nd throttler keeps menu disabled whilst msg-list 
             * of dynamic length (re)renders in declarative time.
             *****************************************************/
            ,tally = () => o.cssAll('#msg-list div.msg').length || 3
            ,toggleChron = (order) => {
                reqChron.dataset.disable   = 'true'
                reqThreads.dataset.disable = 'true'
               o.aDelay((300 + view.dtReplayRender*tally()), () => {
                    reqChron.textContent = order
                    reqChron.dataset.disable   = ''
                    reqThreads.dataset.disable = ''
                })
            }

            ,active = 'active'
            ,setActive = (x) => {
                if (x.nodeName !== 'LI') return
                ;[...menu].map(li => li.classList.remove(active))
                x.classList.add(active)
            }
            ,onClick = (e) => {
                (e.target.textContent === 'Chron') 
                    && (e.target.textContent = oldest)

                const want = e.target.textContent

                // Conditionally disable 2nd throttler; dynamic per messages count. 
                if (menu[0].dataset.disable === 'true') 
                    return

                setActive(e.target)

                /********************************
                 * Publish the menu-click event
                 *******************************/
                want && eb.pub(eTypes.MsgListMenu, {want: want})

                /**************************************************************
                 * Menu FX
                 *
                 * Menu state set (per dataset) to value of want IIF oldest, 
                 * newest or thread; here to isolate from other/future wants.
                 *************************************************************/

                 // If chron request, then toggle order; disable menu during.
                ;(want === newest)
                    && toggleChron(oldest)
                ;(want === oldest)
                    && toggleChron(newest)

                // If either chron requested, then set menu state, 
                // and disable threads count and toggler.
                ;((want === oldest) || (want === newest))
                    && ( (reqToggle.dataset.disable = 'true')
                        ,(reqThreads.dataset.count = '')
                        ,(msgListMenu.dataset.state = want)
                    )

                // If Threads requested, then set menu state
                // and reset chron and enable threads toggler.
                ;(want === 'Threads')
                    && ( (reqChron.textContent = 'Chron')      // INIT
                        ,(reqToggle.dataset.disable = '')
                        ,(msgListMenu.dataset.state = want)
                    )
            }
            /****************************************************
             * Init menu by synthesizing a click event
             * at menu item selected per config param.
             * Fires on first eTypes.Net message; once and off.
             ***************************************************/
            ,ev = new Event('click', {"bubbles": true, "cancelable": false})
            ,menuInit = (ebMsg) => {
                // Initialize menu per config param
                !!(view.cfgMsgs.menuActive === 'Threads')
                    ? reqThreads.dispatchEvent(ev)
                    : reqChron.dispatchEvent(ev)
                // Remove event listener
                eb.off(eTypes.View, menuInit)
            }

        /*******************
         * Listen/Publish 
         *****************/
        msgListMenu && msgListMenu.addEventListener('click', o.throttle(view.dtThrottle, onClick))

        menuInit()

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... self is the only publisher of this key; once, on init.

            return
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : centreListMenu
;(function (o, undefined) {
    'use-strict'

    return
    if (!o.css('#centre')) return 

    // @ init
    const 
        cName = 'centreListMenu'
        ,cSelector = `#msg-list-menu`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)
        ,ss = o.State().store

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        /*****************************************************************************
         * This clickable msg-list menu is static, 
         * so its event handler is attached and closed over upon init. 
         * All dynamics are handled per event therein; no per-data doings here. 
         * Events (message-render requests) are published for Actions handler,
         * which sets mode and such, and then publishes for State.
         *****************************************************************************/
        const 
            lTypeMenu = o.css('#msg-list-menu')

            ,menu = o.cssAll('LI', lTypeMenu) 
            ,newest = 'Newest'
            ,oldest = 'Oldest'
            ,reqChron   = menu[0]
            ,reqThreads = menu[1]
            ,reqToggle  = menu[2]
            
            /******************************************************
             * 2nd throttler keeps menu disabled whilst msg-list 
             * of dynamic length (re)renders in declarative time.
             *****************************************************/
            ,tally = () => o.cssAll('#msg-list div.msg').length || 3
            ,toggleChron = (order) => {
                reqChron.dataset.disable   = 'true'
                reqThreads.dataset.disable = 'true'
               o.aDelay((300 + view.dtReplayRender*tally()), () => {
                    reqChron.textContent = order
                    reqChron.dataset.disable   = ''
                    reqThreads.dataset.disable = ''
                })
            }

            ,active = 'active'
            ,setActive = (x) => {
                if (x.nodeName !== 'LI') return
                ;[...menu].map(li => li.classList.remove(active))
                x.classList.add(active)
            }
            ,onClick = (e) => {
                (e.target.textContent === 'Chron') 
                    && (e.target.textContent = oldest)

                const want = e.target.textContent

                // Conditionally disable 2nd throttler; dynamic per messages count. 
                if (menu[0].dataset.disable === 'true') 
                    return

                setActive(e.target)

                /********************************
                 * Publish the menu-click event
                 *******************************/
                want && eb.pub(eTypes.MsgListMenu, {want: want})

                /**************************************************************
                 * Menu FX
                 *
                 * Menu state set (per dataset) to value of want IIF oldest, 
                 * newest or thread; here to isolate from other/future wants.
                 *************************************************************/

                 // If chron request, then toggle order; disable menu during.
                ;(want === newest)
                    && toggleChron(oldest)
                ;(want === oldest)
                    && toggleChron(newest)

                // If either chron requested, then set menu state, 
                // and disable threads count and toggler.
                ;((want === oldest) || (want === newest))
                    && ( (reqToggle.dataset.disable = 'true')
                        ,(reqThreads.dataset.count = '')
                        ,(lTypeMenu.dataset.state = want)
                    )

                // If Threads requested, then set menu state
                // and reset chron and enable threads toggler.
                ;(want === 'Threads')
                    && ( (reqChron.textContent = 'Chron')      // INIT
                        ,(reqToggle.dataset.disable = '')
                        ,(lTypeMenu.dataset.state = want)
                    )
            }
            /****************************************************
             * Init menu by synthesizing a click event
             * at menu item selected per config param.
             * Fires on first eTypes.Net message; once and off.
             ***************************************************/
            ,ev = new Event('click', {"bubbles": true, "cancelable": false})
            ,menuInit = (ebMsg) => {
                // Initialize menu per config param
                !!(view.cfgMsgs.menuActive === 'Threads')
                    ? reqThreads.dispatchEvent(ev)
                    : reqChron.dispatchEvent(ev)
                // Remove event listener
                eb.off(eTypes.View, menuInit)
            }

        /*******************
         * Listen/Publish 
         *****************/
        lTypeMenu && lTypeMenu.addEventListener('click', o.throttle(view.dtThrottle, onClick))

        menuInit()

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... self is the only publisher of this key; once, on init.

            return
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 
