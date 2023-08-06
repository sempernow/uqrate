;(function (o, undefined) {
    'use strict'
    /****************************************************************
     * @ /app/SLUG : Account | Exchange | Profile | Centre
     * 
     * Listen for Auth events; reset per auth-status obj; 
     * listen, edit and such on targeted click events thereafter.
     ***************************************************************/

     // TODO : Segregate : one JS file per page; this file has grown too muddled.

    const 
        app = o.css('#app') //... @ app-owned channels (pages)
        ,install =  app && o.css('#install')
        ,account =  app && o.css('#account') 
        ,exchange = app && o.css('#exchange')
        ,profile =  app && o.css('#profile')
        ,chnMenu =  app && o.css('#channel-header .menu')

    if (!install && !account && !exchange && !profile && !chnMenu) 

        return 

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

        // DOM
        ,ghost = o.create('GHOST')
        //,header = o.css('HEADER')
        ,header = o.css('SECTION.wrapper')
        ,accountH1= o.css('#account H1')
        ,chnMenuButtons = chnMenu ? {
            one: o.css('LI A[href="#1"]', chnMenu),
            two: o.css('LI A[href="#2"]', chnMenu),
            three: o.css('LI A[href="#3"]', chnMenu),
        } : null
        ,content = o.cssAll('#app .content>*')
        ,contentIDs = content ? [...content].map(el => el.id) : []

        // DOM : Exchange page
        ,addP = exchange && o.css('#add-p dt a')
        ,exch = exchange ? {
            addQ: {
                dt: o.css('#add-q dt'), 
                dd: o.cssAll('#add-q dd'),
                a: o.css('#add-q dt a')
            },
            redeemP: {
                dt: o.css('#redeem-p dt'), 
                dd: o.cssAll('#redeem-p dd')
            },
            sponsor: {
                dt: o.css('#sponsor dt'), 
                dd: o.cssAll('#sponsor dd'),
                a: o.css('#sponsor dt a')
            },
            subscribe: {
                dt: o.css('#subscribe dt'), 
                dd: o.cssAll('#subscribe dd')
            },
        } : {}
        ,doToggleExch = (dd) => (ev) => {
            dd[0].classList.toggle('hide') 
            dd[1].classList.toggle('hide')

            // @ Add q, guard the internal form against unauthorized users.
            !!(ss.auth && ss.auth.sub) || (dd[1].dataset.def === "q") && (
                dd[1].innerHTML = `
                    <h1 class="center">
                        <a href="/app/login" class="button">
                            Requires Login
                        </a>
                    </h1>&nbsp;</h1>
                `
            )
        }
        ,ddAll = exchange ? o.cssAll('DL', exchange) : []
        ,dlHashTargets = exchange ? {
            addq: o.css('#add-q'),
            //redeem: o.css('#redeem'),
            sponsor: o.css('#sponsor'),
            subscribe: o.css('#subscribe'), 
            inform: o.css('#inform'),
        } : { install: install}

        // Exchange : Form P2q : Add q 
        ,formP2q = o.css('#add-q form')
        ,amount = formP2q && o.css('input[name="amount', formP2q)
        ,submit = formP2q ? o.css('button', formP2q) : ghost
        ,chkValidity = (ev) => amount 
                                && amount.checkValidity() 
                                    ? ( amount.classList.remove('invalid')
                                        ,(submit.disabled = false)
                                        ,true
                                    )
                                    : ( amount.classList.add('invalid')
                                        ,(submit.disabled = true)
                                        ,false
                                    )

        // DOM : Profiles page 
        /****************************************************
         * UPDATE
         * Segregated the add-a-profile page into two
         * separate pages, /app/profile-{buyin,payout},
         * accessed through selection page; /app/profiles .
         * 
         * This to satisfy the host script, AcceptUI.js, 
         * which expects its ONE contact form present 
         * upon page load.
         ***************************************************/
        ,formContainer = o.css('#form-container')
        ,addBuyinProfile = o.css('#profile-buyin dt')
        ,addPayoutProfile = o.css('#profile-payout dt')
        ,profileInfo = o.css('.profile-info', profile)
        ,doToggleAddBuyinProfile = () => {
            if (hostScriptFail()) return
            formContainer.classList.toggle('hide') 
            profileInfo.classList.toggle('hide')
        }
        ,doToggleAddPayoutProfile = () => {
            if (hostScriptFail()) return
            formContainer.classList.toggle('hide') 
            profileInfo.classList.toggle('hide')
        }

        ,h2 = o.css('#profile-buyin dt a h2')
        // If fail @ AcceptUI.js 
        ,hostScriptFail = () => h2 && (h2.dataset.hostScriptFail === "1")

        // DOM : Account page
        ,settings = o.css('#settings')
        ,edit    = settings ? o.css('H2 a[href="#edit"]', settings)   : ghost
        ,save    = settings ? o.css('H2 a[href="#save"]', settings)   : ghost
        ,cancel  = settings ? o.css('H2 a[href="#cancel"]', settings) : ghost
        ,editElsNew = {}

        // as.user : Element keys are model key names
        ,asUserEdits = account ? {
            handle:   o.cssAll('#handle td')[1]  || ghost
            ,display: o.cssAll('#display td')[1] || ghost
            ,about:   o.cssAll('#about td')[1]   || ghost
            ,email:   o.cssAll('#email td')[1]   || ghost
        } : {}
        ,asUserStatics = account ? {
            tokens_p:  o.cssAll('#token-p td')[1] || ghost
            ,tokens_q: o.cssAll('#token-q td')[1] || ghost
            ,qrate:    o.cssAll('#qrate td')[1]   || ghost
            ,profile_buyin:  o.cssAll('#buyin td')[0]  || ghost
            ,profile_payout: o.cssAll('#payout td')[0] || ghost
            ,subing: o.css('#subscriptions h2 .count') || ghost
        } : {}
        
        ,paidSubs = o.css('#subscriptions table')
        ,ownedChns = o.css('#channels table')
        
        ,state = {as: {}, subs: [], idem: false}
        
        ,input = (name, val) => {
            // Set asUserEdits[name] to input el if val, else reset to and return input.value .
            // In effect, toggle target as editable or not, per val, capturing its current state.
            if (!asUserEdits[name]) 
                return 

            if (val) { 
                // Make name editable 
                asUserEdits[name].innerHTML = `
                    <input type="text" 
                        name="${name}" 
                        value="${val.trim()}"
                        required
                        pattern=[A-Za-z0-9]{3,256}>
                `
                // TODO ...
                // ;(name === 'about') 
                //     && (asUserEdits[name].innerHTML = `
                //             <textarea type="text" 
                //                 name="${name}"
                //                 value="${val.trim()}"
                //                 required
                //                 pattern=[A-Za-z0-9]{3,256}></textarea>
                //         `)
            } else {
                // Make name uneditable
                const input = o.css('input', asUserEdits[name])
                asUserEdits[name].innerHTML = input ? input.value : '--'
                return input ? input.value : '--'
            }

        }
        ,doEdit = (ev) => {
            if (!(state.as && state.as.user))
                return //... should never be.

            // PUT changes on Save (click)
            if (ev.target.href.substring(ev.target.href.length - 5) === '#save') {
                Object.keys(asUserEdits).map(name => (editElsNew[name] = input(name).trim()))

                putChanges(state.as)
            }

            // Toggle Edit/Save/Cancel anchors, 
            ;[edit, save, cancel].map(el => el.classList.toggle('hide'))

            // Set all asUserEdits (els) as either editable or not, per status of the edit element. 
            edit.classList.contains('hide') 
                ? Object.keys(asUserEdits).map(name => input(name, (state.as.user[name]) || ' '))
                : Object.keys(asUserEdits).map(name => (asUserEdits[name].innerHTML = state.as.user[name]))
        }
        ,putChanges = (as) => {
            const 
                uri = `/u/${as.sub}`
                ,payload = {csrf: o.rand(22)}

            // Send only changed-value key(s); abort if none.
            var flag = false
            Object.keys(editElsNew).map(name => 
                (editElsNew[name] !== as.user[name])
                    && ((payload[name] = editElsNew[name])
                        ,(flag = true)
                    )
            )
            if (!flag) return

            logDeb('@putChanges(..)', 'payload', payload)

            // PUT the updated user keys per AJAX
            auth.FetchAPI('PUT', uri, payload)
                .then(r => (r.meta.status === 204) ? r : Promise.reject(r))
                .then(logDeb)
                // Get updated user record, and update the DOM (Settings) with it.
                .then(() => o.Auth().SubRecordGet())
                .then((u) => Object.keys(asUserEdits)
                                .map(name => (asUserEdits[name].innerHTML = u[name]))
                )
                .catch(logErr)
        }
        ,getSubscriptions = (as) => {
            /********************************************************
             * Retrieve this auth-user's paid-subscriptions record,
             * and insert the info into apropos DOM elements.
             * 
             * Currently, only channel models are handled.
             * TODO: user and group subscriptions.
             ******************************************************/
            const 
                // Set uri per subject user's ID retrieved from auth-status.
                uri = as.sub ? `/cl/paid/${as.sub}` : ''

                // DOM insertions : each table row is a channel.SponSub record.
                ,respHandler = (resp) => {
                    logDeb('@ getSubscriptions(as) : respHandler(resp) : resp:', resp)
                    const paidSubsRows = o.cssAll('tr', paidSubs)
                    state.subs = resp.body ? resp.body : [] //... save for doUnsubscribe(..)
                    // Remove all rows except that of heading
                    ;[...paidSubsRows].map((tr,i) => (i > 0) && (tr.remove())) //... 96% !!!
                    // Insert sponsub(s) per table row
                    if (!(state.subs && state.subs.list && state.subs.list.length)) return
                    state.subs = state.subs.list
                    state.subs.map((sub) => o.toDOM(paidSubs, `
                        <tr>
                            <td class="text-left"><a href="${sub.uri_local}">${sub.uri_local}</a></td>
                            <td>${sub.payment}</td>
                            <td>${sub.interval ? sub.interval : 'once'}</td>
                            <td>${Math.round((o.UTCtoSec(sub.date_expiry) - o.nowSec())/86400)}</td>
                            ${sub.interval ? `<td><a href="#${sub.id}" class="button">✕</a></td>` : '<td>&nbsp;</td>'}
                        </tr>
                    `))
                }

            logDeb('@ getSubscriptions(as) : as:', as)

            /*********************************************
             * Response body is of []channel.SponSub{..}
             ********************************************/
            uri ? auth.FetchAPI('GET', uri)
                        .then(respHandler)
                        .catch(logErr)
                : logErr('@ getSubscriptions(as)')
        }
        ,getOwnedChns = (as) => {
            /********************************************************
             * Retrieve this auth-user's (owner's) channel records,
             * and insert the info into apropos DOM elements.
             ******************************************************/
            const 
                // Set uri per subject user's ID retrieved from auth-status.
                uri = as.sub ? `/cl/owned/${as.sub}` : ''

                // DOM insertions : each table row is a channel.Channel record.
                ,respHandler = (resp) => {
                    logDeb('@ getOwnedChns(as) : respHandler(resp) : resp:', resp)
                    const ownedChnRows = o.cssAll('tr', ownedChns)
                    // Remove all rows except that of heading
                    ;[...ownedChnRows].map((tr,i) => (i > 0) && (tr.remove())) //... 96% !!!
                    if (!(resp.body && resp.body.list && resp.body.list.length)) return
                    // Insert channel(s) per table row; skip timeline channels
                    resp.body.list.map((chn) => true
                        && o.toDOM(ownedChns, `
                            <tr>
                                <td class="text-left">
                                    <a href="/${as.user.handle}/${chn.slug}">${as.user.handle}/${chn.slug}</a>
                                </td>
                                <td>${chn.sub_rate}</td>
                                <td><a href="/app/channel/#${chn.chn_id}" class="button">Edit</a></td>
                            </tr>
                        `)
                    )
                }

            logDeb('@ getOwnedChns(as) : as:', as)
            /*********************************************
             * Response body is of []channel.Channel{..}
             ********************************************/
            uri ? auth.FetchAPI('GET', uri)
                        .then(respHandler)
                        .catch(logErr)
                : logErr('@ getOwnedChns(as)')
            
        }
        ,doUnsubscribe = (ev) => {
            if (ev.target.nodeName !== 'A') return
            if (!ev.target.hash.substring(1)) return
            const
                target = ev.target.hash.substring(1)
                ,payee = state.subs.filter((sub) => (target === sub.id))[0].payee_id
                ,txn = payee ? {
                    act: o.TxnAct.Subscribe,
                    xid: ev.target.hash.substring(1),
                    xis: o.TxnXIS.Channel,
                    payer_id: ss.auth.sub,
                    payee_id: payee,
                    tokens_q: -2,
                    tokens_p: 0,
                    csrf: o.rand(22)
                } : null
                ,uri = '/x'
                ,respHandler = (resp) => {
                    /****************************************
                     * @ Success, update auth-user record, 
                     * and then reset DOM's Subscriptions. 
                     ***************************************/
                    if (resp.meta.status === 201) {
                        o.Auth().SubRecordGet()
                                .catch(logErr)
                    } else {
                        logErr('FAIL @ doUnsubscribe(as) : respHandler(resp) : resp:', resp)
                    }
                }

            txn && auth.FetchAPI('POST', uri, txn)
                        .then(respHandler)
                        .catch(logErr)
        }
        ,doDeleteProfile = (ev) => {
            /**********************************************************************
             * TODO: This is a simple update of a user record; sans transaction.
             **********************************************************************/
        }
        ,doPerAuthStatus = (as) => {
            state.as = as
            logDeb('@ doPerAuthStatus(as) : as:', as)
            /************************************************
             * Reset DOM els per (auth-status obj) user keys
             ***********************************************/
            // Abort lest valid auth-status obj
            if (!o.ttl(as.r.exp) || !as.user) {
                edit && edit.classList.add('warn')
                return
            } 

            // Show user-account handle (replace 'Account') 
            o.setText(accountH1, `/${as.user.handle}`)

            // Show user-account fields per matching key
            Object.keys(asUserEdits)
                .map(name => o.setText(asUserEdits[name], as.user[name]))

            // Show other user-account elements
            Object.keys(asUserStatics)
                .map(name => o.setText(asUserStatics[name], as.user[name].toLocaleString('en-US')))

            // Show/Reset subscriptions count to that of paid only (recurring + one-off)
            ;(as.user && asUserStatics.subing) 
                && o.setText(asUserStatics.subing, 
                    (as.user.subed_recur.length + as.user.subed_once.length).toLocaleString('en-US')
                )

            // Subscriptions : Get/Show all paid subscriptions of auth-user
            getSubscriptions(as)
            // Channels : Get/Show all channels owned by auth-user
            getOwnedChns(as)
            
            // Listen @ Edit/Save/Cancel
            settings && [edit, save, cancel].map(el => el 
                && el.addEventListener('click', doEdit)
            )

            // Set Exchange mode per user's buyin-profile status
            addP && (as.user.profile_buyin
                ? addP.href = '/app/c4' // per profile
                : addP.href = '/app/c3' // per card info (hosted popup form)
            )
        }
        ,doP2qExchange = () => {
            if (state.idem)  return
            state.idem = true 
            submit.disabled = true

            const 
                txn = {
                    act: o.TxnAct.P2q,
                    xid: ss.auth.sub,
                    xis: o.TxnXIS.User,
                    payer_id:  ss.auth.sub,
                    payee_id: ss.channel.owner_id,
                    tokens_q: 0,
                    tokens_p: parseInt(amount.value, 10) || 0,
                    csrf: o.rand(22)
                }
                ,uri = '/x'
                ,respHandler = (resp) => {
                    const 
                        success = () => (
                            exch.addQ.dd[1].innerHTML = `<h1>SUCCESS : <a href="/app/account">Account</a> updated</h1>`
                        ) 
                    // @ Fail, inform.
                    resp.body.error && (exch.addQ.dd[1].innerHTML = `<h1>FAIL : ${resp.body.error}</h1>`)
                    // @ Success, update auth-user record and inform.
                    ;(resp.meta.status === 201) && (
                        o.Auth().SubRecordGet()
                            .then(success)
                            .catch(logErr)
                    )
                }

            auth.FetchAPI('POST', uri, txn)
                    .then(respHandler)
                    .catch(logErr)
        }
        ,doGoToHash = (ev) => {
            if (ev.target.innerText && ev.target.innerText.includes('WordPress Plugin'))
                return
            if (!ev.target.hash && !window.location.hash) 
                return
            if (o.getText(ev.target) === 'Account') 
                return
            if (ev.target.innerText === 'Requires Login')
                return
            ev.preventDefault()
            if ((ev.target.nodeName !== 'A') && (ev.target.nodeName !== '#document')) {
                return
            }
            if (ev.target.hash || window.location.hash) {
                const 
                    target = (ev.target.hash && o.css(`${ev.target.hash}`))
                            || (window.location.hash && o.css(`${window.location.hash}`))
                    ,yTarget = target ? target.getBoundingClientRect().top : 0

                window.scrollTo({
                    top: window.pageYOffset + yTarget - (20 + header.clientHeight),
                    left: 0,
                    behavior: 'smooth'
                })
            }
        }
        ,doGoToCentre = (ev) => {
            /**********************************************************
             * @ /app/centre : scroll to content per menu selection
             * DEPRICATED: Instead of scroll to content, using
             * chnMenu click listen/handle : doShowContent(..)
             *********************************************************/
            logFocus(ev.target)
            if (!ev.target.dataset.item) return 
             
            const 
                target = o.css(`#${ev.target.dataset.item}`)
                ,yTarget = target ? target.getBoundingClientRect().top : 0

            window.scrollTo({
                top: window.pageYOffset + yTarget - header.clientHeight,
                left: 0,
                behavior: 'smooth'
            })
        }
        ,doShowContent = (ev) => {
            /*********************************************
             * Toggle content per click @ chnMenu item
             ********************************************/
            contentIDs.filter((id,i) => 
                (ev.target.hash === `#${i+1}`)
                    ? o.css(`#${id}`).classList.remove('hide')
                    : o.css(`#${id}`).classList.add('hide')
            )
        }

    logDeb(debugOFF)

    // If channel has a header menu, then add margin-top, else shrink logo
    chnMenu && (app.style.marginTop = '1em') //: logo.classList.add('small')

    // LISTENers

    // @ Any page having chnMenu
    chnMenu && chnMenu.addEventListener('click', doShowContent)

    // @ Account|Exchange page
    ;(account || exchange) && eb.sub(eTypes.Auth, o.throttle(3000, doPerAuthStatus))

    // @ Account : Unsubscribe
    paidSubs && paidSubs.addEventListener('click', doUnsubscribe)

    // @ Account : Delete Payment Profile 
    // TODO: ... this; a simple user update; sans transaction.

    // @ Exchange page
    Object.keys(exch).map(x => 
        exch[x].dt && exch[x].dt.addEventListener('click', doToggleExch(exch[x].dd))
    )
    if (exchange && !profile || install) {
        // Scroll to bookmark (hash) if exist
        self.addEventListener('load', doGoToHash) 
        Object.values(dlHashTargets).map(el => el.addEventListener('click', doGoToHash))
    }
    // Form : Add-q (P2q exchange)
    amount && amount.addEventListener('keyup', chkValidity)
    amount && chkValidity()
    formP2q && submit.addEventListener('click', doP2qExchange)

    // @ Profiles : Buyin / Payout
    //addBuyinProfile && addBuyinProfile.addEventListener('click', doToggleAddBuyinProfile)
    //addPayoutProfile&& addPayoutProfile.addEventListener('click', doToggleAddPayoutProfile)

    // Centre 
    //chnMenu && chnMenu.addEventListener('click', doGoToCentre)


})(window[__APP__] = window[__APP__] || {}) 
