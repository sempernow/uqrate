/*
    wProxy(fn) is a minor mod of Open Source 'greenlet.js'.

    Function calls, fn(args), are executed asynchronously at its clone ($fnClone$) in a spawned Dedicated Worker (@ .wURL). A Promise of its result is returned to the original function, per call.
    
    API
        const wP = wProxy(fn)
        const pFn = wP.fn
        pFn(args)
            .then(fnResultHandler)

        wP.kill() // Kill Worker after the Promise-result queue empties.

        wProxy(fn).once(args) // Run once then kill Worker.
            .then(fnResultHandler)

    REF: https://github.com/developit/greenlet 
         MIT License @ https://oss.ninja/mit/developit 
*/
;(function (o, undefined) {
    //log = (arg, ...args) => console.log(`wProxy ::`, arg, ...args)

    o.wProxy = function wProxy(fn) {

        function sleep(ms) {
            let t0 = Date.now()
            while (true) if ( ( Date.now() - t0 ) > ms ) break
        }

        // @ Profiling
        //const t = {now: () => performance.now()}, t0 = t.now()

        // Create the Worker; `fn` clone and its handler
        const log = srcID = 'W'
            ,log = o.log(srcID)
            ,logErr = o.log(srcID, o.log.levels.ERROR)
            ,wCode = '\n'
                + '// Helper function(s)\n'
                + sleep + '\n'
                + `// Clone :: ${fn.name}()\n`
                + 'const $fnClone$ = ' + fn + '\n' // fn clone
                /** Handle the clone and messages (Rx/Tx) between it and `fnProxy`:
                 *  - Rx:   Recieve (Rx) `[pID, args]` from `fnProxy(args)`.
                 *  - Call: Apply the received `args` to the clone; `fn(args)`.
                 *  - Tx:   Return the Promise of result of `$fnClone$`:
                 *              @success: `[pID, 0, result]`
                 *              @failure: `[pID, 1, error]`
                 */
                + `// Handler\n`
                + ';onmessage = ' + (e => Promise.resolve(e.data[1]) // Rx
                    .then(args => $fnClone$.apply($fnClone$, args))  // Call
                    .then(rtn => postMessage(                        // Tx
                            [e.data[0], 0, rtn]
                            ,[rtn].filter(x => (
                                (x instanceof ArrayBuffer) ||
                                (x instanceof MessagePort) ||
                                (self.ImageBitmap && x instanceof ImageBitmap)
                        ))) // transfer zero-copy if transferable 
                        ,err => postMessage([e.data[0], 1, '' + err])
                    )
                )
            ,wURL = URL.createObjectURL(new Blob([wCode]))
            ,w = new Worker(wURL)

            ,state = { // Store promised results per call:
                pID: 0 // promised-result ID.
                ,p: {} // promised-results, per call (per pID).
            }

        /** Handle return messages from worker clone:
         *    @success: `[pID, 0, result]` 
         *    @failure: `[pID, 1, error]`
         *  Promise resolve()/reject() is IMPLICITLY RETURNED to `fnProxy`.
         */
        w.submessage = e => {
            /** Invoke one of the two `Promise` functions, per `e.data[1]`:
            *     `resolve(e.data[2])` on `0` (success), i.e., `p[pID][0](result)`
            *     `reject(e.data[2])`  on `1` (failure), i.e., `p[pID][1](result)`
            *     (A pending `Promise` contains an array of those 2 functions)
            */
            state.p[e.data[0]][e.data[1]](e.data[2]) 
            // Trash the promise store key of this completed call/event (pID).
            delete state.p[e.data[0]]
        }

        // @ Profiling
        //const t1 = t.now(); log('invoke',t1-t0,'[ms]')

        // Forward `args` from original, `fn(args)`, to its Worker clone, 
        // and return a `Promise` of that result sent back therefrom.
        function fnProxy(args) {
            args = [].slice.call(arguments)
            return new Promise(function () {
                state.p[++state.pID] = arguments
                state.que = state.pID // flag @ `.kill()`
                w.postMessage(
                    [state.pID, args]
                    ,args.filter(x => (
                        (x instanceof ArrayBuffer) ||
                        (x instanceof MessagePort) ||
                        (self.ImageBitmap && x instanceof ImageBitmap)
                ))) // zero-copy transer if transferable
            })
        }

        // Run `fnProxy(args)` once, then kill its Worker.
        function fnOnce(args) {
            const wP = wProxy(fn)
                ,pfn = wP.fn
                ,rtn = pfn(args)
            wP.kill()
            return rtn //wP.wURL
        } 

        return { 
            state: state  // DEV/TEST ONLY 
            ,fn: fnProxy
            ,once: fnOnce
            ,wURL: wURL
            ,kill: () => { // When que empties.
                const id = setInterval(() => {
                    if (!state.p[state.que]) {
                        URL.revokeObjectURL(wURL)
                        w.terminate()
                        clearInterval(id)
                    }
                }, 200)
            }
            ,killNow: () => setTimeout(() => { 
                URL.revokeObjectURL(wURL)
                w.terminate()
            }, 0)
        }
    }
})(window[__APP__] = window[__APP__] || {})
