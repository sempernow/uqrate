;(function (o, undefined) {
    'use strict'
    /*********************************************************************
     * Centre : Top lists : Messages|Channels : Newest, Trending, Popular
     ********************************************************************/
    const 
        cName = 'centre'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,keys = view.components

    if (!cNode) return 

    keys[cName] = (() => {
        const 
            logDeb      = view.logDeb(cName)
            ,logErr     = view.logErr(cName)
            ,logFocus   = view.logFocus(cName)
            ,debugOFF   = ''//o.log.debugOFF // ''
            ,eb = o.EB()
            ,eTypes = eb.eTypes()
            ,ss = o.State().store

            // Model 
            ,modelMenu = o.css('#channel-header .menu')
            ,modelMenuItems = o.cssAll('#channel-header .menu LI A')
            ,lTypeMenu = o.css('#msg-list-menu')
            ,contents = o.cssAll('#app .content>*')
            ,channels = o.css('#chn-list')
            ,messages = o.css('#msg-list')

            ,purgeContents = () => (
                [...contents].map(node => o.purge(node))
                ,(state.idsRendered = [])
            )

            // List type : user selection
            ,lTypesEls = o.cssAll('LI', lTypeMenu)
            ,lType = () => lTypesEls && [...lTypesEls]
                                .filter(li => (li.classList.contains('active')))[0].textContent.toLowerCase()
            ,setActiveLType = (node) => {
                if (node.nodeName !== 'LI') return
                ;[...lTypesEls].map(li => li.classList.remove('active'))
                node.classList.add('active')
            }

            /*********************************************************************
             * Local (IIFE) state per page load; init/defaults.
             * Render state is managed locally, unlike at msg-list renderers,
             * which relies entirely on external o.State for render integrity.
             * 
             * This scheme is better; simpler, more robust; abides subsidiarity.
             ********************************************************************/
            ,initModel = 'Message' // Per data-model @ class="active" @ /centre/channel.gohtml
            ,state = {
                model:          o.ModelName(o.Models[initModel]),
                list:           o.ListName(o.Models[initModel]),
                ltype:          lType(),
                scroll:         false,
                tag:            '',
                idsRendered:    [],
                length:         -1,
            }

            ,resetView = () => {
                state.tag = ''
                o.removeHash()
                purgeContents()
            }
            ,uriRoot = (model) => (o.Models[model] === o.Models.Channel)
                                    ? 'cl/top' : 'ml/top'

            // @ Click : user selects list model, type, and tag (optional list filter)

            ,doSelectModel = (ev) => {
                resetView()
                if (!ev.target.dataset.model)
                    return false
                state.model = ev.target.dataset.model
                state.list  = o.ListName(o.Models[ev.target.dataset.model])
                state.ltype = lType()

                return doTopLists()
            }
            ,doSelectLType = (ev) => {
                resetView()
                setActiveLType(ev.target)
                state.ltype = lType()

                return doTopLists()
            }
            ,doHashTag = (ev) => {
                if (ev.target.nodeName !== 'A') return
                if (ev.target.classList.contains('active')) return
                /**************************************************
                 * Set state.tag; the content filter upon render.
                 *************************************************/
                o.aDelay(10, () => (
                    (window.location.hash) && (
                        (state.tag = window.location.hash.substring(1)))
                        ,doTopLists()
                ))
            }

            ,doTopLists = () => {
                /********************************************************************
                 * Publish request for content of user-selected model and list type
                 *******************************************************************/
                //if (!ss.msg_list) return
                eb.off(eTypes.State, doTopLists)
                state.tag && window.scrollTo(0, 0)
                state.scroll = false

                eb.pub(eTypes.View, {
                    dType: o.dTypes.diff
                    ,want: ['top']
                    ,uri:  [uriRoot(state.model), state.ltype]
                })
            }

            // @ Render

            ,avatarHide = true
            ,avatar = (x) => x ? x : 'uqrate-avatar.png'
            ,banner = (x) => x ? x : 'uqrate-banner.webp'
            ,about = (chn) => chn.owner_about ? chn.owner_about : chn.about 
            ,exclTags = ["Uncategorized", "Column", "Latest", "Links"]
            ,includesTag = (tags, tag) => tags.filter(x => (o.replaceAll(x,' ', '') === tag)).length
            ,htmlTags = (arr = [], selected = '') => arr.filter(tag => !exclTags.includes(tag)).map(tag => `
                <span>
                    <a 
                        class="${(o.replaceAll(tag,' ', '') === selected) ? 'bold' : ''}"
                        href="#${o.replaceAll(tag,' ', '')}">${tag}</a>
                </span>
            `)
            ,html = {
                Channel: (chn, tag = '') => (tag ? (includesTag(chn.tags, tag)) : true) 
                                                && (chn.slug !== 'sub') && `
                    <div class="channel-of-list">

                        <div class="banner${!chn.owner_banner ? ' hide' : ''}">
                            <img src="${o.cfg.view.banners}/${banner(chn.owner_banner)}">
                        </div>

                        <div class="main">
                            <div class="head">
                                <div class="avatar${avatarHide ? ' hide' : ''}">
                                    <img src="${o.cfg.view.avatars}/${avatar(chn.owner_avatar)}">
                                </div>
                                <h4>
                                    <a href="/${chn.owner_handle}/${chn.slug}">${chn.owner_handle}/${chn.slug}</a>
                                </h4>
                            </div>
                            <p>
                                ${(about(chn) !== 'proxy') ? about(chn) : 'This channel mirrors the blog.'}
                            </p>
                            <div class="tags${chn.tags.length ? '' : ' hide'}">
                                ${htmlTags(chn.tags, tag).join('<span class="sep">|</span> ')}
                            </div>
                        </div>
                    </div>
                `,
                Message: (msg) => `<h4>${msg.idx} by ${msg.author_handle} @ ${msg.date}</h4>`,
            }
        
        // @ init : close over whatevs at this node.
        if (!view.validate.node(cNode, cSelector)) return function() {} 

        /***********************************************************************
         * Hide all data-model contents where page-menu anchor is not 'active'
         * (Also affected by doShowContent(..) @ channels.js)
         **********************************************************************/
        ;[...modelMenuItems].filter(el => (!el.classList.contains('active')))
            .map(a => [...contents].map(el => (
                (a.dataset.model === el.dataset.model) && el.classList.add('hide')
            ))
        )
        purgeContents()

        // Listen : (initial page) state
        eb.sub(eTypes.State, doTopLists)

        // @ model menu
        modelMenu && modelMenu.addEventListener('click', doSelectModel)

        // @ list-type menu
        lTypeMenu && lTypeMenu.addEventListener('click', doSelectLType)
        
        // @ tag (filter) select
        cNode.addEventListener('click', doHashTag)

        // @ render per state
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //data.list = data.lists[state.list][state.ltype] //... copy by reference.
            if (!(data.list && data.list.length)) 
                return true

            // Messages model rendering handled elsewhere (See msg-list.js).
            if (data.active.model === o.ModelName(o.Models.Message)) 
                return true

            const 
                a  = data.list[0].date
                ,b = data.list[data.list.length -1].date
                ,oldest = (a - b > 0) ? b : a // ss.active.oldest.date

                ,onScroll = () => {
                    /*************************************************************************
                     * Publish request for older data if near page bottom of ltype 'newest',
                     * only once per data. This is "infinite scroll".
                     ************************************************************************/
                    if (o.scrollPagePct() < 90) 
                        return 

                    if (state.ltype !== o.lTypeName(o.lTypes.newest)) 
                        return

                    state.scroll = true
                    window.removeEventListener('scroll', onScroll)

                    //logFocus({a: a, b: b})

                    eb.pub(eTypes.View, {
                        //dType: o.dTypes.scroll
                        dType: o.dTypes.diff
                        ,want: ['top']
                        ,uri:  [uriRoot(state.model), state.ltype, oldest, 50]
                    })
                }

                ,idKey = (state.model === o.ModelName(o.Models.Channel)) ? 'chn_id' : 'msg_id'
                ,ctnr  = (state.model === o.ModelName(o.Models.Channel)) ? channels : messages 
                /**********************************************************************************
                 * Render scheme is much simpler and somewhat faster than those of msg-list.js, 
                 * yet has all the benefits of those declarative-time schedulers.
                 * Scheduling per count, abiding rIC and rAF, with eventual render guaranteed.
                 *********************************************************************************/
                ,render = (node, obj, i) => {
                    // Forbid duplicates.
                    if (state.idsRendered.includes(obj.id)) return 

                    // Schedule politely yet guarantee this element renders (within about i*30 frames).
                    o.rIC(() => o.toDOMrAF(node, html[state.model](obj, state.tag)), (i * 500))

                    //logFocus(obj.idx, obj.id, obj.owner_handle)

                    // Reckon the rendered element.
                    state.idsRendered.push(obj.id)
                }

            // Purge content lest data is continuation of current list (@ scroll event)
            !state.scroll && purgeContents()

            // Assure reverse-chron order (newest first) if list type is 'newest'.
            !!((state.ltype === o.lTypeName(o.lTypes.newest)) && (b > a)) 
                && data.list.sort((a,b) => (b.date - a.date))

            // Render the list lest of Message model
            data.list.map((obj, i) => render(ctnr, obj, i))

            // Reattach the scroll listener after list renders if any.
            !!(state.length !== state.idsRendered.length) 
                && window.addEventListener('scroll', onScroll)
            state.length = state.idsRendered.length
        }
    })()

})(window[__APP__] = window[__APP__] || {}) 
