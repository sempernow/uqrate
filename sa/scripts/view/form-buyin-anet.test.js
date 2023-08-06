;(function(o, undefined){
    'use strict'
    /**********************************************************************
     * Handles all buyin and payout transactcions of Authorize.net gateway
     *********************************************************************/
    const formContainer = o.css('#form-container')
 
    if (!formContainer) return

    const cfg = o.cfg.view
        ,srcID = 'buyin'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,{  css
            ,create
        } = o
        // ========
        // PARAMs
        // ========
        ,test = (o.bMode === o.bModes.TEST)
        // App-wide state cache (synchronous access)
        ,ss = o.State().store

        // DOM
        ,form = css('FORM', formContainer)
        ,ghost = create('input')
        ,amount = css('input[name=amount]', form)         || ghost
        ,cardnumber = css('input[name=cardnumber]', form) || ghost
        ,expiry= css('input[name=expiry]', form)          || ghost
        ,cardcode = css('input[name=cardcode]', form)     || ghost
        ,zipcode = css('input[name=zipcode]', form)       || ghost

        /*********************************************************************
         * All forms (HTML) regarding buyin, payout, or exchange 
         * per Authorize.net gateway share this one companion script; 
         * its behavior varies per mode and action params read from the DOM.
         ********************************************************************/
        // Modes 
        ,mode = (x) => (form.dataset.mode === x)
        // @ clear card data : NOT @ production
        // @ AcceptUI.js     : PCI-DSS SAQ-A (per gateway's iframe)
        ,hosted = 'hosted'
    
    // =========
    // DEV/TEST
    // =========

    ;(()=>{// Mock user input
        if (mode(hosted) || !test) 
            return
        /**********************************************************************
         * Testing Guide : 
         *  https://developer.authorize.net/hello_world/testing_guide.html
         * 
         * AmEx         370000000000002 
         * Discover     6011000000000012
         * JCB          3088000000000017
         * Diners Club  38000000000006
         * Visa         4007000000027       4012888818888
         * Mastercard   5424000000000015    2223000010309703
         * 
         * Payout : Bank Routing Number a.k.a. ABA Number
         * 
         * Routing Number: 256072691 (2560-7269-1) E TRADE BANK
         * Account Number: 1234567
         * For testing purposes, 
         * eCheck.Net transactions under $100 will be accepted.  
         * To generate a decline, submit a transactions over $100.  
         * A monthly limit of $5000 is also configured in the sandbox.
         *********************************************************************/
        const jForm = {
                amount: '11'
                ,cardnumber: '5424000000000015'
                ,expiry: '11/22'
                ,cardcode: '900'
                ,zipcode: '10003' // Decline: 46282, Wrong: 46205 / 46201
            }

        // Inject values into the form
        amount.value        = jForm.amount
        cardnumber.value    = jForm.cardnumber
        expiry.value        = jForm.expiry
        cardcode.value      = jForm.cardcode
        zipcode.value       = jForm.zipcode
    })//()

    ;(()=>{// DEV/TEST : SHA256 : 
       /***********************************************************************
        * Testing Guide : 
        *   https://developer.authorize.net/hello_world/testing_guide.html
        * 
        * Fingerprint:
        *   acde30d4-9438-4866-a173-1fda7253713f
        *   5424000000000015
        *   10003
        * Concat:
        *   acde30d4-9438-4866-a173-1fda7253713f542400000000001510003
        **********************************************************************/
        o.aDelay(500, () => {
            //logFocus("ss:",ss,o.State().store)
            
            // const src = ss.auth.sub
            //             + cardnumber.value.replace(/\s+/g, '')
            //             + zipcode.value
            const src = 'acde30d4-9438-4866-a173-1fda7253713f542400000000001510003'
            o.sha256(src).then(x => logFocus("sha:",x))
            o.sha256(
                ss.auth.sub
                + cardnumber.value.replace(/\s+/g, '')
                + zipcode.value
            ).then(fp => logFocus("sha:",fp))
        })
    })//()
    
    //;[...selection].map(x => logFocus(x.dataset.name))

    // logFocus(navigator.language)  // en-US
    // logFocus(navigator.languages) // ["en-US", "en"]

})( window[__APP__] = window[__APP__] || {} )
