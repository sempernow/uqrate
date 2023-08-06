;(function(o, undefined){
    'use strict'
     /************************************************************************************ 
      * Thread toggler for #msg-list and #msg-list-menu nodes.
      * 
      * UPDATE: Also handle class 'new' FX. (Currently, but this should be segregated.)
      ***********************************************************************************/
    const 
        msgListRoot = o.css('#msg-list')
        ,msgListMenu = o.css('#msg-list-menu')

    if (!msgListRoot || !msgListMenu) return

    const 
        srcID = 'thread-toggler'
        ,cfg = o.cfg.view.msgs
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,dTypes = o.dTypes
        ,log        = o.log(srcID)
        ,logFocus   = o.log(srcID, o.log.levels.FOCUS)
        ,logErr     = o.log(srcID, o.log.levels.ERROR)

        ,css        = o.css
        ,cssAll     = o.cssAll
        ,create     = o.create
        ,setText    = o.setText
        ,aDelay     = o.aDelay
        ,throttle   = o.throttle
        ,dt = 500
        ,collapse   = 'collapse'
        ,expand     = 'expand'
        ,svg = (action) => `${cfg.svgsPath}#def-${action}`
        ,expanded   = svg(collapse)
        ,collapsed  = svg(expand)
        ,ghost = create('GHOST')
        ,_publish = () => eb.pub(eTypes.View, {
            want:  [],
            arg: 'toggleThreadFired',
            args:  [],
            uri:   [],
        })
        ,publish = o.debounce(200, _publish)
        ,page = o.Page()

        // Toggle thread per action (idempotent)
        ,toggleThread = (thread, action) => {
            const 
                siblings = cssAll(`#${thread.id}>.thread`, thread)
                ,threads = cssAll(`#${thread.id} .thread`, thread)
                ,button  = css('.toggle .title svg use', thread)
                ,count   = css('.toggle .count-replies', thread)
                ,state   = {flag: undefined, href: undefined}

            if (!button) {
                return logErr(
                    '@ toggleThread(..) : falsey button : implies DUPLICATE IDs rendered:', 
                    {thread: thread, action: action}
                )
            }

            page.embedded && publish()

            ;(action === collapse) 
                && ( state.flag = 'true'
                    ,state.href = collapsed
                    ,button.parentNode.parentNode.dataset.title = 'Expand'
                    ,count.textContent = `${siblings.length}/${threads.length}`
                  ) 
            ;(action === expand) 
                && ( state.flag = ''
                    ,state.href = expanded
                    ,button.parentNode.parentNode.dataset.title = 'Collapse'
                    ,count.textContent = ''
                  )

            ;[...siblings].map(el => {
                el.dataset.selfCollapsed = state.flag  
            })

            button.setAttribute('href', state.href)
            thread.dataset.threadCollapsed = state.flag

            // FX @ class 'new'
            // TODO: segregate these doings; they should have their own script.
            //aDelay(10000, ()=>[...siblings].map(el => el.classList.remove('new')))
        }
        // Return the targeted thread given an event target. 
        ,getThread = (et) => { 

            const state = {eTarget: undefined, thread: undefined}

            // Filter out all but certain event targets, exploiting event delegation.
            ;(et.matches('.toggle .title')) 
                && (state.eTarget = et.parentNode) 
            ;(et.matches('.toggle .title svg')) 
                && (state.eTarget = et.parentNode.parentNode) 
            ;(et.matches('.toggle .title svg use')) 
                && (state.eTarget = et.parentNode.parentNode.parentNode) 

            // If event target is relevant, then return the targeted thread
            // which is referenced thereof at event-target's dataset '-msg-ref=#m-<MESSAGE_ID>'
            ;(state.eTarget) 
                && (state.thread = css(`#${state.eTarget.dataset.msgRef}`))

            // FX @ class 'new' :: remove class from target thread.
            // TODO: segregate these doings; they should have their own script.
            ;(state.thread) && state.thread.classList.remove('new')

            return state.thread 
        }
        // Toggle event-target thread per dataset '-thread-collapsed' state (idempotent)
        ,toggleReplies = (e) => {
            const thread = getThread(e.target)
            ;(thread) && (
                (thread.dataset.threadCollapsed) 
                    ? toggleThread(thread, expand) 
                    : toggleThread(thread, collapse)
            )
        }

        /***********************************************************************
         * MsgListMenu :: Expand/Collapse All 
         **********************************************************************/
        ,msgListMenuAllToggle = css('li.toggle', msgListMenu) || ghost
        ,msgListMenuAllToggleWord = css('em', msgListMenuAllToggle)
        ,msgListMenuAllToggleButton = css('svg', msgListMenuAllToggle)
        ,msgListMenuAllToggleSVG = css('use', msgListMenuAllToggleButton)

        // Toggle all threads of dataset '-thread-replies=true', per action
       ,toggleAll = (action) => {
            if (msgListMenuAllToggle.dataset.disable === 'true') 
                return //... disabled @ chron mode (flat list)

            ;[...(cssAll('.thread', msgListRoot) || [])].map(el => { 
                (el.dataset.threadReplies === 'true') 
                    && toggleThread(el, action)
            })
        }
        // MsgListMenu :: Expand/Collapse All :: word, per action
        ,toggleWord = (action) => setText(msgListMenuAllToggleWord, 
            ((action === collapse)
                ? 'Expand'
                : 'Collapse'
            )
        )
        // MsgListMenu :: Expand/Collapse All :: init per action 
        ,msgListMenuInit = (action) => {
            ;(action === collapse)
                && ( toggleAll(collapse), 
                    msgListMenuAllToggleSVG.setAttribute('href', collapsed), 
                    toggleWord(collapse)
                )
            ;(action === expand)
                && ( toggleAll(expand), 
                    msgListMenuAllToggleSVG.setAttribute('href', expanded), 
                    toggleWord(expand)
                )
        }
        // MsgListMenu :: Expand/Collapse All :: event, per toggler's state.
        ,onMsgListMenuAllToggle = (ev) => {
            if (msgListMenuAllToggle.dataset.disable === 'true') 
                return
                
            // Hover FX per mouse enter/leave
            const mouse = {enter: (ev.type === 'mouseenter'), leave: (ev.type === 'mouseleave')}
            ;(mouse.enter) && (msgListMenuAllToggleButton.classList.add('hover'))
            ;(mouse.leave) && (msgListMenuAllToggleButton.classList.remove('hover'))
            if ( mouse.enter || mouse.leave) return 

            // Expand/Collapse per click
            ;(msgListMenuAllToggleSVG.getAttribute('href') === expanded)
                ? msgListMenuInit(collapse)
                : msgListMenuInit(expand)
        }

        /*********************************************************************
         * onPub1(ebMsg)
         * 
         * @param {object}  {   node: NODE
         *                      ,dType: dTypes.{full, diff}
         *                      ,want: [WANT1, WANT2, ...]
         *                  }
         * (Re)Attach click listener to reckon DOM mutation(s).
         * One listener handles all threads per Event Delegation.
         * Also set the toggle state per ebMsg and config params. 
         ***/
        ,onMsgListChange = (ebMsg) => {

            const 
                init = ebMsg.want.includes('init')
                ,reset = ebMsg.want.includes('reset')
                ,collapseThread = ebMsg.want.includes('collapseThread')

            if (!msgListRoot || (!reset && !init)) 
                return srcID

            // Detach the event listener.
            msgListRoot.removeEventListener('click', toggleReplies)  

             // Reset all threads to state declared at config param, on init.
            ;(init) && (
                (cfg.collapseAll) 
                    ? toggleAll(collapse)
                    : toggleAll(expand)
            )

            // Collapse a thread per ebMsg params
            ;(collapseThread) 
                && toggleThread(ebMsg.node, 'collapse')
            
            // Attach the event listener. 
            msgListRoot.addEventListener('click', toggleReplies)

            // Remove class 'new' from all threads after delay.
            // TODO: segregate these doings; they should have their own script.
            aDelay(10000, ()=>[...cssAll('.thread', msgListRoot)]
                .map(el => el.classList.remove('new')))

            return srcID
        }
        // Initialize msgListMenu per config param, per ebMsg
        ,onMsgListMenuSelect = (ebMsg) => {
            ebMsg.then(obj=>{
                const init = (obj && obj.data && obj.data.msgListMenu)
                ;(init) && (
                    (cfg.collapseAll) 
                        ? msgListMenuInit(collapse)
                        : msgListMenuInit(expand)
                )
                return srcID
            }).catch(logErr)
        }

    /**************************************************************************
     * INIT 
     **************************************************************************/
    // Init sans event.
    //onPubEvent({want: 'init'}) 

    // Listen/handle :: hover and click events at message-list menu toggle
    msgListMenuAllToggle.addEventListener('mouseenter', onMsgListMenuAllToggle)
    msgListMenuAllToggle.addEventListener('mouseleave', onMsgListMenuAllToggle)
    msgListMenuAllToggle.addEventListener('click', throttle(dt, onMsgListMenuAllToggle))

    // Listen to Loader and View event types, 
    // and invoke onPubEvent per event pub (ebMsg) therefrom.
    eb.sub(eTypes.Loader, onMsgListChange)
    eb.sub(eTypes.View, onMsgListChange)
    eb.sub(eTypes.Action, onMsgListMenuSelect)

})( window[__APP__] = window[__APP__] || {} )
