;(function(o, undefined){
    'use strict'
    /***  State provides state/store management  **************************
     * State is logged differentially and cached cumulatively, 
     * per Actions event. State logs allow for concurrency/multiplexing.
     * The log is an append-only array of component object state. 
     * Per commit, the newer is merged with the cummulative store, 
     * Store, of such merged differentials in client storage.
     * 
     * So, the most recent cache (Store) survives page reload.
     *
     * State commits result of emitted eTypes.Action data 
     * to an append-only (indexed) log, and emits the index 
     * (state.cursor) of the newer log, per eTypes.State. 
     * Each state (log) is a differential, 
     * and may be consumed, e.g., at the View module. 
     *
     * Any action published under eTypes.Action, from anywhere,
     * triggers a commit(data) process, per aModes.<MODE>; 
     * promise, mutate, or replay. 
     *
     * Signature of eTypes.Action payload (CONVENTION):
     *      {
     *          data: <obj|state.cursor>, 
     *          mode: <aMode>
     *      }  
     *
     *  All data not of mode aModes.replay (any state change)
     *  has dType: dTypes.<TYPE> k-v pair, depicting the
     *  data type; full, diff, ...
     * 
     * Currently, all states are of the same store key (owner/slug). 
     * That is, this is not a Single Page Application (SPA). 
     * To make it so, logs would become two-dimensional; log[key][i].
    **********************************************************************/
    const srcID = 'State'
        ,cfg = o.cfg.state
        ,log        = o.log(srcID, o.log.levels.INFO)
        ,logErr     = o.log(srcID, o.log.levels.ERROR)
        ,logWarn    = o.log(srcID, o.log.levels.WARN)
        ,logDeb     = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus   = o.log(srcID, o.log.levels.FOCUS)
        ,debugOFF   = o.log.debugOFF  // '' | o.log.debugOff 
        ,profOff    = o.log.profOFF   // '' | o.log.profOFF 
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        //... APIs: 'none','cookie','storage','idb','sql','cache'
        ,{  clone
            ,aDelay
            ,nowSec
            ,nowMsec
            ,nowISO
            ,time2UTC
            ,UTCtoMsec
            ,isObject
            ,dTypes
            ,aModes
            ,waitUntil
            ,seq125
            ,arrsConcat
            ,profile
            ,has
        } = o
        /***********************************************************
         * The store is the client-storage facility and its API.
         * Its data is stored per channel key (owner/slug),
         * which is also State's key (state.key). 
         * Access per get/set methods; store.get(state.key) .
         * These public Store methods are private @ State .
         * State's synchronous subset is public; o.State().store .
         **********************************************************/
        ,store = o.Store('state', ...cfg.apisCSV.split(',')) 

        // State ...
        ,dormant = 1
        ,mutating = 0
        ,init0 = {time: nowMsec()}
        ,noKey = ''
        /****************************************************************
         * o.State() is a singleton returning the app-wide state object.
         * It holds the commits of action events in its ephemeral logs; 
         * indexed (cursor) per commit, all of one state.key.
         ***************************************************************/
        ,state = { 
            key: noKey          // per channel (owner/slug)
            ,status: dormant    // commit-chain status
            /*************************************************************
             * o.State().store is a synchronous peek into client cache;
             * a subset of cache keys @ Store(..); store.get(state.key) . 
             ************************************************************/
            ,store: {} 
            /***********************************************************
             * State's ephemeral, append-only log is consumed by View. 
             **********************************************************/
            ,logs: []           
            ,cursor: undefined 
            ,get: (i) => { 
                i = !isNaN(i) ? i : state.logs.length - 1
                i = (i < 0) ? 0 : i
                if (!isObject(state.logs[i])) 
                    return Object.assign(init0, {
                        init: 'NOT GOOD : state.get() was called before commit() set cursor.'
                    })
                return state.logs[i] //... consumable.
            }
        }

        // ========================================
        // HELPERs of the commit-chain middlewares
        // ========================================
 
        /***********************************************************************
         * mutexState() guarantees atomicity of commit sequence (per state) 
         * regardless of event timing, and allows for multithreading @ Worker.
         * (See declarative-time/scheduler labs for demo.)
         **********************************************************************/
        ,mutexState = () => state.status 
        /********************************************
         * Additively merge newer state into cache.
        ********************************************/
        ,merge = (got) => { 
            if (!isObject(got.newer.data)) return got

            const 
                prof = profile('State : merge') 
                ,cache = got.cache
                ,newer = got.newer.data

            prof.start(profOff)

            /***********************************************************************
             * Additively overwrite cache with newer at all newer keys not of list.
             **********************************************************************/
            Object.keys(newer).map((k) => ((k !== 'list') && (cache[k] = newer[k])))

            if (newer.list) { 
                /**************************************************************************
                 * Set got.cache.lists per newer; renormalize to fit o.Store(..) .
                 * The store may hold several models, and each may have several lists, 
                 * each of a list type, whereas each commit cotains only zero or one 
                 * (type) list of one model. Hence the differing object structures.
                 * 
                 * @param {object} got Where newer key may contain {list: {}, meta: {}}.
                 * @returns {object} The got, where cache key contains a 'lists' key:
                 * { lists: { 
                 *     active: {model: mNAME, list: lNAME_2, type: lTYPE_X, mode: sMODE},
                 *     lNAME_1: {lTYPE_A: [{..}, {..}, ..], lTYPE_B: [..] }, 
                 *     lNAME_2: {..},
                 *   }
                 * }
                 * 
                 * Only the list-related keys (list, meta) require this mapping.
                 *************************************************************************/
                const 
                    lName = newer.active.list,
                    lType = newer.active.type

                // Init cache.lists
                cache.lists || (cache.lists = {})
                // Init cache.lists.<list-name>
                cache.lists[lName] || (cache.lists[lName] = {})
                // (Re)Set active-list meta of cache to that of newer list regardless
                cache.lists.active = newer.active

                // Init or update cache with the newer-data list (newer.list)
                if (!cache.lists[lName][lType]) {
                    // Init cache.lists.<list-name>.<list-type>
                    cache.lists[lName][lType] = newer.list
                } else if (o.isArray(cache.lists[lName][lType])) {
                    // Update cache.lists.<list-name>.<list-type>
                    arrsConcat(cache.lists[lName][lType], newer.list)
                }

                // (Re)Sort in place (ascending)
                cache.lists[lName][lType].sort((m1, m2) => m1.date - m2.date)

                /************************************************************************
                 * Set other list-meta keys; those regarding newset and oldest messages
                 ***********************************************************************/
                const 
                    // Get list of new (non-reply) messages authored by channel owner.
                    ownerNewMsgs = cache.lists[lName][lType].filter(msg => 
                        ((msg.author_id == cache.channel.owner_id) && !msg.to_id)
                    )

                    ,meta = {
                        count:   cache.lists[lName][lType].length || 0
                        ,oldest: cache.lists[lName][lType][0]
                        ,newest: cache.lists[lName][lType][cache.lists[lName][lType].length-1]
                        ,oldest_owner_new: ownerNewMsgs[0]
                        ,newest_owner_new: ownerNewMsgs[ownerNewMsgs.length-1] 
                    }
                // Merge this list meta into that at cache
                Object.assign(cache.lists.active, meta)
            }
            // Legacy : usage ???
            cache.dType = dTypes.full

            /***********************
             * (Re)Set state.store
             **********************/
            ;['cursor', 'auth', 'channel', 'owner', 'view', 'app', 'txn']
                .map(k => (state.store[k] = o.clone(cache[k])))

            state.store.key = state.key
            state.store.api = store.api
            state.store.active = (cache.lists ? cache.lists.active : newer.active) || {}
    
            prof.stop()

            return cache
        }
        ,namesMeta = (meta) => ({
            model: o.ModelName(meta.model),
            list:  o.ListName(meta.model),
            type:  o.lTypeName(meta.type),
            mode:  o.sModeName(meta.mode),
        })
        /*****************************************************************
         * Renormalize cache.lists into keys expected by state consumers.
         ****************************************************************/
        ,renormCache = (cache) => {
            /*******
             * BEFORE:
             * { lists: { 
             *      active: {model: mNAME, list: lNAME_2, type: lTYPE_X, mode: sMODE},
             *      lNAME_1: {lTYPE_1: [{..}, {..}, ..], lTYPE_2: [..] }, 
             *      lNAME_2: {..},
             *   }
             * }
             * AFTER:
             * { 
             *      active: { model: mNAME, list: lNAME, type: lTYPE, mode: sMODE }, 
             *      list: []
             * } 
             ******/
            if (!cache.lists) return cache
            cache.active = namesMeta(cache.meta)
            const 
                lName = cache.active.list,
                lType = cache.active.type

            if (cache.lists[lName][lType]) {
                cache.list   = cache.lists[lName][lType]
                delete cache.lists
            }

            return cache
        }

        // ================================
        // Middlewares of the commit chain
        // ================================
 
        /*********************************************************************
         * Renormalize newer data obj into that expected by state consumers.
         * @param {object} got Processed only if got.newer contains:
         * {list: [{..},{..},..], meta: {..}}.
         * @returns {object} The got, where got.newer contains:
         * {list: [{..},{..},..], meta: {..}, active: {..}}
         ********************************************************************/
        ,renormNewer = (got) => {
            if (got.newer.mode === aModes.replay) return got 
            if (!got.newer.data.list) return got 

            /************************************
             * Normalize the primary-id key (id)
             * and set a date key (epoch).
             ***********************************/
            const d = got.newer.data 
            var idKey
            switch (d.meta.model) {
                case o.Models.Message:
                    idKey = 'msg_id'
                    break
                case o.Models.Channel:
                    idKey = 'chn_id'
                    break
                case o.Models.Group:
                    idKey = 'grp_id'
                    break
                default:
                    return Promise.reject({
                        why:    'Unsupported Model', 
                        what:   d.meta,
                        where:  'renormNewer(..)',
                    })
            }
            d.list.map(x => {
                x.date = UTCtoMsec(x.date_create)
                x.id = x[idKey]
                delete x[idKey]
            })

            // Map list-meta enums to their names
            d.active = namesMeta(d.meta)
            d.meta.list = d.active.list

            // Add View-component key at certain list types
            !!(d.meta.type >= o.lTypes.newest) && (d.centre = true) 
            got.newer.data = d 

            return got
        }
        /**********************************************************
         * Deduplicate the new list data WRT that at cache.
         * Apply an in-place (zero-copy) filter to newer (state),
         * removing elements already in cache (store).
         *********************************************************/
        ,dedup = (got) => {
            if (got.newer.mode === aModes.replay) return got 
            
            if (!got.newer.data.list) return got
            const prof = profile('State : dedup')
            prof.start(profOff)

            const 
                newer = got.newer.data
                ,lName = newer.active.list
                ,lType = newer.active.type
                ,active = got.cache.lists && got.cache.lists[lName]
                ,cachedList = (active && got.cache.lists[lName][lType])
                                ? got.cache.lists[lName][lType] : []

            // Sorted IDs lists required for in-place dedup (slice)
            cachedList.sort((m1, m2) => m1.date - m2.date)
            newer.list.sort((m1, m2) => m1.date - m2.date)

            const 
                idsCache = o.ReduceToListOfKey(cachedList, 'id'),
                idsNewer = o.ReduceToListOfKey(newer.list, 'id')

            // Reverse required because index changes per slice.
            idsCache.reverse().map(id => {
                const k = idsNewer.indexOf(id)
                if (k >= 0) newer.list.splice(k, 1)
            })

            // if no new data, then delete the relevant view-component keys
            if (!newer.list.length) { 
                delete newer.list
                delete newer.centre
            }
            got.newer.data = newer
            prof.stop()
            
            return got
        }

        /*******************************************************************
         * If got.newer.txn, then update affected message at got.cache . 
         * View.txn renders changes ephemerally; this is an after action.
         ******************************************************************/
        ,txnAfterAction = (got) => {
            if (got.newer.mode === aModes.replay) return got 
            const txn = got.newer.data.txn
            if (txn) {
                const 
                    active = got.cache.lists && got.cache.lists.active
                    ,cachedList = active ? got.cache.lists[active.list][active.type] : []
                    /************************************************************************
                     * Renormalize service-sent msg to fit our client. See renormNewer(..).
                     ***********************************************************************/
                    ,renorm = (msg) => {
                        msg.id = msg.msg_id
                        msg.date = o.UTCtoMsec(msg.date_create)
                        delete msg.msg_id
                        return msg
                    }
                // Update cache by reference : cachedList is effectively a pointer to target list @ got.
                cachedList.map((msg, i) => ( (msg.id === txn.msg_id) && (cachedList[i] = renorm(txn)) ))
            }
            return got
        }
        /*************************************************************************
         * Feed essential keys of cache back to state if the latter lacks them.
         * UPDATE: Now @ o.State().store; MIGRATING such downstream consumers.
         ************************************************************************/
        ,feedback = (got) => {
            if (got.newer.mode === aModes.replay) return got 
            // Assure newer has owner and channel data.
            // Not all api endpoints do, e.g., /ml/..., yet required of data-request pubs.
            ;(got.newer.data.owner)   || (got.newer.data.owner = got.cache.owner)
            ;(got.newer.data.channel) || (got.newer.data.channel = got.cache.channel)

            // Update accumulated message count; cache total (client-store total).
            //;(got.newer.data.msg_list && got.cache.msg_list) 
            //    && (got.newer.data.msg_list.count = got.cache.msg_list.count)

            return got
        }
        /*************************************************************
         * Validate the essential newer-data keys against state.key.
         * 
         * TODO: How to handle reject? Purge state or reload page?
         ************************************************************/
        ,validate = (got) => {
            if (got.newer.mode === aModes.replay) return got

            if (!got.newer.data.owner || !got.newer.data.channel) 
                return Promise.reject({
                    why: 'got.newer.data is MISSING channel and/or owner KEYs', 
                    what: got.newer.data, 
                    where: 'validate : newer' 
            })
            if (`${got.newer.data.owner.handle}/${got.newer.data.channel.slug}` !== state.key) 
                return Promise.reject({
                    why: 'handle/slug DOES NOT MATCH state.key', 
                    what: got.newer.data, 
                    where: 'validate : newer' 
            })
            return got
        }
        // Increment cursor regardless of mode.
        ,setCursor = (got) => {
            state.cursor = state.logs.length
            got.newer.data.cursor = state.cursor

            return got
        }
        // Overwrite state's o.Store(..) at state.key with merged (newer-cache) object.
        ,updateStore = (got) => {
            if (got.newer.mode === aModes.replay) return got
            if (state.key === noKey) 
                return Promise.reject({
                    why: 'No key.', what: got, where: 'updateStore'
                })
            const prof = profile('State : updateStore') 
            prof.start(profOff)

            store.set(state.key, merge(got)) 

            prof.stop()

            return feedback(got)
        }

        /***************************************************************************
         * Push this commit to logs array at state.cursor index (state.logs[i]);
         * either merged or differential data, depending on data and state params.
         **************************************************************************/
        ,pushToLogs = (got) => {
            var result
            /*************************************************************************************
             * The dynamics of higher-mode list types (@ centre.js; /app/centre) 
             * are entirely different than those of lower modes (@ msg-list.js).
             * At centre.js, view is reset per user select, 
             * and render state is managed locally, 
             * and so want entire list (except scroll case).
             * Whereas, at msg-list.js, differentials are required and 
             * multiple renderers may run multiplexed across states, 
             * requesting and adding newer/older messages as apropos per events(s). 
             * Renderers of msg-list.js are much more complicated (1,200 lines of code);
             * its declarative-time functions are built from lower-level functions,
             * whereas those of centre.js are simply calls to o.rAF(..) and o.rIC(..).
             * 
             * TODO : Migrate to simpler (centre.js) method; always manage render-state locally.
            *************************************************************************************/
            if (got.newer.mode !== aModes.replay) {

                if (state.cursor === 0) {
                    result = renormCache(got.cache)             //... MERGED (STORE + newer STATE). 
                } else {
                    if (got.cache.meta.type < o.lTypes.newest) {
                        result = got.newer.data                 //... DIFFERENTIAL.
                    } else {
                        (got.newer.data.dType === o.dTypes.scroll)
                            ? (result = got.newer.data)         //... DIFFERENTIAL.
                            : (result = renormCache(got.cache)) //... MERGED (STORE + newer STATE). 
                        //logFocus('@pushToLogs : scroll mode:', (got.newer.data.dType === o.dTypes.scroll))
                    }
                }

            } else {
                // @ replay mode, most commit-chain func are bypassed; do shallow merge here. 
                result        = Object.assign(got.newer.data, renormCache(got.cache))
                result.mode   = aModes.replay
                result.cursor = state.cursor
            }

            /************************************************************************
             * @ Message-model list, renormalize for (legacy) msg-list.js renderers.
             ***********************************************************************/
            if (result.list && (result.active.model === o.ModelName(o.Models.Message))) {
                result.msg_list || (result.msg_list = {})
                result.msg_list.list = []
                Object.assign(result.msg_list, got.newer.data.meta)
                result.msg_list.list = result.list 
            }

            state.logs.push(result)

            return got
        }
        /*************************************************************************
         * Publish state.cursor. This is the one ebMsg published by eTypes.State.
         ************************************************************************/
        ,publish = (got) => {
            eb.pub(eTypes.State, state.cursor) 
            state.status = dormant //... release the commit lock.
            return got
        }
        // Show cache (state/store) info at current key.
        ,showState = (got) => {
            if (false) {
                log('#', state.cursor, 'state.store', state.store, store.get(state.key))
            } else {
                const about = `: Cache @ api='${store.api}', key='${state.key}' : messages:`
                if (debugOFF) {
                    log('#', state.cursor, `state.logs[${state.cursor}] :`, state.logs[state.cursor])
                } else {
                    logDeb('#', state.cursor, 'state.logs:', state.logs.length, state.logs)
                }
                if (store.mode === 'synch') {
                    log('#', state.cursor, about, store.get()[state.key])
                } else {
                    store.get().then(cache => {
                        log('#', state.cursor, about, cache[state.key])
                    })
                }
            }
            return got
        }

        // ==========================
        // ENTRY POINT of the commit
        // ==========================
        
        /***************************************************************************
         * commit(..) is the per-state ENTRY POINT to o.State()
         * 
         * - Invoked per published event of type o.EB().eTypes.Action .
         * - Payload (ebMsg) is processed async regardless.
         * - Commits payload to store (client's cache) additively. 
         * - Appends new state (component differentials + meta) to state.log . 
         * - Publishes state.cursor (state.log index).
         * - Aborts its promise chain on any error.
         * 
         * @param {object} ebMsg {data: {..}|state.cursor, mode: o.aModes[MODE]} 
        ***************************************************************************/
        ,commit = (ebMsg) => {
            /***************************************************************************
             * got() recieves new data (newer) per async event-bus message, 
             * combines it with that of same state.key retrieved from store (cache), 
             * and returns the "got" pair. The got is passed along the middlewares 
             * chain affecting a "commit" process of newer into o.SS() store (cache).
             * @returns {object} The "got" promise : {newer: {..}, cache: {..}}
             **************************************************************************/
            const got = () => ebMsg.then((x) => {

                if (!(x && x.hasOwnProperty('data') && x.hasOwnProperty('mode'))) {
                    return Promise.reject({
                        why: 'Does not abide eType.Actions signature.', 
                        what: ebMsg, 
                        where: 'got()' 
                    })
                }

                // Reset state.key if apropos.
                state.key = x.data.owner && x.data.owner.handle
                            && x.data.channel && x.data.channel.slug 
                            && x.data.owner.handle + '/' + x.data.channel.slug 
                            || state.key || noKey 
                /*********************************************************************
                 * Repackage the state/store objects into one ephemeral promise
                 * for async processing regardless of their original synchronies; 
                 * they may arrive of MIXED SYNCHRONIES, per Action, per Store API.
                 ********************************************************************/
                const pkg = {
                        newer: x,                    //... new data to commit.
                        cache: store.get(state.key)  //... last-stored state.
                    }
                if (state.key === noKey) return Promise.reject(
                    {why: 'No key.', what: ebMsg, where: 'got(ebMsg)'}
                )

                return Promise.all([pkg.newer, pkg.cache])
                        .then((pkg) => Promise.resolve({
                            newer: pkg[0] || {}, 
                            cache: pkg[1] || {}
                        }))
                })

            state.status = mutating  // mutex lock.

            /*******************************************************************
             * Promise-chain functions abide middlewares pattern, 
             * passing the returned got() promise; {newer: {..}, cache: {..}}.
             ******************************************************************/
            got() 
                .then(renormNewer)
                .then(dedup)
                .then(txnAfterAction)
                .then(feedback)
                .then(validate)
                .then(setCursor)
                .then(updateStore)
                .then(pushToLogs)
                .then(publish)
                .then(showState)
                .catch((err) => {
                    state.status = dormant 
                    ;(err.why === 'No changes.')
                        ? logDeb('#', state.cursor, state.key, err)
                        : (
                            (typeof state.cursor !== 'undefined') 
                                ? logErr('#', state.cursor, state.key, err)
                                : logWarn('#', state.cursor, state.key, err)
                        )
                })
        }

        /*************************************************************
         * doCommitState(..) is the commit's scheduler.
         * Awaits completion of prior commit, abiding mutexState().
         ************************************************************/
        ,doCommitState = (ebMsg) => {
            waitUntil( /**  Wait until state.status is dormant (mutex unlocked)  **/
                mutexState,  /**  The predicate func  **/
                seq125(5),   /**  The wait func (closure); 5, 10, 25, 50, ... ms  **/
                commit,      /**  The callback func  **/
                ebMsg        /**  The callback args  **/
            )
            return srcID
        }

    // Expose
    o.State = () => state
    o.SS = () => store // <== UNUSED : Use o.State().store

    // Listen
    eb.sub(eTypes.Action, doCommitState) 

    logDeb(debugOFF)

//})( window[__APP__] = window[__APP__] || {} )
})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
) 
