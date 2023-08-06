;(function(o, undefined){
    'use strict'

    // =======================
    // @ View.Header Component
    // =======================
    const 
        ghost = o.create('GHOST')
        ,header = o.css('header .site') // || ghost

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

        // @ Chn Menu
        ,chnMenu = o.css('#channel-header .menu')
        ,chnMenuList = css('#channel-header .menu UL')
        ,chnMenuTabs = chnMenuList ? {
            one: css('LI A[href="#1"]', chnMenuList),
            two: css('LI A[href="#2"]', chnMenuList),
            three: css('LI A[href="#3"]', chnMenuList),
        } : null

        ,doChnMenuTabs = (ev) => {
            const ss = o.State().store
            if (ss.owner && ss.channel) {
                if (chnMenuTabs) {
                    switch (true) {
                        // @ pub/sub : set href per owner.handle; set .active FX
                        case (ss.channel.slug === 'pub') || (ss.channel.slug === 'sub') :
                            chnMenuTabs.one.href = `/${ss.owner.handle}/pub`
                            chnMenuTabs.two.href = `/${ss.owner.handle}/sub`
                            ;(ss.channel.slug === 'pub')
                                ? chnMenuTabs.one.classList.add(active)
                                : chnMenuTabs.two.classList.add(active)
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
        ,siteMenuButton = css('.site .menu BUTTON', header) || ghost
        ,logo = css('.logo svg', header) || ghost
        ,open = css('svg.menu-open', header) || ghost
        ,close = css('svg.menu-close', header) || ghost

        ,siteMenu = css('.menu UL', header) || ghost
        ,siteNav = css('.nav UL', header) || ghost

        ,siteMenuItems = cssAll('LI', siteMenu)
        ,siteNavItems = cssAll('LI', siteNav)

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
            activeMenu: tags('A', siteMenu)[0],
            activeNav: tags('A', siteNav)[0]
        }

        ,menuOpen = () => {
            siteMenu.style.display = show 
            open.style.display = hide 
            close.style.display = show 
            close.classList.add(rotate)
            over.style.display = show 
            channel.classList.add(blur)
        }
        ,menuClose = () => {
            siteMenu.style.display = hide 
            open.style.display = show 
            close.style.display = hide 
            over.style.display = hide
            channel.classList.remove(blur)
        }   

        ,getActive = (list) => {
            // Get/Set state : active nav-bar anchor
            const 
                url = location.hash[1] || location.pathname.replace(/^.*[\\\/]/, '')
                ,aSlug = `A[href="/app/${channel.dataset.slug}"]`

            // Set per Dataset API (channel.dataset.slug) else per 1st anchor @ list
            state.activeMenu = css(aSlug, siteMenu) || tags('A', siteMenu)[0]
            state.activeNav  = css(aSlug, siteNav)  || tags('A', siteNav)[0]
            
            // Set per url matching anchor slug or hash
            ;[...tags('A', list)].filter((el,i) => { 
                var slug = el.href.replace(/^.*[\\\/]/, '')
                if (slug === url) {
                    state.activeMenu = tags('A', list)[i]
                }
                if (el.hash[1] === url) {
                    state.activeMenu = tags('A', list)[i]
                }
            })
        }
        ,setActiveFX = (el, list) => {
            // Set active nav-bar anchor FX
            [...tags('A', list)].map(a => a.classList.remove(active))
            el.classList.add(active)
        }

        ,logoResizeFx = (msg) => {
            const y = window.scrollY
            if (y > 250 && state.size === small) 
                return

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

    /********
     * Init
     *******/

    ;(() => {
        getActive(siteMenu)
        state.activeMenu.classList.add(active)
        state.activeNav.classList.add(active)
    })()

    // Allow large logo only if page header has a channel menu
    chnMenu || logo.classList.add(small)

    /**********
     * Listen
     *********/

    eb.sub(eTypes.State, doChnMenuTabs)

    // @ Site menu button
    open.addEventListener('click', menuOpen)
    close.addEventListener('click', menuClose)
    over.addEventListener('click', menuClose)

    // @ Site menu
    siteMenu.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActiveFX(e.target, siteMenu)
    })
    siteMenu.addEventListener('keydown', (e) => {
        !!(e.key === 'Escape') && (
            !!(close.style.display === show) && menuClose()
        )
    })
    siteMenuButton.addEventListener('keydown', (e) => {
        !!(e.key === 'Enter') && (
            !!(open.style.display === show) 
                ? menuOpen()
                : menuClose()
        )
    })

    // @ Site nav bar
    siteNav.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActiveFX(e.target, siteNav)
    })

    // @ Channel nav bar 
    chnMenuList && chnMenuList.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActiveFX(e.target, chnMenuList)
    })

    // @ Scroll vertical
    window.addEventListener('scroll', throttle(dt, logoResizeFx))

})( window[__APP__] = window[__APP__] || {} )

