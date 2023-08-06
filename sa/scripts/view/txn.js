
// View : txn
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'txn'
        /********************************************************************
         * Token transactions may occur at message, channel, user or group.
         * Such spawn network fetches and DOM mutations before and after.
         * Though a View key, this IIFE is not of a view component per se. 
         * It operates on events per listeners/handlers attached on init, 
         * rendering and such thereby rather than per State log.
         * 
         * It handles all transaction events at
         * #owner, #msg-list, and modal(s) launched therefrom; 
         * POSTs transactions and fetches updated targets per AJAX, 
         * and publishes under several eTypes, some of which spawn a 
         * View/Action/State loop, affecting other View keys downstream.
         * 
         * @ #owner 
         *  - q, P (Sponsor/Subscribe)
         * @ #msg-list
         *  - q, P (Sponsor), Punish
         ******************************************************************/
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)

    keys[cName] = (() => {
 
        // @ init 
        const 
            /*************************************************
            * modalCtnr is a popup form to get user input 
            * for sponsor/subscribe transaction of p-tokens.
            *************************************************/
            articleNode = o.css('#article')
            ,modalCtnr = o.css("#modal-sponsub")
            ,modal = modalCtnr ? {
                wrapper: o.css('.wrapper', modalCtnr)
                ,heading: o.css('.header H1', modalCtnr)
                ,main: o.css('.main', modalCtnr)
                ,close: o.css('.close', modalCtnr)
                ,submitForm: o.css('#submit', modalCtnr)
                ,submitButton: o.css('#submit BUTTON', modalCtnr)
                ,limit: o.css('.main .fund-source label SPAN B', modalCtnr)
                // INPUT elements
                ,one: o.css('#radio-amount-one', modalCtnr)
                ,two: o.css('#radio-amount-two', modalCtnr)
                ,five: o.css('#radio-amount-five', modalCtnr)
                ,other: o.css('#text-amount-other', modalCtnr)
                ,source: o.css('#check-fund-source', modalCtnr)
                ,sponsor: o.css('#radio-action-sponsor', modalCtnr)
                ,subscribe: o.css('#radio-action-subscribe', modalCtnr)

                ,message: o.css('.main .message TEXTAREA', modalCtnr)
            } : {}
            ,txnMsg = modalCtnr ? {
                get: function _get() { return modal.message.value; },
                set: function _set(msg) { msg ? (modal.message.value = msg) : modal.message.value = ''; }
            } : {get:()=>{}, set:()=>{}}
            ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
            ,ghost = o.create('GHOST')
            ,subscribeInput = modalCtnr ? o.css('.main .action[data-action="subscribe"]', modalCtnr) : ghost
            ,channel = o.css('#channel') || ghost
            ,over = o.css('#overlay-2')  || ghost
            ,blur = 'blur'
            ,hide = 'none'
            ,show = 'block'
            ,closeModal = (save) => {
                save || stateReset()
                txnMsg.set()
                
                modalCtnr.removeEventListener('keyup', o.debounce(100, doKeyUp))
                modalCtnr.removeEventListener('click', o.debounce(200, doClick))

                modalCtnr.classList.add('hide') 
                channel.classList.remove(blur)
                modal.close.classList.add('rotate')
                over.style.display = hide 

                subscribeInput.classList.remove('hide')
            }
            ,resetModal = (content) => {//... failed attempt at spinner
                const overlay = () => `<div class="modal-overlay spin">${content}</div>`
                o.toDOM(modal.wrapper, overlay())
            }
            /***************************************************************
             * Local state obj shares transaction state across DOM states;
             * a less restrictive alternative to Dataset k-v pairs.
             **************************************************************/
            ,state = {
                channel: {},
                valid: false,   // Enable|Disable the submit button
                virgin: true,   // False on 1st keyup (idempotent)
                gw: false,      // Payment-gateway flag (per toggled source of funds)
                limit: 0,       // User.TokensP count
                psp: {},        // User.PSP state
                txn: {},        // DOM state 
                x: {},          // POST-payload state
            }
            ,stateReset = () => { //... per popup.
                state.valid = false
                state.virgin = true
                state.gw = false 
                state.limit = 0
                state.txn = {}
                state.x = {}
            }
            ,headingReset = () => {// Interval in weeks
                const interval = Math.floor(+state.txn.amount/state.channel.sub_rate * 4.33)
                                    // Add one extra week per additional month
                                    + Math.floor((+state.txn.amount/state.channel.sub_rate) - 1)
                // Reset heading lest amount is zero
                state.txn.amount && (modal.heading.innerHTML = `
                    ${+state.txn.amount} <span class="token">P</span> buys ${interval} weeks
                `)
            }
            /**************************************************************
            * @ keyup, uncheck radio buttons on user input @ modal.other.
            **************************************************************/
            ,doKeyUp = (ev) => {
                (modal.other.value) 
                    && [modal.one, modal.two, modal.five]
                            .map(el => (el.checked = false))
                validate()
                headingReset()

                state.virgin && (
                    (modal.other.placeholder = '')
                    ,(state.virgin = false)
                )
                validate()
                state.valid && logDeb('@ doKeyUp : valid state:', state)
            }
            /******************************************************
             * UPDATE : Issue caused by redirect out of IFRAME
             * @ msg-list.js . See line 1225+
             * *********************************************
             * Explicitly set checked attribute per target.
             * Inexplicably, all radio and checkbox INPUT targets
             * of the modal are dead if in WordPress IFRAME.
             *****************************************************/
            ,deadSet = (target) => (
                // Radio : check
                (+target.dataset.x === 1) && (modal.one.checked = true)
                ,(+target.dataset.x === 2) && (modal.two.checked = true)
                ,(+target.dataset.x === 5) && (modal.five.checked = true)
                ,(+target.dataset.recur === 0) && (modal.sponsor.checked = true)
                ,(+target.dataset.recur === 1) && (modal.subscribe.checked = true)
                // Checkbox : toggle
                ,(target.dataset.source === 'existing') && (
                    (modal.source.checked === true) 
                        ? (modal.source.checked = false) 
                        : (modal.source.checked = true) 
                )
                //,logFocus(`'${target.dataSource}'`)
            )
            /*****************************************************
            * @ click, publish on submit, else clear modal.other 
            * value if any radio-amount checked.
            *****************************************************/
            ,doClick = (ev) => {
                // modal.one.checked = true // Okay; can force
                // deadSet(ev.target)
                // logFocus(ev.target.innerHTML,modal.one, modal.subscribe)
                !![modal.one, modal.two, modal.five].map(el => 
                    (el.checked === true) && (modal.other.value = '')
                )
                validate()
                headingReset()

                const 
                    action = 'sponsor' //(+state.x.act === 2) ? 'subscribe to' : 'sponsor'    
                    ,xis = ((+state.x.xis === 1) && 'message')
                                || ((+state.x.xis === 2) && 'channel')
                                    || ((+state.x.xis === 3) && 'channels')
                    ,msgText = `I appreciate your ${xis}.`

                txnMsg.get() || txnMsg.set(msgText)

                !!(state.valid && (ev.target.nodeName === 'BUTTON'))
                    && publishModal()
            }
            /****************************************************
            * Validate modal input and reset state accordingly.
            * Disable submit button lest state is valid.
            ****************************************************/
            ,max = (max) => max || 10 //... psp.lastMax
            ,validate = () => {
                state.valid = false
                
                // If other is valid, then set txn.amount to it; set FX accordingly.
                if (modal.other.checkValidity()) {
                    modal.other.classList.remove('invalid') 
                    state.txn.amount = modal.other.value
                    state.valid = true
                } else {
                    modal.other.classList.add('invalid')
                    state.valid = false
                }

                // If other is empty, then set txn.amount per checked radio-amount-* button
                if (!modal.other.value) {
                    state.valid = false
                    ;[modal.one, modal.two, modal.five].map(el => {
                        if (el.checked === true) {
                            state.txn.amount = el.value
                            state.valid = true
                        }
                    })
                }

                // Set gateway flag per source checkbox (toggle)
                if (modal.source.checked === true) {
                    state.gw = false
                    limit(state.limit)
                } else {
                    state.gw = true
                    limit((2 * max(state.psp.lastMax)))
                }

                // Set amount limit per toggled source of funds
                if (state.gw) {
                    // If using payment gateway, then limit amount per user history (psp.lastMax)
                    if (state.txn.amount > (2 * max(state.psp.lastMax))) {
                        state.valid = false
                        modal.other.classList.add('invalid')
                        modal.limit.classList.add('invalid')
                    } else {
                        modal.limit.classList.remove('invalid')
                    }
                } else {
                    // If sans gateway, then limit amount per User.TokensP (existing tokens)
                    if (state.txn.amount > state.limit) {
                        state.valid = false
                        modal.other.classList.add('invalid')
                        modal.limit.classList.add('invalid')
                    } else {
                        modal.limit.classList.remove('invalid')
                    }
                }
    
                // Set x.act per checked radio-action-* button
                ;[modal.sponsor, modal.subscribe].map(el => 
                    (el.checked === true) && (state.x.act = el.value)
                )

                // Enable submit button if valid, else disable; set FX accordingly.
                if (state.valid) {
                    modal.submitButton.disabled = false
                    modal.submitButton.classList.remove('disabled')
                } else {
                    modal.submitButton.disabled = true
                    modal.submitButton.classList.add('disabled')
                }
            }
           ,limit = (p) => o.setText(modal.limit, p)
            /*****************************************************
            * Publish the modal-modified transaction payload (x)
            *****************************************************/
            ,publishModal = () => {
               // Synch txn and x amounts (int); preserve txn.action (DOM string)
                state.txn.amount = +state.txn.amount
                state.x.tokens_p = +state.txn.amount
                state.x.act      = +state.x.act
                state.txn.msg    = txnMsg.get()
 
                // FAILing attempts @ spinner
                //resetModal(`<h1 class="heart-beat">Processing</h1>`)
                //resetModal(`<svg><use href="${svgLogoDef}"></use></svg>`)
                
                closeModal(true)

                eb.pub(eTypes.Modal, state.x)
            }
            /*************************************************************
            * Launch and init modal, and attach its listeners/handlers.
            *************************************************************/
            ,openModal = (ev) => {
                const ss = o.State().store
                state.psp = o.Auth().UserPSP(ss.auth)
                state.limit = (ss.auth && ss.auth.user.tokens_p) ? ss.auth.user.tokens_p : 0
                state.channel = ss.channel
                state.owner = ss.owner

                // Set modal position (y) : directly over the target to handle all cases.
                //modalCtnr.style.top = `${o.top(ev.target)}px` 

                o.aDelay(350, () => {//... delay modal popup to allow heartbeat FX.
                    /****************************************************************
                     * Hide the Subscribe option if target is a Message, 
                     * or if target is Channel to which user is already subscribed.
                     * Whereof allow only Sponsor transaction.
                     ***************************************************************/ 
                    if ((state.txn.xis === o.TxnXIS.Message)
                        || ((state.txn.xis === o.TxnXIS.Channel) 
                            && (ss.auth.user.subed_recur.includes(ss.channel.chn_id))
                        )) {
                        subscribeInput.classList.add('hide')
                        modal.subscribe.checked = false
                        modal.sponsor.checked = true
                    }

                    modal.heading.innerHTML = `Monthly Rate: 
                        ${state.channel.sub_rate} <span class="token">P</span>
                    `

                    modalCtnr.classList.remove('hide') 
                    // If no payment-gateway profile, then abort transaction and inform/link.
                    if (!state.x.anet.profile_customer_id || !state.x.anet.profile_payment_id) {
                        const 
                            header = o.css('.header H1', modalCtnr)
                            ,wrapper = o.css('.wrapper', modalCtnr)

                        wrapper.classList.add('abort')
                        header.innerHTML = `
                            <a href="/app/profile-buyin" class="button">
                                Add a Payment Profile
                            </a>
                        `

                        ;[modal.main, modal.submitForm].map(el => el.classList.add('hide'))

                        state.txn.actionNode.classList.add('warn')
                    }

                    modal.other.value = ''
                    over.style.display = show 
                    modal.close.classList.add('rotate')
                    channel.classList.add(blur)
                    validate()

                    attachListenersOnce()
                })
            }
            ,attach = () => {
                modalCtnr.addEventListener('keyup', o.debounce(100, doKeyUp))
                /********************************************************************** 
                 * BUG @ button type="submit"
                 * @ debounce : doClick : ev.preventDefault FAILs to prevent default
                 * @ throttle : doClick : validate() fires TWICE per click.
                 * 
                 * Workaround: change type="button"
                 ********************************************************************/
                modalCtnr.addEventListener('click', o.debounce(200, doClick))
            }
            ,attachListenersOnce = o.once(attach)
 
            /******************************************************
             * nodes are transaction-location targets (XID, XIS)
             *****************************************************/
            ,nodes = {
                msgList: o.css('#msg-list')
                ,owner: o.css('#owner-chn-buttons')
                //,channel: o.css('#channel') 
                //... No. channel listener overlaps msgList listener
            }
            ,authFail = 'auth-fail'
            ,toSelf = 'to-self'
            ,outOfq = 'out-of-q'
            /*******************************************
             * postTxnHandler(..) fetches the affected 
             * txn target (xid) and updates its view.
             ******************************************/
            ,postTxnHandler = (r) => {
                const x = r.body
                if (!(x && x.txn_id) || !(x.tokens_q || x.tokens_p)) {
                    // action-node FX @ txn FAIL
                    r.meta.status 
                        && ((r.meta.status >= 400) || (r.meta.status === 111))
                            && state.txn.actionNode.classList.add('warn')
                            //... still not catching Offline case; too far downstream.

                    return Promise.reject({
                        why: 'Transaction failed.', 
                        what: {
                            resp: r,
                            txn: state.txn
                        },
                        where: 'postTxnHandler(..)'
                    })
                }

                const
                    /********************************************************************************
                     * Ephemeral FX prior to txn pub spawning Action/State/View loop; 
                     * thereafter, cache is updated, so message rendering accounts for all txns.
                    ********************************************************************************/
                    xidMsgNode = o.css(`#m-${x.xid}`) //... not exist if x.xis is not of message type
                    ,actions = o.css('.actions', xidMsgNode)
                    ,qTokenNode = o.css(`.title[data-title=qToken]`, actions)
                    ,pTokenNode = o.css(`.title[data-title=pToken]`, actions)
                    ,punishNode = o.css(`.title[data-title=Punish]`, actions)
                    ,msgTknCount = {
                        qToken: o.css(`SPAN`, qTokenNode),
                        pToken: o.css(`SPAN`, pTokenNode),
                        Punish: o.css(`SPAN`, punishNode),
                    }
                    ,reckonCount = (span, amount) => {
                        var n = +(o.getText(span))
                        n = n ? (n + amount) : amount 
                        o.setText(span, `${n}`)
                    }
                    ,punished = () => {
                        // FX @ Punish 
                        const yea = o.css('.yea', actions)
                        o.setText(o.css(`SPAN`, punishNode), '')
                        o.purge(actions)
                        o.append(actions, yea)
                        o.append(yea, punishNode)
                        o.append(yea, qTokenNode)//... TODO: want qrate, not q

                        o.css('.msg', xidMsgNode).dataset.punished = 'true'
                    }
                    ,respHandle = r => r.body ? r.body : Promise.reject(r.meta)
                    ,yeaHandler = (txn) => {
                        // Reckon token count @ DOM : add txn amount to current/prior count.
                        reckonCount(msgTknCount[txn.action], txn.amount)
                        // Display pToken button (otherwise hidden) 
                        // only if qToken count exceeds minMsgQ4P.
                        ;(+(o.getText(msgTknCount['qToken'])) > view.minMsgQ4P) 
                            && (pTokenNode.classList.remove('hide'))
                        return x
                    }
                    ,nayHandler = (x) => {
                        // Reckon token count @ DOM : set per updated-msg data.
                        o.setText(msgTknCount['qToken'], x.tokens_q)
                        ;(o.getText(msgTknCount['qToken']) < 0) && punished()
                        return x
                    }
                    ,pubEvent = x => {
                        // Update state/store with txn-key data : spawn Action/State/View loop 
                        eb.pub(eTypes.Txn, x)
                        return x
                    }

                /***********************************
                 * Handle per action (r.body.act)
                 **********************************/

                //logFocus('postTxnHandler(..) : msgTknCount', msgTknCount)
                logDeb('postTxnHandler(..) : x:', x, 'state:', state)

                switch (true) {
                    /*****************************************************************
                     * Nominally, message transactions are reckoned by summing 
                     * the transacted token value with that read from the DOM, 
                     * but not so of Punish action, 
                     * whereof qToken cost is per qRate of punished member, 
                     * which changes per API-service function (unknown by client), 
                     * and so must fetch updated target prior to reckoning. 
                     * 
                     * If action is Follow/Unfollow (3), the affected target 
                     * is the subscriptions list of the authenticated user, 
                     * so their updated record is fetched/published.
                     * 
                     * In all cases, publish to spawn Action/State/View loop,
                     * updating affected target in cache, else txns are ephemeral.
                     ****************************************************************/
                    // XIS @ Message : punish (act=0, q=-1)
                    case (x.act === 0):
                        // Fetch the affected message; apply Punish-action FX; publish.
                        auth.FetchAPI('GET', `/m/${x.xid}`)
                            .then(respHandle)
                            .then(nayHandler)
                            .then(pubEvent)
                            .catch(logErr)
                        break

                    // XIS @ Message : reward (0 < act < 3, q|p > 0) 
                    case ((x.act === 1) && (x.xis === o.TxnXIS.Message)):
                        yeaHandler(state.txn)
                        // Fetch the affected message; publish
                        auth.FetchAPI('GET', `/m/${x.xid}`)
                            .then(respHandle)
                            .then(pubEvent)
                            .catch(logErr)
                        break

                    // XIS @ Channel, User, or Group
                    case (  ((x.act === 1) || (x.act === 2)) 
                            && (x.xis >= o.TxnXIS.Channel) 
                            && ((x.tokens_q !== 0) || x.tokens_p !== 0)
                        ):

                        if (x.tokens_p !== 0) {
                            /*********************************************************************
                             * Show gratitude on success of pTokens sponsor/subscribe @ Channel.
                             * Show amount and thank-you note (#owner pTokens button).
                             * Ephemeral; does not survive page reload. 
                             * 
                             * TODO: 
                             * We're not showing accumulated total channel.tokens_p, 
                             * yet that is publicly exposed. Pick one; either show or protect.
                             *******************************************************************/
                            var ghost  = ghost || o.create('GHOST')
                                ,owner = owner || o.css('#owner')
                            const pTokens = !owner ? ghost : o.css('.sponsor span[data-title="pToken', owner)
                            o.toDOM(pTokens, `${x.tokens_p.toLocaleString('en-US')} <em class="thanks">&hellip; Thank you!</em>`)
                        }

                        // Get and publish updated auth-user record.
                        o.Auth().SubRecordGet()

                        // Publish request for updated channel
                        eb.pub(eTypes.View, {
                            dType: o.dTypes.full
                            ,want: ['channel']
                            ,uri: ['c', x.xid]
                        })

                        break
                }

                if (x.tokens_p === 0) return r  
                /**************************************************************
                 * If txn is of P tokens, then publish a txn-notify message 
                 * regardless of txn target
                 *************************************************************/
                const 
                    ss = o.State().store
                    ,lType = Object.keys(o.lTypes)[ss.msg_list.type-1]
                    ,xid = (lType === o.lTypes.chn) ? ss.channel.chn_id : ss.channel.owner_id
                    ,postMsgHandler = x => {
                        /***************************************************
                         * Request fetch of newly created message.
                         * Response spawns another Action/State/View loop,
                         * thereby rendering the new message.
                         * 
                         * (Net module is subscribed to eTypes.View)
                         *************************************************/
                        eb.pub(eTypes.View, { 
                            dType: o.dTypes.diff
                            ,want: ['newer']
                            ,uri: ['ml', lType, xid]
                        })// uri: {pg, ml}, {pub, sub, chn}, xid, [, t [, n]] 

                        return x //... abide middleware pattern.
                    }
                    /***************************************************************
                     * xidMsg : If txn-target type (XIS) was message, 
                     * then reconstruct keys from Dataset API reads at its id, 
                     * else set target to a logically-adjacent recipient message;
                     * if at thread view (#article), 
                     * then to owner's oldest (thread-root) new message
                     * (#article.dataset.articleId), 
                     * else to owner's newest new message.
                     * Such are captured @ State().store log.
                     **************************************************************/
                    ,xidMsg = xidMsgNode 
                                ? {
                                    id: xidMsgNode.id.replace('m-', '')
                                    ,author_display: xidMsgNode.dataset.authorDisplay
                                    ,author_handle: xidMsgNode.dataset.authorHandle
                                }
                                : ( (article && ss.msg_list && ss.msg_list.oldest_owner_new)
                                    || (ss.msg_list && ss.msg_list.newest_owner_new) || {}
                                )
                    ,msg = {
                        form: o.mForm.short
                        ,to_id: xidMsg.id
                        ,to_display: xidMsg.author_display
                        ,to_handle: xidMsg.author_handle
                        ,chn_id: ss.channel.chn_id
                        ,author_id: ss.auth.sub
                        ,author_display: ss.auth.user.display
                        ,author_handle: ss.auth.user.handle
                        ,author_avatar: ss.auth.user.avatar || o.cfg.view.avatarDefault
                        ,author_badges: ss.auth.user.badges
                        ,body: state.txn.msg
                        ,sponsub: state.txn.amount
                    }

                logDeb('msg:', msg, 'state:', state)
                
                auth.FetchAPI('POST', '/m', msg)
                        .then(postMsgHandler)
                        .then(logDeb)
                        .catch(logErr)

                return r //... abide middleware pattern.
            }
            ,failHandle = err => {//... auth.FetchAPI publishes (upstream), so why here too?
                eb.pub(eTypes.Net, {
                    data: {http: {status: err.status, statusText: err.statusText}}, 
                    mode: o.aModes.promise
                })
                logErr(err)
            }
            /***********************************************************
             * getTxn(..) returns a transaction object containing 
             * all params required of API's transaction request, 
             * per event target (et) at either msgList or owner node.
             **********************************************************/
            ,getTxn = (et) => { 
                const 
                    ss = o.State().store
                    ,txn = {
                        actionNode: undefined, 
                        action: undefined, 
                        xid: '', 
                        xis: '',
                        payee: '', 
                        payer: '', 
                        amount: 0,
                        psp: auth.UserPSP(ss.auth),
                        msg: '',
                    }

                // Validate user is authenticated
                if (!(ss.auth && ss.auth.sub && ss.auth.r && o.ttl(ss.auth.r.exp))) {
                    txn.action = authFail 
                }

                // Filter out all but certain event targets, exploiting event delegation.
                // This is required due to one listener having multiple targets.

                // @ Message 
                txn.xis = o.TxnXIS.Message
                et.matches('.actions .title')
                    && (txn.actionNode = et) 
                et.matches('.actions .title svg')
                    && (txn.actionNode = et.parentNode) 
                et.matches('.actions .title svg use')
                    && (txn.actionNode = et.parentNode.parentNode) 

                // @ Channel 
                if (!txn.actionNode) {
                    txn.xis = o.TxnXIS.Channel
                    et.matches('span[data-title="Follow"]')
                        && (txn.actionNode = et) 
                    et.matches('span[data-title="Unfollow"]')
                        && (txn.actionNode = et) 

                    et.matches('use[href="#def-token-q')
                        && (txn.actionNode = et.parentNode) 
                    et.matches('svg[data-title="qToken"]')
                        && (txn.actionNode = et) 

                    et.matches('use[href="#def-token-p')
                        && (txn.actionNode = et.parentNode) 
                    et.matches('svg[data-title="pToken"]')
                        && (txn.actionNode = et) 
                }

                if (!txn.actionNode) return txn

                switch (txn.xis) {

                    case o.TxnXIS.Channel:
                        txn.payee = ss.channel.owner_id
                        txn.xid   = ss.channel.chn_id 
                        break

                    case o.TxnXIS.Message:
                        const targetMsg = o.ancestor(txn.actionNode, 'DIV.thread')
                        txn.payee = o.getID(targetMsg.dataset.authorId)
                        txn.xid   = o.getID(targetMsg.id)
                        break 
                }

                // Set payer per Auth object
                txn.payer = ss.auth.sub
                // Flag fail mode
                !!( (txn.payee === txn.payer) 
                    && (txn.actionNode.dataset.title !== 'Reply') 
                    && (txn.actionNode.dataset.title !== 'Repost')
                ) && (txn.action = toSelf)

                ss.auth.user && (ss.auth.user.tokens_q === 0) && (txn.action = outOfq)

                // Set action per dataset.title or fail mode
                txn.action = ((txn.action === authFail) || (txn.action === toSelf) || (txn.action == outOfq))
                                ? txn.action 
                                : txn.actionNode.dataset.title

                switch (txn.action) {
                    case 'qToken':
                    case 'Follow':
                        txn.amount = 1
                        break
                    case 'pToken':
                        txn.amount = 1 
                        break
                    case 'Punish':
                    case 'Unfollow':
                        txn.amount = -1
                        break
                    default:
                        txn.amount = 0
                        break
                }
                return txn 
            }
            /**************************************************
             * onTxn(..) handles all token-transaction events.
             * (Currently, none @ POST of form-msg.)
             **************************************************/
            ,onTxn = (ev) => {
                //ev.preventDefault()// FAILs to prevent @ IFRAME : other listeners attached ?
                const 
                    txn = getTxn(ev.target)
                    ,msgNode = txn.actionNode && o.ancestor(txn.actionNode, '.msg')

                if (!txn.actionNode) 
                    return 

                logDeb('onTxn(ev) : txn:', txn)

                if (msgNode && (msgNode.dataset.punished === 'true')) 
                    return

                // Conditionally abort and set FX per txn status
                switch (true) {
                    case (txn.action === authFail):
                        txn.amount = 0
                        //txn.actionNode.dataset.title = 'Login!' // killed by flex
                        txn.actionNode.classList.add('warn')
                        return
                    case (txn.action === toSelf):
                        txn.amount = 0
                        //txn.actionNode.dataset.title = 'To/From Self ???' // killed by flex
                        txn.actionNode.classList.add('warn')
                        return
                    case (txn.action === outOfq):
                        txn.amount = 0
                        //txn.actionNode.dataset.title = 'To/From Self ???' // killed by flex
                        txn.actionNode.classList.add('warn')
                        return
                    default:
                        txn.actionNode.classList.add('heart-beat')
                        o.aDelay(550, () => txn.actionNode.classList.remove('heart-beat'))
                        break
                }

                if ((txn.action === 'Reply') || (txn.action === 'Repost')) 
                    return

                // Normalize : create payload (x) from txn
                var x = {
                    act: 9999,
                    xid: txn.xid, 
                    xis: txn.xis,
                    payer_id: txn.payer, 
                    payee_id: txn.payee, 
                    tokens_q: 0,
                    tokens_p: 0,
                    anet: {},
                    csrf: o.rand(22),
                }

                switch (txn.action) {
                    case 'Punish':
                        x.act = o.TxnAct.Punish
                        x.tokens_q = txn.amount 
                        break
                    case 'qToken':
                    case 'Reward':
                        x.act = o.TxnAct.Sponsor
                        x.tokens_q = txn.amount
                        break
                    case 'Follow':
                    case 'Unfollow':
                        x.act = o.TxnAct.Subscribe
                        x.tokens_q = txn.amount
                        break
                    case 'pToken':
                        x.act = o.TxnAct.Sponsor
                        x.tokens_p = txn.amount
                        x.anet = {
                            profile_customer_id: txn.psp.cid,
                            profile_payment_id: txn.psp.pid, 
                        }
                        break
                }

                stateReset()
                state.txn = txn
                state.x = x

                logDeb('onTxn(..) :', {state: state, x: x, txn: txn})
                
                if (x.tokens_p) {
                    openModal(ev)
                } else {
                    doFetchAPI(x)
                }
            }
            /***********************************************************************
             * POST the transaction payload (x), then handle FX and after-actions.
             * 
             * Payment-gateway flag (state.gw) implies a two-step transaction;
             * first an ExchBuyin, adding x.tokens_p for cash drawn from gateway,
             * then either Sponsor or Subscribe (per x.act), 
             * sending the newly-acquired tokens to the target (payee).
             * Sans gateway flag, transaction draws from payer's existing tokens.
             *********************************************************************/
            ,doFetchAPI = (x) => {
                const uri = state.gw ? '/anet/ss' : '/x'
                auth.FetchAPI('POST', uri, x)
                        .then(postTxnHandler)
                        .then(logDeb)
                        .catch(failHandle)
            }

        /*************************************************
         * Close over the list of target nodes (XID/XIS)
         * whereof a token transaction may occur.
         ************************************************/
        nodes.keys = Object.keys(nodes).filter(key => (nodes[key] && nodes[key].id))
        
        if (!nodes.keys.length) return function() {} 

        /**************************************************
        * Attach a throttled click listener to each node.
        **************************************************/
        nodes.keys.map(key => nodes[key].addEventListener('click', o.throttle(777, onTxn)))

        /*******************************************************************
         * Attach click listener to selected targets, closing the modal
         * on any click anywhere else (over), or at its own close button.
        *******************************************************************/
        modalCtnr && [over, modal.close].map(el => el.addEventListener('click', closeModal))

        /***********************************
        * Listen to modal-published events
        ***********************************/
        eb.sub(eTypes.Modal, doFetchAPI) 

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... nothing left to do per State event.
            logDeb('published : data.txn:', data.txn)
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

