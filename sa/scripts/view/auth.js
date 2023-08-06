// View : auth
;(function (o, undefined) {
    'use-strict'
    /***********************************************************
     * Process per auth status
     * 
     * Yet here relying on data key, not auth-status object, 
     * unlike all others. Why? Is this as reliable?
     * Always has auth.user ???
     **********************************************************/
    const 
        cName = 'auth'
        ,cSelector = `#view header section.action`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 

        // @ init
        const
            actionNode = cNode
            ,actionNodeLogout = o.css('#view HEADER SECTION.menu UL LI A[href="/app/logout"]') 
            ,actionLogoutPerAuth = (is) => is 
                ? actionNodeLogout.style.display = 'block' 
                : actionNodeLogout.style.display = 'none'

            ,home =  o.css('#view HEADER SECTION.nav UL LI A[href="#home"]')
            
            ,menu =  o.css('#view HEADER SECTION.menu UL')
            ,start = o.css('#view HEADER SECTION.menu UL LI A[href="/app/start"]')
            ,menuIsDisplayed = menu && (menu.style.display !== 'none')

            ,atLogin = '/app/login'
            ,atLogout = '/app/logout'
            ,atLogoutRedirect = '/app/centre'
            ,atSignup = '/app/signup'
            
            ,actionLoginSignup = `<span><a href="${atLogin}">Login</a>|<a href="${atSignup}">Signup</a></span>`
            ,actionLogout = `<span><a href="${atLogout}">Logout</a>`

            ,onClick = (ev) => {
                /**********************************************************************
                 * Events that warrant a purge of auth credentials are handled hereby.
                 * Prior to satisfying the click request, the auth store is purged 
                 * and the AOA service is called per async request 
                 * to EXPIRE the auth-reference and nonce COOKIES.
                 *********************************************************************/
                ev.preventDefault()
                const target = ev.target.pathname 

                // Redirect @ Logout
                ;(target === atLogout)
                    && ( auth.Purge().then(() => (o.aDelay(100, 
                        () => window.location.href = atLogoutRedirect
                    ))))

                // Redirect @ Login/Signup
                ;((target === atLogin) || (target === atSignup))
                    && ( auth.Purge().then(() => (o.aDelay(100, 
                        () => window.location.href = target
                    ))))
            }

        /*************
         * Listeners
         ***********/

        actionNode && actionNode
            .addEventListener('click', o.throttle(555, onClick))

        actionNodeLogout && actionNodeLogout
            .addEventListener('click', o.throttle(555, onClick))

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            if (!data.auth.a || !data.auth.r) return false
            if (!data.auth.user) return false

            const 
                authenticated = !!o.ttl(data.auth.r.exp)
                ,authorized   = !!o.ttl(data.auth.a.exp)

            /*******************************************************************************
             * - Show Home anchor and set its href per auth-user.
             * - Set apropos Login/Signup or Logout, per auth state, 
             *   at either menu or action node, per viewport width.
             *      - Login/Signup displays at action node regardless of viewport width.
             *      - Logout displays at menu node if slim (dropdown), else at action node.
             * 
             * Logout button FAIL @ edge-case: 
             *      If auth'ed @ slim viewport and then change to wide, 
             *      sans page reload, then Logout action is lost until page reload.
             ******************************************************************************/
            ;(authenticated || authorized)
                ? ( o.purge(actionNode)
                    ,(menuIsDisplayed && o.toDOM(actionNode, actionLogout))
                    ,home.classList.remove('hide')
                    ,(home.href = `/${data.auth.user.handle}/pub`)
                    ,start.classList.add('hide')
                )
                : ( o.purge(actionNode)
                    ,actionLogoutPerAuth(false)
                    ,o.toDOM(actionNode, actionLoginSignup) 
                )

            // If not authenticated, then purge auth store and request logout service. 
            !!authenticated || auth.Purge()
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 
