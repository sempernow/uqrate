;(function(o, undefined){
    'use strict'
    /***********************************************************************************
     * Handle the message-submittal form; either the dynamic per-message reply form, 
     * #form-msg under #msg-list, or the static new-message form (#form-msg-new).
     * 
     * Toggle a single instance of the message-submittal form per 'click' event. 
     * (Re)Attach 'click' listeners per DOM mutations and click events; 
     * DOM mutations are signaled by eTypes.View per render event.
     *
     *  - One listener to the static new-message button. 
     *  - One listener to all the reply-message buttons; insert/remove #form-msg per.
     **********************************************************************************/
    const msgList = o.css('#msg-list')
    if (!msgList) return 

    const 
        cfg = o.cfg.view.msgs
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,srcID = 'form-msg'
        ,log = o.log(srcID)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = ''//o.log.debugOFF // ''
        ,logFocus = o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,css = o.css
        ,cssAll = o.cssAll
        ,create = o.create
        ,pathName = window.location.pathname
        ,svgReplyOpen = `${cfg.svgsPath}#def-reply-open`
        ,svgReplyClose = `${cfg.svgsPath}#def-reply-close`
        ,svgNewClose = `${cfg.svgsPath}#def-reply-close`
        ,ghost = create('GHOST')
        //,formMsgNew = css('#form-msg-new')
        //,formMsgNewButton = css('BUTTON', formMsgNew) //|| ghost 
        //... BUG if not exist; returns other button node.
        ,formMsgNew = css('#form-msg-new')
        ,formMsgNewButton = css('#form-msg-new BUTTON') || ghost
        ,formNewMsgStr = 'New Message'
        /********************************************************
         * There is always zero or one message form per page; 
         * this one form is inserted/removed per button click.
         ******************************************************/ 
        ,formMsgGet = () => css('#form-msg') 
        ,formMsg = `
             <div id="form-msg" class="form-msg">
                <form method="post" action=""> 
                    <fieldset name=inner class="">

                        <label for="title" class="">Title</label>
                        <textarea type="text" 
                            required
                            autocomplete=off
                            minlength=1
                            maxlength=128
                            name="title"
                            placeholder=""></textarea>
 
                        <label for="body" class="">Message</label>
                        <textarea type="text" 
                            required
                            autocomplete=off
                            minlength=1
                            maxlength=${cfg.maxShort}
                            name="body"
                            placeholder="&hellip;"></textarea>

                        <button type="submit">Publish</button>

                    </fieldset>
                </form>
            </div>
            `
        // Handle @ top or any child iframe ... 
        // https://stackoverflow.com/questions/580669/redirect-parent-window-from-an-iframe-action
        ,redirect = (path) => (window.top.location.href = path)
        ,targetState = {}

        /********************************
         * Init the target message form
         *******************************/
        ,initMsgForm = (target) => {
            /***********************************************************
             * Handle form input @ either 'New Message' or Reply
             * target: (svg.reply | #form-msg-new button.form-msg-new)
             **********************************************************/
            const 
                auth = o.Auth()
                ,ss = o.State().store
                ,isChnOwner = ss.owner ? (ss.owner.user_id === ss.auth.sub) : false
                ,isLongForm = ss.channel ? (ss.channel.msg_form === o.mForm.long) : false
                ,isThreadView = ss.view ? (ss.view.vname === 'thread-view') : false
                ,isReply = !(target === formMsgNewButton)
                // Dynamic elements : DOM mutates per click of reply-message button.
                ,form = css('FORM', formMsgGet())
                ,submit = css('BUTTON', form)
                ,bodyLabelNode = css('LABEL[for="body"]', form)
                ,titleLabelNode = css('LABEL[for="title"]', form) 
                ,bodyTextNode = css('TEXTAREA[name="body"]', form) 
                ,titleTextNode = css('TEXTAREA[name="title"]', form) 
                ,thread = target.closest('div.thread')
                ,chnID = (thread && thread.dataset.chnId) || ss.channel.chn_id
                ,toID = thread ? thread.id.replace('m-', '') : undefined
                /***********************************************************************
                 * Muster the message obj
                 * 
                 * Currrenly allowing only short-form (o.mForm.short) messages.
                 * TODO : msg.form : select per lTypes (pub or slug) and new or reply
                 **********************************************************************/
                ,msg = {
                    form: o.mForm.short
                    ,chn_id: chnID
                    ,to_id: toID
                    ,to_display: toID ? thread.dataset.authorDisplay : undefined
                    ,to_handle: toID ? thread.dataset.authorHandle : undefined
                    ,author_id: ss.auth.sub
                    ,author_display: ss.auth.user.display
                    ,author_handle: ss.auth.user.handle
                    ,author_avatar: ss.auth.user.avatar || o.cfg.view.avatarDefault
                    ,author_badges: ss.auth.user.badges
                    ,csrf: o.rand(22)
                }
                // @ User is no longer authenticated.
                ,handleNotAuthenticated = () => {
                    // Inform per button text, and redirect to login page on button click.
                    [bodyLabelNode, bodyTextNode, titleLabelNode, titleTextNode]
                        .map(el =>el.classList.add('hide'))
                    o.setText(submit, 'Login required')
                    submit && submit.addEventListener('click', (ev) => {
                        ev.preventDefault()
                        redirect('/app/login')
                    })
                }
                // @ Auth status object lacks auth.user object.
                ,handleMissingUser = (target) => {
                    // Retrieve auth.user record, then redirect back to target message.
                    const div = o.ancestor(target, 'div.thread')
                        ,frag = div ? `#${div.id}` : ''
                    auth.SubRecordGet().then(() => redirect(window.location.href+frag))
                }
                // Validate the form
                ,state = {invalid: true}
                ,validNodes = (isLongForm && isChnOwner && !isThreadView && !isReply) 
                    ? [bodyTextNode, titleTextNode]
                    : [bodyTextNode]
                ,chkValidity = () => (
                    validNodes.map(el => el.checkValidity() 
                        ? ( el.classList.remove('invalid')
                        )
                        : ( el.classList.add('invalid')
                            ,(state.invalid = true)
                        )
                    ),
                    (state.invalid)
                        ? ( submit.classList.add('disabled')
                            ,(submit.disabled = true)
                        )
                        : ( submit.classList.remove('disabled')
                            ,(submit.disabled = false)
                        )
                )
                ,doMsgSubmit = (ev) => {
                    ev.preventDefault()
                    const 
                        xid = (x) => {
                            switch (o.lTypes[ss.active.type]) {
                                case o.lTypes.chn:
                                    return ss.channel.chn_id 
                                case o.lTypes.pub:
                                case o.lTypes.sub:
                                    return ss.channel.owner_id
                                case o.lTypes.th:
                                    return x.body.msg_id
                                default:
                                    break
                            }
                        }
                        ,postHandler = resp => {
                            /***************************************************************
                             * Toggle the form. This nested ev.target is a submit button, 
                             * but send form toggler the original target (message button).
                             **************************************************************/
                            toggleFormMsg({target: target})
        
                            logDeb('@ postHandler : resp:', resp)

                            if (resp.meta && resp.meta.status > 399) 
                                return Promise.reject({
                                    body: resp.body,
                                    meta: resp.meta
                                })

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
                                ,uri: ['ml', ss.active.type, xid(resp)]
                            })// uri: {pg, ml}, {pub, sub, chn, th}, xid, [, t [, n]] 
            
                            return resp //... abide middleware pattern.
                        }

                    
                    msg.title = titleTextNode.value
                    msg.body  = bodyTextNode.value
                    msg.form  = ss.channel.msg_form
                    ;(ss.owner.user_id !== ss.auth.sub)
                        && (msg.form = o.mForm.short)
                    ;(msg.to_id)
                        && (msg.form = o.mForm.short)

                    logDeb('@ doMsgSubmit : msg:', msg)
                    
                    auth.FetchAPI('POST', '/m', msg)
                            .then(postHandler)
                            .then(logDeb)
                            .catch(logErr)

                }

            // Conditionally show or hide title INPUT, and set focus accordingly.
            ;(isLongForm && isChnOwner && !isThreadView && !isReply) 
                ? titleTextNode && titleTextNode.focus()
                : ( [titleTextNode, titleLabelNode]
                        .map(el => el.classList.add('hide'))
                    ,bodyTextNode && bodyTextNode.focus()
                )

            /***********************************************
             * Handle form submittal per auth.FetchAPI(..)
             **********************************************/

            !targetState.svg && (
                (targetState.svg = target),
                (targetState.use = target.firstElementChild)
            )//... who cares? Was this for DEV/TEST ???

            if (!(ss.auth && o.ttl(ss.auth.r.exp))) {
                handleNotAuthenticated()
                return
            }
            if (!(ss.auth && ss.auth.user && ss.auth.user.handle)) {
                handleMissingUser(target)
                return
            }
            state.invalid = true
            chkValidity()

            // Listen/Manage : textarea; idempotent per key entry.
            form && form.addEventListener('keyup', 
                o.throttle(100, (ev) => {
                    state.invalid = false
                    chkValidity()
            }))

            submit && submit.addEventListener('click', doMsgSubmit)
        }

        /*********************************************
         * Toggle form : insert/remove per ev.target 
         * (target: svg.reply | button.form-new-msg)
         ********************************************/
        ,toggleFormMsg = (ev) => { 

            const 
                target = ev.target
                ,state = {
                    form: formMsgGet()
                    ,useReply: cssAll('#msg-list svg.reply use') || []
                    ,active:    undefined
                    ,button:    undefined
                    ,container: undefined
                }

            // Publish toggle request; See loader @ IFRAME
            eb.pub(eTypes.View, {
                node:  state.form,
                dType: null,
                want: [],
                arg:   'toggleFormRequest',
                args:  [],
                uri:   []
            }) 

            /***********************************************************
             * Find the intended target (button) from the event target
             **********************************************************/
            ;( (target && target.matches('svg.reply')) 
            || (target && target.matches('svg.new')) ) 
                && (
                    state.button = target,
                    state.active = state.button.querySelector('use')
                )
            ;( (target && target.matches('svg.reply use')) 
            || (target && target.matches('svg.new use')) ) 
                && (
                    state.active = target,
                    state.button = state.active.parentNode 
                )
            ;(state.button) 
                //&& (state.container = state.button.parentNode.parentNode.parentNode.parentNode)
                && (state.container = o.ancestor(state.button, 'div.options'))

            ;(target && (target === formMsgNewButton)) 
                && (
                    state.button = target,
                    state.container = css('#form-msg-new form') 
                    //... state.button.parentNode
                )

            // Prevent toggle if out of q 
            const ss = o.State().store
            if ((ss.auth && ss.auth.user && (ss.auth.user.tokens_q === 0))) {
                if (state.button) {
                    state.button.disabled = true
                }
                return
            }

            /*****************************************************
             * Toggle #form-msg : guarantee DOM has one or none.
             ****************************************************/
            // @ Case : no form is open.
            if (!state.form) {
                // const msgNode = o.ancestor(state.container, '.msg')
                // if (msgNode && msgNode.dataset.punished === 'true') 
                //     return 
                //... depricated; all actions are removed upon negative qToken count.
                // Append form to target
                if (state.button) {
                    state.container.insertAdjacentHTML('afterend', formMsg)
                    state.form = formMsgGet()
                    state.form.querySelector('textarea').focus()

                    initMsgForm(target)
                }
                if (state.button !== formMsgNewButton) {
                    // button FX @ reply-msg form
                    if (state.active) {
                        state.active.setAttribute('href', svgReplyClose)
                        state.button.classList.add('active')
                    }
                } else {
                    // button FX @ new-msg form
                    formMsgNewButton
                        && (formMsgNewButton.innerHTML = `
                            <svg class="new"><use href="${svgNewClose}"></use></svg>`
                        )
                }


            // @ Case : form is already open (anywhere).
            } else { 
                if (state.button) {
                    // find & close (remove) the form (wherever it is).
                    state.form.remove()
                    ;[...state.useReply].map(el => 
                        el.parentNode.classList.contains('active')
                            && (el.setAttribute('href', svgReplyOpen),
                                el.parentNode.classList.remove('active')
                            )
                    )
                    // button FX @ new-msg form 
                    formMsgNewButton
                        && (formMsgNewButton.innerHTML = formNewMsgStr)
                }
            }
        }
        /*****************************************************
         * (Re)Attach click listeners to reckon DOM changes.
         ****************************************************/
        ,onDemand = (ebMsg) => {
            if ((ebMsg.arg !== 'toggleFormRequest') && !ebMsg.want.includes('init'))

                return
           
            // Detach
            {
                formMsgNewButton 
                    && formMsgNewButton.removeEventListener('click', toggleFormMsg) 
                msgList 
                    && msgList.removeEventListener('click', toggleFormMsg)
            }
            // Re-attach
            {
                // @ form button : New message
                formMsgNewButton
                    && ( formMsgNewButton.innerHTML = formNewMsgStr
                        ,formMsgNewButton.addEventListener('click', toggleFormMsg)
                    )
                // @ form button : Reply message 
                msgList 
                    && msgList.addEventListener('click', toggleFormMsg)
            }

            return srcID
        }

    //;[msgList,formMsgNewButton].map(el =>logFocus({name: el.nodeName, id: el.id, class: el.className}))

    logDeb(debugOFF)

    // @ Init
    eb.sub(eTypes.Loader, onDemand)
    // @ DOM mutations 
    eb.sub(eTypes.View, onDemand)

    // Hide "New Message" form BUTTON @ /sub channel (Timeline tab: "Incoming+").
    ;(pathName.substring(pathName.length - 4) === '/sub')
            && (formMsgNew.style.display = 'none')

})( window[__APP__] = window[__APP__] || {} )
