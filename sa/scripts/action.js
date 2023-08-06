;(function (o, undefined) {
    'use-strict'
    /**************************************************************************
     * Action module provides an OPTIONAL central event-action DISPATCHER. 
     * It declares actions for pub, fn(ebMsg), 
     * and subs them to event bus (EB). 
     * Each is an EB callback; one per eType (actionKey). 
     * Each such action must take an ebMsg of its eType, 
     * and return a resulting ebMsg.
     * The dispatch publishes that under eTypes.Action, per event.
     *  
     * The ebMsg signature of eType.Action
     * 
     *     {
     *         data: <any>, 
     *         mode: o.aModes.<aMode>
     *     }  
     *
     * Where any data OBJECT not of mode o.aModes.replay 
     * includes k-v pair: `dType: o.dTypes.<dType>` (METADATA).
     * 
     * Actions are often coupled to state parameters,
     * and all invoke pub/sub methods of EB, hence colocating such code.
     * However, this module may be entirely bypassed, 
     * with code of each eType defining and invoking pub/sub internally. 
    **************************************************************************/
    const srcID = 'Action'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,debugOFF = o.log.debugOFF // ''
        ,eb = o.EB()
        ,eTypes = eb.eTypes() 
        ,_state = o.State()
        ,aModes = o.aModes
        ,isObject = o.isObject
        ,dispatch = (actionKey) => {
            /***********************************************************************************
             * Dispatch the event handlers: 
             * - Declare the subscribable EB callbacks (actions), per eType (actionKey).
             * - Fire, validate, and publish result, per event, per eType (actionKey).
             * 
             * Each such function takes an ebMsg that abides the signature of its eType, 
             * and returns an object abiding the ebMsg signature expected by State module.
             * That result, if exist, is published under eTypes.Action as a resolved promise.
             **********************************************************************************/
            return function actionKeyFn(payload) {
                const actions = {
                        EtypeFoo: (ebMsg) => { 
                            return {
                                data: {
                                    viewComponent: {
                                        renderer: ebMsg.want
                                    }
                                }
                                ,mode: aModes.replay
                            }
                        }
                        ,Txn: (ebMsg) => { 
                            logDeb('Txn : ebMsg:', ebMsg)
                            return {
                                data: {
                                    txn: ebMsg
                                }
                                ,mode: aModes.promise
                            }
                        }
                        ,Auth: (ebMsg) => {
                            /*************************************************
                             * TODO: Update model/logic to account for 
                             * these newer keys; subed_free, subed_paid .
                             * 
                             * Note subing key is redundant here, but KEEP; 
                             * is used for owner object.
                             ***********************************************/
                            logDeb('Auth : ebMsg.user:', ebMsg.user)
                            ebMsg.user && ebMsg.user.user_id && (
                                ebMsg.user.subing = ebMsg.user.subed_free.length 
                                                    + ebMsg.user.subed_once.length
                                                    + ebMsg.user.subed_recur.length
                            )
                            return {
                                data: {
                                    auth: ebMsg
                                }
                                ,mode: aModes.promise
                            }
                        }

                        ,Net: (ebMsg) => {
                            return {
                                data: ebMsg.data
                                ,mode: ebMsg.mode
                            }
                        }
                        
                        ,MsgListMenu: (ebMsg) => {
                            if (!['Threads', 'Newest', 'Oldest'].includes(ebMsg.want))

                                return false

                            return {
                                data: {
                                    msgListMenu: {
                                        want: ebMsg.want
                                    }
                                }
                                ,mode: aModes.replay
                            }
                        }

                        ,CentreMenu: (ebMsg) => {
                            if (!['CentreList'].includes(ebMsg.want))

                                return false

                            return {
                                data: ebMsg.data
                                ,mode: aModes.replay
                            }
                        }

                    }

                // Validate this eType's callback handler exists
                if (!actions.hasOwnProperty(actionKey)) 
                    return

                // Fire the handler, passing it the ebMsg, and capture its result.
                const result = actions[actionKey](payload)

                // Validate result abides ebMsg signature of our eType,
                // and publish a resolved promise of it if so.
                ;(result 
                    && result.hasOwnProperty('data') 
                        && isObject(result.data) 
                            && result.hasOwnProperty('mode')
                ) && eb.pub(eTypes.Action, Promise.resolve(result)) 
 
                logDeb({
                    action: actionKey, 
                    keys: (result.data 
                            ? Object.keys(result.data)
                                .filter(k => ((k !== 'mode') && (k !== 'dType'))) 
                            : result
                    ), 
                    mode: result.mode
                })
            }
        }

    // Subscribe all our action keys to their registered event type (one:one).
    Object.keys(eTypes).map(key => {
        eb.sub(eTypes[key], dispatch(key))
    })

    logDeb(debugOFF)

//})( window[__APP__] = window[__APP__] || {} )
})( (typeof window !== 'undefined') 
&& (window[__APP__] = window[__APP__] || {})
    || (typeof global !== 'undefined') 
        && (global[__APP__] = global[__APP__] || {})
) 
