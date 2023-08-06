;(function(o, undefined){
    'use strict'
    //const form = o.css('#form-container')
    const form = o.css('FORM')
    
    if (!form) return 

    const cfg = o.cfg.view
        ,srcID = 'login'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,{  css
            ,purge
            ,toDOM
            ,arrSeq
            ,rand
            ,urlAOA
        } = o
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,auth = o.Auth()
        ,keyOA = o.cfg.auth.keyOA
        ,providers = o.cfg.auth.providers
        ,oaSvcRoot = o.cfg.view && o.cfg.view.oauthSvcRoot
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
        ,cookieGet = (k)    => o.Cookies.get(k)
        ,login = css('#login', form)
        ,reset = css('#reset', form)
        ,verify = css('#verify', form)
        ,resetRequest = css('H3 A[href="#reset"]', login)
        
        //,state = {invalid: true}
        ,state = {
            invalid: true, 
            mode: login, 
            applicant: {}
        }
        ,chkValidity = () => {
            !!(state.mode === login)
                && [username, password].map(el => el.checkValidity() 
                    ? ( el.classList.remove('invalid')
                    )
                    : ( el.classList.add('invalid')
                        ,(state.invalid = true)
                    )
                )
            !!(state.mode === reset) 
                && (email.checkValidity() 
                        ? ( email.classList.remove('invalid')
                        )
                        : ( email.classList.add('invalid')
                            ,(state.invalid = true)
                        )
                )
        }

        // DOM 
        ,main = css('MAIN')
        ,submit = css('input[type="submit"]', form)
        ,username = css('input[name=user]', form)
        ,password = css('input[name=pass]', form)
        ,email = css('input[name=email]', form)
        ,code = css('input[name=code]', form)

        // OAuth Providers
        ,oauth = css('#oauth')
        ,oaProvidersToDOM = (payload) => {
            /****************************************************
             * Repopulate the server-sent oauth component 
             * with providers declared per config, if any,
             * else return false.
             * 
             * Get titles per aFetch, but its declared order 
             * of providers is not preserved,
             * so use env declarations of config (provider).
             ***************************************************/
            if (!oauth) return false
            const 
                index = payload.body
                ,oaProvider = (name) => {
                    return `
                        <a href="${oaSvcRoot}/${name}">
                            <span title="${index.ProvidersMap[name]}">
                                <svg>
                                    <use href="#def-${name}"></use>
                                </svg>
                            </span>
                        </a>`
                }
                ,names = providers ? providers.split(',') : [] 
                //... index.Providers does not preserve order declared @ environment var.
                ,pBox = css('DIV', oauth)
                ,add = (name) => toDOM(pBox, oaProvider(name))

            purge(pBox)
            names.map(add)
            return !!(names.length)
        }
        ,oaProviders = () => o.aFetch(urlAOA('/o/')).then(oaProvidersToDOM)

        ,spinner = (ev = false) => {
            /*******************************************************
             * The spinner func animates the ev.target svg of 
             * an oauthProvider(..) node under the MAIN tag,
             * if exist, else it creates the app-logo equivalent.
             * Regardless, it purges MAIN of all other content.
            *******************************************************/
            const 
                logo = () => {
                    const 
                        span = o.create('SPAN')
                        ,svg = `
                            <svg>
                                <use href="${svgLogoDef}"></use>
                            </svg>`
    
                    o.toDOM(span, svg)
                    return span
                }
                ,selected = (ev.target && ev.target.closest('SPAN')) || logo()
                ,spinner = o.create('DIV')

            selected.classList.add('selected')
            spinner.classList.add('spinner')
            o.purge(main)
            main.append(spinner)
            spinner.append(selected)
            o.aDelay(500, () => spinner.classList.add('spin'))
        }
        ,successHandler = x => {
            purge(form) /* else prior-appended child persists */
            purge(main)
            main.append(form)
            toDOM(form, `<h1 class="report">Success! You are logged in.</h1>`)
            return x
        }//... now handled @ View.auth key
        ,publish = (as) => eb.pub(eTypes.Auth, as) 
        ,redirectDefault = o.cfg.auth.redirect || false
        ,redirect = (u, on = redirectDefault) => on && u.handle && (window.location.href = `/${u.handle}/pub`)
        ,loginFailHandler = (err) => { 
            if (!err.what) return logDeb(err)
            logErr(err)

            switch (err.what.sub && o.ttl(err.what.r.exp)) {
                case 0: // @ Auth expired (Refresh token expired)
                    //toDOM(form, `<h1 class="report">Authentication expired.</h1>`)
                    break
                default:
                    purge(form) /* else prior-appended child persists */
                    purge(main)
                    main.append(form)
                    toDOM(form, `<h1 class="report">Authentication failed.</h1>`)
                    break
            }
            eb.pub(eTypes.Net, {
                data: { http: {
                        method: err.what.method, 
                        status: err.what.status, 
                        statusText: err.what.statusText 
                    }
                },
                mode: o.aModes.promise
            })
        }

        // Form/action handler

        ,doSubmit = (ev) => {
            //logFocus('@ doSubmit', state)
            ev.preventDefault()

            switch (state.mode) {

                case login:
                    const 
                        user = username.value
                        ,pass = password.value
        
                    spinner(ev)

                    /*************************************************************
                     * The AJAX login, auth.Basic(..), handles authentication 
                     * and subsequent storage of the Access/Refresh tokens pair.
                     * Since the server response includes that (JSON) payload,
                     * the client must perform any (this) subsequent redirect;
                     * here, to the authenticated user's pub channel
                     * (after retrieving the owner's record).
                     ************************************************************/
                    auth.Basic(user, pass)
                        .then(publish)
                        .then(auth.SubRecordGet)
                        .then(redirect)
                        .catch(loginFailHandler)

                    break

                case verify:

                    state.applicant.email = email.value 

                    // Prep for final mode
                    submit.value = 'Reset Password'
                    code.required = true
                    login.innerHTML = '' 
                    //... else FORM is forever invalid due to `required` input
                    state.mode = verify

                    const 
                        bypass = true
                        ,nextStepToggle = () => 
                            [form, verify, reset]
                                    .map((el) => el.classList.toggle('hide')) 
                                && chkValidity()

                    //spinner(ev)
                    
                    //... else FORM is forever invalid due to `required` input

                    !bypass && auth.Apply('reset', {
                            email: state.applicant.email
                            ,csrf: rand(22)
                        })
                        .then(() => o.aDelay(500, nextStepToggle))
                        .catch(logErr)

                    bypass && nextStepToggle()

                    break

                case reset:

                    break
            }


            // // Overwrite form values 
            // css('input[name=user]', form).value = lolz()
            // css('input[name=pass]', form).value = lolz()
            // // Replace form with notification.
            // purge(form)
            // toDOM(form, `<h1 class="report">Your request was sent!</h1>`)
        }
        ,doVerify = (ev) => {
            state.mode = verify
            ;[login, reset].map(el => el.classList.add('hide'))
            verify.classList.remove('hide')
            submit.value = 'Verify'
            login.innerHTML = '' //... else FORM is forever invalid (per HTML/Web API)
            email.required = true
        }
        ,doVerifyMode = (ev) => {
            ev.preventDefault()
            const 
                user = css('input[name=user]', form).value

            state.mode = verify

            if (username.checkValidity()) {
                login.classList.add('hide')
                reset.classList.remove('hide')
            }

        }
        ,doKeyup = (ev) => {
            // @ Handle
            //username.value = [...username.value].map(x => o.isAlphaNum(x) ? x : '').join('')
            // @ Handle or Email
            username.value = o.replaceAll(username.value, ' ', '')

            state.invalid = false
            chkValidity()
    
            ;(state.invalid)
                ? ( submit.classList.add('disabled')
                    ,(submit.disabled = true)
                )
                : ( submit.classList.remove('disabled')
                    ,(submit.disabled = false)
                )
        }
        // OAuth-provider selection handler
        ,doOAuth = (ev) => {
            /*********************************************
             * Synchronously; NOT per AJAX. 
             * Final server response is a cookie (keyOA) 
             * containing the tokens object (JSON), 
             * {
             *      "a": "<aTKN>", 
             *      "r": "<rTKN>", 
             *      "mode": "OBA", 
             *      "provider": "<PROVIDER>"
             * },
             * serialized per base64url encoding,
             * which is handled by auth.CheckOAuth()
             **********************************************/
            //ev.preventDefault()
            //logFocus(ev.target)
            const
                target = ev.target && ev.target.closest('A')
                ,url = target && target.href
                //,cookieSet = (k, v, days) => o.Cookies.set(k, v, days = 1)

            if (!url) return 
            logDeb('@ doOAuth(ev) :', url)
            spinner(ev)

            // DEV : asynchronous OAuth
            false && auth.OAuth(url)
                .then(publish)
                .then(auth.SubRecordGet)
                .then(redirect)
                //.then(successHandler)
                .catch(failHandler)
            
            return 
        }

    // // Listen/Manage :: Login-form state; idempotent per key entry.
    form && form.addEventListener('keyup', o.throttle(100, doKeyup))

    // Listen/Manage :: Login form submittal event
    form && form.addEventListener('submit', doSubmit)

    // Moved to /app/reset
    //resetRequest && resetRequest.addEventListener('click', doVerify)

    // Listen/Manage :: OAuth-provider selection event (if any providers)
    oaProviders().then(got => got
        ? oauth.addEventListener('click', doOAuth) 
        : purge(oauth)
    ).catch(logErr)

    // Init
    if (cookieGet(keyOA)) spinner()
    submit.classList.add('disabled')
    form && o.aDelay(200, chkValidity)
    login.classList.remove('hide')
    verify.classList.add('hide')
    reset.classList.add('hide')

    const a = cookieGet('_na'), b = cookieGet('_nb')
    logDeb('nonce a|b :',a && a.substring(0, 5), '|', b && b.substring(0, 5))

    /**************************************************************
     * Check for oauth cookie. 
     * Its existence implies successful OAuth completion.
     * Whence we publish the event, retrieve the user's record,
     * and then redirect to their home page; 
     * all if app authentication validates, else reject.
     ************************************************************/
    auth.CheckOAuth()
        .then(as => {
            if (as.sub && as.r && o.ttl(as.r.exp)) {
                purge(form) /* else prior-appended child persists */
                purge(main)
                main.append(form)
                toDOM(form, `<h1 class="report">Success! You are logged in.</h1>`)
                return as
            } else {
                //auth.Purge()
                //return 
                return Promise.reject({
                    why: 'Authentication fails to validate.', 
                    what: as,
                    where: 'form-login : auth.CheckOAuth()'
                })
            }
        })
        //.then(successHandler)
        .then(publish)
        .then(auth.SubRecordGet)
        .then(redirect)
        .catch(loginFailHandler)

    ;(()=>{// DEV/TEST :: Mock user input
        if (css('H1', form)) return
        const 
            user = ''
            ,pass = ``

        // @ TEST/DEV :: Mock user input
        css('input[name=user]', form).value = user
        css('input[name=pass]', form).value = pass
    })//()

})( window[__APP__] = window[__APP__] || {} )
