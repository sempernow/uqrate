/***********************************************
 * This file has 2 IIFEs 
 *  - "Add/Edit Channel" page (#channel-post)
 *  - "Get API Key" page (#apikey)
 **********************************************/

// #channel-post
;(function (o, undefined) {
    'use strict'
    /****************************************************************
     * Channel : Add/Edit
     ***************************************************************/
    const chnPost = o.css('#channel-post')
    
    if (!chnPost) return 

    const 
        cfg = o.cfg.view
        ,srcID = 'chns'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = ''//o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,ss = o.State().store
        ,dl = o.css('DL', chnPost)
        ,dt = o.css('DL DT', chnPost)
        ,action = o.css('A', dt)
        ,h2     = o.css('H2', dt)
        ,dd     = o.cssAll('DD', chnPost) // 0: form, 1: inform
        ,form   = o.css('FORM', chnPost)
        ,chn = {
            chn_id:     ''
            ,title:     o.css('#form-channel-title')
            ,slug:      o.css('#form-channel-slug')
            ,about:     o.css('#form-channel-about')
            ,rate:      o.css('#form-channel-rate')
            ,host_url:  o.css('#form-channel-host')
            ,tags:      o.css('#form-channel-tags')
            ,privacy:   o.cssAll('FIELDSET.privacy INPUT[type="radio"', chnPost)
        }
        ,chkValidityEls = ['title', 'slug', 'about', 'host_url', 'rate']
        ,rate = o.css('FIELDSET.rate', chnPost)
        ,submit = o.css('FORM INPUT[type="submit"]', chnPost)
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef

        ,state = {chn: {}, mode: '', invalid: true, chnID: ''}

        ,subjChnSlug = () => (state.mode === 'add') && (state.chn.slug || '...') 
                            || (state.mode === 'edit') && (chn.slug.value || '...') || '...'

        ,doToggleForm = (ev) => {
            ev.preventDefault()
            if (!ev.target.dataset.action) return
            ;[...dd].map(el => el.classList.toggle('hide'))

            if( !(ss.auth && ss.auth.sub) ) {
                o.purge(dd[0])
                o.toDOM(dd[0], `
                    <div id="guard-form">
                        <h3>
                            <a href="/app/login" class="button">
                                Requires Login
                            </a>
                        </h3>
                    </div>
                `)
                return
            }
            /**************************************************
             * Subscription Rate : Hide that input element 
             * lest channel has the min-required subscribers.
             *************************************************/
            ;(ss.auth.user.subed_recur.length < 100) && rate.classList.add('hide')

            h2.textContent = `@ /${ss.auth.user.handle}/${subjChnSlug()}`

            // Focus on first empty input
            const emptyNode = Object.keys(chn)
                .filter(node => ( ( (node !== 'chn_id') && (node!== 'privacy') ) && !chn[node].value) )
            emptyNode.length && chn[emptyNode[0]].focus()
        }
        ,doKeyup = (ev) => {
            const name = ev.target.name
            ;(chn.rate.value !== "") ? (chn.rate.required = true) : (chn.rate.required = false)

            if (name === 'rate') {
                ;(chn.rate.value !== "") && (chn.rate.value = +chn.rate.value)
            }
            if (name === 'title') {
                ;['|', '\\', '^', '*', '`' ]
                    .map((ch) => (chn.title.value = o.replaceAll(chn.title.value, ch, '')))
                chn.title.value = o.replaceAll(chn.title.value, '  ', ' ')
            }
            if (name === 'slug') {
                if (state.mode === 'edit') return 
                ;['|', '\\', '(',')', '[', ']', '{', '}', '\>', '\<', '/', '%', 
                    '^', '?', '@', '#', '$', '&', '*', ':', ';', '+', '=', '--', 
                    '!', '~', '`', ',', '"', '.', '\'\''
                    ].map((ch) => (chn.slug.value = o.replaceAll(chn.slug.value, ch, '')))
                chn.slug.value = o.replaceAll(chn.slug.value, ' ', '-')
                chn.slug.value = o.replaceAll(chn.slug.value, '--', '-')
                chn.slug.value = o.replaceAll(chn.slug.value, '__', '_')
            }
            if (name === 'tags') {
                ;['|', '\\', '(',')', '[', ']', '{', '}', '\>', '\<', '/', '%', 
                    '^', '?', '@', '#', '$', '&', '*', ':', ';', '+', '=', '-', 
                    '_', '!', '~', '`', ',,', '"', '.', '\'\''
                    ].map((ch) => (chn.tags.value = o.replaceAll(chn.tags.value, ch, '')))
                chn.tags.value = o.replaceAll(chn.tags.value, ' ', '')
            }
            // Update state 
            chn[name] && (state.chn[name] = chn[name].value)
            //h2.textContent = `@ /${ss.auth.user.handle}/${state.chn.slug ? state.chn.slug : '...'}`
            h2.textContent = `@ /${ss.auth.user.handle}/${subjChnSlug()}`
            chkValidity()
            resetSubmitButtonState()
        }
        ,chkValidity = () => {
            // (In)Validate the form; idempotent.
            const chk = (name) => 
                    chn[name].checkValidity() 
                        ? chn[name].classList.remove('invalid') 
                        : ( chn[name].classList.add('invalid')
                            ,(state.invalid = true)
                        )
            state.invalid = false
            chkValidityEls.map(chk)
        }
        ,resetSubmitButtonState = () => {
            // Enable/Disable + FX
            if (state.invalid) {
                submit.classList.add('disabled')
                submit.disabled = true
            } else {
                submit.classList.remove('disabled')
                submit.disabled = false
            }
        }
        ,httpStatus = (resp) => `${resp.meta.statusText} (${resp.meta.status})`
        ,reportFail = (resp) => `
            <div class="report">
                <h3>
                    Error : <code>${httpStatus(resp)} ${resp.body && (' : ' + resp.body.error)}</code>
                </h3>
            </div>
        `
        ,doSubmit = (ev) => {
            /****************************************
             * POST/PUT (Add/Edit) the channel obj.
             * ... DEPRICATED : Use upsert endpoint.
             * 
             * POST : Upsert the channel obj.
             ***************************************/
            ev.preventDefault()
            if (form.dataset.idempotent) return
            form.dataset.idempotent = o.rand()
            spinner(ev)
            const 
                method = 'POST'    //(state.mode === 'add') ? 'POST' : 'PUT'
                ,uri = '/c/upsert' //(state.mode === 'add') ? '/c' : '/c/' + state.chnID
                ,anchorGetKey = state.chn.host_url ? `
                        or <a href="/app/apikey" class="button">Get API Key</a>
                    ` : ``
                ,reportOkay = (msg) => `
                    <div class="report">
                        <h3>
                            <em>${msg}</em>
                            <a href="/app/account"class="button">See Account Page</a>
                            ${anchorGetKey}
                        </h3>
                    </div>
                `
                ,respHandler = (resp) => {
                    // Replace spinner with result report.
                    if (resp.meta && (+resp.meta.status < 299)) {
                        // @ Okay
                        logDeb('resp:', resp)
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportOkay('Success!'))

                    } else {
                        // @ Fail
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportFail(resp))

                        return Promise.reject({
                            why: `${method} : HTTP response code : ${resp.meta.status}`, 
                            what: {resp: resp},
                            where: 'respHandler(..)'
                        })
                    }
                }

            /***************************************
             * TODO : Allow/handle privacy settings
            ***************************************/
            // // Get the checked privacy setting
            // ;[...chn.privacy].map(el => {
            //     if (el.checked === true) {
            //         payload.privacy = +el.value
            //     }
            // })

            // If tag(s), then map CSV to array and clean it up.
            state.chn.tags && (
                (state.chn.tags = state.chn.tags.split(',')),
                (state.chn.tags = state.chn.tags.map(tag => tag.trim())),
                (state.chn.tags = state.chn.tags.filter(tag => tag))
            )
            const payload = {} 

            // Add keys to payload only if their state changed
            Object.keys(state.chn).map(key => (state.chn[key] && (payload[key] = state.chn[key])))
            // @ rate : string to integer
            ;(+state.chn.rate) && (payload.rate = +state.chn.rate) 
            
            // Abort and report on no change.
            if (!Object.keys(payload).length) {
                o.purge(dd[0])
                o.toDOM(dd[0], reportOkay('No changes.'))

                return 
            }
            payload.csrf = o.rand(22)
            ;(state.mode == 'edit') && (payload.chn_id = state.chnID)

            logDeb('doSubmit : payload:', payload)
            //return

            // Request upsert
            return auth.FetchAPI(method, uri, payload)
                    .then(respHandler)
                    .catch(logErr)
        }
        ,chnPrivacySet = (v) => [...chn.privacy].map((el) => 
                (+el.value === v) ? (el.checked = true) : (el.checked = false)
            )
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

            o.purge(dd[0])
            dd[0].append(spinner)
            spinner.append(selected)
            o.aDelay(500, () => spinner.classList.add('spin'))
        }
        ,mode = (action) => {
            switch (action) {
                case 'add':
                    state.mode = 'add'
                    h2.dataset.action = state.mode
                    h2.textContent = 'Add Channel'
                    break
                case 'edit':
                    state.mode = 'edit'
                    h2.dataset.action = state.mode
                    h2.textContent = `Edit Channel`
                    break
            }
        }

    // Set mode and such per URL hash (containing the ID of the channel to be edited).
    if (!window.location.hash) {
        mode('add')
    } else {
        /***********************************************
         * @ Edit mode, retrieve the target channel
         **********************************************/
        const 
            labels = {
                title: o.css('FORM FIELDSET.text LABEL[for="form-channel-title"]', chnPost)
                ,slug: o.css('FORM FIELDSET.text LABEL[for="form-channel-slug"]', chnPost)
                ,host: o.css('FORM FIELDSET.text LABEL[for="form-channel-host"]', chnPost)
            }
            ,hideFields = (strArr) => strArr.map(field => {
                chn[field].classList.add('hide')
                labels[field].classList.add('hide')
            })
            ,respHandler = (resp) => {
                
                // @ Fail
                if (!(resp.body && (resp.body.chn_id === state.chnID))) {
                    o.purge(dd[0])
                    o.toDOM(dd[0], reportFail(resp))

                    return Promise.reject({
                        why: 'Failed to retrieve channel.', 
                        what: {resp: resp},
                        where: 'respHandler(..)'
                    })
                }

                // @ Okay

                // Initialize form-input values
                chn.title.value     = resp.body.title
                chn.slug.value      = resp.body.slug
                chn.about.value     = resp.body.about
                chn.rate.value      = resp.body.sub_rate
                chn.host_url.value  = resp.body.host_url
                chn.tags.value      = resp.body.tags
                // TODO : Allow/handle privacy settings
                //chnPrivacySet(resp.body.privacy)

                // Hide the immutable slug input on edit
                hideFields(['slug'])

                // Hide other immutables if Timeline channels (pub, sub)
                ;((chn.slug.value === 'pub') || (chn.slug.value === 'sub')) && (
                    hideFields(['title', 'host'])
                )
                chkValidity()
                resetSubmitButtonState()
            }
        
        mode('edit')

        // Capture the target channel ID from the URL
        state.chnID = window.location.hash.substr(1)

        // Retrieve the target channel for editing
        auth.FetchAPI('GET', '/c/'+state.chnID)
                .then(respHandler)
                .catch(logErr)
    }

    // Toggle the form on click
    action.addEventListener('click', doToggleForm)

    // @ keyed form input
    form && form.addEventListener('keyup', o.throttle(100, doKeyup))

    // @ submit button
    form && form.addEventListener('submit', doSubmit)

    // Init the form button 
    submit.classList.add('disabled')
    chkValidity()
    resetSubmitButtonState()

})(window[__APP__] = window[__APP__] || {}) 

// #apikey
;(function (o, undefined) {
    'use strict'
    /****************************************************************
     * API Key : Get per user select of a hosted channel
     ***************************************************************/
    const section = o.css('#apikey')
    
    if (!section) return 

    const 
        cfg = o.cfg.view
        ,srcID = 'apikey'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = ''//o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,ss = o.State().store
        ,dl = o.css('DL', section)
        ,dt = o.css('DL DT', section)
        ,h2 = o.css('H2', dt)
        ,action = o.css('A', dt)
        ,dd = o.cssAll('DD', section) // 0: form, 1: inform
        ,form       = o.css('FORM', section)
        ,title      = o.css('FORM FIELDSET.channel H3')
        ,radioCtnr  = o.css('FORM FIELDSET.channel', section)
        ,submit     = o.css('FORM INPUT[type="submit"]', section)
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef

        ,state = {cid: '', channels: [], mode: '', invalid: true, resp: {}}

        ,chkValidity = () => o.aDelay(200, () => {
            [...state.channels].map(el => (
                (el.checked === true) 
                    && ((state.invalid = false),
                        (state.cid = el.dataset.cid),
                        (title.classList.add('alpha50'))
                    )
            ))
            resetSubmitButtonState()
        })
        ,resetSubmitButtonState = () => {
            // Enable/Disable + FX
            if (state.invalid) {
                submit.classList.add('disabled')
                submit.disabled = true
            } else {
                submit.classList.remove('disabled')
                submit.disabled = false
            }
        }
        ,httpStatus = (resp) => `${resp.meta.statusText} (${resp.meta.status})`
        ,reportFail = (resp) => `
            <div class="report">
                <h3>
                    Error : <code>${httpStatus(resp)} ${resp.body && (' : ' + resp.body.error)}</code>
                </h3>
                ${(+resp.meta.status === 403) && help()}

            </div>
        `
        ,help = () => `
            <p>
                 <b>Logout then login again</b> to update your newly-acquired role.
                 You will then be authorized to get an API key. Pardon the trouble.
            </p>
            `
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

            o.purge(dd[0])
            dd[0].append(spinner)
            spinner.append(selected)
            o.aDelay(500, () => spinner.classList.add('spin'))
        }
        ,getOwnedChns = (as) => {
            /********************************************************
             * Retrieve this auth-user's (owner's) channel records,
             * and insert the info into apropos DOM elements.
             ******************************************************/
            const 
                // Set uri per subject user's ID retrieved from auth-status.
                uri = as.sub ? `/cl/owned/${as.sub}` : ''
                ,radioInput = (chn) => `
                    <label for="c_${chn.IDx}">
                        <input 
                            type="radio" 
                            name="channel" 
                            data-cid="${chn.chn_id}" 
                            id="c_${chn.IDx}" 
                            value="${chn.IDx}">
                        <span>${chn.slug}</span>
                    </label>
                `
                ,respHandler = (resp) => {
                    logDeb('@ getOwnedChns(as) : respHandler(resp) : resp:', resp)

                    // @ Fail

                    if (!(resp.body && resp.body.list && resp.body.list.length) || (+resp.meta.status >= 400)) {

                        o.purge(dd[0])
                        o.toDOM(dd[0], reportFail(resp))

                        return Promise.reject({
                            why: 'Failed to retrieve channel.', 
                            what: {resp: resp},
                            where: 'respHandler(..)'
                        })
                    }

                    // @ Okay

                    // `/${as.user.handle}/${chn.slug}`
                    resp.body.list.map((chn) => (chn.slug !== 'pub' && chn.slug !== 'sub') 
                        && o.toDOM(radioCtnr, radioInput(chn))
                    )
                    state.channels = o.cssAll('FIELDSET.channel INPUT', section)
                }
            /*********************************************
             * Response body is of []channel.Channel{..}
             ********************************************/
            uri && auth.FetchAPI('GET', uri)
                    .then(respHandler)
                    .catch(logErr)
                //: logErr('@ getOwnedChns(as) : Auth status (as) :', as)
        }
        ,doToggleForm = (ev) => {
            ev.preventDefault()
            if (!ev.target.dataset.action) return
            ;[...dd].map(el => el.classList.toggle('hide'))

            if( !(ss.auth && ss.auth.sub) ) {
                o.purge(dd[0])
                o.toDOM(dd[0], `
                    <div id="guard-form">
                        <h3>
                            <a href="/app/login" class="button">
                                Requires Login
                            </a>
                        </h3>
                    </div>
                `)
                return
            }
        }
        ,doRadio = (ev) => chkValidity()
        ,doSubmit = (ev) => {
            /************************************************
             * PATCH : Channel's API Key
             * 
             * Body contains CSRF Double-submit cookie val.
             ***********************************************/
            ev.preventDefault()
            if (form.dataset.idempotent) return
            form.dataset.idempotent = o.rand()
            spinner(ev)
            const 
                method = 'PATCH'
                ,uri = `/c/key/${state.cid}`
                ,payload = {csrf: o.rand(22)} 
                ,fname = 'uqrate_key.json'
                ,reportOkay = (resp) => `
                    <div class="report success">
                        <h3>
                            <code>
                                <input type="text" id="apikey-got" value="${resp.body.key}">
                            </code>
                        </h3>
                        <h4 id="apikey-got-buttons">
                            <button data-action="copy" class="button copy">Copy key</button> 
                            <button data-action="download" class="button download">Download file</button> 
                        </h4>
                    </div>
                `
                ,respHandler = (resp) => {
                    logDeb('doSubmit() : resp:', resp)
                    // Replace spinner with result report.
                    if (resp.body && resp.meta && (resp.meta.status < 299)) {
                        // @ Okay
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportOkay(resp))
                        state.resp = resp
                        action.removeEventListener('click', doToggleForm)
                        o.purge(dt)
                        o.toDOM(dt, `<h2><em class="center alpha50">Store your SECRET key securely.</em></h2>`)
                        return true
                    } else {
                        // @ Fail
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportFail(resp))

                        return Promise.reject({
                            why: `${method} : HTTP response code : ${resp.meta.status}`, 
                            what: {resp: resp},
                            where: 'respHandler(..)'
                        })
                    }
                }
                ,doButtons = (ev) => { // Copy | Download
                    ev.preventDefault()
                     const input = o.id('apikey-got')

                    logDeb(ev.target, ev)

                    // @ Copy
                    ;(ev.target.dataset.action === 'copy')
                        && Promise.resolve(o.copyToClipboard(input))
                            .then(() => (ev.target.innerHTML = 'TEXT COPIED'))

                    // @ Download
                    if (ev.target.dataset.action === 'download') {
                        const 
                            arr = [JSON.stringify(state.resp.body)]
                            ,blob = new Blob(arr, {type : 'application/json'})
                            ,fname = `uqrate${
                                (state.resp.body.chn_slug) 
                                    ? ( '.' + state.resp.body.chn_slug )
                                    : ''
                            }.json`
                            ,a = document.createElement('a')
                            ,href = URL.createObjectURL(blob)

                        a.classList.add('hide')
                        a.setAttribute('download', fname)
                        a.href = href
                        a.setAttribute('target', '_blank')
                        Promise.resolve(a.click(),o.Delay(1000))
                            .then(() => URL.revokeObjectURL(href))
                            .then(() => (ev.target.innerHTML = 'JSON DOWNLOADED'))
                    }
                }
                ,keyHandler = () => {
                    const buttonBox = o.id('apikey-got-buttons')
                    return buttonBox.addEventListener('click', o.throttle(200, doButtons))
                }

            return auth.FetchAPI(method, uri, payload)
                        .then(respHandler)
                        .then(keyHandler)
                        .catch(logErr)
        }

    eb.sub(eTypes.Auth, o.throttle(200, getOwnedChns))

    // Toggle the form on click
    action.addEventListener('click', doToggleForm)

    // @ radio button/chkbox input
    form && form.addEventListener('click', o.throttle(200, doRadio))

    // @ submit button
    form && form.addEventListener('submit', doSubmit)

    // Init the form button 
    submit.classList.add('disabled')

    chkValidity()
    resetSubmitButtonState()

})(window[__APP__] = window[__APP__] || {}) 
