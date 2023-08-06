// ===  View module
;(function(o, undefined){
    'use strict'
    const 
        // Private
        srcID = 'V'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus = o.log(srcID, o.log.levels.FOCUS)
        ,_logFocus = (id) => o.log(`${srcID}|${id}`, o.log.levels.FOCUS)
        ,logWarn = o.log(srcID, o.log.levels.WARN)
        ,render = (i) => {
            Object.keys(foo.components).map(key => foo.components[key](i))
        } 
        // Public
        ,foo = {
            log: log,
            logFocus: _logFocus,
            components: {}
        }

    // Make foo globally accessible; o.Foo()
    o.Foo = () => foo
    
    // Mock EB event/payload : 1
    o.aDelay(0, ()=>render(1))

})//(window[__APP__] = window[__APP__] || {})

// === Component(s) : Foo
;(function(o, undefined){
    'use strict'
    const 
        srcID = 'Foo'
        ,foo = o.Foo()
        ,keys = foo.components
        ,logFocus = foo.logFocus(srcID)

    keys.foo = (()=>{
        const a = 111
        return (data) => {
            logFocus(a, data)
        }
    })()

})//(window[__APP__] = window[__APP__] || {})

// === Component(s) : Bar
;(function(o, undefined){
    'use strict'
    const 
        srcID = 'Bar'
        ,foo = o.Foo()
        ,keys = foo.components
        ,logFocus = foo.logFocus(srcID)

    keys.bar = (()=>{
        const a = 111
        return (data) => {
            logFocus(a, data)
        }
    })()

})//(window[__APP__] = window[__APP__] || {})
