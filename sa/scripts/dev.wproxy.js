// ===  DEV/TEST  ===
;(function(o, undefined){
    'use strict'

    const srcID = 'LAB'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,id = o.id
        ,css = o.css
        ,toDOM = o.toDOM
        ,aDelay = o.aDelay
        ,eb = o.EB()
        ,sleep = o.sleep

        ,target = css('#target')
        ,mButton = css('#m')
        ,wButton = css('#w')
        ,gwButton = css('#gw')
        ,emButton = css('#em')
        ,kButton = css('#k')

        // Synchronous fns
        ,fast = (x) => {log(`FAST fn @ ${x}`);return 'fast'}
        ,slow = (x) => {sleep(1200); log(`SLOW fn @ ${x}`); return 'slow'}
        ,slower = (x) => {sleep(1500); log(`SLOWER fn @ ${x}`); return 'slower'}
        ,slowW = (x) => {sleep(1000); return `slower ${x}`}

        // Asynchronous fns
        ,slow1 = (x) => {aDelay(0, ()=>slow(x))}
        ,fast1 = (x) => {aDelay(0, ()=>fast(x))}
        ,slower1 = (x) => {aDelay(0, ()=>slower(x))}
        ,eObj = {a: "foo @ emit", b: 1111, delay: 800}
        ,sObj = {a: "foo @ sans", b: 7777, delay: 500}
        ,foo = async (obj) => {
            sleep(obj.delay)
            obj = {a: obj.a, b: obj.b, c: Date.now().toString(10).substring(9)}
            return obj
        }
        // Worker proxy
        ,wProxy = o.wProxy(foo)
        //,wProxy = o.wProxy(slowW)
        ,pFn = wProxy.fn
        ,wrapProxy = (obj) => pFn(obj).then(log)

        // schedule(priority, fn) returns a function that runs asynchronously (deferred), but sequentially ordered relative to any other so scheduled. (lower number is higher priority); implicitly returns PID
        ,schedule = o.aScheduler

        // Usage: aSchedule(priority, fnName)(args)
        // ,aSchedule = (priority, fn) => args => {
        //     return new Promise(resolve => {
        //         setTimeout(() => resolve(fn), priority ? priority : 0) 
        //     }).then(fn => fn(args))
        // }
        ,aSchedule = o.aSchedulerP
        //,fns = [slower,fast,slow]
        //,fns = [schedule(2,slower),fast,schedule(1,slow)] 
        //,fns = [schedule(2,slower1),fast,schedule(1,slow1)] 
        // ... synch fn is NOT blocked by slow async fn

        //,fnsNow = [fast]
        //,fnsNow = [slower, fast, slow]
        //,fnsNow = [slower1, fast, slow1]
        ,fnX = schedule(3,slow)
        //,fnsNow = [fnX, schedule(2,slower), schedule(1,fast)] 
        //,fnsNow = [workerProxy(), schedule(1,fast), schedule(2,slower)] 
        ,fnsNow = [pFn, aSchedule(3,slower1), aSchedule(1,fast1), aSchedule(2,slow1)] 
        //,fnsNow = [aSchedule(700,slower)] // logoFx @ midway through
        //,fnsDef = [slower1, fast, slow1]
        ,fnsDef = [aSchedule(3,slower), aSchedule(1,fast), aSchedule(2,slow)] 
        //,fnsDef = [aSchedule(3,slower1), aSchedule(1,fast1), aSchedule(2,slow1)] 
        //,fnsDef = [aSchedule(2,slower), aSchedule(1,fast)] 
        //,fns = [aSchedule(3,slower), fast, aSchedule(2,slow)] 

    async function getBlobText(url, fn) {
        await fetch(url)
            .then(r => r.blob())
            //.then(blobToFile)
            .then(b => textToCallBack(b,fn))
            .catch(log)
    }
    // takes a fetched blob, reads it into text, and passes that as arg to fn
    function textToCallBack(b, fn){
        const reader = new FileReader()
        reader.readAsText(b)
        reader.addEventListener('loadend', e => fn(e.srcElement.result))  
        return b  
    }

    // @ click :: buttons/click handlers
    mButton.addEventListener('click', ()=> foo(sObj).then(log) ) 
    //wButton.addEventListener('click', () => pFn(sObj).then(log) )
    wButton.addEventListener('click', () => wrapProxy(sObj) )
    gwButton.addEventListener('click', () => getBlobText(wProxy.wURL, log) )

    // gpButton.addEventListener('click', () => log(`${pFn}`) )
    kButton.addEventListener('click', () => wProxy.kill())


    ;(()=>{// TEST :: wProxy
        var x 
        x = o.wProxy(slowW)
        x.fn('=== this ===').then(log)

        o.wProxy(slowW).subce('== once ==').then(log)
    })//()

    ;(()=>{// TEST :: EB + Worker (wProxy)
        eb.reg('now')
        eb.reg('def')

        const eTypes = eb.eTypes()
        //eb.sub(eTypes.now, foo) // blocks
        
        // itempotent test
        eb.sub(eTypes.now, wrapProxy)
        eb.sub(eTypes.now, pFn)
        eb.sub(eTypes.now, pFn)
        eb.sub(eTypes.now, wrapProxy)

        // Such EB sheduling schemes have no effect on run order at Worker
        //eb.sub(eTypes.now, aSchedule(wrapProxy,1)) 

        eb.pub(eTypes.now, eObj)

        emButton.addEventListener('click', () => eb.pub(eTypes.now, eObj) )

    })()

    ;(()=>{// TEST :: EB
        eb.reg('def')
        eb.reg('now')
        eb.reg('now') // idempotent test

        const eTypes = eb.eTypes()

        fnsDef.map(fn => eb.sub(eTypes.def, fn)) 
        fnsDef.map(fn => eb.sub(eTypes.def, fn)) // idempotent test
        fnsNow.map(fn => eb.sub(eTypes.now, fn))

        eb.pub(eTypes.now, 'now')//.then(consumed=>log('emitted :: now ::',consumed))   
        eb.pub(eTypes.def, 'def')//.then(consumed=>log('emitted :: def ::',consumed))   

        log('state() ::', eb.peek())
        log('state().eTypes ::', eb.peek().eTypes)
        log('eTypes() ::', eb.eTypes())
        log('eTypes() includes fnX ::', eb.peek().subs[eTypes.now].includes(fnX))
    })//()

    ;(()=>{
        aSchedule(400,fast)(444)
            .then(log) // 'fast' 
            // not the natively asynch fns (fast1, ...) return undefined because of their construction.

        // the other version is asynch, but return is PID not that of fn
        log(schedule(200,fast)('200')) // 5

        const rtn = aSchedule(400,fast)(444)
        log('rtn',rtn)
        rtn.then(log)
    })

    
    ;(()=>{// DEV :: EventBus :: components of emit() 
        const state = []
            ,render = (a) => {
                const el = css('main')
                //log('a',a[0])
                //el.innerHTML = `<code>solved :: ${a[0]}</code>`
                toDOM(el,`<code>solved :: ${a[0]}</code>`, 1)
            }
            ,record = (a)=>{
                a.map(el=>state.push(`fn: ${el}`))
                return state
            }
            ,consume = async (fn, i)=>{
                return await fn(i)
            }
            // Without async/await @ emit(), logs one promise fulfilled; value of which is array of promises, each in state: fullfilled undefined.
            // With async/await @ emit, logs one promise pending.
            ,emit = async ()=>{
                    //await undefined
                    return Promise.all( fns.map(consume) ).then(record)
                }

        emit()
        .then(s=>{log('state:',s);return s})
        .then(log)
        .then(render)

        log(state)

        // FAST fn @ 1  
        // SLOW fn @ 2  
        // SLOWER fn @ 0
        // Array(3) [ "fn: slower", "fn: fast", "fn: slow" ] // log

        log('after')

    })

})( window[__APP__] = window[__APP__] || {} )


