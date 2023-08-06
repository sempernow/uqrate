;(function(o, undefined){
    'use strict'
    /***********************************************
     * Handles Anet gateway transactions
     **********************************************/
    const formContainer = o.css('#form-container')
 
    if (!formContainer) return

    const cfg = o.cfg.view
        ,srcID = 'buyin'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,{  css
            ,cssAll
            ,create
            ,purge
            ,toDOM
            ,rand
            ,isDigits
        } = o
        // ========
        // PARAMs
        // ========
        ,test = (o.bMode === o.bModes.TEST)
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
        ,eb = o.EB()
        ,eTypes = eb.eTypes()

        // App-wide buyin params : SEE o.LockPeriod
        //,lockPeriod = test ? 0 : 30     //... throttle per-member buyins (days)
        ,amountMax = 100     //... hard limit regardless
        ,amountDefault = 20  //... max sans profile

        // Local state
        ,state = {invalid: true, cardname: '', psp: {}}
        // App-wide state cache (synchronous access)
        ,ss = o.State().store
        // Async
        ,auth = o.Auth()
        ,pspGet = (as) => auth.UserPSP(as)

        // DOM
        ,main = css('MAIN')
        ,form = css('FORM', formContainer)
        ,ghost = create('input')
        ,names = css('#form-cardnames') || ghost
        ,selection = cssAll('svg', names) 
        ,validated = x => css(`#form-cardnames svg[data-name=${x}]`) || ghost

        // Tokenization @ hosted
        ,dataDescriptor = css('#dataDescriptor') || ghost
        ,dataValue= css('#dataValue')            || ghost
 
        ,inform = css('DIV.inform', formContainer)
        ,submit = css('#form-submit', form)  
        ,button = submit
        ,amount = css('input[name=amount]', form)         || ghost
        ,cardnumber = css('input[name=cardnumber]', form) || ghost
        ,expiry= css('input[name=expiry]', form)          || ghost
        ,exp = {mm: '', yy: ''}
        ,cardcode = css('input[name=cardcode]', form)     || ghost
        ,zipcode = css('input[name=zipcode]', form)       || ghost

        /*********************************************************************
         * All forms (HTML) regarding buyin, payout, or exchange 
         * per Authorize.net gateway share this one companion script; 
         * its behavior varies per mode and action params read from the DOM.
         ********************************************************************/
        // Modes 
        ,mode = (x) => (form.dataset.mode === x)
        // @ clear card data : NOT @ production
        ,clear = 'clear'
        // @ Accept.js       : PCI-DSS SAQ-A-EP (per gateway's tokenizer)
        ,opaque = 'opaque'
        // @ AcceptUI.js     : PCI-DSS SAQ-A (per gateway's iframe)
        ,hosted = 'hosted'
        // @ Sans card entry : User has PSP profile (auth.user.profile_buyin)
        ,profile = 'profile'
        /**************************************************************
         * App-API endpoint of AJAX request on submit event is set 
         * per mode and action read from dataset params of FORM tag.
        **************************************************************/
       ,arb = (form && form.dataset.action === 'arb')
        ,perMode = (acc, m, i) => {
            const x = mode(m) && (arb ? `/anet/a${i+1}` : `/anet/c${i+1}`)
            acc = x ? x : acc 
            return acc
        }
        ,uri = [clear, opaque, hosted, profile].reduce(perMode, '')
 
        // ================================================
        // HELPER FUNCTIONs @ doKeyup etal prior to submit
        // ================================================

        // Invalidate if any required-pattern els fail validation; +/- class accordingly.
        ,chkValidity = () => [amount, cardnumber, expiry, cardcode, zipcode]
                                .map(el => el.checkValidity() 
                                    ? ( el.classList.remove('invalid') 
                                    )
                                    : ( el.classList.add('invalid'),
                                        (state.invalid = true)
                                    )
                                )
        ,isValidCard = (ccNum) => {
            const 
                parity = ccNum.length % 2
                ,luhn = (n, i) => {
                    var d = parseInt(n, 10)
                    ;(i % 2 == parity) && (d *= 2)
                    ;(d > 9) && (d -= 9)
                    sum += d
                }
            var sum = 0
            ;[...ccNum].map(luhn)
            return (sum % 10) === 0
        }
        ,cardType = (ccNum) => {
            ccNum = ccNum.split(' ').join('')
            const cards = {
                electron: /^(4026|417500|4405|4508|4844|4913|4917)d+$/,
                maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
                dankort: /^(5019)\d+$/,
                interpayment: /^(636)\d+$/,
                unionpay: /^(62|88)\d+$/,
                visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                mastercard: /^5[1-5][0-9]{14}$/,
                amex: /^3[47][0-9]{13}$/,
                diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
                discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
                jcb: /^(?:2131|1800|35\d{3})\d{11}$/
            }
            for (var k in cards) {
                if (cards[k].test(ccNum)) 
                    return k
            }
            return null
        }
        ,validateCardInput = () => {
            /************************************************************
             * Infer card type from pattern, validate card number,
             * then show card number as space-delimited groups of four.
             ***********************************************************/
            if (cardnumber.name === ghost.name) return 'n/a'
            const 
                ccNum = cardnumber.value
                ,showNum = () => {
                    const
                        ccShow = []
                        ,end = Math.floor(ccNum.length/4)+1

                    for (let i = 0; i < end; i++) { 
                        ccShow[i] = ccNum.substring(i*4, 4+i*4)
                    }
                    return ccShow.join(' ').trim()
                }

            logDeb(isValidCard(ccNum), cardType(ccNum))

            var ccName = ''
            
            ccName = isValidCard(ccNum) && cardType(ccNum)
            state.cardname = ccName
            cardnumber.value = showNum()
            if (ccName) {
                ;[...selection].map(el => el.classList.add('hide'))
                validated(ccName).classList.remove('hide')
            } else {
                ;[...selection].map(el => el.classList.remove('hide'))
            }

            return ccName
        }
        ,takes = x => {//... inform user of PSP % take
            const a = (x) => parseInt(x, 10)
                ,pct = (a) => Math.round((a*2.9+30)/a)
            return isNaN(pct(a(x))) 
                ? '&nbsp;' 
                // : `
                //     The <abbr title="Payment Service Provider">PSP</abbr> 
                //     takes ${pct(a(x))}% of that amount.
                // ` 
                : `The gateway takes ${pct(a(x))}% of that amount.`
        }
        ,clean = (v) => [...v].map(x => isDigits(x) ? x : '').join('')

        // ===============
        // EVENT HANDLERs 
        // ===============

        ,doKeyup = (ev) => {
            /****************************************************************
             * Validate form; enable submit if valid; purge bad characters. 
             * Atomic per form. Idempotent per keyup.
            ****************************************************************/
            if (!button) return //... while @ hosted popup
            // Remove invalid values
            ;[amount, cardnumber, cardcode, zipcode]
                .map(x => x.value && (x.value = clean(x.value)))
            ;(amount.value.length === 1) 
                && (amount.value === '0') && (amount.value = '')

            // Inform if amount is over member's limit.
            ;(parseInt(amount.value, 10) > state.psp.max) 
                ? ( (amount.value = `${state.psp.max}`),
                    (o.setText(inform, state.psp.maxText))
                )
                : ( o.purge(inform),o.toDOM(inform, '&nbsp;'),
                    o.purge(inform),o.toDOM(inform, takes(amount.value))
                )

            if (expiry.name !== ghost.name) {
                // @ expiry input : MM/YY (assure) 
                ;['/'].map(ch => (expiry.value = o.replaceAll(expiry.value, ch, '')))
                exp.mm = expiry.value.substring(0,2)
                exp.yy = expiry.value.substring(2,4)
                // Auto-insert slash, when and where apropos.
                ;(expiry.value.length < 2)  && (expiry.value = `${exp.mm}`)
                ;(expiry.value.length >= 2) && (expiry.value = `${exp.mm}/${exp.yy}`)
                // If MM is not a valid month (digits), then remove entire value
                ;(exp.mm > 12) && (expiry.value = '')
                ;(isDigits(exp.mm)) || (expiry.value = '')
                // If YY entered but not digits, then remove entire value
                ;(exp.yy && !(isDigits(exp.yy))) && (expiry.value = '')
            }

            // Clear all ghost-element values (form-input elements vary per mode)
            ;[amount, cardnumber, cardcode, zipcode]
                .map(x => (x.name === ghost.name) && (x.value = ''))

            // (In)Validate per state of ALL form inputs
            state.invalid = false
            chkValidity()

            // @ cardnumber input : infer card type, validate card number, 
            // then modify its presentation; show in groups of four digits.
            validateCardInput() 
                ? cardnumber.classList.remove('invalid')
                : ( cardnumber.classList.add('invalid'),
                    (state.invalid = true)
                )

            // Enable button only if all inputs are valid
            ;(state.invalid)
                ? ( button.classList.add('disabled'),
                    (button.disabled = true)
                )
                : ( button.classList.remove('disabled'),
                    (button.disabled = false)
                )

            purge(button)
            toDOM(button, `Buy ${amount.value} <span>P</span> Tokens`)
        }

        ,doSubmit = (ev) => {
            /************************************************
             * AJAX request to app API; vary per form/mode
             ***********************************************/
            ev.preventDefault()
            if (form.dataset.idempotent) return
            form.dataset.idempotent = rand()

            const 
                bank = 'BANK'
                ,card = 'CARD' 
                ,paymentType = card 
                ,authData = {}
                ,cardData = {}
                ,bankData = {}
                ,secureData = {}
                ,publicClientKey = '7rJ7h7m6d2ZfFUU8AUUW5m9wZB85c8d6BbSx8rLUe9Lw9HzdU6zGAcHQ456GeJ3K'
                ,apiLoginID      = '6yKc23qQ5C'
                ,psp = pspGet(ss.auth)
                // Gateway Actions (across all modes) 
                ,action = (act) => {
                    switch (act) {
                        case 'zero':
                            return o.TxnAct.ExchZero
                        case 'p2q':
                            return o.TxnAct.ExchP2q
                        default:
                            return o.TxnAct.ExchBuyin
                    }
                }
                ,jForm = {
                    act: action(form.dataset.action),
                    xid:  arb ? ss.owner.pub_id : ss.owner.user_id,
                    xis:  arb ? o.TxnXIS.Channel : o.TxnXIS.User,
                    payer_id:  ss.auth.sub,
                    payee_id: ss.owner.user_id,
                    tokens_q: 0,
                    tokens_p: parseInt(amount.value, 10) || 0,
                    anet: {
                        credit_card: {
                            card_name: state.cardname,
                            card_number: cardnumber.value.replace(/\s+/g, ''),
                            exp_date: expiry.value,
                            card_code: cardcode.value,
                        },
                        zip_code: zipcode.value,
                        fingerprint: '',
                        data_descriptor: '',
                        data_value: '',
                        profile_customer_id: psp.cid,
                        profile_payment_id: psp.pid,
                    }
                    ,csrf: rand(22)
                }
                ,tokenizeFail = 'failed'
                ,showResult = (ok, x = false) => {
                    const 
                        meta = x ? `
                            <p class="center"><code>
                                HTTP ${x.meta && (x.meta.status)} (${x.meta && (x.meta.statusText)})
                            </code></p>` : ''
                        ,success = `<h1 class="report">Success!</h1>`
                        // 403 @ Declined only; report all others as process error
                        ,error = (x.body && x.body.error) ? x.body.error :  ''
                        ,failure = (ok === false) 
                                        ? (x.meta && (x.meta.status === 403)) 
                                            ? `<h1 class="report">Declined</h1>${error || meta}`
                                            : `<h1 class="report">Process Error/Issue</h1>${error || meta}`
                                        : ( ((ok === tokenizeFail) && (ok = false)),
                                            `<h1 class="report">Tokenization Failure</h1>`
                                        )

                    purge(form); purge(main); main.append(form)
                    ok ? toDOM(form, success) : toDOM(form, failure)

                    return ok
                }
                ,acceptHandler = (resp) => {
                    /*********************************
                     * Hosted-mode callback handler
                     ********************************/
                    if (resp.messages.resultCode === 'Error') {
                        resp.messages.message
                            .map(msg => logErr(msg.code +': '+ msg.text))
                        showResult(tokenizeFail)
                    } else {
                        /********************************************************
                         * On success, tokenize the payment-request payload,
                         * and make the payment request (AJAX) to our api.
                         * 
                         *      data_descriptor: "COMMON.ACCEPT.INAPP.PAYMENT"
                         *      data_value: "eyJj...MSJ9"   
                         * 
                         * Payment request is per AJAX, so set tokenized data.
                         *******************************************************/
                        // Add tokenized-card data to the payload
                        jForm.anet.data_descriptor = resp.opaqueData.dataDescriptor
                        jForm.anet.data_value      = resp.opaqueData.dataValue 
                        // Wipe card-data input from the payload
                        jForm.anet.credit_card.card_number = ''
                        jForm.anet.credit_card.exp_date = ''
                        jForm.anet.credit_card.card_code = '' 
                        
                        buyinRequest()
                    }
                }
                ,buyinRequest = () => {
                    /*******************************************************
                     * Request the buyin transaction at app's API service,
                     * which handles the gateway-transaction request.
                     ******************************************************/
                    const 
                        buyinRespHandler = x => {
                            /*******************************************
                             * Assess the response (resolve/reject); 
                             * report to DOM regardless.
                             ******************************************/
                            logDeb('@ buyinRespHandler : x :', x)
                            
                            if (x.body && x.body.txn_id && x.meta && (x.meta.status === 201)) {
                                return showResult(true)
                            } else {
                                // TODO: handle status=201, but sans txn_id (edge case server err)
                                showResult(false, x)
                                return Promise.reject(x)
                            }
                        }
                        ,buyinSuccessHandler = () => {
                            /********************************************************
                             * Update user record if profile mode, if apropos.
                             * Fetch/store the updated auth-user record regardless.
                             *******************************************************/
                            const updateUserPSP = () => {
                                /*******************************************************************
                                 * Update user record if this buyin is bigger than their max buyin.
                                 ******************************************************************/
                                const 
                                    uri = `/u/${ss.auth.sub}`
                                    ,psp = pspGet(ss.auth)
                                    ,u = {}
                                    ,target = css('DIV.center', form)
                                    ,respHandler = (r) => (r.meta.status === 204) ? true : Promise.reject(r)
                                    ,successHandler = () => toDOM(target, `
                                                    <h3>&nbsp;</h3>
                                                    <p class="italic"><a href="/app/account">Account</a> updated.</p>`
                                                )
                    
                                // Abort lest current buyin is bigger than payer's max
                                if (jForm.tokens_p <= psp.lastMax) 
                                    return Promise.resolve(false)
            
                                // Reassemble an updated psp field
                                u.psp = `${psp.acctType}|${psp.gid}|${psp.cid}|${psp.pid}|${jForm.tokens_p}|${psp.lastDate}`
                                u.csrf = rand(22)
            
                                // Request user-record update
                                return auth.FetchAPI('PUT', uri, u)
                                        .then(respHandler)
                                        .then(successHandler)
                                        .catch(logErr)
                            }
            
                            if (mode(profile)) 
                                return updateUserPSP()
                                        .then(() => o.Auth().SubRecordGet())
                        
                            return o.Auth().SubRecordGet()
                        }
                        ,showTally = (u) => {
                            /**************************************
                             * Show the updated-user tokens tally.
                             *************************************/
                            var p, q
                            try {
                                p = u.tokens_p.toLocaleString('en-US')
                                q = u.tokens_q.toLocaleString('en-US')
                            } catch (err) {
                                p = u.tokens_p
                                q = u.tokens_q
                            }
                            
                            logDeb(u)
        
                            toDOM(form, `
                                <div class=center>
                                    <p><a href="/app/account">Account</a>: ${u.handle}</p>
                                    <p>Total <span class="token">P</span> tokens: ${p}</p>
                                    <p>Total <span class="token">q</span> tokens: ${q}</p>
                                </div>`
                            )
                        }

                    switch (true) {
                        case mode(hosted):
                        case mode(profile):

                            return auth.FetchAPI('POST', uri, jForm)
                                            .then(buyinRespHandler)
                                            .then(buyinSuccessHandler)
                                            .then(showTally)
                                            .catch(logErr)
                            
                            break

                        default:
                            
                            o.sha256(
                                    ss.auth.sub
                                    + jForm.anet.credit_card.card_number
                                    + jForm.anet.zip_code
                                )
                                .then(fpr => {
                                    jForm.anet.fingerprint = fpr
                                    return auth.FetchAPI('POST', uri, jForm)
                                })
                                .then(buyinRespHandler)
                                .then(buyinSuccessHandler)
                                .then(showTally)
                                .catch(logErr)
                            
                            break
                    }
                }
                ,spinner = (ref, blurb = '') => {
                    /*************************************************
                     * Purge MAIN of all content, then insert and 
                     * animate a node containing the referenced svg
                     * with optional blurb appended.
                    *************************************************/
                    const 
                        graphic = (name) => {
                            const 
                                span = o.create('SPAN')
                                ,def = name ? `#def-${name}` : svgLogoDef
                                ,svg = `
                                    <svg>
                                        <use href="${def}"></use>
                                    </svg>`
            
                            o.toDOM(span, svg)
                            return span
                        }
                        //,selected = validated(state.cardname) || logo()
                        ,selected = graphic(ref)
                        ,spinner = o.create('DIV')
                    
                    selected.classList.add('selected')
                    spinner.classList.add('spinner')
                    o.purge(main)
                    main.append(spinner)
                    spinner.append(selected)
                    toDOM(main, `<h2>${blurb}</h2>`)
                    main.classList.add('center')
                    o.aDelay(500, () => spinner.classList.add('spin'))
                }

            logDeb('jForm:', jForm)

            switch (true) {
                /************************************************************
                * Form input is handled per HTML form and its mode. 
                * (See forms @ assets/views/gw/anet/) 
                * Regardless, data of jForm obj is POSTed 
                * per AJAX request to our app's API service, 
                * whereof a transaction request is submitted 
                * to Authorize.net's payment-gateway API.
                * The HTML form is replaced with response results.
                ************************************************************/
                case mode(clear):
                    /********************************************************
                     * Authorize.net : Charge a Credit Card
                     *******************************************************/
                    // Send the raw card data  
                    buyinRequest()
                    break

                case mode(profile):
                    /********************************************************
                     * Authorize.net : Charge per customer/payment profile
                     *******************************************************/
                    buyinRequest()

                    break
    
                case mode(opaque):
                    /****************************************************************
                     * Authorize.net : Accept.js : PCI-DSS SAQ A-EP compliant 
                     * 
                     * REF: https://developer.authorize.net/api/reference/features/acceptjs.html#Using_Your_Own_Payment_Form
                     * 
                     * Map form params to those required by tokenization service 
                     * of Authorize.net, whereof the sensitive card-data input 
                     * is tokenized (dataDescriptor, dataValue).
                     ***************************************************************/

                    // App auth data
                    authData.clientKey  = publicClientKey
                    authData.apiLoginID = apiLoginID

                    // Secure data : app auth
                    secureData.authData = authData

                    // Secure data : card or bank
                    switch (paymentType) {
                        case bank:  
                            // TODO : FORM for bank account charge
                            bankData.accountNumber = accountNumber.value
                            bankData.routingNumber = routingNumber.value
                            bankData.nameOnAccount = nameOnAccount.value
                            bankData.accountType   = accountType.value
                            
                            secureData.bankData = bankData
                            break
                    
                        case card:
                            const exp = expiry.value.split('/')
                            cardData.cardNumber = cardnumber.value.replace(/\s+/g, '')
                            cardData.month      = exp[0]
                            cardData.year       = exp[1]
                            cardData.cardCode   = cardcode.value

                            secureData.cardData = cardData
                            break
                    }
                    // Request tokenization from Authorize.net API per Accept.js
                    Accept.dispatchData(secureData, acceptHandler)

                    break

                case mode(hosted):
                    /******************************************************************
                     * Authorize.net : AcceptUI.js / iframe : PCI-DSS SAQ A compliant 
                     * 
                     * REF: https://developer.authorize.net/api/reference/features/acceptjs.html#Using_Your_Own_Payment_Form
                     * 
                     * All card input handled @ hosted (iframe) payment form,
                     * which returns tokenized card data via two mechanisms:
                     * 
                     *      1. Sets hidden input fields of the parent (app) form.
                     *         (This is unused here.)
                     *      2. Passes object as arg to app-form callback (window obj) 
                     *         declared per Dataset Web API (data-responseHandler). 
                     * 
                     * The app-declared callback triggers a custom event ("accepted"), 
                     * which is caught by the listener at this script, 
                     * passing in the tokenized data via event object (ev.detail).
                     *****************************************************************/
                    logDeb('ev:', ev.detail)
                    acceptHandler(ev.detail)

                    break
            }

            // Clear form-input values
            ;[amount, cardnumber, expiry, cardcode, zipcode, dataDescriptor, dataValue]
                .map(x => (x.value = ''))

            spinner(state.cardname, 'Processing payment')
        }

        ,doGuardForm = (as) => {
            /***************************************************************
             * Buyins and their modes (forms/methods) have prerequisites. 
             * Validate this user and use case, per auth-status obj (as),
             * and inform user on fail. Remove this callback regardless.
             **************************************************************/
            o.ttl(as.r.exp) || auth.Purge()

            eb.off(eTypes.Auth, doGuardForm)
            const psp = pspGet(as)
           
            logDeb('as : psp:', psp)
    
            if (!as.sub) {
                purge(form); purge(main) //; main.append(form)
                toDOM(main, `
                    <div id="guard-form">
                        <h2>
                            <a href="/app/login" class="button">
                                Requires Login
                            </a>
                        </h2>
                    </div>
                `)
                return
            }
    
            if (mode(profile) && !(psp.cid && psp.pid)) {
                purge(form); purge(main) //; main.append(form)
                toDOM(main, `
                    <div id="guard-form">
                        <h2>
                            <a href="/app/profile-buyin" class="button">
                                Add a Payment Profile
                            </a>
                        </h2>
                    </div>
                `)
                return
            }
    
            if (psp.lock) {
                purge(form); purge(main) //; main.append(form)
                toDOM(main, `
                    <div id="guard-form">
                        <h2>Temporarily locked:</h2>
                        <h3>One buyin allowed per ${o.LockPeriod} days.</h3>
                        <h3>You have ${psp.lockDaysRemain} days remaining.</h3>
                    </div>
                `)
                return
            }
    
            // Add user's buyin limit (enhanced psp object) to local-state obj
            const limit = ((psp.lastMax * 2) > amountDefault) 
                            ? (psp.lastMax * 2) : amountDefault
            
            psp.max = (limit > amountMax) ? amountMax : limit
            psp.maxText = (limit > amountMax)
                            ? `You reached the app's current limit per buyin.`
                            : 'Your limit increases with successful transactions.'
    
            state.psp = psp
        }

    // ======================
    // Listen/Handle @ FORM
    // ======================

    // @ keyed input
    form && form.addEventListener('keyup', o.throttle(100, doKeyup))

    // The hosted (iframe) form has the 'submit' listener.
    mode(hosted)  && form && form.addEventListener('accepted', doSubmit)
    !mode(hosted) && form && form.addEventListener('submit', doSubmit)

    mode(hosted) && names.classList.add('hide')

    form && o.aDelay(200, () => {
        state.invalid = false
        chkValidity() 
        state.invalid && button && (
            button.classList.add('disabled'),
            (button.disabled = true)
        )
    })

    eb.sub(eTypes.Auth, doGuardForm)

})( window[__APP__] = window[__APP__] || {} )
