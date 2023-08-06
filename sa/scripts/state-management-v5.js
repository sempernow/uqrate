// Utilities 
const log = (arg, ...args) => console.log('S', arg, ...args)
    ,css = (css) => document.querySelector(css)

// =====================
// ===  eventbus.js  ===
// ===================== 
const EB = () => { 
    const eb = {}
    eb.eTypes = {}
    return {
        subscribe: (ev, fn) => {
            if (!eb.eTypes.hasOwnProperty(ev)) {
                eb.eTypes[ev] = []
            }
            return eb.eTypes[ev].push(fn)
        }
        ,publish: (ev, data = {}) => {
            if(!eb.eTypes.hasOwnProperty(ev)) {
                return []
            }
            //log('pub @ ev, eType:',ev, eb.eTypes[ev])
            return eb.eTypes[ev].map(fn => fn(data))
        }
        ,eTypes: eb.eTypes
    }
}

// =================
// ===  view.js  ===
// ================= 
const View = () => {

    const view = {}
        ,domCount = css('.js-count')
        ,domList = css('.js-items')
        ,domStatus = css('.js-status')

    // ====================
    // ===  Components  ===
    // ====================
    view.Count = (state) => {
        const suffix = state.items.length !== 1 ? '<b>s</b>' : ''
            ,emoji = state.items.length > 0 ? '🙌' : '😢'

        domCount.innerHTML = `
            <small>You've done</small>
            <span>${state.items.length}</span>
            <small>thing${suffix} today ${emoji}</small>
        `
    }

    view.List = (state) => {
        if(state.items.length === 0) {
            domList.innerHTML = `<p class="no-items">You've done nothing yet 😢</p>`
            return
        }
        domList.innerHTML = `
            <ul class="app__items">
                ${state.items.map(item => {
                    return `
                        <li>${item}<button aria-label="Delete this item">&#x2715</button></li>
                    `
                }).join('')}
            </ul>
        `
        domList.querySelectorAll('button')
            .forEach((button, index) => {
                button.addEventListener('click', () => {
                    // Message MUST ABIDE signature of its eType. (CONVENTION)
                    eb.publish(eTypes.domList, index)
                })
        })
    }

    view.Status = (state) => {
        const suffix = state.items.length !== 1 ? 's' : ''
        domStatus.textContent = `${state.items.length} item${suffix}`
    }

    // ====================
    // ===  Init/Listen ===
    // ====================
 
    renderView() 

    function renderView(i) {
        const state = !isNaN(i) ? store.state(i) : store.state()
        Object.keys(view).map(component => {
            view[component](state) 
        })
    }

    eb.subscribe(eTypes.Store, renderView) 
    // Message format: integer.

    return true
}

// ==================
// ===  store.js  ===
// ================== 
// Store mutates by append-only; each store.state[i] is immutable (object). 
const Store = (state) => {
    const dormant = 1
        ,mutating = 0
        ,store = {
            states: state ? state : [] 
            ,status: dormant 
            ,cursor: 0
        }

    store.get = () => store 
    store.state = (i) => {
        i = !isNaN(i) ? i : store.states.length - 1
        return store.states[i]
    }

    eb.subscribe(eTypes.Action, commit)
    // Actions message signature (CONVENTION):
    //  { 
    //      result: <any>,
    //      type: <1|0> (@ `flagNewState`|`flagOldState`)
    //  }

    function commit(received) { 
        //log('Rx @ Store', received)
        store.status = mutating

        const here = store.cursor
            ,flagNewState = 1
            ,flagOldState = 0 

        var committed = received.result
            ,flagReplay = false

        if (typeof committed === 'number') flagReplay = true

        if (received.type === flagNewState) {
            // Create new state, per merge, without affecting prior state(s).
            const cloneLast = Object.assign({}, store.states[here])
                ,newState = Object.assign(cloneLast, committed) 

            store.states.push(newState)
        } 
        
        // Align cursor with index of new state if new state created.
        if (!flagReplay) store.cursor = store.states.length - 1

        store.status = dormant

        log('store', store)

        // Message MUST ABIDE signature of its eType. (CONVENTION)
        eb.publish(eTypes.Store, store.cursor) 
        // format: integer !!!

        return store.cursor 
    }

    return store
} 


// EXTERNAL Action handlers okay
function domListX (index, cursor) {
    const result = {}
    if (store.state().hasOwnProperty('items')) {
        result.items = [...store.states[cursor].items]
        result.items.splice(index, 1)
    }
    //log('domList result:', result)
    return result
}


// ====================
// ===  actions.js  ===
// ==================== 
function Actions() {
    const _Actions = {}
        ,keys = [
            'domForm'
            ,'domList'
            ,'domDT'
            ,'bogus'
            ,'fooBar'
        ] 
    keys.map(domEl => {
        const fn = dispatch(domEl)
        eb.subscribe(eTypes[domEl], dispatch(domEl) )
    })// ... DOM event (eType) to action maps one-to-one.

    // Internal Action[method] handlers okay
    _Actions.domListX = (index, cursor) => {
        const result = {}
        if (store.state().hasOwnProperty('items')) {
            result.items = [...store.states[cursor].items]
            result.items.splice(index, 1)
        }
        //log('domList result:', result)
        return result
    }

    // Route and process the received action-event message, then publish the result.
    function dispatch(actionKey) {
        // - Handle eType per its (unique) callback/action/handler (key).
        // - Publish result and its type (mutation or not).
        return function(payload) {
            const here = store.cursor
                ,flagNewState = 1
                ,flagOldState = 0 

            var type = flagOldState // Presume no new state.

            var result = {} // Capture result of action, mutation or not.
                ,type = flagOldState // Presume no new state.

            const actions = { // Handle events per `actionKey`.
                    domForm: (x) => {
                        if (store.state().hasOwnProperty('items'))
                            return {items: [...store.states[here].items, x]}
                    }
                    // per internal method
                    // ===================
                    //,domList: _Actions.domListX

                    // per external function
                    // =====================
                    ,domList: domListX

                    // per inline function
                    // ====================
                    //,domList: (x) => {
                    //     if (store.state().hasOwnProperty('items')) {
                    //         changed.items = [...store.states[here].items]
                    //         changed.items.splice(x, 1)
                    //     }
                    // }
                    ,domDT: (x) => { // Replay
                        //store.cursor = store.cursor - 1
                        store.cursor = store.cursor + x 
                        if (store.cursor<0) store.cursor = 0
                        return store.cursor
                    }
                    ,fooBar: (x) => {
                        if (store.state().hasOwnProperty('foo'))
                            return {
                                foo: {
                                    received: x 
                                    ,result: `Do ANY mutation, per action key (this key).` 
                                }
                            }
                    }
                }

            // Validate action key
            if (!actions.hasOwnProperty(actionKey)) return

            // Process payload per action on (clone of) state at index of cursor.
            result = actions[actionKey](payload, here)

            // ... which may or may not result in a new state (object).
            if (typeof result === 'object') 
                Object.keys(result).length 
                    ? type = flagNewState
                    : type = flagOldState

            // Message MUST ABIDE signature of its eType. (CONVENTION)
            eb.publish(eTypes.Action, { 
                result: result,
                type: type
            })
        }
    }
}

// ==================
// ===  index.js  ===
// ================== 
const domForm  = css('.js-form')
    ,domInput = css('#new-item-field')
    ,domDT = css('.time-travel')
    ,eTypes = {
        // DOM elements
        domForm: Symbol('domForm')
        ,domList: Symbol('domList')
        ,domDT: Symbol('domDT')
        ,bogus: Symbol('bogus')
        ,fooBar: Symbol('Yo!')
        // Domains 
        ,Actions: Symbol('Actions')
        ,Store: Symbol('Store')
    }
    ,eb = EB()
    ,state0 = {
            items: [
                'I made this'
                ,'Another thing'
            ]
            ,foo: []
        }

    const store = Store([state0])
    View()
    Actions()

domDT.addEventListener('click', () => {
    // Message MUST ABIDE signature of its eType. (CONVENTION)
    eb.publish(eTypes.domDT, -1)
})

domForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const value = domInput.value.trim()
    if(value.length) {
        // Message MUST ABIDE signature of its eType. (CONVENTION)
        eb.publish(eTypes.domForm, value)
        //log(eTypes.domForm)
        domInput.value = ''
        domInput.focus()
    }
})

setTimeout(()=>{
    eb.publish(eTypes.fooBar,{a: 1, b: 2})
}, 600)

log('store.get()', store.get())
log('eb.eTypes',eb.eTypes) 
// ... NOTE: such are NOT registered; not referenced @ .pub or .sub calls.
log('eb.eTypes.domForm',eb.eTypes.domForm) // undefined
//console.error(111)

