/******************************************************************************
 * This FILE is AUTO-GENERATED from source (.gojs) @ PWA-service launch.
 *
 * host : https://swarm.foo
 *****************************************************************************/
;(function(o, undefined){
    'use strict'
    /**************************************************************************
     * uqrate.js : Hosted comments : © Sempernow LLC 
     * 
     * This script runs in the parent page requesting the hosted comments.
     * It communicates with iframeHandler(..) at a script of the iframe.
     * The minimum markup, shown below, is required at parent page.
     * That markup loads this script, which then loads the iframe 
     * whence comments to the parent-page article are hosted.
     * 
     *   <div id="uqrate-iframe-container" data-msg-id="MSG_ID">
     *       <!-- uqrate.js inserts IFRAME here -->
     *   </div>
     *   <script src="https://uqrate.org/sa/scripts/uqrate.min.js"></script>
     * 
     * - MSG_ID is that of the long-form message published at uqrate.org .
     *   It refrences the parent-page article of the hosted comments.
     * 
     * - Client is responsible for publishing the article to uqrate.org, 
     *   and for inserting its *static-reference* value (MSG_ID) into markup.
     *   Publishing the article is accomplished through either the web app 
     *   interface at uqrate.org, or through uqrate services either through 
     *   the client app (below) or as documented at its "API" page (TODO). 
     * 
     * - Uqrate services are also accessible through a WordPress plugin
     *   and an http client app (uqc), enabling any uqrate member 
     *   to concurrently host their own channel(s) at a static site, 
     *   or vice versa, whereof each article has its comments section 
     *   dynamically hosted by uqrate services. 
     * 
     *      WordPress plugin:     https://wordpress.org/plugins/uqrate
     *      http-client app:      https://github.com/sempernow/uqc
     *      channel-host example: https://FIFY.news
     *************************************************************************/
    window.addEventListener('load', () => {
        const 
            debug = true
            ,log = (arg, ...args) => debug && console.log(
                `❤ [${(new Date()).toISOString().substring(17)}] [uqrate.js]`
                ,arg, ...args
            )
            ,id = (id) => document.getElementById(id)
            ,ctnr = id('uqrate-iframe-container') || document.createElement('BOGUS')
            /****************************************************
             * Set IFRAME src per markup params (Dataset API)
             * 
             * Client is responsible for providing values.
             ***************************************************/
            ,host = 'https://swarm.foo'
            ,src = `${host}/m/embed/${ctnr.dataset.msgId}` 
            ,dataset = (cid) => ({
                chnOwner:   ctnr.dataset.chnOwner,
                chnSlug:    ctnr.dataset.chnSlug,
                msgId:      ctnr.dataset.msgId,
                msgTitle:   ctnr.dataset.msgTitle,
                msgSummary: ctnr.dataset.msgSummary,
                chnId: cid,
            })
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
            ,iframe = {
                str: `
                    <iframe 
                        id="uqrate-iframe" 
                        name="uqrate" 
                        title="uqrate.org" 
                        tabindex="0" 
                        src="${src}" 
                        width="100%"
                        height="800"
                        scrolling="yes"  
                        horizontalscrolling="no" 
                        verticalscrolling="no" 
                        frameborder="0"></iframe>
                    `
                ,virgin: true
            }

        /***************************
         * Render IFRAME or die
         **************************/
        ctnr && (ctnr.innerHTML = iframe.str) 
                    && (iframe.node = id('uqrate-iframe'))

        if (!iframe.node) {
            const msg = `Failed to render : #uqrate-iframe`
            ctnr.innerHTML = `<h2><code>${msg}</code></h2>`
            log(msg)

            return 
        }

        /**********************************************************
         * Listen for messages from IFRAME.
         * Dynamically reset IFRAME height per message therefrom.
         *********************************************************/
        window.addEventListener('message', (ev) => {
            // Abort lest origin is of IFRAME source
            if (src.indexOf(ev.origin) === -1) return 

            // Reset IFRAME height (monotonic growth)
            const was = +iframe.node.height
            ;(was < ev.data.height) 
                && (iframe.node.height = ev.data.height + 50)
            
            log('Got msg from IFRAME:', {
                data : ev.data,
                heightNew: +iframe.node.height,
                match: (ev.source === src),
                origin: ev.origin, 
                source: ev.source, 
                target: ev.target, 
            })

            // Post message to IFRAME (once lest debug)
            if (debug && iframe.virgin) { 
                ev.source.postMessage({
                    event: 'load', 
                    height: {old: was, new: +iframe.node.height},
                    origin: ev.origin, 
                    dataset: dataset(ev.data.state.channel.chn_id),//... echo back
                }, src)
                !debug && (iframe.virgin = false)
            }
        }, false)
        
        /****************
         * @ Init
         ***************/
        log('iframe height :', +iframe.node.height)
        log('iframe src :', src)
        // Post (async/delay) message to iframe : MUST test for contentWindow @ async
        ;(debug && iframe.node) && window.setTimeout(() => {
            iframe.node.contentWindow
            && iframe.node.contentWindow.postMessage('debug : async post from parent', src)
        }, 2000)
    })
})()
