;(function (o, undefined) {
    'use-strict'
    /**************************************************************************
     * Add to Home Screen (Button) for PWAs : 87% (CanIUse.com)
     * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen 
     * Install CRITERIA     : https://web.dev/install-criteria/
     * manifest.webmanifest : https://www.w3.org/TR/appmanifest/#typical-structure
     * 
     * Service worker fetch-event listener/handler is used by browser vendors 
     * to validate PWA functionality. If such is missing or faux (caching nothing),
     * then browsers may prevent this pop-up button from functioning.
     *************************************************************************/
    const srcID = 'A2HS'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus = o.log(srcID, o.log.levels.FOCUS)
        ,debugOFF = o.log.debugOFF
        //,eb = o.EB()
        //,eTypes = eb.eTypes()
        ,css = o.css    
        //,header = css('header')
        ,button = css('#a2hs')
        //,pwaPrompt = 'beforeinstallprompt'
        ,state = {defer: undefined}
        //,peek = true // true @ TEST (preview)

    if (!button) return

    // Append/declare aBtn at header
    //o.toDOM(header, `<button class="a2hs">Install : Add to home screen</button>`)
    //header.innerHTML = `<button class="a2hs">Install : Add to home screen?</button>`
    //const aBtn = css('.a2hs')
    //!peek && (button.style.display = 'none')

    //logFocus('@ loaded')
    window.addEventListener('beforeinstallprompt', (ev) => {
        ev.preventDefault()
        state.defer = ev
        //button.style.display = 'block'
        button.classList.remove('hide')
        logFocus('@ beforeinstallprompt :', ev)

        button.addEventListener('click', (ev) => {
            logFocus('@ click :', ev)
            //button.style.display = 'none'
            button.classList.add('hide')
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

})( window[__APP__] = window[__APP__] || {} )
