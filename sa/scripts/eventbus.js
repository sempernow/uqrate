;{/** EventBus v0.5.4
>Our event bus code began with a mix of '`light-event-bus.js`' and '`emittery.js`'.

## REF

- https://github.com/PierfrancescoSoffritti/light-event-bus.js  (MIT License)
- https://github.com/sindresorhus/emittery  (MIT License)

## API

- Instantiate the application-wide singleton

    const eb = o.EB()

- Methods 

    .reg(eType)         // Register an eType; add it to the `eTypes` registry.

    .sub(eType, fn)     // Subscribe :: Attach callback fn as an eType handler (listener).

    .off(eType, fn)     // Unsubscribe :: Remove callback fn from eType handler set. 
                        // Deferred, so does not abort `.pub()` in an event loop. 
                        // Sans fn, all of that eType are removed; eType key remains.

    .pub(eType, args)   // Publish:: Asynchronously call all listeners (fn) of eType; 
                        // the args can be anything (per eType).

    .log(arg, ...args)  // To console, namespaced: [HH:MM:SS.nnnZ] [EB] arg, ...args .

    .eTypes()           // Returns object containing all registered eTypes.

    .peek()             // Peek at synchronous snapshot of the protected state object.

## Features

- Publish (emit) asynchronously; handle any type of callback function.
- Event-type registry and subscription methods (`.sub`, `.off`) 
    are idempotent, yet all unique callback functions are subscribed 
    regardless of `fn` name collisions, even if under same `eType`. 
- Event type may be of type `string` or `object`. 
    Internally, the event type is stored as an object, 
    each a k-v pair: `<eType>: Symbol(<eType>)`. 
- Works well with callbacks wrapped in Worker proxy or scheduler:
    - `wProxy(fn)`
    - `scheduler(priority, fn)`
    - `aScheduler(priority, fn)`
- The `.peek()` object is a synchronous peek of the internal state store at the current state of the event bus. Mutating it has no other effect; it's a throw-away copy; a debugging tool. The `.pubs` record includes a per-callback performance profile (`ms`; execution time + queue time) and callback return value (`rtn`). Convention is for the return (object perhaps) to include a self reference (to aleviate that otherwise unhappy consequence of pub/sub decoupling, where the caller's identity is a mystery). The `.peek()` object:
        
    {
        eTypes: ["eType1", "eType2", ...],
        subs: {eType1: [fn1, fn2, ...], eType2: [..], ...},
        pubs  { 
            eType1: {
                total: eventTOT,
                consumed: [{
                                fn: fn.name, 
                                args: args,
                                rtn: msg,
                                ms: (t.rtn - t.call),
                                time: timestampZ
                            }, {
                                ...
                            }
                            , ...
            },
            eType2: {
                ...
            },
            ...
        }
    }

    - Peek (Status) 

        .peek().eTypes                     // All registererd eTypes (array).  
        .peek().pubs                       // All published events, per type (object)
        .peek().subs.eTypes                // All subscribed eTypes (array)
        .peek().subs[eName]                // All listeners (fn) on at event `eName` (array). 
        .peek().subs[eName].length         // Number of listeners (fn) on at event `eName`.
        .peek().subs[eName].includes(fnX)  // Test if listener `fnX` is on at event `eName`.

            - `.eTypes` is an array of `string` type elements, each a _registred_ event type. 
            - `.subs` access per __any__ `Object` property/method. 
            - `.subs.eType` access per __any__ `Array` property/method. 
            - `.pubs` record is accessible, but not explicitly per `eType` (.pubs.eType) due to mismatch between emitter and state (a)synchrony.
*/}
;(function(o, undefined){
    'use strict'

    const 
        srcID = 'EB'
        ,id = Math.floor(Math.random() * Math.floor(999)) //... validate singleton

        //,log = (arg, ...args) => console.log(arg, ...args)
        //,logErr = (arg, ...args) => console.log(arg, ...args)
        ,log = o.log(srcID)
        ,logDeb = o.log(srcID,o.log.levels.DEBUG)
        ,debugOFF = o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logWarn = o.log(srcID, o.log.levels.WARN)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,verbose = (o.bMode === o.bModes.TEST)
        ,isFunction = o.isFunction

        //,cfg = o.cfg.eb
        //,eTypes = cfg.eTypes

        // Internal, protected state object.
        ,state = {
            subs: {},  
            pubs: {},  
            eTypes: {} 
        }
        
        // Event Bus (EB) object
        ,eb = {id: id}

        // eType helpers 
        ,isRegistered = (et) => state.eTypes[et] || false 
        ,set = (et) => isRegistered(et) && ( get(et) || ( state.subs[et] = new Set() ) )
        ,get = (et) => state.subs[et] || false
    
        // ------------------------------------------------------------------------
        // eb.pub(eType, args) helpers

        ,got = (eType, args) => [...get(eType)].map((fn) => {
            return {
                eType: eType,
                fn: fn,
                args: args
            }
        })
        ,consume = async (e) => {
            e.t0 = performance.now() 
            e.rtn = e.fn(e.args)
            e.rtn = await e.rtn ? await e.rtn : e.rtn 
            e.fn  = e.fn.fn ? e.fn.fn : e.fn.name 
            e.t1 = performance.now()
            return await e
        }
        ,record = (event) => event.map(e => {

            if (!logDeb) return

            const eType = e.eType
            e.ms = e.t1 - e.t0                           // Includes queue time.
            delete e.eType; delete e.t0; delete e.t1     // `map()` fails here.
            e.time = new Date()
            e.time = e.time.toISOString().substring(11)  // HH:MM:SS.nnnZ
            ;(!state.pubs[eType]) && ( state.pubs[eType] = {total: 0, consumed: []} )
            state.pubs[eType].total += 1
            ;(state.pubs[eType].consumed.length > 9) && state.pubs[eType].consumed.shift()
            state.pubs[eType].consumed.push(e)

            ;(verbose) && logDeb(`emit :: ${eType} ::`, {ms: e.ms, fn: e.fn, args: e.args}) 

            return e
        })

        // ------------------------------------------------------------------------
        // eb.sub(eType, fn) and eb.off(eType, fn) helpers
        ,listeners = (et) => {
            return {
                add: (fn) => {
                    if (!isFunction(fn)) {
                        logErr('@ add(fn) :: The arg is NOT a FUNCTION:', {eType: et, fn:fn})
                        return false
                    }
                    if (!isRegistered(et)) {
                        logErr('@ add(fn) :: The eType is NOT REGISTERED:', {eType: et, fn:fn})
                        return false
                    }
                    get(et) 
                        ? get(et).add(fn) 
                        : set(et).add(fn) 
                    
                    ;(verbose) && logDeb('on ::', {eType: et, fn: fn})
                    return true
                },
                rem: (fn) => {
                    let fns = get(et)
                    if ( !!fn && (!fns || !fns.has(fn)) ) 
                        return false

                    !!(fn && verbose)
                        ? logDeb('off ::', {eType: et, fn: fn.name})
                        : logDeb('off ::', {eType: et, fn: 'All'})

                    Promise.resolve() // Defer to allow any/all async emits underway
                        .then(() => { 
                            fns.delete(fn)
                            if ( fns.size === 0 || ( typeof fn === 'undefined' ) ) {
                                // Delete all `fn` of this eType, but keep key.
                                fns.clear()  
                            }
                        }).catch(logErr)
                    return true
                }
            } 
        }

    // Synchronous snapshot of the protected internal `state` object. 
    // Useful for listing registered eTypes, and for debugging.
    eb.peek = () => {
        const subs = {}
        for (var eType in state.subs) {
            const fns = []
            state.subs[eType].forEach( fn => fns.push(fn) )
            subs[eType] = fns
        }
        subs['eTypes'] = Object.keys(state.subs)
        Object.defineProperty(subs, 'eTypes', { enumerable: false })
        const et = Object.keys(state.eTypes)
        return { subs: subs, pubs: state.pubs, eTypes: et }
    }

    /** Register an eType
    * @param {string, object} et (idempotent regardless)
    */
    eb.reg = (et) => state.eTypes[et] || ( state.eTypes[et] = Symbol(et) )

    // List eTypes registry
    eb.eTypes = () => eb.peek().eTypes
        .reduce((acc, et) => {
            acc[et] = et
            return acc
        }, {})  

    /** (Un)Subscribe (Off/On)
    * @param {string}   eType
    * @param {function} fn
    */
    eb.sub = (eType, fn) => listeners(eType).add(fn)
    eb.off = (eType, fn) => listeners(eType).rem(fn)

    /** Publish (Emit)
    * Call all subscribers of `eType` per `fn(args)`; record each lest `debubOFF`.
    * @param {string} eType
    * @param {object} args
    */
     eb.pub = async (eType, args) => {
        if (!get(eType)) return false
        const emitted = await Promise.all( got(eType, args).map(consume) ) 
        ;(verbose) && record(emitted)
        return emitted // Thenable at caller, but NOT here due to `await`.
    }

    // eb.pubSeq = (eType, args) => {/**/}
    //... TODO: ??? Seq/Synch emitter. (See prior EB versions.)
    
    logDeb(debugOFF)

    // ------------------------------------------------------------------------
    // Declare and return the app-wide singleton
    
    o.EB = () => eb
    
    // ------------------------------------------------------------------------
    // Initialize : Register all application eTypes
    
    ;(() => {
        const 
            srcID = 'eTypes'
            ,cfg = o.cfg.eb
            ,eb = o.EB()
            ,eTypes = cfg.eTypes
            ,logDeb = o.log(srcID,o.log.levels.DEBUG)
            ,logErr = o.log(srcID, o.log.levels.ERROR)
            ,verbose = (o.bMode === o.bModes.TEST)
            ,debugOFF = o.log.debugOFF // ''
        eTypes.map(eb.reg)

        logDeb(debugOFF)

        logDeb('eb.id', eb.id)
        logDeb('cfg.eTypes',  eTypes)
        logDeb('eb.eTypes()', eb.eTypes())
        logDeb('eb.peek()',  eb.peek()) 
    })()

    // ------------------------------------------------------------------------
    // References : Message signatures per eType

    ;(() => {
        const 
            eb = o.EB(),
            eTypes = eb.eTypes()

        eTypes.Loader = {
            want: ['todo1', 'todo2', '...'],
            uri:  ['segment-1', 'segment-2']
        }

        eTypes.Net = {
            want: ['todo1'],
            httpResp: {
                status:     d.status,
                statusText: d.statusText,
                url:        d.url,
                req:        req,
                cType:       mime
            }
        }

        eTypes.Action = {
            data: {},
            mode: o.aModes.promise
        }

        eTypes.Txn = txn
        //... to Action, whereof subkeyed; data.txn

        eTypes.State = 3

        eTypes.View = {
            node:  document.body.main,
            dType: o.dTypes.full,
            want:  ['todo1', 'todo2', '...'],
            arg:   'str',
            args:  [1, '2', {foo: 3}],
            uri:   ['segment-1', 'segment-2']
            // uri:  {pg,ml}, lt, xid [, t [, n]]
        }   //       {'pg','ml'}, {'pub','sub','chn'}, xid, [, t [, n]]

        eTypes.Modal = {
            id: 'sponsub',
            data: {},
        }
    })//()

})( (typeof window !== 'undefined') 
&& (window[__APP__] = window[__APP__] || {})
    || (typeof global !== 'undefined') 
        && (global[__APP__] = global[__APP__] || {})
)
