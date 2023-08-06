;(function(o, undefined){
    'use strict'
    const formCtnr = o.css('#form-container')
    
    if (!formCtnr) return 
    /****************************************************************
     * @ Two-step reset : AOA : verify, reset
     * 
     * @ Step 1: applicant submits POST request including email.
     * AOA service stores applicant info and an associated code, 
     * and concurrently sends applicant the code 
     * via their claimed email address.
     * 
     * @ Step 2: applicant retrieves verification code from their 
     * email, entering it into a newly created form input field. 
     * That code is added to the applicant object and POSTed.
     * If code validates at AOA service, then a member record
     * is created from the applicant data.
     ***************************************************************/
    const cfg = o.cfg.view
        ,srcID = 'reset'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,{  css
            ,cssAll
            ,rand
            ,purge
            ,toDOM
            ,id
            ,aFetch
            ,dedup
            ,arrSeq
            ,urlAOA
        } = o
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        // Request params
        ,auth = o.Auth()
        // Form params
        ,main = css('MAIN')
        ,submit = css('input[type="submit"]', formCtnr)
        ,email = css('input[name=email]', formCtnr)
        ,pass = css('input[name=pass]', formCtnr)
        ,confirm = css('input[name=confirm]', formCtnr)
        ,code = css('input[name=code]', formCtnr)
        
        ,step1 = css('#step-1', formCtnr)
        ,step2 = css('#step-2', formCtnr)

        ,spinnerCtnr = o.create('DIV')

        ,state = {
            mode: formCtnr.dataset.mode, 
            //... for TODO: combine signup and reset scripts
            invalid: true, 
            step: 1, 
            applicant: {}
        }

        // ==================
        // Form validation
        // ==================

        ,chkValidity = () => {
            const chk = (el) => 
                    el.checkValidity() 
                        ? el.classList.remove('invalid') 
                        : ( el.classList.add('invalid')
                            ,(state.invalid = true)
                        )
            
            state.invalid = false
            switch (state.step) {
                case 1:
                    ;[email].map(chk)
                    break
                case 2:
                    ;[code, pass, confirm].map(chk)
                    break
            }
            resetSubmitButtonState()
        }
        ,resetSubmitButtonState = () => {
            // Enable/Disable + FX
            if (state.invalid || !passConfirmed()) {
                submit.classList.add('disabled')
                submit.disabled = true
            } else {
                submit.classList.remove('disabled')
                submit.disabled = false
            }
        }
        ,passConfirmed = () => (state.step === 2) ? (pass.value === confirm.value) : true

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
                        span = o.create('SPAN')
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
        ,failHandler = (resp) => { 
            // Publish the HTTP status code/text
            !!(typeof resp.meta !== 'undefined') 
                && eb.pub(eTypes.Net, {
                    data: { 
                        http: {
                            status: resp.meta.status, 
                            statusText: resp.meta.statusText 
                        }
                    },
                    mode: o.aModes.promise
                })
            logErr(resp)
            
            spinnerRemove()

            // Report on failure.
            const rpt = {
                err: (resp.body && resp.body.error && resp.body.error) || '',
                reason: ''
            }
            switch (true) {
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
                        Your password is UNCHANGED.
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
            !!(state.step === 1) 
                && (email.value = o.replaceAll(email.value, ' ', ''))

            !!(state.step === 2) 
                && (code.value = o.replaceAll(code.value, ' ', ''))

            chkValidity()
        }
        ,doSubmit = (ev) => {
            ev.preventDefault()

            switch (state.step) {

                case 1:
                    /*********************************************************
                     * Step-1 : Capture and send email address only
                     ********************************************************/
                    state.applicant = {
                        email: email.value
                        ,csrf: rand(22)
                    }

                    // FX
                    spinner(ev)

                    // Prep for Step 2 
                    submit.value = 'Reset'
                    email.required = false
                    email.autofocus = false

                    ;[code, pass, confirm].map(el => (el.required = true))
                    state.step = 2

                    // Send payload 
                    const 
                        bypass = false //... @ TEST
                        ,nextStepToggle = () => {
                            spinnerRemove() 
                                && [formCtnr, step1, step2]
                                    .map((el) => el.classList.toggle('hide')) 
                                && chkValidity()

                            code.focus()
                        }

                    logDeb('doSubmit(..) : applicant:', state.applicant)

                    !bypass && auth.Apply('reset', state.applicant)
                        .then(() => o.aDelay(500, nextStepToggle))
                        .catch(failHandler)

                    bypass && nextStepToggle()

                    break

                case 2:
                    /******************************************************
                     * Step-2 : Capture code, pass, confirm; 
                     *          send that and the email addr too.
                     *****************************************************/
                    // Payload must satisfy user.User struct expectations
                    state.applicant.code = code.value
                    state.applicant.pass = pass.value
                    state.applicant.pass_confirm = confirm.value
                    state.applicant.csrf = rand(22)

                    // FX
                    step2.classList.add('hide')
                    submit.classList.add('hide')
                    spinner(ev)

                    logDeb('doSubmit(..) : applicant:', state.applicant)

                    auth.Verify('reset', state.applicant)
                        .then(publish)
                        .then(auth.SubRecordGet)
                        .then(redirect)
                        .catch(failHandler)

                    break
            }
        }

    // Listen : state per keyup
    formCtnr && formCtnr.addEventListener('keyup', o.throttle(100, doKeyUp))

    // Listen : submit event
    formCtnr && formCtnr.addEventListener('submit', doSubmit)

    // Init
    submit.classList.add('disabled')
    chkValidity()

})( window[__APP__] = window[__APP__] || {} )
