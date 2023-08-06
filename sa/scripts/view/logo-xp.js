;(function(o, undefined){
    'use-strict'
    {// Logo FX. Copyright (c) Sempernow 2019. All rights reserved.
    /*  
    This logo FX code is the optimized version of 'xpSpinner*' development code. It's simpler; less code ('off' is merely static case); no class toggling; no added CSS classes; significantly less CPU usage (per Chrome 'Performance monitor' and 'Layers').

    It asynchronously implements a spinner effect for our Chrismon logo by toggling one `dataset` (Web API) attribute that is dynamically injected into targeted SVG tags per CSS selectors. The logo's eighteen encircling arc paths (SVG `path`) are so toggled in succession at a fixed rate (`dt`). Geometrically indexed, these affected elements present as a spinning arc of light, or shadow, per color theme. 
    
    Synchronized to this, its three superimposed `trinity` class arc paths are toggled, persisting each until the next trinity is reached by the aforementioned "arc of light". (So one of the trinity is always "lit".) Concurrently (multiplexed), each of the two primary Chrismon elements (chi, rho) are toggled at half the revolution rate. (Twelve revolutions yielding three such Chrismon "announcements".) 
        
    The `delay` parameter allows for this effect to immediately follow any other external effect. This logo FX is wired to the eventbus per `eTypes.Loader` event, and has its own `click` event listener as well.
    */
    }
    /****************************
     * @ View.Header Component 
     ***************************/
    const cfg = o.cfg.view.logo
        ,target = cfg.target
        ,logo = cssAll(`${target} .arcs`)[0] 

    if (!logo) return

    const 
        duration = cfg.duration ? parseInt(cfg.duration, 10) : 5400
        ,delay = cfg.delay ? parseInt(cfg.delay, 10) : 0 
        //,delay = 170 * 6 // @ CSS animation: rotateCW 
        ,srcID = 'logo'
        ,log = o.log(srcID)
        ,logWarn= o.log(srcID, o.log.levels.WARN)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,css = o.css
        ,cssAll = o.cssAll
        ,aDelay = o.aDelay
        ,throttle = o.throttle

    function _init(logo) {

        if (!logo) return false

        const arcs = logo.getElementsByTagName('path')
            ,chi = css(target+' .chi')
            ,rho = css(target+' .rho')
            ,trinity = cssAll(target+' .trinity')
            ,paths = 18
            ,revs = 12
            ,tails = 3 // (1-5)
            ,dt = duration / ( paths * revs ) 
            // 25 = 5400 / (18 * 12)

        return function _logoFX() {

            var toggle = rho
            aDelay(0, ()=>{chi.dataset.spinner = 'on'})

            for (let n = 0; n < revs; n++) {
                aDelay(dt*(paths*n), ()=>{
                    for (let i = 0; i < arcs.length; i++) {

                        !!(i%6 !== 5) 
                            // arcs sans trinity (+tails)
                            ? ( aDelay(dt*i,         ()=>{arcs[i].dataset.spinner = 'on'}),
                                aDelay(dt*(i+tails), ()=>{arcs[i].dataset.spinner = 'off'})
                            ) 
                            // trinity arcs (one; persist until next)
                            : ( aDelay(dt*i,     ()=>{trinity[i%5].dataset.spinner = 'on'}),
                                aDelay(dt*(i+6), ()=>{trinity[i%5].dataset.spinner = 'off'})
                            )

                        // annnounce chrismon (toggle chi/rho)
                        !!( n%2 !== 0 && i == 0) && (
                            aDelay(dt*paths,     ()=>{toggle.dataset.spinner = 'on'}),
                            aDelay(dt*(paths+2), ()=>{toggle.dataset.spinner = 'off'}),
                            aDelay(dt*(paths+1), ()=>{
                                !!(toggle === chi) 
                                    ? (toggle = rho) 
                                    : (toggle = chi) 
                            })
                        )
                    }
                })
            }

            aDelay(dt*(paths*revs + 1), ()=>{
                chi.dataset.spinner = 'off'
                rho.dataset.spinner = 'off'  
            })
        }
    }

    //o.Logo = function onLoad() {
    function onLoad() {
        const 
            init = _init(logo)
            ,logoFx = wait => {
                wait ? wait : 0
                aDelay(wait, init)
            }

        ;(logo)
            ? ( logoFx(delay)
                ,css('#view header .logo')
                    .addEventListener('click', throttle(duration, logoFx))
            )
            : ( eb.off(eTypes.Loader, onLoad) 
                ,logWarn(`'${target}' : HTML node NOT EXIST.`)
            )

        return srcID 
    }

    o.Logo = onLoad // TODO: modularize

    eb.sub(eTypes.Loader, onLoad) 
    // ... replace w/ `o.Logo = ...` @ migrating to `Actions()` @ `load` key

})( window[__APP__] = window[__APP__] || {} ) 
