'use strict'
/******************************************************************************
 * Authorize.net : AcceptUI.js / iframe : PCI-DSS SAQ A compliant 
 * 
 * AcceptUI.js generates an iframe popup payment form of cross origin.
 * On submit, hosted script passes tokenized data (dataDecriptor, dataValue) 
 * to app-declared response handler, and also sets app-form input attributes, 
 * input.name and input.value, to the tokenized data; a pair of k-v pairs.
 * 
 *      <input type="hidden" 
 *          name="dataDescriptor" 
 *          value="COMMON.ACCEPT.INAPP.PAYMENT">
 * 
 *      <input type="hidden" 
 *          name="dataValue" 
 *          value="eyJ...MSJ9">
 * 
 * These compliance schemes require exposing our handler script to window,
 * publicly exposing our gatwway ID, loosening CSP to allow for inline styles, 
 * dropping our standard of cryptographically signing scripts and styles 
 * (CSP/SRI), and blindly accepting a cross-origin script, ironically.
 * 
 * In other words, the industry's compliance schemes mitigate 
 * application server weaknesses, yet increase vulnerability 
 * to an external attacker at the weakest link (the client).
 * 
 * https://developer.authorize.net/api/reference/features/accept.html 
 ***************************************************************************/
const 
    log = (arg, ...args) => console.log(`[anet]`, arg, ...args)
    ,id = (id) => document.getElementById(id)
    ,css = (selector, root) => {
        root = root ? root : document 
        return root.querySelector(selector)
    }
    ,ghost = document.createElement('GHOST')
    ,appForm = css('#form-container form') || ghost
    ,accepted = (resp) => new CustomEvent('accepted', {detail: resp})

/******************************************************************* 
 * Host-registered handler : hostedSubmitHandler(..)
 * 
 * The hosted (iframe) form (AcceptUI.js) responds to our app 
 * upon (user's) submit event by calling this handler, 
 * which is declared at our app's form (appForm) per 
 * Dataset Web API (data-responseHandler). Our response handler 
 * dispatches a custom event (accepted), passing the response 
 * object (resp) containing the tokenized data to our listener 
 * at a companion form-handler script. 
 * 
 * That script sends the tokenized data to our app's API service
 * per POST request (AJAX). Thereof our service initiates the 
 * gateway-transaction request per POST to the Authorize.net API.
********************************************************************/
function hostedSubmitHandler(resp) {
    // See 'accepted'-event listener @ app's companion script
    log('@ Event : accepted')
    appForm.dispatchEvent(accepted(resp))
}

/***********************************************************************
 * Click listener wrapped in load listener
 * 
 * - Wait until scripts load before accessing the DOM to initialize.
 * - Remove hosted (iframe) popup on click anywhere in the background.
***********************************************************************/
self.addEventListener('load', () => {
    const 
        bkgnd = id('AcceptUIBackground')
        ,ctnr = id('AcceptUIContainer') || ghost
        ,h2 = css('#profile dt a h2') || ghost

    // @ Host script fail
    bkgnd || (
        (h2.textContent = 'Add Payment Profile *** UNAVAILABLE ***')
        ,(h2.dataset.hostScriptFail=1)
    )

    log('@ Event : loaded')
    bkgnd && bkgnd.addEventListener('click', () => 
        [bkgnd, ctnr].map(el => el.classList.remove('show'))
    )
})

