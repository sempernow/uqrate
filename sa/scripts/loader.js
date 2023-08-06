;(function(o, undefined){
    'use-strict'
    /**************************************************************************
     * Loader is the application initialization script 
     *************************************************************************/
    //console.log('@',(document.currentScript.src).split('/').reverse()[0])

    // Reset scroll to top on (just before) page reload  
    window.addEventListener('beforeunload', () => window.scrollTo(0, 0))
    //... https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event

    // @ Page load 
    window.addEventListener('load', () => {

        // Load cfg object else die.
        if ((typeof o.cfg === 'undefined') || (typeof o.cfg.loader === 'undefined')) {
            console.log('@ Loader : FAIL @ cfg')
            return
        }

        const 
            srcID = 'Loader'
            ,log = o.log(srcID)
            ,logDeb = o.log(srcID, o.log.levels.DEBUG)
            ,debugOFF = ''//o.log.debugOFF  // ''
            ,logFocus = o.log(srcID, o.log.levels.FOCUS)
            ,logErr = o.log(srcID, o.log.levels.ERROR)
            ,cfg = o.cfg.loader
            ,eb = o.EB()
            ,eTypes = eb.eTypes() 
            ,filltext = o.filltext
            ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
            ,pageView = o.css('#view')
            ,page = o.Page()

            // @ DEV/TEST : Bypass IFRAME-source validation.
            ,mockValid = false

            ,iframeHandler = (state) => {
                /****************************************************************
                 * This runs once, initializing IFRAME monitoring and messaging.
                 * 
                 * If @ IFRAME and parent validate, then listen to View events, 
                 * and post iframeStatus message to parent, per thread toggle,
                 * passing it the new pageView.clientHeight .
                 * 
                 * Also ... ???
                 * Send chn_id; client sends back chn_id and article obj, 
                 * which includes msg_id; we upsert using msg_id.
                 ***************************************************************/
                const 
                    eb = o.EB()
                    /***************************************************
                     * Post iframe height to parent:
                     * - per thread toggle.
                     * - per scheduled sequence.
                     **************************************************/
                    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage 
                    //,post = (msg) => page.parent.postMessage(msg, "*")
                    ,post = (msg) => page.parent.postMessage(msg, page.referrer)
                    ,iframeStatus = () => ({
                        referrer: page.referrer,
                        height: pageView.clientHeight,
                        state: {key: state.key, channel: state.channel}
                    })
                    ,onToggle = (ebMsg) => (
                        (ebMsg.arg === 'toggleFormRequest') || (ebMsg.arg === 'toggleThreadFired')
                    ) && o.aDelay(100, () => post(iframeStatus()))
                    ,schStatus = () => o.aScheduleSeq(o.seq125(200), () => post(iframeStatus()))

                // Per schedule
                schStatus()

                // Per toggle of any height-changing element
                eb.sub(eTypes.View, onToggle)
    
                window.addEventListener("message", (ev) => {
                    /********************************************************
                     * Listen for messages from parent page.
                     * Abort lest message source is (top-most) parent page.
                     *******************************************************/
                    if (page.top !== ev.source) return

                    /**********************************************************
                     * UPSERT the thread-root message (blog article or such) 
                     * of parent page; that for which we are hosting comments.
                     *********************************************************/
                    const 
                        article = (dataset) => dataset ? ({
                            chnOwner: dataset.chnOwner,
                            chnSlug: dataset.chnSlug,
                            msgId: dataset.msgId,
                            msgTitle: dataset.msgTitle,
                            msgSummary: dataset.msgSummary,
                            chnId: dataset.chnId, //... sent & returned
                        }) : undefined
                        // REDUNDANT : channelNode is REDUNDANT 
                        // See #article node : data-article-id="TID"
                        //,channelNode = o.css('#channel')
                        
                        // UPDATE : Client handles upsert
                        ,upsert = article(ev.data.dataset)
                        ,doUpsert = (article) => logDeb('TODO : UPSERT per Fetch / dataset API :', article)

                    // upsert && (upsert.chnId === state.channel.chn_id) && doUpsert(upsert)
                    
                    // REDUNDANT : Set TID/MID (thread-root message) per Dataset API (data-tid="TID")
                    //channelNode && ev.data.dataset && ev.data.dataset.msgId 
                    //    && (channelNode.dataset.tid = ev.data.dataset.msgId)

                    logDeb('Got msg from PARENT :', { 
                        data: ev.data,
                        top: page.top,          // https://fify.news/   (Restricted object)
                            ev: {
                            origin: ev.origin,  // https://fify.news    (String)
                            source: ev.source,  // https://fify.news/   (Restricted object)
                            target: ev.target,  // https://swarm.now/thread/MSG_ID  (This iframe)
                        },
                    })
                }, false)
            }

            /***************************************************************
             * validateParent(..) matches host against referrer;
             * page.referrer (window) v. channel.host_url (uqrate record).
             **************************************************************/
            ,validateParent = (url) => (
                    url && (page.referrer.indexOf(url) !== -1)
                ) ? true : false
            ,onState = (i) => {
                /****************************************
                 * Launch iframeHandler(..) and die.
                 ***************************************/
                const state = o.State().get(i)
                // Do nothing until state.channel key arrives. 
                if (!state.channel) return

                // Stop listening regardless
                eb.off(eTypes.State, onState)

                // Validate the iframe upon arrival of State's channel key.
                if (mockValid || validateParent(state.channel.host_url)) {
                    iframeHandler(state) // @ Success

                } else {                 // @ Fail
                    /*********************************************************
                     * On parent-validation fail, replace entire page view
                     * with a static content.
                     ********************************************************/
                    logDeb('state :', state ) 

                    // Replace this embedded-page content with static content.
                    const obj = JSON.stringify({ 
                            comment: (state.channel.slug === "404") 
                                ? 'Parent article NOT FOUND' : 'Channel host-referrer MISMATCH',
                            referrer: page.referrer,
                            chnHostURL: (state.channel.slug === "404") 
                                        ? 'N/A' : (state.channel.host_url || 'NONE'),
                            replies: (state.channel.slug === "404") 
                                        ? '404 (Not Found)' : 'N/A',
                        }, null, '\t')

                    // Static content @ fail : banner link, blurb, and meta-object str.
                    pageView.innerHTML = `
                        <div class="iframe-guard">
                            <a target="_parent" href="${cfg.origin}">
                                <svg>
                                    <use href="#def-uqrate-banner"></use>
                                </svg>
                            </a>
                            <p>
                                Speak your mind,<br>
                                mind your <span>P</span>s and <span>q</span>s,<br>
                                and <b>prosper</b>.
                            </p>
                            <div class="pre">
                                <pre>obj: ${obj}</pre>
                            </div>
                        </div>
                    `
                    return
                }

            }

        /****************
         * INIT the app
         ***************/

        /*******************************************************
         * IF in IFRAME, then hide most markup, mute colors, 
         * and listen to State for channel key,
         * whence iframe is validated/initialized.
        *******************************************************/
        page.embedded && ([
                o.css('HEADER'), 
                o.css('FOOTER'), 
                o.id('article'), 
                o.css('#owner .banner'), 
                o.css('#owner .channel H3'), 
                o.css('#owner .channel P'), 
                o.css('#owner .badge')
            ].map(el => el && el.classList.add('hide'))
            // ...o.cssAll('ASIDE.right') //... NO. Else main right-justified @ wide view

            ,page.embedded && pageView.classList.add('iframe-grayscale')

            ,eb.sub(eTypes.State, onState)
        )

        /*************************************************************
         * Regardless, publish load-event want(s) over the event bus.
         ************************************************************/
        eb.pub(eTypes.Loader, {want: ['init']})

        logDeb(debugOFF)
        logDeb('is @ iframe :', (page.embedded && page)) 

        /******************************
         * Service Worker : Register
         *****************************/
        ;(() => {
            const 
                onResolved = (registration) => {
                    log('REGISTERed \'' + cfg.sw + '\' @ SCOPE:'
                        ,registration.scope.replace(location.origin, '')
                    )
                }
                ,onRejected = (err) => {
                    logErr('FAILed @ REGISTERing', cfg.sw, '::', err)
                }

            ;('serviceWorker' in navigator)
                ? navigator.serviceWorker.register(cfg.sw)
                    .then(onResolved, onRejected)
                : log('NO SUPPORT for ServiceWorker API @ Browser')
        })//()

        /***************
         * LAB
         **************/
         ;(() => {   
            const buttonGroup = o.id('group-1')
            // buttons group click event bind/handle
            !!(buttonGroup) && buttonGroup
                .addEventListener('click', function (e) {
                    var f = e.target.innerHTML.replace('()','')
                    if (typeof o[f] === 'function') { 
                        o[f]()
                    }
                })

            // Populate `.filltext` class
            ;(typeof filltext === 'function') && (
                !![...document.querySelectorAll('.filltext')]
                    .map(el => el.textContent = filltext(el.dataset.sentences))
            )
        })//()

    })
})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
)
