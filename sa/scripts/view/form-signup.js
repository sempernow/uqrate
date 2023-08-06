;(function(o, undefined){
    'use strict'
    const formCtnr = o.css('#form-container')
    
    if (!formCtnr) return 
    /*********************************************************************
     * Nominally a two-step signup : apply, verify (per fieldset)
     * 
     * @ Step 1: applicant submits form, yet POST request includes
     * only the applicant info requiring validation (email, handle).
     * If handle validates, then AOA service stores applicant info 
     * and associated verification code (nonce) locally (state), 
     * and concurrently emails that code to applicant.
     * 
     * @ Step 2: applicant enters their email-retrieved code 
     * into a newly created form input field. 
     * That code is added to state.applicant object and POSTed.
     * If code validates at AOA service, then a member record is 
     * created from applicant data, lest claim mode, whence updated.
     * 
     * VIP signup is a three-step process: claim, apply, verify
     * 
     * @ Step 0: applicant claims an existing account; @ claim mode only. 
     * This first form (fieldset) has only one input; a VIP key. 
     * The existing account is retrieved (per key match) by AOA service. 
     * That response body is used to populate certain fieldset 
     * inputs of Step 1. From there, the nominal process ensues.
     * 
     *********************************************************************
     * Reset mode has its own URI, page (html) & script (form-reset.js).
     ********************************************************************/
    const cfg = o.cfg.view
        ,srcID = 'signup'
        ,log        = o.log(srcID)
        ,logDeb     = o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF   = ''//o.log.debugOFF // ''
        ,logFocus   = o.log(srcID, o.log.levels.FOCUS)
        ,logErr     = o.log(srcID, o.log.levels.ERROR)
        ,{  rand
            ,css
            ,purge
            ,toDOM
            ,aFetch
            ,dedup
            ,arrSeq
            ,urlAOA
        } = o
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,auth = o.Auth()
        // Signup modes of AOA service.
        ,sModes = {claim: 0, signup: 1, reset: 2} 
        // FORM params
        ,main = css('main')
        ,title = css('h1', formCtnr)
        ,spinnerCtnr = o.create('div')
        // FORM INPUTs
        ,claim      = css('input[name=claim]', formCtnr)
        ,display    = css('input[name=display]', formCtnr)
        ,handle     = css('input[name=handle]', formCtnr)
        ,email      = css('input[name=email]', formCtnr)
        ,pass       = css('input[name=pass]', formCtnr)
        ,confirm    = css('input[name=confirm]', formCtnr)
        ,code       = css('input[name=code]', formCtnr)
        // FORM ...
        ,submit = css('input[type="submit"]', formCtnr)
        ,handleLabel = css('label[for=form-signup-handle]', formCtnr)
        ,available = css('output[name=available]', formCtnr)
        ,codeResendReq = css('h3 a[href="#resend"]', formCtnr)
        // FORM FIELDSETs (steps)
        ,step0 = css('#step-0', formCtnr) // claim (@ vip mode only)
        ,step1 = css('#step-1', formCtnr) // apply
        ,step2 = css('#step-2', formCtnr) // verify
        // FORM INPUT constraints
        /***************************************************************
         * Workaround for attribute bugs (min, minlength, ...) whereof, 
         * if JS modifies the input, then input validates regardless.
         * See chkValidity() .
         **************************************************************/
        ,minLenEls = [claim, display]
        ,minLength = (acc, el) => ((acc[el.name] = {min: +(el.min || el.minLength)}), acc)
        ,validity  = minLenEls.reduce(minLength, {})
        // Params (earlier work) for validateHandle()
        ,minHandle = handle && handle.dataset.min
        ,maxHandle = handle && handle.dataset.max
        /********************************************************
         * state : contains the form's state per mode and step.
         *******************************************************/
        ,state = {
            mode: sModes[formCtnr.dataset.mode], // claim (1), signup (2). 
            step:           1,      // Active FIELDSET; claim (1), signup (2), verify (3).
            failedHandles:  [],     // List of handles that failed AOA-service validation.
            goodHandles:    [],     // List of handles that passed AOA-service validation.
            invalid:        true,   // Validity of active FIELDSET per state (mode and step).
            handled:        false,  // Flag the initial user edit of handle INPUT.
            applicant:      {},     // Accrued INPUT per active FIELDSET (per step); feeds request body(s).
            uid:            '',     // Claim mode only; presence (User.ID) flags mode @ AOA service (step 3).
            handle:         '',     // Claim mode only; set once (static) to claim an existing user account.
        }

        // ==================
        // Form validation
        // ==================

        ,passConfirmed = () => (state.step === 1) ? (pass.value === confirm.value) : true
        ,validateHandle = () => {
            /*******************************************************************
             * validateHandle() is called per keyup at step 1 of signup mode
             * to assure handle (username) is available before form submittal. 
             * Hits the apropos AOA-service endpoint per call, 
             * but mitigates redundant or otherwise useless fetches.
             * Informs user of form status by input-label FX per call.
             *****************************************************************/
            if (state.mode !== sModes.signup) return
            if (state.step !== 1) return 

            const 
                /**************************************
                 * Declare params of aFetch(..) here 
                 * for additional use beforehand @ FX
                 * to assure no discrepancies.
                 *************************************/
                jForm = {
                    display: display.value
                    ,handle: handle.value
                }
                ,hdrs = new Headers({
                    //'Content-Type': 'application/json'
                })//... Unsafe CORS
                ,params = {
                    method: 'POST'
                    ,headers: hdrs
                    ,body: JSON.stringify(jForm)
                }
                ,url = urlAOA('/a/ahandle')
                ,req = new Request(url, params)
                ,rspHandle = rsp => (rsp.meta && (rsp.meta.status === 200)) 
                                        ? rsp.body : Promise.reject(rsp.meta)

                ,eb = o.EB()
                ,eTypes = eb.eTypes()

                // @ Handle FX 
                ,short = '9.5em'
                ,shortText = `Handle is too short.`
                ,long  = '9.3em'
                ,longText = `Handle is too long.`
                ,avail = '10.5em'
                ,availText = `Handle is available! ✔`
                ,not   = '11em'
                ,notAvailText = `Handle is not available.`
                ,notAllowText = `Handle is not allowed.`
                ,bare  = '3.8em'
                ,bareText = `Handle`

                // '✓', // 'CHECK MARK' (U+2713) | Success = "\u2713"
                // '✗', // 'BALLOT X' (U+2717) | Failure = "\u2717"

                // '✔', // HEAVY CHECK MARK (U+2714)
                // '✘', // HEAVY BALLOT X (U+2718)

            state.invalid = true
            /*************************************************
             * Prevent redundant handle-validation fetches,
             * yet keep applicant informed of handle status.
             ************************************************/
            if (jForm.handle.length < minHandle) {
                (jForm.handle.length > 0) 
                    && ((handleLabel.style.width = short)
                        ,o.setText(handleLabel, shortText)
                    )
                return
            }
            if (jForm.handle.length > maxHandle) {
                handleLabel.style.width = long
                o.setText(handleLabel, longText)
                return
            }
            if (state.goodHandles.indexOf(handle.value) >= 0) {
                handleLabel.style.width = avail
                o.setText(handleLabel, availText)
                state.invalid = false
                return 
            }
            if (state.failedHandles.indexOf(handle.value) >= 0) {
                handleLabel.style.width = not
                o.setText(handleLabel, notAvailText)
                return
            }
            if (handle.classList.contains('invalid')) {
                handleLabel.style.width = not
                o.setText(handleLabel, notAllowText)
                //return
            }

            // Default UI FX
            handleLabel.style.width = bare
            o.setText(handleLabel, bareText)

            logDeb('@ validateHandle()', {invalid: state.invalid, jForm: jForm})
            
            /**********************************************************
             * The handle-validation fetch; 
             * Server responds with same handle if it is available, 
             * else with a minimally-mutated available alternative.
             * 
             * (We're discarding the mutated ones.)
             *********************************************************/
            return aFetch(req)
                .then(rspHandle)
                .then(rsp => {

                    purge(available)
                    // If server response includes the requested handle, 
                    // then availability is validated; handle is available.
                    ;(rsp.handle === jForm.handle)
                        ? ( (handleLabel.style.width = avail)
                            ,o.setText(handleLabel, availText)
                            ,(state.invalid = false)
                            // Recon state's lists of handles; Add this one to state's good list
                            ,(state.goodHandles.push(jForm.handle))
                            ,(state.goodHandles = dedup(state.goodHandles))
                        )
                        : ( (handleLabel.style.width = not)
                            ,o.setText(handleLabel, notAvailText)
                            // Recon state's lists of handles; move this one from good to failed.
                            ,(state.failedHandles.push(jForm.handle))
                            ,(state.failedHandles = dedup(state.failedHandles))
                            ,(state.goodHandles.splice(state.goodHandles.indexOf(jForm.handle), 1))
                        )

                    // If handle.value is on the failed list, ...
                    !!(state.failedHandles.indexOf(handle.value) >= 0)
                        && (state.invalid = true)

                    logDeb('@ aFetch(..)', {invalid: state.invalid, rsp: rsp})
                })
                .catch(meta => { 
                    // Publish HTTP status on fail 
                    eb.pub(eTypes.Net, {
                        data: { http: {
                                method: meta.req.method, 
                                status: meta.status, 
                                statusText: meta.statusText 
                            }
                        },
                        mode: o.aModes.promise
                    })

                    state.invalid = true
                    handle.classList.add('invalid')
                    logErr(meta)

                    switch (true) {
                        case (handle.value.length < minHandle):
                            handleLabel.style.width = short
                            o.setText(handleLabel, shortText)
                            break
                        case (handle.value.length > maxHandle):
                            handleLabel.style.width = long
                            o.setText(handleLabel, longText)
                            break
                        default:
                            handleLabel.style.width = bare
                            o.setText(handleLabel, bareText)
                            break
                    }

                    // This (HTTP 4nn) shouldn't happen under current server logic.
                    !!(meta.status < 499)
                        && ((handleLabel.style.width = not)
                            ,o.setText(handleLabel, notAvailText)
                        )
                    
                    state.failedHandles.push(jForm.handle)
                    state.failedHandles = dedup(state.failedHandles)
                    state.goodHandles.splice(state.goodHandles.indexOf(jForm.handle), 1)

                    // Abort the signup on any server-side fail
                    !!(meta.status > 499)
                        && (purge(main),
                            toDOM(main, `<div class="report"><h1>Oops! The server is having problems.</h1></div>`)
                        )
                })
        }
        ,chkValidity = () => {
            /*************************************************************************
             * Validate the form's active fieldset (state) as a whole. Idempotent.
             * The metric is: state.invalid. The submit button is reset accordingly.
             * FX are added/removed (class) per input element's state (validity).
             ************************************************************************/
            const chk = (el) => {
                if (!el.checkValidity()) {
                    state.invalid = true
                    el.classList.add('invalid')
                } else {
                    el.classList.remove('invalid')
                }
                /************************************************************
                 * Workaround for attribute bugs (min, minlength, ...);
                 * if user input value is modified by JS, e.g., @ doKeyUp,
                 * then INPUT VALIDATES REGARDLESS, so catch those here.
                 ***********************************************************/
                if (minLenEls.includes(el)) {
                    if (el.value.length < validity[el.name].min) {
                        state.invalid = true
                        el.classList.add('invalid')
                    } else {
                        el.classList.remove('invalid')
                    }
                }

                if (state.step !== 1) 
                    return 

                if (el === confirm) {
                    if (!passConfirmed()) {
                        state.invalid = true
                        el.classList.add('invalid')
                    } else {
                        el.classList.remove('invalid')
                    }
                }
            }
            /*****************************************************
             * Declare the form valid (once per call); hereafter,
             * any invalid input (element) invalidates the form.
             ****************************************************/
            state.invalid = false

            switch (state.mode) {

                case sModes.reset:
                    /***  handled by form-reset.js  ***/
                    break

                case sModes.claim:
                    switch (state.step) {
                        case 0:
                            chk(claim)
                            break
                        case 1:
                        case 2:
                    }
                    /** fallthrough **/

                case sModes.signup:
                    switch (state.step) {
                        case 0:
                            break
                        case 1:
                            ;[display, handle, email, pass, confirm].map(chk)
                            /***********************************************************
                             * handle : Validity is set per both input pattern (HTML)
                             * and availability per AOA response (state.goodHandles).
                             * See validateHandle() .
                             **********************************************************/
                            if (state.mode !== sModes.claim) {
                                if (state.goodHandles.includes(handle.value)) {
                                    handle.classList.remove('invalid')
                                } else {
                                    state.invalid = true
                                    handle.classList.add('invalid')
                                }
                            }
                            break
                        case 2:
                            chk(code)
                            break
                    }
                    break
            }
            resetSubmitButtonState()
        }
        ,resetSubmitButtonState = () => {
            if (state.invalid) {
                submit.classList.add('disabled')
                submit.disabled = true
            } else {
                submit.classList.remove('disabled')
                submit.disabled = false
            }
        }
        // ====================================
        // Promise-chain handlers and helpers
        // ====================================

        ,spinner = (ev = false) => {
            /*******************************************************
             * The spinner func animates the ev.target svg of 
             * an oauthProvider(..) node under the MAIN tag,
             * if exist, else it creates the app-logo equivalent.
             * Regardless, it purges MAIN of all other content.
            *******************************************************/
            const 
                _logo = () => {
                    const 
                        span = o.create('span')
                        ,svg = `
                            <svg>
                                <use href="${svgLogoDef}"></use>
                            </svg>`
    
                    o.toDOM(span, svg)
                    return span
                }
                ,logo = _logo()

            formCtnr.classList.add('hide')
            logo.classList.add('selected')
            spinnerCtnr.innerHTML = ''
            spinnerCtnr.classList.add('spinner')
            main.append(spinnerCtnr)
            spinnerCtnr.append(logo)
            o.aDelay(500, () => spinnerCtnr.classList.add('spin'))
        }
        ,spinnerRemove = () => (
            (spinnerCtnr.parentNode && spinnerCtnr.parentNode.removeChild(spinnerCtnr))
            ,true
        )
        ,failHandler = (rsp) => { 
            // Publish the HTTP status code/text
            !!(typeof rsp.meta !== 'undefined') 
                && eb.pub(eTypes.Net, {
                    data: { 
                        http: {
                            status: rsp.meta.status, 
                            statusText: rsp.meta.statusText 
                        }
                    },
                    mode: o.aModes.promise
                })
            logErr(rsp)
            
            spinnerRemove()

            // Report on failure.
            const rpt = {
                err: (rsp.body && rsp.body.error && rsp.body.error) || '',
                reason: ''
            }
            switch (true) {
                case rpt.err.includes('users_email_key'):
                    rpt.reason = 'The account already exists'
                    break
                case rpt.err.includes('not found'):
                    rpt.reason = 'No matching record found'
                    break
                case rpt.err.includes('expired applicant'):
                    rpt.reason = 'Expired code'
                    break
                default:
                    rpt.reason = rpt.err || 'Unknown'
                    break
            }
            toDOM(main, `
                <div class="report">
                    <h1>
                        Your signup attempt failed.
                    </h1>
                    ${rpt.reason ? '<p>Reason: ' + rpt.reason + '.</p>' : ''}
                </div>
            `)

        }
        ,publish = (as) => eb.pub(eTypes.Auth, as) 
        ,redirectDefault = o.cfg.auth.redirect || false
        ,redirect = (u, on = redirectDefault) => on && u.handle 
                        && (window.location.href = `/${u.handle}/pub`)

        // ===============
        // Event handlers
        // ===============

        ,doKeyUp = (ev) => {

            // Disallow whitespace from these inputs
            [claim, email, code]
                .map((el) => (el.value = o.replaceAll(el.value, ' ', '')))

            /**********************************************************
             * Modify handle.value per display.value, 
             * but only until user's 1st manual edit of the former.
             * Thereafter only disallow whitespace at handle.value .
             *********************************************************/
            ;(ev.target.id === 'form-signup-handle')
                && (state.handled = true)
            ;( (ev.target.id === 'form-signup-display') && (state.handled === false) )
                && (handle.value = o.replaceAll(display.value, ' ', ''))

            // Strip unwanted characters from inputs lacking pattern validation.

            ;[' ', '|', '\\', '(',')', '[', ']', '{', '}', '\>', '\<', '/', 
                '%', '^', '?', '@', '#', '$', '&', '*', ':', ';', '+', '=', 
                '-', '_', '.', '!', '~', '`', '"', '\'', ','
                ].map((ch) => (handle.value = o.replaceAll(handle.value, ch, '')))

            ;['  ', '|', '\\', '(',')', '[', ']', '{', '}', '\>', '\<', '/', 
                '%', '^', '?', '@', '#', '$', '&&', '*', ':', ';', '+', '=', 
                '--', '_', '!', '~', '`', ',,', '""', '..', '\'\''
                ].map((ch) => (display.value = o.replaceAll(display.value, ch, '')))

            // handle is static @ claim mode; set per AOA-service response body of step 0.
            ;(state.mode === sModes.claim) && (handle.value = state.handle)

            // Validate the form per state (mode and step).
            Promise.resolve(validateHandle())
                .then(chkValidity)
                .then(resetSubmitButtonState)
        }
        ,doSubmit = (ev) => {
            // Per step (0, 1, 2) of FORM
            ev && ev.preventDefault()
            const 
                lolz = arrSeq(33).map(i => 'lolz').join('') //... to overwrite input
                ,nextStepPrep = (focus, rsp = {}) => {
                    spinnerRemove() && formCtnr.classList.remove('hide')
                    chkValidity()
                    focus.focus()
                    return rsp.body
                }
                ,populate = (x) => {
                    // Populate the signup form with VIP user's record (@ claim mode)
                    logDeb('rsp:', x)
                    display.value = x.display
                    handle.value  = x.handle
                    state.handle  = x.handle
                    state.uid     = x.user_id

                    chkValidity()
                    resetSubmitButtonState()
                }

            switch (state.step) {

                case 0:
                    /******************************************************
                     * This step occurs only in claim mode (sModes.claim);
                     * applicant is claiming an existing account.
                     * Their VIP key is 
                     *****************************************************/
                    state.applicant = {
                        mode:   state.mode,
                        key:    claim.value.trim(),
                        email:  'required@claim.bogus', 
                        csrf:   rand(22),
                    }

                    spinner(ev)

                    formCtnr.removeEventListener('paste', doKeyUp)

                    submit.value = 'Apply'
                    claim.value = lolz
                    step0.classList.add('hide')
                    step1.classList.remove('hide')
                    o.required([display, handle, email, pass, confirm])
                    step0.innerHTML = '' //... See o.required(..) comments.
                    state.step = 1
                    state.invalid = true
                    handle.title = 'This is the handle of your VIP claim; an existing account.'
                    handleLabel.title = handle.title

                    auth.Claim(state.applicant)
                        .then((rsp) => nextStepPrep(email, rsp))
                        .then(populate)
                        .catch(failHandler)
                    
                    // DEV/TEST : mock auth.Claim(..) req/rsp
                    false && o.aDelay(0, () => {
                        Promise.resolve({body: {display: 'Foo Bar', handle: 'FooBar'}})
                            .then((rsp) => nextStepPrep(email, rsp))
                            .then(populate)
                            .catch(failHandler)
                    })

                    break

                case 1:
                    /**********************************************************************
                     * Capture all step-1 form input to (local) state.applicant object, 
                     * but POST only that required to validate applicant (handle, email). 
                     *********************************************************************/
                    state.applicant = {
                        mode:          state.mode,
                        display:       display.value,
                        handle:        handle.value,
                        email:         email.value,
                        pass:          pass.value,
                        pass_confirm:  confirm.value,
                        user_id:       state.uid, 
                    }

                    // Secure : overwrite HTML inputs
                    ;[display, handle, email, pass, confirm]
                        .map((el) => (el.value = lolz))

                    // FX
                    spinner(ev)

                    // Prep for Step 2 
                    submit.value = 'Verify'
                    display.autofocus = false
                    step2.classList.remove('hide')
                    ;[code, codeResendReq].map(el => el.classList.remove('hide'))
                    step1.innerHTML = '' //... See o.required(..) comments.
                    o.required([code])
                    state.step = 2

                    auth.Apply('signup', {
                            mode:   state.mode,
                            handle: state.applicant.handle,
                            email:  state.applicant.email,
                            csrf:   rand(22),
                        })
                        .then(() => o.aDelay(1000, nextStepPrep, code))
                        .catch(failHandler)

                    break

                case 2:
                    /****************************************************************
                     * Add code (user input) to (local) state applicant object,
                     * and POST the entire applicant obj to complete the signup.
                     * Request body (state.applicant) must abide user.User struct.
                     ***************************************************************/
                    delete state.applicant.mode
                    state.applicant.code = code.value
                    state.applicant.csrf = rand(22)
                    code.value = lolz

                    // FX
                    step2.classList.add('hide')
                    submit.classList.add('hide')
                    spinner(ev)

                    logDeb('doSubmit(..) : applicant:', state.applicant)

                    auth.Verify('signup', state.applicant)
                        .then(publish)
                        .then(auth.SubRecordGet)
                        .then(redirect)
                        .catch(failHandler)

                    break
            }
        }
        ,doResend = (ev) => {
            /****************************************************
             * Allow this one request from user 
             * for another email of verification code.
             * Then inform and prevent any more such requests.
             * This upserts existing applicant to new code.
             ***************************************************/
            auth.Apply('signup', {
                handle: state.applicant.handle
                ,email: state.applicant.email
                ,csrf: rand(22)
            })
            .then(() => (codeResendReq.parentNode.innerHTML = '<em>Sent!</em>'))
            .catch(failHandler)
        }

    // ====
    // Init
    // ====

    /***********************************************************
     * Reset state per URI; active FIELDSET (step) and mode: 
     * @ signup : /app/signup
     * @ claim  : /app/signup#vip OR /app/signup?mode=vip
     **********************************************************/
    if (window.location.href.includes('vip')) {
        // @ Claim mode
        o.setText(title, 'Claim Your Account')
        step0.classList.remove('hide')
        state.mode = sModes.claim
        state.step = 0
        submit.value = 'Claim'
        o.required([display, handle, email, pass, confirm, code], false)
        o.required([claim])
        claim.focus()
        /*********************************************************
         * VIP applicant may paste (rather than type) their key. 
         * (Key was sent earlier along with link to this mode.)
         ********************************************************/
        formCtnr && formCtnr.addEventListener('paste', doKeyUp)
    } else {
        // @ Signup
        state.step = 1
        step0.innerHTML = ''
        step1.classList.remove('hide')
        submit.value = 'Apply'
        o.required([claim, code], false)
        o.required([display, handle, email, pass, confirm])
        display.focus()
    }

    submit.classList.add('disabled')
    chkValidity()
    formCtnr && o.aDelay(200, validateHandle)

    // Listen : state per keyup
    formCtnr && formCtnr.addEventListener('keyup', o.throttle(100, doKeyUp))

    // Listen : submit event
    formCtnr && formCtnr.addEventListener('submit', doSubmit)

    // Listen : step-2 click event @ "Resend the code" button (anchor)
    codeResendReq && codeResendReq.addEventListener('click', doResend)

    ;(()=>{// DEV/TEST 
        if (state.mode !== sModes.signup) 
            return 
        const 
            rnd = rand(4)
            ,x = {
                //display: `Any Name III ${rnd}`
                display: `Any Name "The Foo" III, Esq.`
                //,handle: `AnyNameIII${rnd}`
                ,handle: ''
                ,email: `bogus-${rnd}@addr.no`
                ,pass: '999999999'
                ,pass_confirm: '999999999'
            }
            display.value  = x.display
            handle.value   = x.handle
            email.value    = x.email
            pass.value     = x.pass
            confirm.value  = x.pass_confirm 
    })//()

})( window[__APP__] = window[__APP__] || {} )
