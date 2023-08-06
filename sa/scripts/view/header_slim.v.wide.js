;(function(o, undefined){
    'use strict'
    // =======================
    // @ View.Header Component
    // =======================
    const 
        ghost = o.create('GHOST')
        ,header = o.css('header .site') || ghost

    if (!header) return

    const srcID = 'header'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,cfg = o.cfg.view.header
        ,{ throttle
            ,id
            ,tags
            ,css
            ,cssAll
        } = o
        ,logoResizeTrigger = parseInt(cfg.logoResizeTrigger, 10)
        ,emit = {
            onScroll: (msg) => {eb.pub(eTypes.scroll, msg); return srcID}
        }
        //,ghost = create('GHOST')

        // @ Chn Menu
        ,chnMenu = o.css('#channel-header .menu')
        ,chnMenuList = css('#channel-header .menu UL')
        ,chnMenuButtons = chnMenuList ? {
            one: css('LI A[href="#1"]', chnMenuList),
            two: css('LI A[href="#2"]', chnMenuList),
            three: css('LI A[href="#3"]', chnMenuList),
        } : null
        ,doPageButtons = (ev) => {
            const ss = o.State().store
            if (ss.owner && ss.channel) {
                if (chnMenuButtons) {
                    switch (true) {
                        // @ pub/sub : set href per owner.handle; set .active FX
                        case (ss.channel.slug === 'pub') || (ss.channel.slug === 'sub') :
                            chnMenuButtons.one.href = `/${ss.owner.handle}/pub`
                            chnMenuButtons.two.href = `/${ss.owner.handle}/sub`
                            ;(ss.channel.slug === 'pub')
                                ? chnMenuButtons.one.classList.add(active)
                                : chnMenuButtons.two.classList.add(active)
                            break

                        // Hide page menu on all member-owned channels except pub and sub
                        case (ss.owner.handle !== 'app')
                                && (ss.channel.slug !== 'pub')
                                && (ss.channel.slug !== 'sub'):
                            chnMenuList.classList.add('hide')
                            break
                    }
                }
            }
            
        }

        // @ Site Menu

        ,hideIfWide = ['install', 'apikey', 'groups', 'terms', 'privacy']
        
        ,siteMenuButton = css('.site .menu BUTTON', header) || ghost
        ,logo = css('.logo svg', header) || ghost
        ,open = css('svg.menu-open', header) || ghost
        ,close = css('svg.menu-close', header) || ghost
        ,siteMenu = css('.menu UL', header) || ghost
        ,siteMenuItems = cssAll('LI', siteMenu)
        ,hideLIs = [...siteMenuItems].filter(li => 
            hideIfWide.includes( li.lastChild.href.split('/').pop().split('#').pop() )
        )
        ,logoutMenu = css('.menu LI A[href="/app/logout"]', header) || ghost
        ,over = id('overlay-1') || ghost
        ,channel = css('#channel') || ghost
        ,slug = channel && channel.dataset.slug
        ,width = `(max-width: ${cfg.maxWidth})`
        ,mq = window.matchMedia(width)
        ,blur = 'blur'
        ,rotate = 'rotate'
        ,active = 'active'
        ,show = 'block'
        ,hide = 'none'
        ,big = 'big'
        ,small = 'small'
        ,dt = 40
        ,state = {
            size: '',
            active: ''
        }

        // @ Start page

        ,appPage = css('#app')
        ,ifStartPage = () => {
            return
            // logo.classList.add(small),
            // state.size = small
        }

    function initSlim() {
        const logoutAction = css('.action SPAN A[href="/app/logout"]', header) || ghost
        //... inserted/removed @ view.auth per state.
        siteMenu.style.display = hide 
        logoutMenu.style.display = show 
        logoutAction.style.display = hide
        open.style.display = show 
        close.style.display = hide 
        close.classList.remove(rotate)
        over.style.display = hide 
        appPage && ifStartPage()
        ;[...hideLIs].map(li => (li.style.display = show))

        return true
    }
    function initWide() {
        //const logoutAction = css('header .site .action span a[href="/app/logout"]') || ghost
        //logoutAction.style.display = show 
        //... inserted/removed @ view.auth per state; user must reload page to get Logout.
        siteMenu.style.display = 'flex'  
        logoutMenu.style.display = hide
        open.style.display = hide  
        close.style.display = hide 
        over.style.display = hide 
        channel.classList.remove(blur)
        appPage && ifStartPage()
        ;[...hideLIs].map(li => (li.style.display = hide))

        return true
    }
    function _open() {
        siteMenu.style.display = show  
        open.style.display = hide  
        close.style.display = show 
        close.classList.add(rotate)
        over.style.display = show 
        channel.classList.add(blur)

        return true
    }
    function _close() {
        siteMenu.style.display = hide   
        open.style.display = show   
        close.style.display = hide 
        over.style.display = hide
        channel.classList.remove(blur)

        return true
    }   
    function onMQEvent(e) {
       !!(mq.matches) ? initSlim() : initWide()
    }//... Re-init on window-size change.  
    // E.g., if window is slim and menu is open, 
    // then menu and FX are removed if window changes to wide.

    function logoResizeFx(msg) {
        //if (appPage) return

        const y = window.scrollY
        if (y > 250 && state.size === small) return

        !!state.size || (state.size = big)

        !!(state.size === small && y < logoResizeTrigger) && (
            chnMenu && logo.classList.remove(small),
            state.size = big
        )
        !!(state.size === big && y >= logoResizeTrigger) && (
            logo.classList.add(small),
            state.size = small
        )
    }

    function getActive(menu) {
        // Set active site-menu el per URL hash, else path, else channel.dataset.slug
        const url = location.hash[1] || location.pathname.replace(/^.*[\\\/]/, '')
        ;[...tags('A', menu)].filter((el,i) => { 
            var a = el.href.replace(/^.*[\\\/]/, '')
            if (a === url) state.active = tags('A', menu)[i]
            if (el.hash[1] === url) state.active = tags('A', menu)[i]
        })
        state.active || (state.active = css(`A[href="/app/${channel.dataset.slug}"]`, siteMenu))
        return state.active ? true : false
    }
    function setActive(a, menu) {
        ;[...tags('A', menu)].map(a => a.classList.remove(active))
        a.classList.add(active)
    }

    /********
     * Init
     *******/

    ;(() => {
        getActive(siteMenu)
        !!(state.active) || ( state.active = tags('A', siteMenu)[0] )
        !!(state.active) && state.active.classList.add(active)
        !!(mq.matches) ? initSlim() : initWide()
    })()

    /**********
     * Listen
     *********/

    eb.sub(eTypes.State, doPageButtons)

    // @ nav menu (mouse)
    open.addEventListener('click', _open)
    close.addEventListener('click', _close)
    over.addEventListener('click', _close)

    siteMenu && siteMenu.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActive(e.target, siteMenu)
    })
    chnMenuList && chnMenuList.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActive(e.target, chnMenuList)
    })

    // @ nav menu (keyboard)
    siteMenu.addEventListener('keydown', (e) => {
        !!(e.key === 'Escape') && (
            !!(close.style.display === show) && _close()
        )
    })
    siteMenuButton.addEventListener('keydown', (e) => {
        !!(e.key === 'Enter') && (
            !!(open.style.display === show) 
                ? _open()
                : _close()
        )
    })
    // @ window-size change
    //mq.addListener(onMQEvent) //... DEPRICATED 2021-03-05
    mq.addEventListener('change', onMQEvent) // FIX? YES. 2021-03-05
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/onchange 

    // @ scroll vertical
    //window.addEventListener(eTypes.scroll, throttle(dt, emit.subScroll))
    //eb.sub(eTypes.scroll, logoResizeFx)
    window.addEventListener('scroll', throttle(dt, logoResizeFx))

    chnMenu || logo.classList.add(small)

    //logFocus(hideLIs,[...siteMenuItems].map(el => el.lastChild.href.split('/').pop().split('#').pop()))

})( window[__APP__] = window[__APP__] || {} )

