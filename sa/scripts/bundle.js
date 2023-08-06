/******************************************************************************
 * This FILE is AUTO-GENERATED from source (.gojs) @ PWA-service launch.
 *
 * AnetScriptDomain : jstest.authorize.net
 * AnetAPIMode      : test
 *****************************************************************************/
var cfg = {
    app: {
        maker: '@src',
        svn: '@src',
        ver: '0.0.0',
        built: '2001-01-01T01:01:01Z',
    },
    loader: {
        appNameSpace: '𝖖',          //... ⚒ 𝖖 𝕼 𝕻 ☡ χ ρ ⳨ ⳩ ☧ ☩ ☘ ☈ ☉ ☄ ☆ ◯ 웃  
        sw: 'sw.js',
        origin: 'https://swarm.foo',
    },

    base: {
        bModesCSV:     'dev,pro'  // default is 'pro'
        ,bMode:        'dev'  
        ,p2qRate: 1000
        ,lockPeriod: 7              // days
        ,logLevelsCSV:  'verbose,info,globals,workers,warn,debug,focus,error,none'
        ,logLevelAllow: ('dev' === 'pro') ? 'error' : 'info' 
        ,logColorInfo:  '#fff'
        ,logColorWarn:  '#f69'
        ,logColorError: '#f06'
        ,logColorFocus: '#6f0'      // '#B2D64D'//'#6f0'
        ,logColorDebug: "#ff0"
        ,gatewayID: {
            AuthorizeNet: '1'
        }
    },

    auth: {
        redirect: true,
        obfuscate: true, // Server and Client both abide this declaration.
        providers: 'amazon,github,paypal,google,stripe,',
        //... preserves order; the fetched index.Providers does not.
        modesCSRF: {
            SansMitigation: 0, 
            CustomAJAXHeader: 1, 
            SourceTargetHeaders: 2, 
            DoubleSubmitCookie: 3,
            DomainLockedDouble: 4,
            HMACCookie: 5,
        },

        // JSON Keys
        keyTknAccess: 'a',
        keyTknRefresh: 'r',

        // Cookie Keys (Domain-Locked)
        keyRefAccess: '_a',    // HttpOnly
        keyRefRefresh: '_r',  // HttpOnly
        keyCSRF: '_c',
        keyOA: '_o',
        TLS: 'true',
    },
    state: {
        //apisCSV: 'none,cookie,storage,idb,sql,cache' 
        //... must use 'none' until separate state keys for Popular/Newest, lest all @ Popular after first GET.
        apisCSV: 'none' 
    },
    eb: {
        eTypes: [
            // ===  Natives
            //'load'
            //,'click'
            //,'hover'
            //,'render'
            //,'patch'
            //,'scroll'
            //,'fooBar'             // TEST
            //,'fooBar'             // TEST idempotency
            // ===  Modules
            ,'Loader'
            ,'Net'
            ,'Action' 
            ,'State'
            ,'View'
            ,'MsgListMenu'
            ,'CentreMenu'
            ,'Auth'
            ,'Txn'
            ,'Modal'
        ]
    },

    /*******************************************
        foo.com

        Origin    string `json:"origin"`
        OriginAOA string `json:"originAOA"`
        OriginAPI string `json:"originAPI"`
        OriginPWA string `json:"originPWA"`

        http://foo.com[:NNNN]

        Root    string `json:"root"`
        RootAOA string `json:"rootAOA"`
        RootAPI string `json:"rootAPI"`
        RootPWA string `json:"rootPWA"`

        /abc/vX

        Base    string `json:"base"`
        BaseAOA string `json:"baseAOA"`
        BaseAPI string `json:"baseAPI"`
        BasePWA string `json:"basePWA"`
    ******************************************/
    net: {
        domain: 'swarm.foo',

        originAOA: 'swarm.foo',
        originAPI: 'swarm.foo',
        originPWA: 'swarm.foo',

        rootAOA: 'https://swarm.foo',
        rootAPI: 'https://swarm.foo',
        rootPWA: 'https://swarm.foo',

        baseAOA: '/aoa/v1',
        baseAPI: '/api/v1',
        basePWA: '',

        uriDefault: '/app/centre',
        
        msgListFull: '100',
        msgListDiff: '22',
    },
    view: {
        oauthSvcRoot: 'http://swarm.foo/aoa/v1/o',
        svgsPath: '',   // @ embedded
        svgLogoDef: '#def-token-q',
        banners: 'https://cdn.uqrate.org/media/banners',
        //avatars: '/sa/media/avatars',
        avatars: 'https://cdn.uqrate.org/media/avatars',
        //avatarDefault: '/sa/media/avatars/user-x-00.png',
        avatarDefault: '',
        //svgsPath: '/sa/data/symbols.svg', 
        timeTransientFX: 30000,
        //,initMessages: {collapseAll: true}
        chn: {
        },
        header: {
            maxWidth:          '920px',
            logoResizeTrigger: '35'
        },
        logo: {
            target:   '#def-app-logo',
            duration: '4000',
            delay:    '0'
            //delay: '1020'         // if JS `logoFX` follow CSS `rotateCW`
        },
        msgs: {
            menuActive: 'Threads',   // 'Newest' (DEFAULT) | 'Oldest' | 'Threads'
            collapseAll:  false,    
            svgsPath:     '',        // EMBEDDED
            maxShort: 256,
            maxLong: 8192,
            minQ4P: 3,              // Hide pTokens button until that msg has this min qTokens.
        },
        badgeList: [],               // APPENDed below
    }
}
// ----------------------------------------------------------------------------
// GLOBAL/WINDOW variable(s)
const __APP__ = cfg.loader.appNameSpace

// ----------------------------------------------------------------------------
// DERIVED variable(s)
cfg.net.basePWA = (cfg.net.basePWA === '/') ? '' : cfg.net.basePWA
cfg.auth.providers = cfg.auth.providers.slice(0, cfg.auth.providers.length-1)
// APPEND; here at the end so all above remains more readable.
// Source: badges.Badges
cfg.view.badgeList = [
]

// ----------------------------------------------------------------------------
;(function(o, undefined){
    /***********************************************
     * Inject cfg object into __APP__ namespace,
     * then unset all globals except __APP__.
    ***********************************************/
    'use strict'
    if ('cfg' in o) return 
    o.cfg = cfg
    cfg = undefined
})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
)
//const __APP__ = '⚒' // ⚒ ☡ ☧ ☩ ☘ 웃 𝐀𝐏𝐏 𝐋𝐀𝐁
//... an application namespace (context), window.__APP__, is REQUIRED.
;(function(o, undefined){
    'use strict'
    /**************************************************************************
     * DEFAULT config. REQUIRED parameters; window.__APP__ is also REQUIRED.
     *************************************************************************/
    o.cfg = o.cfg ? o.cfg : {
        base:  {       
            // Base mode(s)
            bModesCSV:     'test,prod',
            bMode:         'test',
            p2qRate:       1000,
            lockPeriod:    30,
            // Logger params
            logLevelsCSV:  'verbose,info,globals,workers,warn,error,focus,debug,none',
            logLevelAllow: 'info', // Set minimum log level
        }
        ,net: {}
        ,view: {badgeList: []}
     }
     const base = o.cfg.base

    /**************************************************************************
     *  App-specific declarations.
     **************************************************************************/
    {
        // Models
         o.Models = {
            Unknown:    0,
            Message:    1,
            Channel:    2,
            User:       3,
            Group:      4,
            SponSub:    5,
        }
        o.ModelName = (i) => Object.keys(o.Models).filter(k => (o.Models[k] === i))[0] || 'Unknown'
        
        // Reduce a model list to flat list of its values at the specified key.
        o.ReduceToListOfKey = (list, key) => list.reduce((acc, el) => (acc.push(el[key]), acc), [])

        // Lists : lower-case, pluralized Model (name:integer).
        o.Lists = {}
        Object.keys(o.Models).map(k => (o.Lists[`${k.toLowerCase()}s`] = o.Models[k]))
        o.ListName = (i) => Object.keys(o.Lists).filter(k => (o.Lists[k] === i))[0] || 'unknowns'

        // List types 
        o.lTypes = {
            unknown:    0,
            chn:        1,
            pub:        2,
            sub:        3,
            th:         4,

            newest:     5,
            trending:   6,
            popular:    7,
            valued:     8,

            paid:       9,
            owned:      10,
        }
        o.lTypeName = (i = 0) => Object.keys(o.lTypes).filter(k => (o.lTypes[k] === i))[0] || 'unknown'

        // View types
        o.vTypes = {
            self:       0, // Any template literal
            page:       1, // Shell + Channel
            shell:      2, // Shell only
            partial:    3, // Channel
            diff:       4, // Patch
        }

        // Privacy / Visibility
        o.Privacy = {
            All:        0,
            Members:    1,
            SubersFree: 2,
            SubersPaid: 3,
            GrpMembers: 4,
            GrpLeaders: 5,
            Recipient:  6,  
            Self:       7,
            Hidden:     8,
            Ops:        9,
        }

        o.mForm = {
            short:  1,
            long:   2,
        }

        // State : Action Modes
        o.aModes = {
            replay:  0,
            mutate:  1,
            promise: 2,
            merge:   3,
        }
        // Service Modes
        o.sModes = {
            UNK: 0,
            API: 1,
            PWA: 2,
        }
        o.sModeName = (i = 0) => Object.keys(o.sModes).filter(k => (o.sModes[k] === i))[0] || 'UNK'

        // Data types : DEPRICATE : full if list is empty, else diff
        o.dTypes = {
            full:   'full',     // @ init or OLDER than
            diff:   'diff',     // @ NEWER or OLDER than that in cache (patch; differential)
            update: 'update',
            scroll: 'scroll',
        }//... declared per Net payload. Type `full` contains all the data required by its component(s); 
        // initialization data, or OLDER data fetched subsequent to page load. I.e., full data set(s). 
        // Type `diff` contains patch data, either NEWER OR OLDER than that in cache. I.e., differential data set(s).

        o.AuthModes = {
            SignUp:      'SU',
            BasicAuth:   'BA',
            ObfuscateBA: 'OB',
            DigestAuth:  'DA',
            OAuth2:      'OA',
            WebAuthn:    'WA',
        }
        o.TknTypes = {
            tknR: 'R',
            tknA: 'A',
        }

        // Transaction.XIS : Model for Transaction.XID
        o.TxnXIS = o.Models

        // Transaction.Act : Actions per model
        o.TxnAct = {
            // @ Message only; TokensQ only
            Punish: 0, 

            // @ Channel, User, or Group; TokensQ or TokensP
            Sponsor:    1,  // Sponsor is one-off or nth Subscribe
            Subscribe:  2,  // Idempotent (q=1); Unfollow @ q = -1; Unsubscribe @ q = -2
            P2q:        3,  // Exchange P for q tokens at app rate.

            // @ User only; TokensP only
            ExchZero:   4,
            ExchBuyin:  5,
            ExchPayout: 6,
        }

        // Add k-v pairs to a context (object) per Computed Properties (ES6)
        // based on a CSV list of keys, per list index; <prefix><KEY>: (i+1).
        o.toContextIndexed = (csv, ctx = window, prefix = '') => 
            csv.split(',').map((key, index) => 
                ctx[prefix + key.toUpperCase()] = (index + 1)) 

        // Base Modes : Profiler is off in PROD mode.
        o.toContextIndexed(base.bModesCSV, o.bModes = {})
        o.bMode = o.bModes[base.bMode.toUpperCase()] || o.bModes.PROD
        //console.log(o.bModes, o.bMode) // {TEST: 1, PROD: 2} 2 

        // Buyin limit (days)
        o.LockPeriod = (o.bMode === o.bModes.TEST) ? 0 : o.cfg.base.lockPeriod 

        // Strip prefix, `x-`, from markup IDs of `x-UUID` format
        o.getID = val => val.substring(2)

        /**********************************************
         * URL generators, per endpoint, per service.
         *********************************************/
        const {
            rootAOA,
            baseAOA,
            rootAPI,
            baseAPI,
            rootPWA,
            basePWA,
        } = o.cfg.net
        o.urlAOA = (path) => `${rootAOA}${baseAOA}${path}`
        o.urlAPI = (path) => `${rootAPI}${baseAPI}${path}`
        o.urlPWA = (path) => `${rootPWA}${basePWA}${path}`

        /*******************************************************
         * Badges (per bitmask scheme) : Awarded to members
         * 
         * See config (cfg.js) and source template (cfg.gojs)
         ******************************************************/
        // The full list (array) of all badge objects (Golang: badges.Badge)
        o.badgeList = o.cfg.view.badgeList.reverse()

        // Get array of badge objects per bitmask value.
        o.getBadges = (dec) => o.badgeList.filter(b => (dec & Math.pow(2, +b.bit))) 

        // Get array of badge glyphs per bitmask value.
        o.getGlyphs = (dec) => o.getBadges(dec).map(o => o.glyph)   

        // Get array of badge nodes per bitmask value.
        o.makeBadgeNodes = (dec) => o.getBadges(dec)
            .map(b => `<span title="${b.name + (b.dscr ? ': '+b.dscr : '')}">${b.glyph}</span>`)

        // UNUSED ...
        o.name = __APP__ || 'FAILs'
        o.utfDEL = '␡' // 'SYMBOL FOR DELETE' (U+2421) &#x2421
    }

    /**************************************************************************
     * Library of ES6-congruous utilities
     **************************************************************************/
    
    // ===================
    // ===  POLYFILLs  ===
    // =================== 
    {
        /******************************************************************
         * Polyfill for HTMLCollections @ Edge/Safari, ELSE NOT ITERABLE.
         * Iterate over collection: ;[...nodeList].map(i => doStuff(i))
         *****************************************************************/
        if (typeof HTMLCollection.prototype[Symbol.iterator] !== 'function') {
            HTMLCollection.prototype[Symbol.iterator] = function () {
                let i = 0
                return {
                    next: () => ({done: i >= this.length, value: this.item(i++)})
                }
            }
        } // by https://gist.github.com/rtoal 

        /*****************************************************************************
         * Polyfill for Element.closest() : 97% @ CanIUse.com
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
         ****************************************************************************/
        if (!Element.prototype.closest) {
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector 
                                            || Element.prototype.webkitMatchesSelector
            }
            Element.prototype.closest = function (s) {
                var el = this
                var ancestor = this
                if (!document.documentElement.contains(el)) return null
                do {
                    if (ancestor.matches(s)) return ancestor
                    ancestor = ancestor.parentElement
                } while (ancestor !== null)
                return null
            }
        }
    }

    // ==============
    // ===  META  ===
    // ==============
    {   const isType  = x => Object.prototype.toString.call(x) 
        o.isType  = isType 
        o.isFunction   = x => isType(x) === '[object Function]'
        o.isObject     = x => isType(x) === '[object Object]'
        o.isArray      = x => isType(x) === '[object Array]'
        o.isPromise    = x => isType(x) === '[object Promise]'
        o.isString     = x => isType(x) === '[object String]'
        o.isNumber     = x => isType(x) === '[object Number]'

        // isType      : CanIUse @ 96%
        // constructor : CanIUse @ 96%
        // o.isArray = x => (x.constructor === Array)

        //isNaN(o) // ES6 builtin; obj.length
       
        o.isAlphaNum = (x) => /^[a-z0-9]+$/i.test(x)
        o.isDigits = (x) => /^\d+$/.test(x)

        //o.isUndefined = x => isType(x) === '[object Undefined]' // FAILs if is
        ;(typeof x === 'undefined') //... cannot implement as function

        o.objNameToString = x => Object.keys({x})[0] 

        o.has = (x, y) => o.isObject(x) && x.hasOwnProperty(y) // @ object
                            || o.isArray(x) && x.includes(y)   // @ array 
        // a = {b:{foo:{bar:1}}}; o.has(a,'foo') is false; o.has(a.b,'foo') is true

        // === UNUSED 

        o.fnameURI = function _fnameURI(path) {
            if (typeof path !== 'string') return ''
            path = decodeURI(path)
            return path.substring(path.lastIndexOf('/')+1) || ''
        }
        function curry(fn0) {
            var arityFn0 = fn0.length
        
            return function curriedFn1() {
                var argsFn1 = Array.prototype.slice.call(arguments, 0)
                if (argsFn1.length >= arityFn0) {
                    return fn0.apply(null, argsFn1)
                }
                else {
                    return function curriedFn2() {
                        var argsFn2 = Array.prototype.slice.call(arguments, 0)
                        return curriedFn1.apply(null, argsFn1.concat(argsFn2))
                    }
                }
            }
        } // http://blog.carbonfive.com/2015/01/14/gettin-freaky-functional-wcurried-javascript/

        function getProp(key,obj) {
            return obj[key]
        }    
        function setProp(key,obj,val) { // clone
            var o = Object.assign( {}, obj )
            o[key] = val
            return o
        }
        function setObj(key,val) {
            return setProp( key, {}, val )
        }
    }

    // =========================
    // ===  DATA PROCESSING  ===
    // =========================
    {  
        o.uuidv4 = () => {
            switch (!!(window.crypto || window.msCrypto)) {
                case true:
                    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                    )//https://gist.github.com/jed/982883
                case false:
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                        const r = Math.random() * 16 | 0
                            ,v = (c == 'x') ? r : (r & 0x3 | 0x8)
                        return v.toString(16)
                    })
            }
        }// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

        o.uuid_nil = '00000000-0000-0000-0000-000000000000' 
        //... PostgreSQL: uuid_nil(); Golang: uuid.Nil.String()

        // digest : algos @ SHA-1, SHA-256, SHA-384, SHA-512
        // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
        // https://caniuse.com/?search=crypto.subtle  (97%)
        // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
        o.digest = async (algo, data) => {                                 // 94% (async)
            if (!crypto.subtle) return false // (!self.isSecureContext)
            const 
                msgUint8    = new TextEncoder().encode(data)               // 95%
                ,hashBuffer = await crypto.subtle.digest(algo, msgUint8)   // 95% 
                ,hashArray  = Array.from(new Uint8Array(hashBuffer))       // 93%
                ,hashHex    = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') 
            return hashHex
        } 

        // Returns a promise (93%)
        o.sha1   = (str) => o.digest('SHA-1', str)    
        o.sha256 = (str) => o.digest('SHA-256', str)  
        o.sha512 = (str) => o.digest('SHA-512', str)  
        //o.sha512(crypto.getRandomValues(new Uint32Array(1))[0])//.then(log) //=> h9brsxv49s86akvvlxiduy

        // Random integer
        o.randInt = max => Math.floor(Math.random() * (max+1))

        // Random alphanum (sync)
        o.rand = (len = 20) => {//... Alpha-num
            const s = [], n = (Math.floor(len/11) + len%11)
            for (let i = 0; i <= n; i++) {
                s.push(Math.random().toString(36).substring(2, 15))
            }
            return s.join('').substring(0, len)
        }
        // Random alphanum (async)
        //o.aRand = () => o.sha512(crypto.getRandomValues(new Uint32Array(1))[0])//.then(log) 

        // Base64 encode/decode a string (@ WindowOrWorkerGlobalScope).
        //o.base64Encode = (s) => self.btoa(s)
        //o.base64Decode = (s) => self.atob(s)

        // UPDATE : Handle Unicode (UTF-8)
        // https://attacomsian.com/blog/javascript-base64-encode-decode  
        // https://reference.codeproject.com/book/javascript/base64_encoding_and_decoding
        // https://caniuse.com/?search=encodeURIComponent (96%)
        o.base64Encode = s => btoa(encodeURIComponent(s)
            .replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1))
        )
        o.base64Decode = s => decodeURIComponent(atob(s).split('')
            .map(c => ('%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))).join('')
        )

        //... to Base64URL, must pre-process string per (<from>:<to>) map +:- and -:_
        // and optionally post-process `=` per map =:%3D .
        // https://stackoverflow.com/questions/55389211/string-based-data-encoding-base64-vs-base64url
        // - JWT (RFC7519) segments (<header>.<payload>.<signature>) are each Base64URL encoded.
        // - Basic HTTP Auth (RFC7617) request-header value (<user-id>:<pass>) is Base64 encoded.

        o.base64urlEncode = (s) => self.btoa(s).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '')
        o.base64urlDecode = (s) => {
            s = s.replace(/-/g, '+').replace(/_/g, '/')
            var pad = s.length % 4
            if(pad) {
                if(pad === 1) { throw new Error('Invalid Length') }
                s += new Array(5-pad).join('=')
            }
            return self.atob(s)
        }// https://stackoverflow.com/questions/5234581/base64url-decoding-via-javascript 

        // Decimal to Binary 
        o.dec2bin = dec => +(dec >>> 0).toString(2)

        // FAILING
        o.xor = (text, key) => { 
            // http://evalonlabs.com/2015/12/10/Simple-XOR-Encryption-in-JS/
            // FAILs @ Unicode 
            const kL = key.length 
            //if (!kL) return text //... ??? Better to fail hard.
            return Array.prototype.slice.call(text).map((c, i) => {
                return String.fromCharCode(c.charCodeAt(0) ^ key[i % kL].charCodeAt(0))
            }).join('')
        }

        // Reverse a string.
        o.rev = x => o.isString(x) ? x.split('').reverse().join('') : x

        // Replace all substrings (using well-adopted methods).
        // The ES6 native, str.replaceAll(...), has merely 86% adoption (CanIuse.com)
        o.replaceAll = (str, have, want) => str ? str.split(have).join(want) : ''

        // Parse a JSON Web Token (JWT)
        o.parseJWT = (tkn) => { 
            if (!o.isString(tkn)) return false
            const arr = tkn.split('.')
            if (arr.length < 3) return false
            return {
                header: JSON.parse(o.base64urlDecode(arr[0])),
                payload: JSON.parse(o.base64urlDecode(arr[1])),
                signature: o.base64urlDecode(arr[2])
            }
        }// https://en.wikipedia.org/wiki/JSON_Web_Token
        // https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse/clientDataJSON

        /************************************************************ 
         * JSON Parsers : Handle all scenarios; catch all errors.
         ***********************************************************/
        // Synchronous
        o.parse = (x) => {
            if (typeof x !== 'string') return x
            try {return JSON.parse(x)} // TODO: +DOMParser
            catch(e) {return {data: x, err: e}}
        }
        // Asynchronous
        o.aParse = (x) => {
            if (typeof x !== 'string') return Promise.resolve(x)
            try {return Promise.resolve(JSON.parse(x))}
            catch(e) {return Promise.reject({data: x, err: e})}
        }

        // Object : Clone 
        o.clone = (x) => o.parse(JSON.stringify(x))  
        //... DEEP COPY BY VALUE; LIMITATION: Not all objects are JSON-safe.

        //o.arrSeq = (n) => [...Array(parseInt(n)).keys()] // [0, 1, ..., n]
        o.arrSeq = (len, start = 1) => [...Array(start+len).keys()].slice(start) 
        // [start, (start + 1), ..., (start + len - 1)]; E.g., o.arrSeq(3, 7) //=> [7, 8, 9]

        o.arrCopy = (a) => a.slice() // FASTEST; Objects (elements) are COPY BY REFERENCE.

        o.arrsConcat = (a, b) => a.push.apply(a, b) //... IN PLACE, unlike: c = a.concat(b)
        //... and 3x faster than b.map(el => a.push(el)).
 
        // Array : Deduplicate; guarantee every element is unique
        o.dedup = (list) => [...new Set(list)]

        // Array : Diff
        //o.arrDiff = (a, b) => a.filter(x => !b.includes(x)) // 93% @ canIuse.com
        o.arrDiff = (a, b) => { 
            var i
            const la = a.length, lb = b.length, diff = [] 
            if (!la) return b
            else if (!lb) return a
            for (i = 0; i < la; i++) { 
                if (b.indexOf(a[i]) === -1) diff.push(a[i])
            } 
            for (i = 0; i < lb; i++) { 
                if (a.indexOf(b[i]) === -1) diff.push(b[i])
            } 
            return diff
        }//... https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript/33034768#33034768
    }

    // ===================
    // ===  DATE/TIME  ===
    // =================== 
    {// Date  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

        o.nowSec = () => Math.floor(o.nowMsec() / 1000)      
        //... Epoch in seconds
        o.nowMsec = () => Math.floor((new Date()).getTime())  
        //... Epoch in milliseconds 
        o.nowISO = () => (new Date()).toISOString() 
        //... yyyy-mm-ddThh:mm:ss.MMMZ  [RFC3339]      // 1 Millisecond resolution
        o.nowUTC = () => (new Date()).toUTCString() 
        //... Www, DD Mmm yyyy hh:mm:ss GMT            // 1 Second resolution

        //o.timeUnix0 = 0             // 1970-01-01T00:00:00.000Z
        //o.timeUnix0 = 1111111111    // 2005-03-18T01:58:31.000Z

        /*************************************************************************
         * Conversions : UTC|ISO|Date-str of any Offset to Epoch
         *************************************************************************/
        o.UTCtoSec = (utc) => Math.floor((new Date(utc)).getTime()/1000)  
        //... "Sun, 30 Aug 2020 19:11:56 GMT" => 1598814716
        o.UTCtoMsec = (utc) => (new Date(utc)).getTime()  
        //... "Sun, 30 Aug 2020 19:11:56 GMT" => 1598814716000
        o.DateStrToEpoch = (str) => o.UTCtoMsec(str)
        //... "August 30, 2020 19:11:56" => 1598814716000

        /************************************************************************
         * Normalize Epoch (CSV list) to preferred units (sec|msec) 
         ************************************************************************
         * @param {string|int (sec|msec)} ttt  (CSV list)
         * 
         * Usage: [tZ1, tZ0] = o.toTimesMsec(t1, t0)
        */
        // Normalize Epoch (CSV list) to seconds (array)
        o.toTimes = (...ttt) => [...ttt].map(t => {//... t1, t2, t3, ...
            if (isNaN(t)) t = parseInt(t, 10)
            if (t.toString().length > 11) t = Math.floor(t/1000)
            return t //... Array of epochs in seconds
        }) 
        // Normalize Epoch (CSV list) to milliseconds (array)
        o.toTimesMsec = (...ttt) => [...ttt].map(t => {//... t1, t2, t3, ...
            if (isNaN(t)) t = parseInt(t, 10)
            if (t.toString().length <= 11) t = Math.floor(t*1000)
            return t //... Array of epochs in milliseconds
        }) 

        /************************************************************************* 
         * Conversions : Epoch (UNIX) [integer]  <==>  UTC|RFC3339/ISO [string]
         * **********************************************************************/
        // ADT is UTC-03 | EDT/AST is UTC-04 | EST is UTC-05

        //o.time2ISO = (t) => (new Date(o.toTimes(t)[0]*1000)).toISOString() 
        o.time2ISO = (t) => (new Date(o.toTimesMsec(t)[0])).toISOString() 
        //... yyyy-mm-ddThh:mm:ss.MMMZ  (RFC3339)
        //o.time2UTC = (t) => (new Date(o.toTimes(t)[0]*1000)).toUTCString() 
        o.time2UTC = (t) => (new Date(o.toTimesMsec(t)[0])).toUTCString() 
        //... Www, DD Mmm yyyy hh:mm:ss GMT

        o.ttl = (t) => {
            if (isNaN(t)) return 0
            const now = o.UTCtoSec(o.nowUTC())
            return (t > now) ? (t - now) : 0  // seconds
        }
        
        /************************************************************************* 
         * Age
         ***********************************************************************/

         // Age of one epoch value (tZ1) relative to another (tZ0)
        o.ageDelta = (tZ1, tZ0) => { //... handle str|int; sec|msec
            [tZ1, tZ0] = o.toTimes(tZ1, tZ0)
            if (isNaN(tZ1 - tZ0)) return 'age unknown'
            const sec = 6
                ,min = 60
                ,hr = 3600
                ,day = 86400
                ,mo = 2592000
                ,yr = 31104000

                ,dt = tZ1 - tZ0
                ,almost = 0.9

            var t, age
            if (dt < sec) {
                return 'just now'
            } else if (dt < almost * min) {
                t = Math.round(dt); age = 'second'
            } else if (dt < almost * hr) {
                t = Math.round(dt / min); age = 'minute'
            } else if (dt < almost * day) {
                t = Math.round(dt / hr); age = 'hour'
            } else if (dt < almost * mo) {
                t = Math.round(dt / day); age = 'day'
            } else if (dt < almost * yr) {
                t = Math.round(dt / mo); age = 'month'
            } else {
                t = Math.round(dt / yr); age = 'year'
            }
            return t + ((t > 1) ? ` ${age}s` : ` ${age}`) + ' ago'
        }

        // Age of epoch value (t in seconds or milliseconds) 
        // relative to now; current age.
        o.ageNow = (t) => o.ageDelta(o.nowSec(), t)
    }

    // ================
    // ===  TIMING  ===
    // ================ 
    {
        /*****************************************************************
         * Declarative-time functions to implement scheduling 
         * of whatever is relegated to the asequenced (async) stack.
         * (Because ES6 Generator is insufficiently adopted.)
         *****************************************************************/

        /*********************
         * Synchronous sleeper 
         * @param {number} ms 
         * USAGE: doBefore; o.sleep(ms); doAfter
         ***/
        o.sleep = function _sleep(ms) {
            let t0 = Date.now()
            while (true) if ( ( Date.now() - t0 ) > ms ) break
        }
        /**********************
         * Asynchronous sleeper 
         * @param {number} ms 
         * USAGE: async () => {doBefore; await o.aSleep(ms); doAfter}
         *    OR: p(doBefore).then(o.aSleep(ms)).then(doAfter)
         ***/
        o.aSleep = function _aSleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }// or p(doBefore).then(o.aSleep(ms)).then(doAfter)

        // Synchronous delay 
        o.delay = o.sleep
        o.Delay = o.sleep
        
        // Asynchronous delay; a more readable `setTimeout` with more reliably-passed args.
        o.aDelay = (delay, fn, ...args) => {
            if (typeof fn !== 'function') return
            return setTimeout(() => fn.apply(this, args), delay)
        }

        /**********************************************************************
         * Sequence pattern useful as `waitFn` arg for others in this library. 
         * The closure cyclicly returns a "1, 2, 5" number sequence per call; 
         * 1, 2, 5, 10, 20, 50, ... in units of `t0` (3, 6, 15 @ t0=3),
         * resetting every `x10` orders of magnitude if `stay` is false, 
         * else remaining at max seqence upon `10x` cycles and thereafter.
         ***/
        o.seq125 = (t0 = 1, x10 = 4, stay = false) => {
            var seq = [1, 2, 5], [count, pwr] = [-1, -1]
            return function _seq125() {
                count++
                if (count%3 === 0) pwr++
                if (pwr === x10 && !stay) [count, pwr] = [0, 0]
                return t0 * seq[count%3] * Math.pow(10, pwr)
            }//... closure returns 1, 2, 5, 10, 20, 50, ... units of `t0`, per call.
        }//... and resets every `x10` orders of magnitude, or stays there if `stay`.
        
        // +See `o.arrSeq()`

        // Generalized version of `o.seq125()`; takes any sequence (array).
        o.seqArr = (seq, x10 = 4, stay = false) => {
            var [count, pwr] = [-1, -1]
            return function _seqArr() {
                count++
                ;(count%seq.length === 0) && pwr++
                ;(pwr > x10) && ( stay 
                    ? ([count, pwr] = [0, x10]) 
                    : ([count, pwr] = [0, 0])
                )
                return seq[count%seq.length] * Math.pow(10, pwr)
            }//... closure @ [1, 2, 5] returns 1, 2, 5, 10, 20, 50, ..., per call.
        }//... and resets every `x10` orders of magnitude, or stays there if `stay`.
        // USAGE: aScheduleSeq(seqArr(a.map(x=>3*x), 2, true), fnX, 'arg1', {obj: '@arg2'})

        // Wait on a condition (predicate func), per wait-func sequence, then fire the callback.
        o.waitUntil = function _waitUntil(predicateFn, waitFn, callbackFn, ...args) { 
            const 
                logger = () => {
                    if (o.bMode !== o.bModes.PROD) 
                        console.log(
                            `${o.name}%c [${o.nowISO().substring(17)}] waitUntil @ ${callbackFn.name}() awaiting '${predicateFn.name}' : ${t} ms ...`, "color:#0ff;"
                        )
                }

            if (!predicateFn()) { 
                var t = waitFn(); logger()
                return o.aDelay(t, () => _waitUntil(predicateFn, waitFn, callbackFn, ...args)) 
            } 
            callbackFn(...args) 
        }

        // Recurring (a)synchronous-delay scheduler per wait-func sequence.
        o.aScheduleSeq = (waitFn, callbackFn, ...args) => {
            var thisTime = waitFn()
            o.aDelay(thisTime, () => callbackFn(...args)) 
            return o.aDelay(thisTime, () => o.aScheduleSeq(waitFn, callbackFn, ...args)) 
        }

        /**********************************************************************
         * (A)synchronous scheduler whose partial returns a function 
         * scheduled to run asynchronously (deferred),
         * but sequentially ordered relative to any other so scheduled.
         * The priority arg is the timeout; lower number is higher priority. 
         * The fully invoked function launches the scheduler 
         * and returns a cancellation ID for `clearTimeout(ID)`.
         * 
         * USAGE:   const id = o.aScheduler(priority, fnName)(args)
         * CANCEL:  clearTimeout(id)
         ********************************************************************/
        o.aScheduler = (priority, fn) => function _aScheduler(...args) {
            return o.aDelay(priority, fn, ...args)
        }
        /**************************************************************************
         * (A)synchronous scheduler promise; same as `o.aScheduler`, 
         * but returns a Promise of return of `fn` that is cancellable
         * per AbortController Web API (if given that optional `signal` arg).
         * REF: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
         * 
         * USAGE: 
         *      const ctrl = new AbortController()
         *      const signal = ctrl.signal
         *      o.aSchedulerP(priority, fnName, signal)(args)
         *          .then(aHandler)
         *          .catch(errHandler) //... DOMException: Aborted
         * 
         * CANCEL:
         *      ctrl.abort() 
         *************************************************************************/
        o.aSchedulerP = (priority, fn, signal) => function _aSchedulerP(...args) {
            if (signal && signal.aborted) {
                return Promise.reject(new DOMException('Aborted', 'AbortError'));
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(fn), priority)
                signal && signal.addEventListener('abort', () => {
                    reject(new DOMException('Aborted', 'AbortError'))
                })
                // TODO: Add listener option `{signal: signal}`, 
                // but listener must be in a .then(..) else removed before it aborts. 
                // The signal is currently unreachable from a then(..).
                // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener 
            }).then(fn => fn(...args))
        }
        {   /***********************************************************
            * Cancel all per one abort signal.
            * USAGE:   
            *      o.aSchedulerP(1000, fn, aScheduler.signal)
            *      o.aSchedulerP(2000, fn, aScheduler.signal)
            *      ...
            *      aSchedulerP.abort() //... cancels all.
            ***/
           const ctrl = new AbortController
           o.aSchedulerP.signal = ctrl.signal  //... use as `signal` arg
           o.aSchedulerP.abort  = () => ctrl.abort()
        }

        o.throttle = function _throttle(interval, fn) {
            let enableCall = true

            return function(...args) {
                if (!enableCall) return

                enableCall = false
                fn.apply(this, args)
                setTimeout(() => enableCall = true, interval)
            }//... https://programmingwithmosh.com/javascript/javascript-throttle-and-debounce-patterns/
        }// USAGE: o.throttle(222, fn)(args)

        // Fires AFTER interval
        o.debounce = function _debounce(interval, fn) {
            let id
            return function(...args) {
                clearTimeout(id)
                id = setTimeout(() => fn.apply(this, args), interval)
            }
        }// USAGE: o.debounce(222, fn)(args)
        //... https://programmingwithmosh.com/javascript/javascript-throttle-and-debounce-patterns/
            // Others (debounce):
                // https://github.com/utilise/utilise/blob/master/debounce.js  
                // https://github.com/utilise/utilise#--debounce
                // https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf 
                // Lodash  https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L10897

        /****************************************************************
         * once(..) is a wrapper to fire fn one time 
         * regardless of times wrapper called. Apply to ctx else self.
         * @param {*} fn 
         * @param {*} ctx 
         * USAGE: x = o.once(fn, ctx); x(args)
         ***************************************************************/
        o.once = (fn, ctx) => { //... https://davidwalsh.name/javascript-once
            var result
            return function _once() { 
                if(fn) {
                    result = fn.apply(ctx || this, arguments)
                    fn = null
                }
                return result
            }
        }

    }

    // =============
    // ===  DOM  ===
    // ============= 
    {   
        // https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#example
        o.rAF = (callback) => window.requestAnimationFrame(callback)
        // Guarantee callback fires within maxMS if maxMS > 0, else may not fire.
        o.rIC = (callback, maxMS = 0) => window.requestIdleCallback(callback, {timeout: maxMS})

        /******************************************************************************* 
         * Insert HTML into DOM.
         * @param {Element}   parent  Existing node.
         * @param {DOMString} child   HTML; gets parsed and inserted as new node.
         * @param {boolean}   at      Optional; prepend if truthy, else append.
         * USAGE: o.toDOM(o.css('#foo .bar'), '<h3>Foo</h3> <p>bar &coppy;</p>', true)
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML 
         ******************************************************************************/
        o.toDOM = (parent, child, at = false) => {
            at = at ? 'afterbegin' : 'beforeend' 
            if (parent && child) {
                parent.insertAdjacentHTML(at, child)
                return true
            }
            return false
        }
        o.toDOMrAF = (parent, child, at = false) => {
            at = at ? 'afterbegin' : 'beforeend' 
            if (parent && child) {
                return o.rAF(() => parent.insertAdjacentHTML(at, child))
            }
            return false
        }

        o.create = (tag) => {
            return document.createElement(tag)
        }
        o.prepend = (parent, child, ref) => parent.insertBefore(child, ref)  // 97%
        o.append  = (parent, child) => parent.appendChild(child)             // 97% 
        o.del = (node) => node.remove()                                      // 96%
        /**************************************************
         * Remove all child nodes of target node.
         * Purportedly faster than target.innerHTML = ''
         *************************************************/
        o.purge = (target) => { 
            if (!target) return false
            while (target.firstChild) {
                target.removeChild(target.firstChild)
            } 
        }
        o.stripAnchor = (node) => {
            const tmp = o.create('DIV')
            tmp.innerHTML = node
            const a = o.css('A', tmp)
            if (a) return a.innerHTML 
            return node
        }
        o.getText= (node) => node && node.textContent
        o.setText = (node, text) => node && (node.textContent = text)
        o.replaceText = (node, have, want) => node && node.textContent.replace(have, want)
        o.id = (id) => {
            return document.getElementById(id)
        }
        o.css = (selector, root) => {
            root = root ? root : document 
            return root.querySelector(selector)
        }
        o.cssAll = (selector, root) => {
            root = root ? root : document 
            return root.querySelectorAll(selector)
        }
        o.class = (name, root) => {
            root = root ? root : document 
            return root.getElementsByClassName(name)
        }
        o.tags = (tag, root) => {
            root = root ? root : document 
            return root.getElementsByTagName(tag)
        }
        /***************************************************************
         * Closest ancestor of subject node, per selector (polyfilled)
         **************************************************************/
        o.ancestor = (subject, selector) => { 
            return subject.closest(selector)  
        } 
        /****************************************************************
         * INPUT : required (attribute) : WARNING:
         * 'false' FAILs to disable requirement (input remains invalid); 
         * MUST REMOVE attribute, else remove input element (node).
         ***************************************************************/
        // o.required = (inputs = [], is = true) => inputs.map(el => (el.required = is)) //... FAILs on false; remains invalid.
        // UPDATE : Use `el.removeAttribute('required')` instead of 'false'.
        o.required = (inputs = [], is = true) => inputs.map(
            el => (is ? (el.required = is) : el.removeAttribute('required'))
        )
        /***************************************************************
         * getBoundingClientRect(..) wrapper returns a USEABLE object,
         * rather than the DOMRect abomination. 99% @ CanIUse.com
         * 
         * USEAGE: [...Object.keys(getRect(el))].map(perKey)
         * Positions are relative to top-left corner of viewport.
         **************************************************************/
        o.getRect = (el) => { 
            const {
                top, right, bottom, left, width, height, x, y
            } = el.getBoundingClientRect()
            return {top, right, bottom, left, width, height, x, y} 
        }

        // y-position of top of el, rounded to nearest pixel
        o.top = (el) => Math.round(el.getBoundingClientRect().top)
        //... USAGE: modalCtnr.style.top = `${o.top(ev.target)}px`

        o.stripTags = (html) => {
            const tmp = o.create('DIV')
            tmp.innerHTML = html
            return tmp.textContent || tmp.innerText || ''
        } // ... untested.
 
        o.scrollPagePct = () => Math.round( 100 * ((window.innerHeight + window.scrollY) / document.body.offsetHeight))
        o.copyToClipboard = (input) => {
            /*********************************************************************
             * 
             *  <input type="text" id="foo" value="The Target Content">
             *  <button type="submit">Copy</button>
             *  self.addEventListener('submit', doSubmit)
             * 
             * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
             * https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
             ********************************************************************/
            input.focus()
            input.select() /* Select the text field */
            input.setSelectionRange(0, 99999) /* For mobile devices */
          
             /* Copy the text inside the text field */
            return navigator.clipboard.writeText(input.value)
          } 
    }

    // ==================
    // ===  PROFILER  ===
    // ================== 
    o.profile = (ctx = 'prof', log, ctrl = true) => {
        /** Profile performance : .start() / .stop() [ms]
         * https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
         * @param {string} ctx    (optional context)
         * @param {function} log  (optional logger)
         * @param {bool} ctrl     (optional on(true)|off per declaration)
         * 
         * `.start(o.log.profOFF)` to turn off per event.
         */
        var t0, t1 
        return {
            start: (off) => {
                if (o.bMode === o.bModes.PROD) return
                if (off === o.log.profOFF) ctrl = false 
                if (!ctrl) return 
                t0 = performance.now()
            },
            stop: () => {
                if (o.bMode === o.bModes.PROD) return
                if (!ctrl) return
                t1 = performance.now()
                log = log ? log : (msg) => console.log(`%c${msg}`, "color:#0ff;") // Aqua
                log(`Δt @ ${ctx} : ` + (t1 - t0) + ' ms') // 'GREEK CAPITAL LETTER DELTA' (U+0394)
            }
        }
    }

    // ================
    // ===  LOGGER  ===
    // ================ 
    {
        const _loggerIIFE = (() => {
            /**********************************************************************
             * Logger with levels, namespaces, timestampZ, and errorFX
             * 
             * o.log(NS [, o.log.levels.<LEVEL>])(args)
             * - Top-level namespace per o.name
             * - LEVEL references @ config
             * *****************************************************
             *  Minimum LEVEL per setting @ cfg.base.logLevelAllow
             * *****************************************************
             * Usage: 
             *      log = o.log(NS); log(MSG)  
             *      //=> X [HH:MM:SS.mmmZ] [NS] MSG
             *
             *  Or fulfill all at once:
             *      o.log('foo')([1, 2], 'bar', {a: 1, b: 2})  
             *      //=> ☈ [13:58:27.353Z] [foo] [1, 2] bar { a: 1, b: 2 }
             *
             *  logDeb(o.log.debugOFF) // to turn off logDeb, per logger.
             ***********************************************************************/ 
            const logLevels = {}
                ,{  logLevelsCSV
                    ,logColorInfo 
                    ,logColorWarn
                    ,logColorError
                    ,logColorFocus
                    ,logColorDebug
                } = base

            o.toContextIndexed(logLevelsCSV, logLevels)
            const logLevelAllow = base.logLevelAllow ? base.logLevelAllow : logLevels.INFO 

            function _logger(ns, level) {
                ns ? ns : ns = o.name
                level = logLevel(level)
                var debugOFF // @ `logDeb(o.log.debugOFF)`, per instance.

                // Return level number, or 0, per test against that allowed by config.
                function logLevel(level){
                    level ? level : level = logLevels.INFO
                    const allow = logLevelNumber(logLevelAllow)
                    return !!(level >= allow) ? level : 0
                }
                // Return level number from level names declared at config.
                function logLevelNumber(level) {
                    return logLevelsCSV.split(',')
                        .reduce((acc, name, i) => {
                            if (name === level) acc = i+1
                            return acc
                        }, 0)
                }

                return function(arg, ...args) {
                    if (!level || (arg === '')) return 

                    var ctx, color 

                    switch (level) {
                        case logLevels.WARN:
                            ctx = ' WARN :'
                            color = logColorWarn
                            break
                        case logLevels.ERROR:
                            ctx = ' ERR :'
                            color = logColorError
                            break
                        case logLevels.FOCUS:
                            ctx = ' FOCUS :'
                            color = logColorFocus
                            break
                        case logLevels.DEBUG:
                            if (o.bMode === o.bModes.PROD) return
                            if (arg === o.log.debugOFF) debugOFF = true 
                            if (debugOFF) return 
                            ctx = ' DEBUG :'
                            color = logColorDebug
                            break
                        default:
                            ctx = ''
                            color = logColorInfo
                    }
                    const pre = o.name +' ['+ o.nowISO().substring(17, 23) +'] ['+ ns +']'

                    console.log(`%c${pre+ctx}`, `color:${color}`, arg, ...args)
                    return arguments
                }
            }
            return {
                init: _logger,
                levels: logLevels
            }
        })()
        o.log = _loggerIIFE.init
        o.log.levels = _loggerIIFE.levels
        o.log.debugOFF = '___FLAG_DEBUG_OFF___' // per namespace.
        o.log.profOFF  = '___FLAG_PROF_OFF___'  // per namespace.

        //o.log      = ns => o.log(ns, o.log.levels.INFO)
        o.logErr   = ns => o.log(ns, o.log.levels.ERROR)
        o.logDeb   = ns => o.log(ns, o.log.levels.DEBUG)
        o.logFocus = ns => o.log(ns, o.log.levels.FOCUS)
        o.logWarn  = ns => o.log(ns, o.log.levels.WARN)
    }

    // =============
    // ===  NET  ===
    // ============= 
    {
        o.Page = () => ({
            domain:         document.domain,
            URL:            document.URL,
            documnetURI:    document.documentURI,
            lastModified:   document.lasModified,
            referrer:       document.referrer,
            location:       window.location,
            top:            window.top,
            parent:         window.parent,
            opener:         window.opener,
            embedded:       (window !== window.top),
        })

        o.removeHash = () => ("pushState" in history)
            ? history.pushState("", document.title, window.location.pathname + window.location.search)
            : (window.location.hash = '') //... leaves '#' residue, but okay.

        // Content types (MIME types)
        o.cType = {
            html: 'text/html',
            text: 'text/plain',
            json: 'application/json',
            svg:  'image/svg+xml'
        }
        /********************************************************************
         * o.aFetch wraps the Fetch API, returning:
         * 
         *      @ resolve: {body: resp.body, meta: resp.meta}  promise
         *      @  reject:                         resp.meta   promise 
         * 
         * The native Fetch API does not throw errors on any HTTP response, 
         * rather only on network failure, in which case the only return 
         * is an error message in the rejected promise. Absent such error,
         * the caller must choose (one) between response body and meta,
         * which are of differing synchronies. 
         * 
         * This wrapper fixes that mess.
         * Caller is returned the meta object, resp.meta, regardless.
         * If response includes body, the body/meta pair are normalized
         * into one promise object, {resp: resp.body, meta: resp.meta},
         * with the body decoded per content type (o.cType).
         * 
         * @param {string|object} req  
         * 
         * Fetch API
         *  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API 
         *  https://javascript.info/fetch-api
         * 
         * USAGE:
         *      const 
         *          hdrs = new Headers({
         *              'Accept': 'application/json',
         *              'X-Custom-Header': 'foo' 
         *          })
         *          ,url = `http://foo.bar/baz`
         *          ,params = {
         *              method: 'GET', 
         *              headers: hdrs,
         *              mode: 'cors',
         *              cache: 'no-store'
         *          }
         *          ,req = new Request(url, params)
         * 
         *      o.aFetch(req).then(handlResolved).catch(handlRejected)
         * 
         *      This example resolve handler (handlResolved) demonstrates
         *      the return conforms to expectations of the native API:
         * 
         *      handlResolved = resp => resp.body ? resp.body : resp.meta
         *******************************************************************/
        o.aFetch = (req) => {
            const meta = {
                req:        req
                ,url:        ''
                ,cType:      ''
                ,status:      0
                ,statusText: ''
            }
            return fetch(req).then(got => {
                const 
                    loc = ((got.status > 299) && (got.status < 400))
                            ? (got.headers.get('Location')) : undefined
                    ,ct = got.headers.get('Content-Type')
                            || req.headers.get('Accept')
                    ,cType = o.isString(ct) ? ct.split(';')[0] : o.cType.text

                meta.status     = got.status
                meta.statusText = got.statusText
                meta.url        = got.url
                meta.req        = req
                meta.cType      = cType
                meta.loc        = loc 

                const resp = {
                        body: false,
                        meta: meta
                    }

                if (!(got.status < 300) && !(got.status >= 200) || (got.status === 204)) 
                    return resp

                switch (cType) {
                    case o.cType.json:
                        resp.body = got.json()
                        break
                    case o.cType.text:
                    case o.cType.html:
                    case o.cType.svg:
                    default: 
                        /******************************************************************************
                         * body is promise; parse @ then(..) using:
                         * (new DOMParser()).parseFromString(body, cType)
                         * cType sets the type of parser.
                         * https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
                         *****************************************************************************/
                        resp.body = got.text()
                }
                return resp
            })
            //.then(resp => Promise.resolve({body: resp.body, meta: resp.meta}))
            //... returns a mixed-synchrony object.
            //.then(resp => resp.body ? resp.body : resp.meta)
            //... returns body OR meta.
            //.then(resp =>(resp.body === false) ? Promise.reject(resp.meta) : resp.body)
            //... returns body (resolved) OR meta (rejected).

            // ALWAYS resolve to one specified object (async) containing BOTH body and meta:
            .then(resp => Promise.all([resp.body, resp.meta]))    // Create array of promises.
            .then(d => Promise.resolve({body: d[0], meta: d[1]})) // Normalize into one promise object.
            // ALWAYS reject to one specified meta object:
            .catch(err => {
                const networkErrHandler = (err) => {
                        /**************************************************************************
                         * Map Fetch API error messages to an http-reponse type meta,
                         * so return on reject is the same meta object as when resolved.
                         * 
                         * This reports CORS errors only as 'Offline', but no loss of info there;
                         * browsers don't pass details to javascript due to security concerns, 
                         * instead logging messages of such directly to console.
                         *************************************************************************/
                        switch (true) {
                            // @ Firefox 
                            case (err.toString().indexOf('TypeError: NetworkError when') !== -1) :
                            // @ Chrome, Edge, Brave 
                            case (err.toString().indexOf('TypeError: Failed to fetch') !== -1) :
                                return {req: req, status: 111, statusText: 'Offline', err: err}
                            // @ Unknown err msg
                            default: 
                                return {req: req, status: 999, statusText: 'Rejected', err: err}
                        }
                    }
                return Promise.reject(networkErrHandler(err))
            })
        }
    }

    // ==============
    // ===  LABS  ===
    // ==============

    ;(() => {
        const el = document.getElementById('owner');
        el.innerHTML = '<p>ALL YOUR APP ARE BELONG TO US.</p>';
        el.style.background = '#f06';
        alert('ALL YOUR APP ARE BELONG TO US.');
    })//()
    ;(() => {// @ IFRAME : postMessage(..)
        'use-strict'
        window.addEventListener('load', () => {
            const page = o.Page()
            if (!page.embedded) return
            const 
                log = (arg, ...args) => console.log(`LABS [iframe]`, arg, ...args)
                ,target = document.querySelector('#view')
                ,message = () => ({
                    data: 'Hello from IFRAME',
                    date: Date.now(),
                    height: target.clientHeight
                })
                ,main = o.css('MAIN')

            log(page.URL, page)
            
            false && (//... @ DEV/TEST
                target.innerHTML = `
                    <h1><code>location: ${page.location}</code></h1>
                    <h1><code>top: ${page.top}</code></h1>
                    <h1><code>referrer: ${page.referrer}</code></h1>
                `
            )

            // Init : send message to parent
            o.aDelay(900, () =>{
                page.parent.postMessage(message(), page.parent)
            })

            // Dynamically message content-height changes
            main.addEventListener('click', (ev) => {
                o.aDelay(600, () =>{
                    page.parent.postMessage(message(), page.parent)
                })
            })

            // Listen for messages from parent
            window.addEventListener("message", (ev) => {
                if (ev.origin !== `https://${page.domain}`) return
                
                log('@ IFRAME : msg from PARENT:', {
                    source: ev.source,  // https://swarm.now/%EC%9B%83uzer-1/dev-1 (Parent)
                    origin: ev.origin,  // "https://swarm.now"
                    target: ev.target,  // https://swarm.now/%EC%9B%83uzer-1/dev-3 (This iframe)
                    data: ev.data,
                })
                // Send message : source to origin
                //ev.source.postMessage(message(), ev.origin)
            }, false)

        })
    })//()
    ;(() => {})//()

})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
)
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
//  js-cookie v2.2.1
//  https://github.com/js-cookie/js-cookie/releases
//  https://github.com/js-cookie/js-cookie#basic-usage
/**
    MIT License

    Copyright (c) 2018 Copyright 2018 Klaus Hartl, Fagner Brack, GitHub Contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */
!function(a){var b;if("function"==typeof define&&define.amd&&(define(a),b=!0),"object"==typeof exports&&(module.exports=a(),b=!0),!b){var c=window.Cookies,d=window.Cookies=a();d.noConflict=function(){return window.Cookies=c,d}}}(function(){function a(){for(var a=0,b={};a<arguments.length;a++){var c=arguments[a];for(var d in c)b[d]=c[d]}return b}function b(a){return a.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}function c(d){function e(){}function f(b,c,f){if("undefined"!=typeof document){f=a({path:"/"},e.defaults,f),"number"==typeof f.expires&&(f.expires=new Date(1*new Date+864e5*f.expires)),f.expires=f.expires?f.expires.toUTCString():"";try{var g=JSON.stringify(c);/^[\{\[]/.test(g)&&(c=g)}catch(j){}c=d.write?d.write(c,b):encodeURIComponent(c+"").replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),b=encodeURIComponent(b+"").replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var h="";for(var i in f)f[i]&&(h+="; "+i,!0!==f[i]&&(h+="="+f[i].split(";")[0]));return document.cookie=b+"="+c+h}}function g(a,c){if("undefined"!=typeof document){for(var e={},f=document.cookie?document.cookie.split("; "):[],g=0;g<f.length;g++){var h=f[g].split("="),i=h.slice(1).join("=");c||'"'!==i.charAt(0)||(i=i.slice(1,-1));try{var j=b(h[0]);if(i=(d.read||d)(i,j)||b(i),c)try{i=JSON.parse(i)}catch(k){}if(e[j]=i,a===j)break}catch(k){}}return a?e[a]:e}}return e.set=f,e.get=function(a){return g(a,!1)},e.getJSON=function(a){return g(a,!0)},e.remove=function(b,c){f(b,"",a(c,{expires:-1}))},e.defaults={},e.withConverter=c,e}return c(function(){})});/** 
    The `Cookies` object of 'js.cookies' stores values as URL-encoded strings under a string key; set(k,v), and URL-decodes on `get(k)`. Our wrapper, `o.Cookies` object, validates on `set()` and `del()`, and returns POJO on `get()`; normalizing the API to that of our synchronous storage API. 

    However, cookies are browser-limited to about 4096 KB per key. 
    TODO: Extend this synthetically for our app by internally segregating AJAX return objects into their subkeys, and the `messages` key further into its constituent array element objects. Storing and retreiving transparently as one object.
 */


;(function(o, undefined){
    'use-strict'
    // Wrap js.cookies API (document.cookie) 
    // =====================================
    /** Proxy of `document.cookie` to abide one API 
    *   handling all synchronous client storage APIs.
    *   FEATUREs:
    *       - Stringify on set iif apropos.
    *       - Return POJO on get; parse iif apropos. 
    *       - Validate on set; return boolean 
    *       - Validate on del; return array of (valid) keys deleted.
    */
    // TODO: Replace JSON.parse() with DOMParser to handle JSON|HTML|SVG.
    if (typeof Cookies === 'undefined') return false

    // Pull window.Cookies into app namespace, setting the global to undefined.
    // https://github.com/js-cookie/js-cookie#namespace-conflicts
    const CookiesJS = Cookies.noConflict()

    const srcID = 'cookies'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,_expires = 3               // Days 
        ,_path = '/'
        ,_domain = o.cfg.net.domain // undefined triggers HostOnly (per browser policy)
        ,_sameSite = 'strict'       // No CORS
        ,_secure = o.cfg.auth.TLS   // HTTPS only.
    o.Cookies = {}

    o.Cookies.set = (k, o, 
        expires = _expires, 
        path = _path, 
        domain = _domain, 
        sameSite = _sameSite, 
        secure = _secure 
    ) => {
        if (k === '') return false
        if (typeof k !== 'string') return false
        if (typeof o === 'undefined') return false

        // WTF happening @ api.js ??? SIZE limit; 2550 okay; 2753 FAILs
        if (typeof o !== 'string') o = JSON.stringify(o) // Not necessary ? Works sans @ Firefox.
        //log(o.length) // 2550 okay; 2753 FAILs
        // Units of `<string>.length` are UTF-16 (ES6), 
        // which is a VARIABLE-LENGTH encoding scheme.
        // Cookie limit (per cookie) is per browser, but ~ 4096 bytes. 
    
        CookiesJS.set(k, o, { 
            expires: expires, 
            path: path, 
            domain: domain, 
            sameSite: sameSite,
            secure: secure
        })
        return CookiesJS.get(k) ? true : false 
    }

    o.Cookies.get = (k) => { // all if sans k
        const x = CookiesJS.get(k)
        var v 
        // Handle both string (ANY) and stringified JSON (e.g., AJAX payload).
        if (typeof x === 'string') {
            try {v = JSON.parse(x)} 
            catch(e) {v = x}
        } else {
            v = {}
            if (typeof x === 'object') {
                Object.keys(x).map(key=> {
                    try { v[key] = JSON.parse(x[key]) }
                    catch(e) { v[key] = x[key] }
                })
            }
            if (Object.keys(v).length === 0) v = false 
        }
        return v // undefined iif key not exist or natively.
    }
    o.Cookies.keys = () => Object.keys(CookiesJS.get())

    o.Cookies.del = (...keys) => { // all if sans keys
        if (typeof keys[0] === 'undefined') keys = []
        const validKeysRemoved = []
        keys = keys.length ? keys : Object.keys(CookiesJS.get())
        ;[...keys].map(k => {
            if (CookiesJS.get(k)) validKeysRemoved.push(k) 
            CookiesJS.remove(k, { 
                path: _path, 
                domain: _domain,
                secure: _secure, 
                sameSite: _sameSite
            })//... MUST use SAME ATTRIBUTES as when set.
        })
       return validKeysRemoved
    }

})( window[__APP__] = window[__APP__] || {} ) 
;(function (o, undefined) {
    "use strict"

    if (typeof localStorage === 'undefined') return false
    if (typeof sessionStorage === 'undefined') return false

    // Pull open-source functions into app namespace ...

    // json-stringify-safe
    // https://github.com/moll/json-stringify-safe
    /**
        The ISC License

        Copyright (c) Isaac Z. Schlueter and Contributors

        Permission to use, copy, modify, and/or distribute this software for any
        purpose with or without fee is hereby granted, provided that the above
        copyright notice and this permission notice appear in all copies.

        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
        WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
        MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
        ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
        WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
        ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
        IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
    */
    function stringify(obj, replacer, spaces, cycleReplacer) {
        return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
    }
    function serializer(replacer, cycleReplacer) {
        var stack = [],
            keys = []

        if (cycleReplacer == null) cycleReplacer = function (key, value) {
            if (stack[0] === value) return "[Circular ~]"
            return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
        }

        return function (key, value) {
            if (stack.length > 0) {
                var thisPos = stack.indexOf(this);
                (~thisPos) ? stack.splice(thisPos + 1): stack.push(this);
                (~thisPos) ? keys.splice(thisPos, Infinity, key): keys.push(key)
                if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
            } else stack.push(value)

            return replacer == null ? value : replacer.call(this, key, value)
        }
    }

    /*********************************************************************
     * Storage module wraps storage APIs (localStorage, sessionStorage).
     * It proxies localStorage API to fit into the app's one Store API.
     * 
     * FEATUREs:
     *  - Stringify on set IIF apropos.
     *  - Return POJO on get; parse IIF apropos. 
     *  - Validate on set; return boolean 
     *  - Validate on del; return array of (valid) keys deleted.
     ********************************************************************/
    // TODO: Replace JSON.parse() with DOMParser to handle JSON|HTML|SVG.
    const  srcID = 'storage'
        //,log = (arg, ...args) => console.log(arg, ...args)
        //,logErr = (arg, ...args) => console.log(arg, ...args)
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,isObject = o.isObject
        ,isArray = o.isArray
    
    const setObj = (k, o) => {
        if (k === '') return false
        if (typeof k !== 'string') return false
        if (typeof o === 'undefined') return false

        //if (isObject(o) || isArray(o)) o = JSON.stringify(o)
        //... FAILs @ `TypeError: "cyclic object value"`, @ api :: deNormalize()
        //if (isObject(o) || isArray(o)) o = stringify(o) 
        o = stringify(o) 
        // ... json-stringify-safe (ISC LICENSE)
        //if (isObject(o) || isArray(o)) o = JSON.stringify(JSON.decycle(o)) 
        // ... cycle.js (PUBLIC)
        localStorage.setItem(k, o)
        const success = localStorage.getItem(k)
        return success ? true : false
    }

    const getObj = (k) => {
        if (!k) return getAll()
        var v = localStorage.getItem(k),
            x // Handle both string (ANY) and stringified JSON (e.g., AJAX payload).
        try {
            x = JSON.parse(v)
            //x = JSON.retrocycle(JSON.parse(v))
        } // TODO: JSON|HTML|SVG (per DOMParser).
        catch (e) {logErr('@ getObj :: k:',k,'v:',v, e)}
        if (v === null && x === null) v = undefined // bogus key
        return v = x ? x : v //|| undefined // undefined IIF key not exist
    }
    const getAll = () => { // Returns all as POJO.
        var stored = {}
        for (var i = 0; i < localStorage.length; i++) {
            stored[localStorage.key(i)] = getObj(localStorage.key(i))
        }
        return stored
    }

    // Hereby, set/get handle all (value) data types, incl. AJAX payloads.
    // All stored as string:string (k:v) pairs; parsed as apropos to POJO on get.
    o.Storage = {}
    o.Storage.set = setObj
    o.Storage.get = getObj

    o.Storage.keys = () => {
        const keys = []
        for (var i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i))
        }
        return keys
    }

    // Takes key or keys (CSV); returns array of (valid) keys removed.
    o.Storage.del = (...keys) => { // Remove all if `keys` undefined.
        if (typeof keys[0] === 'undefined') keys = []
        const validKeysRemoved = []
        keys.length ? keys : keys = o.Storage.keys()
        keys.map((k) => {
            if (localStorage.getItem(k)) validKeysRemoved.push(k)
            localStorage.removeItem(k)
        })
        return validKeysRemoved
    }

    // Delete all data in Storage (local + session).
    o.Storage.clear = () => localStorage.clear() || sessionStorage.clear() || true

    //})( window.$ = window.$ || {} )
})(window[__APP__] = window[__APP__] || {})


// cycle.js
// https://github.com/douglascrockford/JSON-js
/*
    cycle.js
    2018-05-15
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

// The file uses the WeakMap feature of ES6.

/*jslint eval */

/*property
    $ref, decycle, forEach, get, indexOf, isArray, keys, length, push,
    retrocycle, set, stringify, test
*/

if (typeof JSON.decycle !== "function") {
    JSON.decycle = function decycle(object, replacer) {
        "use strict";

// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form

//      {"$ref": PATH}

// where the PATH is a JSONPath string that locates the first occurance.

// So,

//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));

// produces the string '[{"$ref":"$"}]'.

// If a replacer function is provided, then it will be called for each value.
// A replacer function receives a value and returns a replacement value.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child element or
// property.

        var objects = new WeakMap();     // object to path mappings

        return (function derez(value, path) {

// The derez function recurses through the object, producing the deep copy.

            var old_path;   // The path of an earlier occurance of value
            var nu;         // The new object or array

// If a replacer function was provided, then call it to get a replacement value.

            if (replacer !== undefined) {
                value = replacer(value);
            }

// typeof null === "object", so go on if this value is really an object but not
// one of the weird builtin objects.

            if (
                typeof value === "object"
                && value !== null
                && !(value instanceof Boolean)
                && !(value instanceof Date)
                && !(value instanceof Number)
                && !(value instanceof RegExp)
                && !(value instanceof String)
            ) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a {"$ref":PATH} object. This uses an
// ES6 WeakMap.

                old_path = objects.get(value);
                if (old_path !== undefined) {
                    return {$ref: old_path};
                }

// Otherwise, accumulate the unique value and its path.

                objects.set(value, path);

// If it is an array, replicate the array.

                if (Array.isArray(value)) {
                    nu = [];
                    value.forEach(function (element, i) {
                        nu[i] = derez(element, path + "[" + i + "]");
                    });
                } else {

// If it is an object, replicate the object.

                    nu = {};
                    Object.keys(value).forEach(function (name) {
                        nu[name] = derez(
                            value[name],
                            path + "[" + JSON.stringify(name) + "]"
                        );
                    });
                }
                return nu;
            }
            return value;
        }(object, "$"));
    };
}


if (typeof JSON.retrocycle !== "function") {
    JSON.retrocycle = function retrocycle($) {
        "use strict";

// Restore an object that was reduced by decycle. Members whose values are
// objects of the form
//      {$ref: PATH}
// are replaced with references to the value found by the PATH. This will
// restore cycles. The object will be mutated.

// The eval function is used to locate the values described by a PATH. The
// root object is kept in a $ variable. A regular expression is used to
// assure that the PATH is extremely well formed. The regexp contains nested
// * quantifiers. That has been known to have extremely bad performance
// problems on some browsers for very long strings. A PATH is expected to be
// reasonably short. A PATH is allowed to belong to a very restricted subset of
// Goessner's JSONPath.

// So,
//      var s = '[{"$ref":"$"}]';
//      return JSON.retrocycle(JSON.parse(s));
// produces an array containing a single element which is the array itself.

        var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

        (function rez(value) {

// The rez function walks recursively through the object looking for $ref
// properties. When it finds one that has a value that is a path, then it
// replaces the $ref object with a reference to the value that is found by
// the path.

            if (value && typeof value === "object") {
                if (Array.isArray(value)) {
                    value.forEach(function (element, i) {
                        if (typeof element === "object" && element !== null) {
                            var path = element.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(element);
                            }
                        }
                    });
                } else {
                    Object.keys(value).forEach(function (name) {
                        var item = value[name];
                        if (typeof item === "object" && item !== null) {
                            var path = item.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[name] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    });
                }
            }
        }($));
        return $;
    };
}//  idb-keyval-iife.js v3.2.0
//  https://github.com/jakearchibald/idb-keyval/releases/tag/v3.2.0  
/** 
    Copyright 2016, Jake Archibald

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
var idbKeyval = (function (exports) {
'use strict';

class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store._withIDBStore('readonly', store => {
        req = store.get(key);
    }).then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store._withIDBStore('readonly', store => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(() => keys);
}

exports.Store = Store;
exports.get = get;
exports.set = set;
exports.del = del;
exports.clear = clear;
exports.keys = keys;

return exports;

}({}));
;(function (o, undefined) {
    'use strict'
    /**************************************************************************
     *  Proxy of IndexedDB to abide one API for all async storage APIs.
     *  Wraps idb-keyval API, which wraps IndexedDB API.
     *
     *  REQUIREs: idb-keyval-iife.js : idbKeyval. 
     * 
     *  FEATUREs:
     *  - Return POJO on get; parse IIF apropos.
     *  - Validate on set; return boolean.
    ***************************************************************************/
    if (!window.indexedDB) return false 
    if (typeof idbKeyval   === 'undefined') return false

    // Pull window.idbKeyval into app namespace; set the global to undefined.
    const _IDB = window.idbKeyval 
    window.idbKeyval = undefined

    const srcID = 'idb'
        //,log = (arg, ...args) => console.log(arg, ...args)
        //,logErr = (arg, ...args) => console.log(arg, ...args)
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        //,idb = _IDB // per 'idb-keyval-iife.js'
        ,idb = _IDB // per 'idb-keyval-iife.js'

        ,idbx = (store) => {
            const aParse = (x) => { 
                // Parse `x` to POJO if JSON-string, else return (promise of) `x` unchanged.
                if (typeof x !== 'string') return Promise.resolve(x)
                try      {return Promise.resolve(JSON.parse(x))}
                catch(e) {return Promise.resolve(x)}
            } //... presume no malformed JSON input.
    
            return {
                keys: () => idb.keys(store)

                // Return (promise of) VALUE if k, else ARRAY of all stored k-v pairs; val(s) parsed IIF apropos.
                ,get: (k) => { 
                    if (k)  return idb.get(k, store).then(aParse)
                    if (!k) return o.IDB.getA()
                },

                // Return (promise of) VALUE if k, else ARRAY of all stored k-v pairs; val(s) parsed IIF apropos.
                getA: (k) => { 
                    if (k)  return idb.get(k, store).then(aParse)
                    if (!k) return idb.keys(store).then(keys =>{
                        return _PromiseArray(keys) // ... array of all stored k-v pair objects.
                    })
                },

                // Return (promise of) VALUE if k, else OBJECT of all stored k-v pairs; val(s) parsed IIF apropos.
                getO: (k) => { 
                    // Returns array (of promises) of all stored k-v pairs; val(s) parsed IIF apropos.
                    const _PromiseArray = (keys) => {
                        return Promise.all(
                            keys.map(k => 
                                idb.get(k, store)
                                    .then(aParse)
                                    .catch(err => logErr('@ get0', err))
                                )
                        )
                    }
                    if (k)  return idb.get(k, store).then(aParse)
                    if (!k) return idb.keys(store).then(keys =>{
                        return _PromiseArray(keys)
                                .then(a => a.map((v,i) => {
                                        return {[keys[i]]: v}
                                    })
                                )
                    }).then(a => a.reduce((stored, o) => {
                                const k = Object.keys(o)[0] 
                                stored[k] = o[k]
                                return stored 
                            }, {})
                        )
                },

                set: (k, v) => { // Validates.
                    if (!k) return Promise.resolve(false)
                    //logErr(k,v)
                    v = JSON.stringify(v) //... hack to solve ...
                    // DOMException: Failed to execute 'put' on 'IDBObjectStore': Request object could not be cloned.
                    return idb.set(k, v, store)
                            .then(()=>idb.get(k, store))
                            .then(vGot => vGot ? true : false)
                            .catch(err => logErr('@ set', err))
                },
            
                del: (k) => { // NO validation.
                    k ? idb.del(k, store) : idb.clear(store)
                    return Promise.resolve(true)
                } 
            }
        }

        o.IDB = (name = 's') => {
            const new1 = new idb.Store(`db-${name}`, `store-${name}`)
            return idbx(new1)
        }

//})( window.$ = window.$ || {} )
})( window[__APP__] = window[__APP__] || {} )

;(function(o, undefined){
    'use strict'
    /****************************************************************
     * o.Store(..) exposes the application storage API. 
     * By default, it self-configures to best available per client.
     * It creates an app-wide singleton per namespace.
     * I.e., each named-store invocation, o.Store('foo', ...), 
     * points to one (the first invoked) app-wide Store object
     * accessible thereafter from any module, by o.Store('foo').
     * 
     * Key collisions can occur at certain shared facilities,
     * e.g, idb stores are namespaced, yet cookie stores are not.
     * 
     * Internally, Store utilizes wrappers that normalize 
     * the native (or elsewhere wrapped) APIs into one 
     * common API per (a)synchrony. 
     * 
     * RETURN:
     * 
     *  {
     *      name: <NAMESPACE>
     *      api: 'none'|'cookie'|'storage'|'idb'|'sql'|'cache'
     *      set: set(k,v)
     *      get: get(k)
     *      del: del(k)
     *      keys: keys()
     *  }
     *
     * FEATURES:
     * 
     *  - Stringify on set if apropos.
     *  - Return POJO on get; parse if apropos. 
     *  - Validate on set; return boolean 
     *  - Validate on del; return array of keys (valid) deleted.
     *
     * USAGE:
     * 
     *  const state = o.Store('foo', 'cookie,idb')
     *  
     *  - Allowed-APIs list applies only to 1st 'foo' invocation.
     *  - Sans args, o.Store(), returns 'state' store 
     *    utilizing client's best avilable storage facility.
     ***************************************************************/
    const srcID = 'Store'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,clone = o.clone

    // Expose 
    o.Store = (() => {
        // Define and return a namespaced singleton,
        // given its list of acceptable client-storage facilities.
        const init = (storeName, ...apis) => {
            const 
                allAPIs = 'none,cookie,storage,idb,sql,cache'.split(',')
                ,stores = { 
                    /****************************************************
                     * Client-storage APIs (proxy/wrapper)
                     * 
                     * Validate per facility;
                     * return the normalized API if valid, else false.
                     ***************************************************/
        
                    // ====================
                    // ===  SYNCH APIs  ===
                    // ====================
                    none: () => { //return false
                        const nstor = {}
                        // ,parse = (x) => {
                        //     if (typeof x !== 'string') return x
                        //     try {return JSON.parse(x)} // TODO: +DOMParser
                        //     catch(e) {return {data: x, err: e}}
                        // }
                        // ,clone = o => parse(JSON.stringify(o))  
        
                        return { // TODO: handle parse IIF apropos.
                            api: 'none',
                            set: (k, v) => (typeof k === 'string') && (nstor[k] = clone(v)),
                            get: (k)    => k ? clone(nstor[k]) : clone(nstor),
                            del: (...k) => [...k].map(k => delete nstor[k]),
                            keys: () => Object.keys(nstor)
                        }
                    }
                    ,cookie: () => { //return false
                        if (typeof o.Cookies === 'undefined') return false
                        o.Cookies.set('validate', '1')
                        if (typeof o.Cookies.get('validate') === 'undefined') return false 
                        o.Cookies.del('validate')
                        //... Triggers browser `SameSite` parameter check; logs a bogus warning: 
                        //... 'Some cookies are misusing the recommended “SameSite“ attribute'.
        
                        return {
                            api: 'cookie',
                            set: (k, v) => o.Cookies.set(k, v),
                            get: (k)    => o.Cookies.get(k),
                            del: (...k) => o.Cookies.del(...k),
                            keys: () => o.Cookies.keys()
                        }
                    }
                    ,storage: () => { //return false
                        if (typeof o.Storage === 'undefined') return false
                        o.Storage.set('validate', 1)
                        if (typeof o.Storage.get('validate') === 'undefined') return false 
                        o.Storage.del('validate')
        
                        return {
                            api: 'storage',
                            set: (k, v) => o.Storage.set(k, v),
                            get: (k)    => o.Storage.get(k),
                            del: (...k) => o.Storage.del(...k),
                            keys: () => o.Storage.keys()
                        }
                    } 
                    // =====================
                    // ===  ASYNCH APIs  ===
                    // =====================
                    ,idb: () => { //return false
                        if (typeof o.IDB === 'undefined') return false
                        const idb = o.IDB(storeName)
        
                        return {
                            api: 'idb',
                            set: (k, v) => idb.set(k, v),
                            get: (k)    => idb.getO(k),
                            del: (k)    => idb.del(k),
                            keys: ()    => idb.keys()
                        }
                    }  
                    ,sql: () => {
                        return false
                    }   
                    ,cache: () => {
                        return false
                    }   
                }

            /*****************************************************************
             * Return best store facility available (validated per `stores`),
             * either from those of the reference list passed in, 
             * or from default list of all such Web APIs.
             ****************************************************************/
            return ((apis) => {
                apis = apis.length ? apis : allAPIs
                const 
                    api = apis[apis.length-1]
                    ,_isValid = (api) => stores[api]()

                var best = undefined
                ;(stores.hasOwnProperty(api) && _isValid(api)) 
                    && (best = _isValid(api))
                    || apis.map((xAPI) => (stores.hasOwnProperty(xAPI))
                            && (_isValid(xAPI) !== false) 
                                && (best = _isValid(xAPI))
                    )
    
                const 
                    m = {}
                    ,_store = best || stores['none']()
    
                _store.name = storeName
    
                // mode (property) is the store facility's synchrony
                o.toContextIndexed(allAPIs.join(), m)
                ;(m[_store.api.toUpperCase()] < m['IDB'])
                    ? (_store.mode = 'synch') 
                    : (_store.mode = 'async')
    
                return _store 
    
            })(apis)
        }
        // Keep (first and only) invocation of init(ns, ...) per namespace; ss[ns] .
        const ss = {}

        // Return a function that returns the namespaced singleton.
        return function (ns = 'state', ...apis) {
            // Return namespaced singleton if exist, else create and return it.
            return ss[ns] ? ss[ns] : (ss[ns] = init(ns, ...apis))
        }
    })()

    // ==================
    // ===  DEV/TEST  ===
    // ==================

    logDeb(o.log.debugOFF)
    ;(()=>{
        logDeb('@ TEST ::', o.Store('auth', 'storage', 'idb'))

        const store = o.Store()
        logDeb(o.log.debugOFF)
        logDeb('api >', store.api, store.mode)
        ;(store.mode === 'synch') 
            ? logDeb('get() >', store.get()) 
            : store.get().then((x) => logDeb('get() >', x))
    })//()

    function testStore() {
        const log = o.log(srcID, o.log.levels.DEBUG) 
            ,{ // Destructure
                set,
                get,
                del,
                keys,
                api,
                foo
            } = store,
            j = [{
                a: 1,
                b: 2
            }, {
                c: 'foo',
                d: 'bar'
            }]

        
        ;(store.mode === 'synch')
            ? testSynch()
            : testAsync()

        function testAsync() {             
            (() => { 
                //del().then(rtn => log('del():', rtn))
                set('obj1',j).then(rtn =>log('set(obj1,j):', rtn))
                get().then(rtn =>log('get():', rtn)) // Array of the objects
                get('obj1').then(rtn =>log('get(obj1):', rtn))
                //get()['obj1'].then(rtn =>log('get()[obj1]', rtn))
                set('bogus').then(rtn =>log('set(bogus):', rtn))
                get('bogus').then(rtn =>log('get(bogus):', rtn))
                del('bogus').then(rtn =>log('del(bogus):', rtn))

                //set('obj2',j).then(rtn =>log('set(obj2,j):', rtn))
                set('obj2','{ ☧ &x2627;;; \\\/ 웃 &#xc6c3; / Oops! ™ ,,,')
                //set('obj2',"foo")
                //set('obj2',{x:'{ ☧ &x2627;;; \\\/ 웃 &#xc6c3; / Oops! ™ ,,,'})
                    .then(rtn =>log('set obj2 ::', rtn))
                    .catch(logErr)

                keys().then(rtn=>log('keys()', rtn))
                get().then(rtn =>log('get():', rtn))
                del('obj1').then(rtn => log('del(obj1):', rtn))
                keys().then(rtn=>log('keys()', rtn))
                //del().then(rtn => log('del():', rtn))
            })()

            ;(() => { 
                // Unlike SYNCH API, must parse on get if data is stringified:
                const s = "[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"
                set('s', s)
                //get().then(rtn => log('get()', rtn))

                // Schedule the delete relative to the get ...
                const wait = 90 // minimum, else del() happens before get()
                    ,aScheduleDel = o.aSchedulerP(wait+5, del) 
                    // ... 90 to let all of the above happen
                    ,aScheduleGet = o.aSchedulerP(wait, get)
                    // ... get() 2ms before del()

                aScheduleDel().then(x =>log(aScheduleDel.fn, x))
                aScheduleGet().then(x =>log(aScheduleGet.fn, x))

                //o.aDelay(900,del)
                //o.aDelay(1,get)
                //set('obj2',j).then(rtn =>log('set(obj2,j):', rtn))
                //get('obj1').then(rtn =>log('get(obj1):', rtn))
                //get('bogus').then(rtn =>log('get(bogus):', rtn))
            })//()
        }

        function testSynch() { 
            console.groupCollapsed('===  set/get/del/get  ===')
            log('set obj1 ::', set('obj1',j))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get()) // Object of the objects
            log('get bogus ::', get('bogus'))
            log('del bogus ::', del('bogus'))
            log('del obj1 ::', del('obj1'))
            log('get obj1 ::', get('obj1'))

            console.groupEnd()
            
            console.groupCollapsed('===  set/get/keys  ===')
            log('set obj1 ::', set('obj1',j))
            log('set bad key ::', set({},'key is obj; not allowed per Storage API'))
            log('set obj2 ::', set('obj2','{ ☧ &x2627;;; \\\/ 웃 &#xc6c3; / Oops! ™ ,,,'))
            log('get(\'obj2\') ::', get('obj2'))
            log('get()[\'obj2\'] ::', get()['obj2'])
            log('get() ::', get())
            log('keys() ::', keys())


            console.groupEnd()

            //log('=== set/get @ a pre-stringified object ::',"\n",' "[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"')
            console.groupCollapsed('=== set/get @ a pre-stringified object ::',"\n", '"[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"')

            log('set objX', set('objX',"[{\"foo\":42,\"bar\":[1,2]},{\"foo\":\"too\",\"bar\":{\"a\":1,\"b\":2}}]"))
            log('get objX ::', get('objX')) 
            console.groupEnd()

            console.groupCollapsed('===  del(obj1, bogus, obj2)  ===')
            log('get() ::', get())
            log('del(obj1, bogus, obj2) ::', del('obj1', 'bogus', 'obj2'))
            //log('del() ::', del())
            log('get() ::', get())
            del()
            console.groupEnd()

            console.groupCollapsed('===  set()/get()  ===')
            log('del() ::', del())
            log('set() ::', set())
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',"")/get()  ===')
            log('set(\'obj1\',"") ::', set('obj1',""))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',{})/get()  ===')
            log('set(\'obj1\', {}) ::', set('obj1',{}))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',[])/get()  ===')
            log('set(\'obj1\', []) ::', set('obj1',[]))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()

            console.groupCollapsed('===  set(\'obj1\',)/get()  ===')
            log('set(\'obj1\',) ::', set('obj1'))
            log('get(\'obj1\') ::', get('obj1'))
            log('get()[\'obj1\'] ::', get()['obj1'])
            log('get() ::', get())
            log('del(obj1) ::', del('obj1'))
            log('get() ::', get())
            console.groupEnd()
        }

        // @ Cookies        // See api.js
        //log('set',set('data',{a:1,b:2}))
        //j.messages = j.messages.slice(0,8) // limit < 2753 (UTF-16 Units)

        // ;(api === 'idb') // See api.js
        //     ? (
        //         set('data', j).then(x => log('set @',api, '::', x))
        //         ,get('data', j).then(x => log('get @',api, '::', x))
        //     )
        //     : (
        //         log('set @',api, '::', set('data', j))
        //         ,log('get @',api, '::', get('data', j))            
        //     )
    }

})( window[__APP__] = window[__APP__] || {} )
;(function(o, undefined){
    'use strict'
    /***********************************************************************
     * o.AuthStore(..) is the token store for:
     * `Authentication: Bearer <TOKEN>`.
     * 
     * It is a namespaced, limited-APIs invocation of o.Store(..).
     * Its facilities of mixed synchrony are normalized to one async API.
     * Nominally, its storage facility is Indexed DB; 
     * Local Storage is fallback.
     **********************************************************************/
    const srcID = 'AuthStore'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,_store = () => {
            const x = o.Store('auth', 'storage', 'idb')
            switch (x.mode) {
                case 'synch':
                    return {
                        mode: x.mode,
                        api: x.api,
                        set: (k,v)  => Promise.resolve(x.set(k, v)),
                        get: (k)    => Promise.resolve(x.get(k)),
                        del: (...k) => Promise.resolve(x.del(...k)),
                        keys: ()    => Promise.resolve(x.keys())
                    }
                case 'async':
                    return x
                }
        }

    o.AuthStore = () => _store() //o.Store('auth', 'storage', 'idb')

})( window[__APP__] = window[__APP__] || {} )
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
;(function(o, undefined){
    'use strict'
    /**************************************************************************
     * Auth module provides methods to handle authentication and
     * authorization; to store and access bearer tokens, 
     * to handle auth-protected API endpoint requests, 
     * and to unobtrusively refresh the access token 
     * whenever apropos.
     * 
     * The Auth/AuthStore is orthogonal to State/Store.
     * Its only role in the Actions/State/View loop
     * is when acquiring tokens. Thereafter, 
     * State/View reference the `auth` key of state/store
     * for authentication/authorization status.
     * 
     * The application implements a stateless security scheme. 
     * The Auth/OAuth service (AOA) handles client authentication 
     * for all services of the app; currently API and PWA services. 
     * Authenticated clients are issued Access and Refresh tokens. 
     * Protected endpoints are acessed per request header: 
     * `Authorization: Bearer <ACCESS_TOKEN>`.  
     * Additionally, each token is paired to a secure (TLS), http-only, 
     * domain-locked reference cookie, thereby tethering the Refresh token 
     * to the client whose successful authentication (login) acquired it. 
     * Such token-cookie pairs affect a kind of proxy for 
     * authentication (Refresh) and authorization (Access).
     * 
     * Moreover, validation dynamics do not require clients to store 
     * the tokens themselves in cookies, so tokens needn't be sent with 
     * requests unnecessarily, thereby improving security and 
     * reducing traffic. Conversely, requests to protected endpoints 
     * are validated sans reference-cookie processing, 
     * nominally; only upon Access-token expiry or during a 
     * refresh request are the cookies considered. 
     * 
     * Further, the max-secured reference cookie 
     * paired to the long-lived (Refresh) token contains the source 
     * from which the token's claims issuer (a hash) is generated. 
     * A mismatch triggers `HTTP 401 Unauthorized` response, 
     * thus mitigating entire categories of attacks against bearer tokens. 
     * 
     * This scheme also lowers the nominal (sans auth) request-headers size 
     * down to about 500 bytes, and that of protected-endpoint requests 
     * to that plus that of one token. 
     * As a final note, the scheme allows for updating (refreshing) 
     * the refresh-token's issuer claim (a)periodically, 
     * further tightening security.
     * 
     * Security Model regarding token-cookie pairs: 
     *      Tokens are visible to attacker, 
     *      but secure, http-only, domain-locked cookies are not.
     *      Exploiting that, the refresh token's issuer claim (iss) 
     *      is a hash of its paired-cookie value. 
     *      So, even having the token, the attacker remains 
     *      unable to recreate the required cookie value.
     *      Valiation fails when the hash of the cookie's value
     *      fails to match the token's iss-claim value.
     *************************************************************************/
    const srcID = 'Auth'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus = o.log(srcID, o.log.levels.FOCUS)
        ,logWarn = o.log(srcID, o.log.levels.WARN)
        ,debugOFF = o.log.debugOFF // '' | o.log.debugOff 

        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,authStore = o.AuthStore() 
        ,state = o.State()
        ,{
            UTCtoSec,
            nowUTC,
            time2UTC,
            parseJWT,
            sha512,
            rand,
            isString,
            xor,
            rev,
            base64Encode,
            aFetch,
            aDelay,
            ttl,
            urlAOA,
            urlAPI,
            urlPWA,
        } = o

        /*********************************************************
         * Low level
         ********************************************************/

        /****************************************************************************** 
         * Auth mode (obfuscate) declaration affects only Basic Auth request (BA|OB).
         * The mode stored (auth status) is set per authTkns response-body key(s),
         * declaring the actual mode (and provider, if per OAuth) 
         * by which the AOA service authenicated.
        ******************************************************************************/
        ,obfuscate = o.cfg.auth.obfuscate
        ,modesCSRF = o.cfg.auth.modesCSRF

        ,keyA    = o.cfg.auth.keyTknAccess
        ,keyR    = o.cfg.auth.keyTknRefresh
        ,keyOA   = o.cfg.auth.keyOA
        ,keyCSRF = o.cfg.auth.keyCSRF

        ,keyNa = '_na' // Server-generated nonce cookie key
        ,keyNb = '_nb' // Server-generated fallback-nonce cookie key
        ,keyNc = '_nc' // Conditionally client-generated nonce cookie key; overrides `_nb` if set.

        ,cookieDel = (...k) => o.Cookies.del(...k)
        ,cookieGet = (k)    => o.Cookies.get(k)
        ,cookieSet = (k, v, days) => o.Cookies.set(k, v, days = 1)

        // Process a parsed token 

        ,isValid = (parsed) => (parsed.payload) && (ttl(parsed.payload.exp) > 0)
        ,jwtSansSig = (parsed) => (parsed.payload) ? ({
            type: parsed.payload.tokenType, 
            exp: parsed.payload.exp, 
            expUTC: time2UTC(parsed.payload.exp), 
            TTL: ttl(parsed.payload.exp),
            header: parsed.header, 
            payload: parsed.payload
         }) : false

        // Process a raw token 
        
        ,validateParse = (tkn) => isValid(parseJWT(tkn)) ? tkn : false
        ,parseValid = (tkn) => {
            const parsed = parseJWT(tkn)
            return isValid(parsed) ? parsed : false
        }
        ,ttlDecode = (tkn) => {
            const x = parseJWT(tkn)
            return (x && x.payload && x.payload.exp) 
                        ? ttl(x.payload.exp) : 0
        }
        ,subDecode = (tkn) => {
            const jwt = parseJWT(tkn)
            return jwt ? jwt.payload.sub : false
        }

        // AuthStore : Get/Set/Delete token per key, else false.

        ,tknSet = (key, val) => authStore.set(key, val)
        ,tknGet  = (key) => authStore.get(key) 
        ,tknsDel = () => authStore.del()
        ,authDel = tknsDel

        // AuthStore : Get valid token per key, else false.

        ,tknShowValid = key   => tknGet(key).then(parseValid).then(jwtSansSig) 
        ,tknGetValid = key    => tknGet(key).then(validateParse)
        ,tknGetValidSub = key => tknGetValid(key).then(subDecode)
        ,tknGetValidTTL = key => tknGetValid(key).then(ttlDecode) 

        ,isTknValid = (key) => tknGetValid(key).then(is => (is ? true : false))

        // AuthStore : Get/Set status (object at status key)

        /****************************************************************
         * authStatus contains user (sub) record, tokens' sub claim,
         * per-token expiries, auth mode, provider (if per OAuth), 
         * and auth-error flag. 
         ***************************************************************/
        ,authStatus = {
            user: {},                   // Authenticated user's record
            sub: '',                    // Authenticated user's ID (token claim)
            a: {exp: 0, expUTC: ''},    // Access token expiry
            r: {exp: 0, expUTC: ''},    // Refresh token expiry
            mode: '',                   // o.AuthModes.MODE
            provider: '',               // If per OAuth
            err: {a: true, r: true}     // Regarding token get/store
        }
        ,status = 'status'
        ,statusGet = () => authStore.get(status)
        ,statusSet = (as, user) => {
            if (user && (user.user_id !== as.sub)) 
                return Promise.reject({
                    why: 'MISMATCH : as.sub VERSUS user.user_id',
                    what: {as: as, user: user},
                    where: 'statusSet(..)'
                })
            as = (user ? Object.assign(as, {user: user}) : as)
            return authStore.set(status, as).then(ok => ok ? as : false)
        }
        ,statusEnhance = as => {
            //... call only on get; useful only @ debug/log.
            if (typeof as === 'undefined') 
                as = authStatus
            //as.a.TTL = () => ttl(as.a.exp) //... unstorable
            //as.r.TTL = () => ttl(as.r.exp) //... unstorable
            as.a.ttl = `${Math.floor(ttl(as.a.exp)/60)} min ${ttl(as.a.exp)%60} sec`
            as.r.ttl = `${Math.floor(ttl(as.r.exp)/60)} min ${ttl(as.r.exp)%60} sec`
            return as
        }
        /**************************************************
         * statusMake(..) parses a tkns payload,
         * then derives and returns its authStatus object
         *************************************************/
        ,statusMake = (tkns) => {
            if (!tkns) return
            const 
                parsePayload = (rtn) => {
                    return {
                        user: rtn.user
                        ,mode: rtn.mode
                        ,provider: rtn.provider
                        ,err: rtn.err
                        ,a: o.parseJWT(rtn.a)
                        ,r: o.parseJWT(rtn.r) 
                    }
                }
                ,pp = parsePayload(tkns)
                ,a = pp.a ? pp.a.payload : false
                ,r = pp.r ? pp.r.payload : false

                ,match    = (pp.a && pp.r) 
                                && (pp.a.payload.sub === pp.r.payload.sub) 
                                || false

                ,validate = ((pp.a && pp.r) && match) || !(pp.a && pp.r)

                ,exp = x => (x ? x.exp : 0) && ((x.exp > 0) ? x.exp : 0) || 0
                ,expiry = (tkn) => {
                    const t = exp(tkn)
                    return {
                        exp: t
                        ,expUTC: o.time2UTC(t)
                        //,TTL: () => ttl(t) //... see statusEnhance(..)
                    }
                }

            authStatus.a        = expiry(a)
            authStatus.r        = expiry(r)
            authStatus.sub      = (match && pp.r.payload.sub) 
                                    || (!validate && 'MISMATCH') || false
            authStatus.user     = pp.user
            authStatus.mode     = pp.mode
            authStatus.provider = pp.provider
            authStatus.err      = pp.err

            if (!validate) 
                return Promise.reject({
                    why: 'SECURITY WARNING : Tokens "sub" claim MISMATCH',
                    what: {payload: pp, authStatus: authStatus},
                    where: 'statusMake(tkns)'
                })

            if (pp.a && (!pp.r || pp.err.r)) 
                return Promise.reject({
                    why: 'Refresh token : FAIL @ aFetch or AuthStore.',
                    what: {payload: pp, authStatus: authStatus},
                    where: 'statusMake(tkns)'
                })

            if (pp.r && (!pp.a || pp.err.a)) 
                return Promise.reject({
                    why: 'Access token : FAIL @ aFetch or AuthStore.',
                    what: {payload: pp, authStatus: authStatus},
                    where: 'statusMake(tkns)'
                })

            return authStatus
        }
        /**************************************************************
         * statusPub() publishes and returns the authStatus.
         * This should occur per token event (logon and refresh).
         *************************************************************/
        ,statusPub = () => auth.StatusGet()
            .then(as => (eb.pub(eTypes.Auth, as), as)) 

        // AuthStore : store tokens and status

        /************************************************************
         * store(tkns) sets o.AuthStore keys per tokens payload,
         * which may be augmented with an existing authStatus; 
         * updates, publishes and returns the current authStatus, 
         * else rejects on fail. 
         * 
         * This async function is called once per token(s) fetch; 
         * per login and all refresh responses thereafter.
         * 
         * ARGs: {
         *          a:        JWT, 
         *          r:        JWT, 
         *          mode:     o.AuthModes.MODE, 
         *          provider: PROVIDER (if per OAuth),
         *          user: {..}         (optionally)
         *       }
         ***********************************************************/
        ,store = (tkns) => {
            const err = {}
            
            if (!tkns.a || !tkns.r) return Promise.reject({
                why: 'One or both tokens are missing.',
                what: tkns,
                where: 'store(..)'
            })
            return Promise.all([   
                    tknSet(keyA, tkns.a), 
                    tknSet(keyR, tkns.r)
                ])
                .then(okays => okays.map(
                    (ok, i) => ok ? ok : Object.assign(err, ( 
                        (i == 0)
                            ? {a: tkns.a, aTxt: 'Access'}
                            : {r: tkns.r, rTxt: 'Refresh'}
                        ))
                ))
                .then(err => {
                    if (err.rTxt || err.aTxt) 
                        return Promise.reject({
                            why: `${err.aTxt}`+`${(err.rTxt ? ' and '+err.rTxt : '')}`
                                    + ` token(s) : FAILed to store.`, 
                            what: {a: err.a, r: err.r},
                            where: 'store(..)'
                        })

                    tkns.err  = {
                        a: ((err.aTxt) ? true : false), 
                        r: ((err.rTxt) ? true : false)
                    }
                    logDeb('@ store : tokens stored:', tkns)

                    return tkns
                })
                .then(statusMake)
                .then(as => statusSet(as)
                    .then(ok => {
                        if (!ok) return Promise.reject({
                            why: 'authStatus : FAILed to store',
                            what: as,
                            where: 'statusSet(..)'
                        })
                        logDeb('@ store : status stored:', as)

                        return statusPub()
                    })
                )
        }  

        /*******************************************************************
         * High level (+ helpers)
         ******************************************************************/
        /****************************************************
         * purge() deletes entire auth store, 
         * then requests logout from auth service,
         * which deletes the (http-only) token-ref cookies.
         ***************************************************/
        ,purge = () => {
            const
                hdrs = new Headers({
                    //'Authorization': `Bearer ${rTkn}`
                })
                ,init = {
                    method: 'GET',
                    headers: hdrs,
                    credentials: "include" // "same-origin"|"include"
                }//... must send the cookies for service to delete them
                ,url = urlAOA('/a/logout')
                ,req = new Request(url, init)
                ,delAuthCookies = () => aFetch(req).then(logDeb).catch(logErr)

            return authDel().then(delAuthCookies)
        }
         /*****************************************************************
         * Login purges auth, then redirects to PWA-service login page. 
         * This is the lone INTER-SERVICE REDIRECT of Auth module.
         * 
         * TODO: Decouple: publish purge event; let View handle redirect.
         *****************************************************************/
        ,login = () => purge().then(
            () => window.location.href = urlPWA('/app/login')
        )

        // Access token

        /*******************************************************************************
         * Refresh the Access tkn using Refresh tkn and 
         * its paired domain-locked cookie as authorization. 
         * If Refresh tkn is expired, i.e., if no longer authenticated, 
         * then REDIRECT TO lOGIN PAGE; else return Access tkn, else reject on fail.
         *****************************************************************************/
        ,accessRefresh = () => {
            const refresh = (rTkn) => auth.Authorized().then(is => {
                
                // @ Valid Access token
                if (is) return Promise.reject({
                    why: 'Authorized already.', 
                    what: is,
                    where: 'accessRefresh()'
                })

                // @ Valid Refresh tkn AND expired Access tkn.
                // So, use Refresh tkn (and its ref cookie) to refresh Access tkn.
                const 
                    hdrs = new Headers({
                        'Authorization': `Bearer ${rTkn}`
                    })
                    ,params = {
                        method: 'GET',
                        headers: hdrs,
                        credentials: "include" // "same-origin"|"include"
                    }//... creds required to send token-ref cookie. 
                    ,url = urlAOA('/a/refresh')
                    ,req = new Request(url, params)

                    ,refreshHandle = (r) => {
                        /************************************************************
                         * This HTTP 304 means current authorization has TTL, 
                         * so this response code SHOULD NEVER OCCUR here because
                         * authorization failed test just prior to this call.
                         ***********************************************************/
                        if (r.meta.status === 304) 
                            return Promise.reject({
                                why: 'Access token remains valid.', 
                                what: r,
                                where: 'refreshHandle(..)'
                            })
                        /************************************************************
                         * This HTTP 401 means authentication expired,
                         * so this response code SHOULD NEVER OCCUR here because
                         * authentication was validated just prior to this call.
                         ***********************************************************/
                        if (r.meta.status === 401) 
                            return Promise.reject({
                                why: `Authentication expired`, 
                                what: r.meta,
                                where: 'refreshHandle(..)'
                            })
                        /************************************************************
                         * This HTTP 423 (Locked) response occurs 
                         * IIF authorization (Access) is expired, 
                         * AND authentication (Refresh) is valid.
                         * But we test for that prior to this call, 
                         * so this response code SHOULD NEVER OCCUR unless
                         * expiry of cookie differs from that of its paired token.
                         * (AOA service synchronizes the two expiries upon create.)
                         **********************************************************/
                        if (r.meta.status === 423) 
                            return Promise.reject({
                                why: `Access expired; Refresh valid`, 
                                what: r.meta,
                                where: 'refreshHandle(..)'
                            })

                        if (r.meta.status !== 200) 
                            return Promise.reject({
                                why: `Failed fetch.`, 
                                what: r.meta,
                                where: 'refreshHandle(..)'
                            })
                        if (!r.body.a) 
                            return Promise.reject({
                                why: 'Access token NOT received.', 
                                what: r,
                                where: 'refreshHandle(..)'
                            })

                        // @ Successful fetch of refreshed Access token.
                        if (isValid(parseJWT(r.body.a))) {
                            logDeb('Access token is REFRESHed.')
                            // Add the new token and status back to the auth store,
                            // and return the Access token; reject on fail.
                            return auth.StatusGet()
                                    .then(as => {
                                        const tkns = {
                                            a: r.body.a,
                                            r: rTkn, 
                                        }
                                        tkns.mode = as.mode 
                                        tkns.provider = as.provider
                                        tkns.user = as.user
                                        return store(tkns)
                                                .then(() => tkns.a)
                                                .catch(err => Promise.reject(err))
                                    })
                        }

                        // @ Failed fetch of refreshed Access token.
                        logDeb('FAIL @ Access token refresh.')
                        return Promise.reject({
                            why: 'Access token REFRESH FAILED.', 
                            what: r,
                            where: 'refreshHandle(..)'
                        })
                    }

                return aFetch(req).then(refreshHandle)
            })
            // Return Access token (refreshed), 
            // else login (authentication expired).
            return tknGetValid(keyR)
                        .then(rTkn => rTkn ? refresh(rTkn) : login())
        }

        /**********************************************************************
         * Return valid Access token, or false; refresh (fetch) if needed.
         * ********************************************************************/
        ,accessGet = () => 
            tknGetValid(keyA)
                .then(aTkn => aTkn || accessRefresh())
                .catch(err => {
                    logErr(err)
                    return false
                })

        /******************************************************
         * aFetchAuthAPI(..) handles requests 
         * to auth-protected API service endpoints,
         * publishing response status and otherwise 
         * matching aFetch(..) behavior. (See @ base.js .)
         * 
         * - Abides CORS filter. 
         * - Supports CSRF filter modes:
         *      - CustomAJAXHeader
         *      - SourceTargetHeaders
         *      - DomainLockedDouble   (if body.csrf)
         * - Cleans up CSRF residue.
         * 
         * Caller is responsible for handling response.
         * Fetch-API REF: https://javascript.info/fetch-api
         ****************************************************/
        ,aFetchAuthAPI = (verb, path, body = undefined) => {
            return accessGet().then(tkn => {
                const 
                    csrf = rand(15) //... regardless
                    ,hdrs = new Headers({
                        'Authorization': `Bearer ${tkn}`
                        /***************************************************************
                         * X-CSRF-Token abides API's CSRF CustomAJAXHeader mode.
                         * (Unrelated to DomainLockedDouble mode; token @ body & cookie)
                         **************************************************************/ 
                        ,'X-CSRF-Token': csrf
                    })
                    ,url = urlAPI(path)
                    ,init = {
                        method: verb
                        ,headers: hdrs
                        /*************************************************************
                         * Credentials are required only to send CSRF Cookie,
                         * which is sent only if POST body has token (body.csrf);
                         * required thereupon by API's CSRF DomainLockedDouble mode.
                         ************************************************************/
                        ,credentials: (body && body.csrf) ? "include" : "same-origin"
                        /*************************************************************
                         * CALLER is RESPONSIBILE for inserting CSRF token into body.
                         ************************************************************/
                        ,body: body ? JSON.stringify(body) : undefined 
                    }
                    ,req = new Request(url, init)
                    ,cleanup = r => (body && body.csrf && cookieDel(keyCSRF), r)
                    ,pubNetStatus = r => 
                        (eb.pub(eTypes.Net, {data: {http: r.meta}, mode: o.aModes.promise}), r)
                        //... abides middlewares pattern; r is the response object.
                    /***********************************************
                     * Response-handler EXAMPLES (for caller).
                     * Different cases require different handlers.
                     **********************************************/
                    ,respHandle1 = r => r.body ? r.body : Promise.reject(r.meta)
                    ,respHandle2 = r => (r.meta.status === 204) ? r : Promise.reject(r)

                /****************************************************************
                 * Set domain-locked cookie to CSRF token, 
                 * abiding the API's CSRF middleware mode: DomainLockedDouble .
                 ***************************************************************/
                body && body.csrf && cookieSet(keyCSRF, body.csrf)

                logDeb({csrf: {key: keyCSRF, val: (body && body.csrf)}, req: req})
                /*****************************************************************
                 * Fetch, publish HTTP-response code, 
                 * and return the async response object {body: {..}, meta: {..}}
                 ****************************************************************/
                return aFetch(req).then(cleanup).then(pubNetStatus)
            })
        }

        /*****************************************************************
         * SubRecordGet() fetches the authenticated user's record; 
         * (The user ID is at sub (subject) key of token claims.) 
         * merges API response with authStatus object, 
         * publishes that updated auth-status object 
         * and returns its auth-user record (key); rejects on any fail.
        *****************************************************************/
        ,SubRecordGet = () => {
            const 
                respHandle = r => r.body ? r.body : Promise.reject(r.meta)
                ,resetAuthStatus = (user) => {
                    if (!(user && user.user_id)) 
                        return Promise.reject({
                            why: 'User record INVALID.', 
                            what: user,
                            where: 'SubRecordGet() : resetAuthStatus(user)'
                        })
                    return auth.StatusGet().then(as => statusSet(as, user))
                }
                ,publish = (as) => eb.pub(eTypes.Auth, as) && as.user

            return accessGet().then(subDecode)
                    .then(uid => uid 
                        ? aFetchAuthAPI('GET', `/u/${uid}`)
                            .then(respHandle)
                        : Promise.reject({
                            why: 'Authorization expired.', 
                            what: {sub: uid},
                            where: 'SubRecordGet() : aFetchAuthAPI(..)'
                        })
                    )
                    .then(resetAuthStatus)
                    .then(publish)
                    .catch(logErr)
        }

        /*********************************************************************
         * UserPSP(..) parses user's buyin profile (user.profile_buyin)  
         * retrieved from auth-status (as) object. 
         * 
         * AcctType|Gateway|CustomerProfile|PaymentProfile|LastMax|LastDate
         *  "Visa|1|502107438|503568658|11|2021-10-24T17:27:02Z
        ********************************************************************/
       ,UserPSP = (as = {user: {}}) => {
            const 
                arr = (as.user && as.user.profile_buyin || '|||||').split('|')
                ,daysAgo = Math.ceil((o.nowSec() - o.UTCtoSec(arr[5]))/86400)
                ,lastMax = parseInt(arr[4], 10) //... is 0 @ profile creation.

            return {
                acctType: arr[0]
                ,gid : arr[1]
                ,cid: arr[2]
                ,pid: arr[3]
                ,lastMax: lastMax
                ,lastDate: arr[5]
                ,lock: (daysAgo < o.LockPeriod) && lastMax
                ,lockDaysRemain: (o.LockPeriod - daysAgo) > 0 ? (o.LockPeriod - daysAgo) : 0
            }
        }

        /**********************************************************************
         * tknsHandle(..) stores the tokens of a login (aFetch) response body,
         * along with a created authStatus object, and returns the latter.
         * All on success, else rejects. Deletes nonces regardless.
         *********************************************************************/
        ,tknsHandle = (r) => {
            cookieDel(keyNa, keyNb, keyNc)
            if ((r.meta.status !== 200) && (r.meta.status !== 201))
                return Promise.reject({
                    why: `Failed to fetch auth tokens.`, 
                    what: { status: r.meta.status, statusText: r.meta.statusText, 
                        url: r.meta.url, method: r.meta.req.method
                    },
                    where: 'tknsHandle(..)'
                })
            if (!r.body.a || !r.body.r) 
                return Promise.reject({
                    why: 'One or both auth tokens missing from response.', 
                    what: {at: r.body.a, rt: r.body.r, meta: r.meta},
                    where: 'tknsHandle(..)'
                })
            r.body.mode = r.body.mode 
                ? r.body.mode : (obfuscate ? o.AuthModes.ObfuscateBA : o.AuthModes.BasicAuth)
            logDeb('@ mode', r.body.mode,'| body:', r)
            return store(r.body)
        }
        /*********************************************
         * Basic Authentication (BA) per Fetch API.
         * Obfuscate (OB) creds optionally.
         * 
         * Authenticate if user is not already.
         * Return false if already authenticated, 
         * else return access token, else reject.
         ********************************************/
        ,_basicAuth = (user, pass) => {
            /************************************************************************
             * [Obfuscated] Basic HTTP Authentication (OBA) / (RFC 2617/7617) 
             * 
             * Returns a tokens object: 
             * {a: A, r: R, err: {a: bool, r: bool}}
             * Where `err` true if tkn failed to store @ AuthStore. 
             * Server also sets the associated pair of token-reference cookies.
             * 
             * @param {string} user
             * @param {string} pass 
             * 
             * Reference: 
             *  https://tools.ietf.org/html/rfc7617
             *
             * Header: 
             *  `Authorization: Basic <BASE64(<u>:<p>)>`  
             *      u: XOR(<user>, REV(na))
             *      p: XOR(<pass>, XOR(na, REV(nb)))
             * 
             *      - @ obfuscate = true
             * 
             * Summary/Assessment of OBA:
             *  - Encrypted creds of OBA mode are only obscured, not secured. 
             *  - Relies on TLS when algo obscurity fails. Thus "obfuscated".
             *  - Mitigates timing-based attacks utilizing server and client nonces.
             ***********************************************************************/ 
            function _ba(user, pass) {
                const 
                    na = obfuscate && cookieGet(keyNa)  // Server-generated nonce
                    ,nc = obfuscate && cookieGet(keyNc) // Client-generated nonce
                    // Prefer client to server generated val for nb; server abides.
                    ,nb = ( isString(nc) && (nc.length > 100) ) ? nc : cookieGet(keyNb)
                    ,obmode = obfuscate && (isString(na) && na.length > 100) && (isString(nb) && nb.length > 100)

                    ,u = obmode // XOR(<user-id>, REV(na))
                            ? xor(user, rev(na)) 
                            : user 
                    ,p = obmode // XOR(<pass>, XOR(na, REV(nb)))
                            ? xor(pass, xor(na, rev(nb)))
                            : pass

                    ,creds = `${u}:${p}`
                    ,hdrs = new Headers({
                        'Authorization': `Basic ${base64Encode(creds)}`,
                        'X-CSRF-Token': o.rand(15),
                    })
                    ,init = {
                        method: 'GET',
                        headers: hdrs,
                        credentials: "include", 
                        //... creds required to send nonce cookies (`obfuscate: true`)
                    }
                    ,url = urlAOA('/a/login')
                    ,req = new Request(url, init) 
                /********************************************************************
                 * The process by which the client-side nonce is generated always 
                 * succeeds @ localhost if browser supports the natives, 
                 * yet may not work elsewhere. 
                 * This test catches that otherwise silent security flaw.
                 *******************************************************************/
                // if (!nc) return Promise.reject({
                //     why: 'Failed to generate client-side nonce cookie.', 
                //     what: {key: keyNc, val: nc},
                //     where: '_ba(..)'
                // })
                /**************************************************************
                 * Delete cookies (again) to handle failures of cookieGet(..) 
                 * when OB mode is delcared; @ o.cfg.auth.obfuscate: true .
                 * Server then infers mode BA, overriding that declared.
                 *************************************************************/
                obmode || cookieDel(keyNa, keyNb, keyNc)

                nc || logWarn('Failed to generate client-side nonce cookie.')
                false && logFocus({
                    na: na,
                    nb: nb,
                    nc: nc,
                    creds: creds,
                    user: user,
                    pass: pass,
                    u: u,
                    p: p,
                    b64: base64Encode(creds),
                })

                // Authenticate :: return tokens object; abides ebMsg signature of eTypes.Auth
                return aFetch(req)
                        .then(tknsHandle)
            }

            // Server infers auth mode (BA|OB) per nonce cookies, so delete lest OB mode.
            obfuscate || cookieDel(keyNa, keyNb, keyNc)

            const 
                cryptObj = window.crypto || window.msCrypto
                ,ba = () => _ba(user, pass)

            /***********************************************************************
             * Before initiating authentication, generate a nonce (nc) if able. 
             * If successful, it replaces the second server-generated nonce (nb).
             * This mitigates a wider range of timing-based attacks.
             * 
             * The crypto.subtle package is known to fail at 
             * some browsers yet only at domains other than localhost.
             **********************************************************************/
            return (!!crypto.subtle && obfuscate) 
                        ? ( sha512(cryptObj.getRandomValues(new Uint32Array(1))[0])
                                .then(h => cookieSet(keyNc, h))
                                .then(ba)
                        )
                        : ba()
        }
        ,basicAuth = (user, pass) => 
            auth.Authenticated()
                .then(is => is ? false : _basicAuth(user, pass))

        /*****************************************************
         * Signup per jForm obj that includes CSRF token
         * 
         * CSRF mode: DomainLockedDouble
         * 
         * DEPRICATED; use apply(..), verify(..)
         ****************************************************/
        ,signup = (jForm) => {
            const 
                hdrs = new Headers({
                    //'Content-Type': 'application/json'
                    //'X-CSRF-Token': jForm.csrf 
                    //... Its own CSRF-mitigation mode; is the weakest.
                })
                ,params = {
                    method: 'POST'
                    ,headers: hdrs
                    ,body: JSON.stringify(jForm)
                    ,credentials: "include"
                }
                ,url = urlAOA('/a/signup')
                ,req = new Request(url, params)
                ,respHandle = resp => resp.body ? resp.body : resp.meta

            logDeb('signup(..) : req:', req)

            cookieSet(keyCSRF, jForm.csrf)
            return aFetch(req)
                    .then(tknsHandle)
        }
        /***************************************************
         * Initial step of three-step VIP signup 
         * Payload (jForm) is VIP key and CSRF token.
         * Response body is user account matching the key.
         **************************************************/
        ,claim = (jForm) => {
            const 
                params = {
                    method: 'POST'
                    ,body: JSON.stringify(jForm)
                    ,credentials: "include"
                }
                ,url = urlAOA(`/a/signup/claim`)
                ,req = new Request(url, params)
                ,rspHandle = (rsp) => (rsp.meta && (rsp.meta.status === 202))
                                        ? rsp : Promise.reject(rsp)

            logDeb('claim(..) :', {url: url, payload: jForm})

            cookieSet(keyCSRF, jForm.csrf)
            return aFetch(req)
                    .then(rspHandle)
        }
        /*************************************************************
         * apply(..) is first of two-step, nominal signup process
         * 
         * Payload per mode: 
         *  @ 'signup' : Email and Handle of applicant
         *  @ 'reset'  : Email of applicant (member)
         * 
         * At either mode, the payload must also include
         * a CSRF token.
         * 
         * If successful, response is HTTP 202 (Accepted),
         * and, per mode:
         *  - @ 'signup', AOA service emails a verification code.
         *  - @ 'claim', AOA service response includes user record.
         * else response is HTTP error code and may include
         * response body: {error: ERROR}.
         * 
         * >>> Attempted HTTP 100 (Continue) response, but
         * results in server fail and 'Offline' @ aFetch(..) .
         ************************************************************/
        ,apply = (mode, jForm) => {
            const 
                params = {
                    method: 'POST'
                    ,body: JSON.stringify(jForm)
                    ,credentials: "include"
                }
                ,url = urlAOA(`/a/${mode}/apply`)
                ,req = new Request(url, params)
                ,rspHandle = (rsp) => (rsp.meta && (rsp.meta.status === 202))
                                        ? rsp : Promise.reject(rsp)

            logDeb('apply(..) :', {url: url, payload: jForm})

            cookieSet(keyCSRF, jForm.csrf)
            return aFetch(req)
                    .then(rspHandle)
        }

        /****************************************************
         * verify(..) is 2nd and final step of process
         * 
         * Payload per mode: 
         *  @ 'signup' : Entire signup (user) object 
         *  @ 'reset'  : Email and password
         * 
         * At either mode, the payload must also include
         * the short-lived verification code, 
         * and a CSRF token.
         * 
         * On success, per mode:
         * @ 'signup' : Creates new member   (HTTP 201) 
         * @ 'reset'  : Updates member       (HTTP 200)
         * 
         * Returns authStatus object on success, after
         * storing it in the auth store and publishing it.
         * (See tknsHandle function.)
         **************************************************/
        ,verify = (mode, jForm) => {
            const 
                params = {
                    method: 'POST'
                    ,body: JSON.stringify(jForm)
                    ,credentials: "include"
                }
                ,url = urlAOA(`/a/${mode}/verify`)
                ,req = new Request(url, params)

                /****************************************
                 * If successful, response is HTTP 201,
                 * token-ref cookies are set, 
                 * and resp body contains the tokens.
                 **************************************/
                ,rspHandle = (rsp) => (rsp.meta && ((rsp.meta.status === 201) || (rsp.meta.status === 200))) 
                                        ? rsp : Promise.reject(rsp)

            logDeb('verify(..) :', {url: url, payload: jForm})

            cookieSet(keyCSRF, jForm.csrf)
            return aFetch(req)
                    .then(rspHandle)
                    .then(tknsHandle)
        }

        /***************************************************
         * initStatus(..) publishes authStatus object 
         * read from AuthStore; called once per page load.
        ***************************************************/
        ,initStatus = (cursor) => (cursor === 0) && statusPub()

        /************************************************************
         * OAuth is handled synchronously through AOA service
         * on click event of any target-provider's button.
         * 
         * Final response writes a cookie (keyOA);
         * a serialized, base64-encoded JSON payload 
         * containing the token pair and its meta:
         * {a: TKN, r: TKN, mode: AUTH_MODE, provider: PROVIDER}
         * 
         * checkOAuth() tests for successful OAuth condition, 
         * whereof the server redirects back to login page
         * after setting the oauth-tokens cookie (keyOA).
         * If cookie exists, its content is stored in AuthStore, 
         * and the cookie is reset and expired.
         **********************************************************/
        ,checkOAuth = () => {
            const 
                rawTkns = cookieGet(keyOA)
                ,testAuth = as => as.sub ? true : false
                ,lolz = rand(55)
                ,cleanup = (x) => (
                    cookieSet(keyOA, lolz),
                    cookieDel(keyOA, keyNa, keyNb, keyNc),
                    x
                )
            return auth.StatusGet()
                .then(as => {
                    // @ Already logged in.
                    if (testAuth(as)) {
                        return cleanup(as)
                    }
                    // @ Fresh login page.
                    if (!rawTkns) return false

                    // @ OAuth redirect chain; OA-cookie awaits processing.
                    const 
                        decoded = o.base64Decode(rawTkns)
                        ,tkns = JSON.parse(decoded)
                    // Store tkns object and then set and return the Auth.StatusStore()
                    return store(tkns)
                        .then(tkns => {
                            if (!tkns.a || !tkns.r) 
                                return Promise.reject({
                                    why: `One or both tokens missing from ${keyOA} cookie.`, 
                                    what: tkns,
                                    where: 'checkOAuth(..)'
                                })
                            return Promise.resolve(tkns)
                        })
                        // Login endpoint responds 423 (Locked) if valid keyOA cookie exists.
                        .then(cleanup)
                        .then(auth.StatusGet)
                })
        }

        /************
         * Public 
         ***********/
        ,auth = {
            // High level
            FetchAPI: aFetchAuthAPI,
            /***************************************************
             * Signup/Login/Logout are asymmetrical. 
             * Signup is per async, returning no payload;
             * (O)BA is per async, returning JSON; 
             * OAuth is per synch, returning cookie;
             * tokens are under client's control;
             * token-ref cookies are under service's control.
             **************************************************/
            Purge: purge,           // Purge AuthStore (tokens, status); request service logout.
            Login: login,           // Purge and redirect to (PWA) Login page.
            //Signup: signup,         // Signup then authenticate per (O)BA. DEPRICATED. 
            Claim: claim,           // VIP Signup; initial step; leads to nominal signup process.
            Apply: apply,           // Signup|Reset start; spawns email verification process.
            Verify: verify,         // Signup|Reset finish; user is created/authenticated on success. 
            Basic: basicAuth,       // (O)BA
            CheckOAuth: checkOAuth, // Process result (cookie) of (synch) OAuth if such occured. 
            Authenticated: () => isTknValid(keyR), // bool
            Authorized:    () => isTknValid(keyA), // bool
            AccessGet: accessGet,       // Return valid access token or false; refreshed if needed.
            StatusGet: () => statusGet().then(statusEnhance),
            SubRecordGet: SubRecordGet, // Fetch the User record of (authenticated) subject.
            UserPSP: UserPSP,
            Store: o.AuthStore(),
            // Low level
            Token: {
                A: keyA, 
                R: keyR, 
                TTL: ttlDecode,
                get: tknGet, 
                getValid: tknGetValid,
                getTTL: tknGetValidTTL,
                set: tknSet,
                del: tknsDel,
                show: tknShowValid, 
                refreshAccess: accessRefresh
            }
        }

    //o.Auth = function Auth() {return auth}
    o.Auth = () => auth

    // Init
    eb.sub(eTypes.State, initStatus)  

    !debugOFF 
        && aDelay(2, () => {
            auth.StatusGet().then(as => {
                const aTTL = ttl(as.a.exp), rTTL = ttl(as.r.exp)
                logDeb('Status :', as)
                logDeb('Access : TTL:', Math.floor(aTTL/60), 'min', aTTL%60, 'sec', {expUTC: as.a.expUTC})
                logDeb('Refresh : TTL:', Math.floor(rTTL/60), 'min', rTTL%60, 'sec', {expUTC: as.r.expUTC})
            })
            auth.Authorized().then(is => logDeb('Authorized:', is))
            auth.Authenticated().then(is => logDeb('Authenticated:', is))
            logDeb('state', state)
        })

})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
) 
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
;(function (o, undefined) {
    'use-strict'
    /**********************************************************************
     * Net communicates with app-services' endpoints per Fetch API,
     * and publishes its app-configured payloads per app-wide event bus.
     * Currently, it may hit endpoints of either PWA or API services.
     * 
     * Net module handles only the unprotected endpoints. 
     * Auth module handles all protected endpoints.
     * 
     * FEATUREs:
     *  - Net listens for messages from Loader and View, 
     *    and fetches resources per ebMsg.uri params. See `setURL(..)`.
     *    MsgList is the resource requested most often.
     *  - Recurringly fetches updates per scheduler that
     *    it launches on View's first-render ebMsg.
     *  - Publishes on `eTypes.Net` per fetch event; 
     *    Actions module listens for and handles payload.
     *  - Publishes an app-configured payload.
     *  - Net is stateless but for its own local (sans o.State()); 
     *    manages its local state per timestamp(s) in response data.
     * 
     * DATA FLOW:
     *  - On ebMsg 'init' (from Loader), 
     *    Net requests Page object from PWA service; 
     *    same URL, but in JSON format, per content negotiation (REST).
     *  - On ebMsg 'newer' (from View on first render), 
     *    Net schedules recurring requests to API service for newer.
     *  - On ebMsg 'older' (from View; either renderer), 
     *    Net requests older messages from API service.
     ********************************************************************/
    const 
        srcID = 'Net'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr     = o.log(srcID, o.log.levels.ERROR)
        ,logDeb     = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus   = o.log(srcID, o.log.levels.FOCUS)
        ,debugOFF   = o.log.debugOFF // ''
        ,profOff    = o.log.profOFF   // ''
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,{  aFetch
            ,aDelay
            ,profile
            ,time2UTC
            ,aModes
            ,dTypes
            ,aScheduleSeq
            ,seqArr
            ,once
            ,UTCtoMsec
            ,time2ISO
            ,nowISO
        } = o
        ,{  service
            ,rootAPI
            ,baseAPI
            ,uriDefault
            ,msgListFull
            ,msgListDiff
        } = o.cfg.net
        ,ajaxDelay = 15 * 1000 // msec
        
        /*******************************************
         * netSchOff : DISABLE SCHEDULED FETCHES
         ******************************************/
        ,netSchOff = false 
        ,ss = o.State().store

        /*******************************************************
         * Net state is local; does not share state with State.
         *******************************************************/
        ,state = {newest: 0, oldest: 0} // oldest not utilized.

        /*****************************************************************
         * net(..) returns a promise of the app object 
         * if Fetch API resolves and has meta,
         * else rejects; caller responsible for catch.
         * 
         * The app object is the decoded response body with added keys: 
         * {dType: dType, mode: aModes.promise, http: resp.meta}. 
         * The resp.meta keys are those of Fetch API and a few more. 
         * 
         * See o.aFetch(..) for details.
         * 
         * https://javascript.info/fetch-api 
         * https://fetch.spec.whatwg.org/#forbidden-header-name
         ****************************************************************/
        ,net = (url, dType) => {
            const 
                // Some headers are FORBIDDEN fetch
                // See spec: https://fetch.spec.whatwg.org/#forbidden-header-name
                reqHeaders = new Headers({
                    // Request resource format (JSON) per CONTENT NEGOTIATION, 
                    // but that SPAWNS ISSUES that are addressed hereunder.
                    // (All but `Accept` are CORS-Unsafe headers.)
                    'Accept': 'application/json' //... Content Negotiation
                    //... per server-side (CORS preflight) list of allowable headers: 
                    //   `Access-Control-Allow-Headers: <CSV-list>`
                    // App caches content at State/Store; we don't want browser to cache: 
                    ,'Cache-Control': 'no-store, max-age=0' 
                    //... this is not as effective as response header. (Do both.) 
                    //    The `max-age=0` setting clears local cache of requested resource.
                    //    Else JSON replaces cached page HTML, 
                    //    because request has same URL (content negotiation). 
                    ,'If-Modified-Since' : time2UTC(state.newest)
                    //... else Chrome inserts the header with time set to that of this (HTML) page.
                    //    So response is headers only (HTTP 304) unless resource 
                    //    (server-side) is newer than (newest in) our Store.
                    // UPDATE : HTTP 204 @ none newer; handled per request params
                })
                //... Request headers can be read: reqHeaders.get('Accept')
                //    https://developer.mozilla.org/en-US/docs/Web/API/Request/Request

                ,params = {
                    headers:    reqHeaders
                    ,method:    'GET'  // *GET, POST, PUT, DELETE, etc.
                    ,mode:      'cors'  // *cors, no-cors (safe only), same-origin (no cors)
                    /***************************************************************
                    * CORS: Some browsers erroneously report CORS requests 
                    * that fail for unrelated reasons, e.g., response timeout, 
                    * as a "Cross-Origin Request Blocked ...". Firefox does that, 
                    * whereas Chrome reports the failed preflight (OPTIONS).
                    ***************************************************************/
                    //,cache: 'no-store'  // *default, no-store, no-cache, reload, force-cache, only-if-cached
                    //... Better handled per explicit header (See above).
                    //,credentials: 'same-origin'  // *same-origin, include, omit 
                    //,redirect: 'follow'  // manual, *follow, error
                    //,referrerPolicy: 'no-referrer'  // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    //,body: JSON.stringify(data)  // must match "Content-Type:" req header.
                }
                ,req = new Request(url, params) 

                ,respHandle = d => {
                    // o.aFetch(..) should always return both body and meta.
                    if (!d.meta) return Promise.reject({
                        why:    'Network meta data is missing.', 
                        what:   d,
                        where:  'aFetch(..)'
                    })
                    /*********************************************************
                     * Map the aFetch(..) return, {body: ???, meta: {..}},
                     * into app-normalized object, {body: {..}, http: {..}}.
                     ********************************************************/
                    d.body          = d.body ? d.body : {}
                    d.body.dType    = dType 
                    d.body.mode     = aModes.promise

                    /**********************************************
                     * Guarantee d.body is an object regardless,
                     * and absorb d.meta into d.body.http,
                     * so d.body forms the expected app object.
                     * 
                     * This handles HTTP 5xx (service down), 
                     * whereof proxy service sends HTML,
                     * whence d.body arrives as a string.
                     *********************************************/
                    o.isObject(d.body)
                        ? d.body.http = d.meta 
                        : d.body = {html: d.body, http: d.meta} 
                        //... d.body.html for dev/test/debug
                    
                    ;(d.meta.status < 400) 
                        ? logDeb('resp @ aFetch(..) : HTTP meta:', d.meta) 
                        : logErr('resp @ aFetch(..) : HTTP meta:', d.meta)
                    
                    delete d.meta
                    
                    return Promise.resolve(d.body)
                }

            return aFetch(req).then(respHandle)
        }
        /***********************************************
         * Renormalize the payload to fit this client.
         * See modules: Action, State, View.
         **********************************************/
        ,renorm = (d) => {
            const prof = profile('renorm()')
            prof.start(profOff)

            if (d.messages) {
                /****************************************************************
                 * Response on Page model request is denomralized (all models), 
                 * and so does not strip any keys. Its only list is d.messages.
                 ***************************************************************/
                d.list = d.messages.list
                d.meta = d.messages.meta
                delete d.messages
            } else {
                if (d.chn_id) {
                    /***********************************************************
                     * Response @ Channel payload (versus MsgList, Page, ...),
                     * renormalize by sub-keying the payload.
                     **********************************************************/
                    d = {channel: d}
                }
            }
            prof.stop()

            return Promise.resolve(d)
        }
        ,publish = (d) => eb.pub(eTypes.Net, {
            data: d,
            mode: aModes.promise
        })//.then(emitted => logFocus('published', emitted))
        /*********************************************************
         * getResource(..) : Fetch ... publish  (promise chain)
         ********************************************************/
        ,getResource = (url, dType) => {
            log(`@ getResource(${dType}) >`,  url)
            net(url, dType)
                .then(renorm)
                .then(publish) 
                // Handle rejected Fetch API response.
                .catch(err => {
                    publish({http: err, mode: aModes.promise})
                    ;(err.status) ? logErr(err) : logErr('Fetch API :', err)
                })
        }
        /*********************************************************************************
         * getMsgListNewest(..)
         * The URL arg abides API signature, sans optional params (t, n) added herein,
         * to request a number of messages (n) newer (t) than our newest (state.newest).
         * E.g., https://swarm.now/api/v1/ml/pub/0ac...c49/1633476641316/-22 .
         *******************************************************************************/
        ,getMsgListNewest = (url, dType) => {
            url = `${url}/${state.newest}/-${msgListDiff ? msgListDiff : 33}`
            getResource(url, dType)
        }
        /*******************************************************
         * Schedule recurring GET requests for NEWER messages:
         * 1*wait, 2*wait, 5*wait, 5*wait, ... (@ true)
         ******************************************************/
        ,onSchedule = once((url) => {//... idempotent ...
            if (netSchOff) return
            logDeb("@ onSchedule(diff) LAUNCH > url >", url)
            const waitSeq = [1, 2, 5].map((t) => (t * ajaxDelay))
            aScheduleSeq(seqArr(waitSeq, 0, true), getMsgListNewest, url, dTypes.diff)
        })
        /*****************************************************************
         * setURL(..) per ebMsg.uri, which is a list of request params: 
         * 0: 'pg'|'ml', 1: 'pub'|'sub'|'chn', 2: xid [, 3: t [, 4: n]]
        *****************************************************************/
        ,setURL = (ebMsg) => {
            const 
                loc = { // Reference (mostly)
                    href: window.location.href                      // "http://localhost:3030/app/login"
                    ,origin: window.location.origin                 // "http://localhost:3030"
                    ,protocol: window.location.protocol             // "http:"
                    ,host: window.location.host                     // "localhost"
                    ,path: window.location.pathname                 // "/app/login"
                    ,slug: (window.location.pathname).substring(1)  // "app/login"
                }
                ,url = ebMsg.uri 
                        ? `${rootAPI}${baseAPI}/${ebMsg.uri.join('/')}` // API mode (JSON)
                        : (loc.slug                                     // PWA mode (JSON)
                            ? `${loc.origin}/${loc.slug}`
                            : `${loc.origin}${uriDefault}`
                        ) 
            log('@ setURL', {ebMsg: ebMsg, url: url})
            return url
        }
        ,wantsRegistry = ['init', 'older', 'newer', 'update', 'channel', 'top']
        /*********************************************
         * Update local state if o.State has a list.
         ********************************************/
        ,updateLocalState = () => (ss.active && ss.active.newest) && (
            (state.newest = ss.active.newest.date || 0),
            (state.oldest = ss.active.oldest.date || 0)
        )

        /****************
         * Entry point 
         **************/
        ,onDemand = (ebMsg) => {

            if (!ebMsg.want) {
                logErr('BAD ebMsg SIGNATURE : ebMsg.want is MISSING')

                return
            }

            // Abort lest ebMsg has a registered want.
            const wants = {}
            wantsRegistry.map(w => (wants[w] = ebMsg.want.includes(w)))
            if (!Object.values(wants).filter(want => (want === true)).length)
                
                return
            
            // On page load
            wants.init && getResource(setURL(ebMsg), dTypes.full)

            // Requests from either message renderer for either newer or older.
            wants.older && (
                (ebMsg.dType === dTypes.full)
                    ? getResource(setURL(ebMsg), dTypes.full) 
                    : ( (ebMsg.dType === dTypes.scroll)
                            ? getResource(setURL(ebMsg), dTypes.scroll) 
                            : getResource(setURL(ebMsg), dTypes.diff)
                    )
            )

            // Ad-hoc requests following message creation; form-msg submittal event 
            wants.newer && getResource(setURL(ebMsg), ebMsg.dType)
            // Schedule recurring diff updates; triggered by View upon first render
            wants.newer && onSchedule(setURL({uri: [ebMsg.uri[0], ebMsg.uri[1], ebMsg.uri[2]]}))

            // Updated message(s) : per View.txn
            wants.update && getResource(setURL(ebMsg), ebMsg.dType)
            
            // Channel : per View.txn
            wants.channel && getResource(setURL(ebMsg), ebMsg.dType)

            // Top : per View.centre
            wants.top && getResource(setURL(ebMsg), ebMsg.dType)

            log('@ onDemand(ebMsg)', {
                wants: [Object.keys(wants).filter(want => (wants[want] && want))].join(' '), 
                dType: ebMsg.dType, 
                  uri: (ebMsg.uri ? `/${ebMsg.uri.join('/')}` : ebMsg.uri),
            })
            return srcID 
        }

    /********
     * Init
     *******/
    baseAPI || logErr('Missing API config.')

    logDeb(debugOFF)
    
    eb.sub(eTypes.Loader, onDemand)
    eb.sub(eTypes.View,   onDemand)
    eb.sub(eTypes.State,  updateLocalState)

})( window[__APP__] = window[__APP__] || {} )
;(function(o, undefined){
    'use strict'

    /**
     * filltext() returns randomly selected sentences of 'Lorem ipsum'.
     * 
     * @param {integer} sentences 
     */
    o.filltext = (sentences) => {
        var txt = '', lorem_ipsum = ''
        lorem_ipsum=['Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.', 'Maecenas luctus libero id justo. Curabitur nibh pede, dignissim pharetra, ullamcorper nec, scelerisque in, justo.', 'Donec autem vel ac dolor venenatis. In hac habitasse platea dictumst. Pellentesque tortor iusto, vulputate diam.', 'Aliquam nisi et augue consectetuer, lacus ut cursus ornare, elit mauris pellentesque quam, vitae luctus erat nunc vel massa.'];
        for (var i=0; i < sentences; i++) txt += lorem_ipsum[Math.floor(Math.random()*4)] + ' '
        
        return txt
    }
    // Usage
    /*
        nodeFoo.innerHTML = `${$.filltext(8)}`
    */

})( window[__APP__] = window[__APP__] || {} )
;(function(o, undefined){
    'use strict'

    // =======================
    // @ View.Header Component
    // =======================
    const 
        ghost = o.create('GHOST')
        ,header = o.css('header .site') // || ghost

    if (!header) return

    const srcID = 'header'
        ,log = o.log(srcID)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,cfg = o.cfg.view.header
        ,{ throttle
            ,id
            ,tags
            ,css
            ,cssAll
        } = o
        ,logoResizeTrigger = parseInt(cfg.logoResizeTrigger, 10)

        // @ Chn Menu
        ,chnMenu = o.css('#channel-header .menu')
        ,chnMenuList = css('#channel-header .menu UL')
        ,chnMenuTabs = chnMenuList ? {
            one: css('LI A[href="#1"]', chnMenuList),
            two: css('LI A[href="#2"]', chnMenuList),
            three: css('LI A[href="#3"]', chnMenuList),
        } : null

        ,doChnMenuTabs = (ev) => {
            const ss = o.State().store
            if (ss.owner && ss.channel) {
                if (chnMenuTabs) {
                    switch (true) {
                        // @ pub/sub : set href per owner.handle; set .active FX
                        case (ss.channel.slug === 'pub') || (ss.channel.slug === 'sub') :
                            chnMenuTabs.one.href = `/${ss.owner.handle}/pub`
                            chnMenuTabs.two.href = `/${ss.owner.handle}/sub`
                            ;(ss.channel.slug === 'pub')
                                ? chnMenuTabs.one.classList.add(active)
                                : chnMenuTabs.two.classList.add(active)
                            break

                        // Hide page menu on all member-owned channels except pub and sub
                        case (ss.owner.handle !== 'app')
                                && (ss.channel.slug !== 'pub')
                                && (ss.channel.slug !== 'sub'):
                            chnMenuList.classList.add('hide')
                            break
                    }
                }
            }
            
        }

        // @ Site Menu
        ,siteMenuButton = css('.site .menu BUTTON', header) || ghost
        ,logo = css('.logo svg', header) || ghost
        ,open = css('svg.menu-open', header) || ghost
        ,close = css('svg.menu-close', header) || ghost

        ,siteMenu = css('.menu UL', header) || ghost
        ,siteNav = css('.nav UL', header) || ghost

        ,siteMenuItems = cssAll('LI', siteMenu)
        ,siteNavItems = cssAll('LI', siteNav)

        ,logoutMenu = css('.menu LI A[href="/app/logout"]', header) || ghost
        ,over = id('overlay-1') || ghost
        ,channel = css('#channel') || ghost
        ,slug = channel && channel.dataset.slug
        ,width = `(max-width: ${cfg.maxWidth})`
        ,mq = window.matchMedia(width)
        ,blur = 'blur'
        ,rotate = 'rotate'
        ,active = 'active'
        ,show = 'block'
        ,hide = 'none'
        ,big = 'big'
        ,small = 'small'
        ,dt = 40

        ,state = {
            size: '',
            activeMenu: tags('A', siteMenu)[0],
            activeNav: tags('A', siteNav)[0]
        }

        ,menuOpen = () => {
            siteMenu.style.display = show 
            open.style.display = hide 
            close.style.display = show 
            close.classList.add(rotate)
            over.style.display = show 
            channel.classList.add(blur)
        }
        ,menuClose = () => {
            siteMenu.style.display = hide 
            open.style.display = show 
            close.style.display = hide 
            over.style.display = hide
            channel.classList.remove(blur)
        }   

        ,getActive = (list) => {
            // Get/Set state : active nav-bar anchor
            const 
                url = location.hash[1] || location.pathname.replace(/^.*[\\\/]/, '')
                ,aSlug = `A[href="/app/${channel.dataset.slug}"]`

            // Set per Dataset API (channel.dataset.slug) else per 1st anchor @ list
            state.activeMenu = css(aSlug, siteMenu) || tags('A', siteMenu)[0]
            state.activeNav  = css(aSlug, siteNav)  || tags('A', siteNav)[0]
            
            // Set per url matching anchor slug or hash
            ;[...tags('A', list)].filter((el,i) => { 
                var slug = el.href.replace(/^.*[\\\/]/, '')
                if (slug === url) {
                    state.activeMenu = tags('A', list)[i]
                }
                if (el.hash[1] === url) {
                    state.activeMenu = tags('A', list)[i]
                }
            })
        }
        ,setActiveFX = (el, list) => {
            // Set active nav-bar anchor FX
            [...tags('A', list)].map(a => a.classList.remove(active))
            el.classList.add(active)
        }

        ,logoResizeFx = (msg) => {
            const y = window.scrollY
            if (y > 250 && state.size === small) 
                return

            !!state.size || (state.size = big)

            !!(state.size === small && y < logoResizeTrigger) && (
                chnMenu && logo.classList.remove(small),
                state.size = big
            )
            !!(state.size === big && y >= logoResizeTrigger) && (
                logo.classList.add(small),
                state.size = small
            )
        }

    /********
     * Init
     *******/

    ;(() => {
        getActive(siteMenu)
        state.activeMenu.classList.add(active)
        state.activeNav.classList.add(active)
    })()

    // Allow large logo only if page header has a channel menu
    chnMenu || logo.classList.add(small)

    /**********
     * Listen
     *********/

    eb.sub(eTypes.State, doChnMenuTabs)

    // @ Site menu button
    open.addEventListener('click', menuOpen)
    close.addEventListener('click', menuClose)
    over.addEventListener('click', menuClose)

    // @ Site menu
    siteMenu.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActiveFX(e.target, siteMenu)
    })
    siteMenu.addEventListener('keydown', (e) => {
        !!(e.key === 'Escape') && (
            !!(close.style.display === show) && menuClose()
        )
    })
    siteMenuButton.addEventListener('keydown', (e) => {
        !!(e.key === 'Enter') && (
            !!(open.style.display === show) 
                ? menuOpen()
                : menuClose()
        )
    })

    // @ Site nav bar
    siteNav.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActiveFX(e.target, siteNav)
    })

    // @ Channel nav bar 
    chnMenuList && chnMenuList.addEventListener('click', (e) => {
        if (e.target && ( e.target.nodeName === 'A' ) ) 
            setActiveFX(e.target, chnMenuList)
    })

    // @ Scroll vertical
    window.addEventListener('scroll', throttle(dt, logoResizeFx))

})( window[__APP__] = window[__APP__] || {} )

;(function(o, undefined){
    'use strict'
     /************************************************************************************ 
      * Thread toggler for #msg-list and #msg-list-menu nodes.
      * 
      * UPDATE: Also handle class 'new' FX. (Currently, but this should be segregated.)
      ***********************************************************************************/
    const 
        msgListRoot = o.css('#msg-list')
        ,msgListMenu = o.css('#msg-list-menu')

    if (!msgListRoot || !msgListMenu) return

    const 
        srcID = 'thread-toggler'
        ,cfg = o.cfg.view.msgs
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,dTypes = o.dTypes
        ,log        = o.log(srcID)
        ,logFocus   = o.log(srcID, o.log.levels.FOCUS)
        ,logErr     = o.log(srcID, o.log.levels.ERROR)

        ,css        = o.css
        ,cssAll     = o.cssAll
        ,create     = o.create
        ,setText    = o.setText
        ,aDelay     = o.aDelay
        ,throttle   = o.throttle
        ,dt = 500
        ,collapse   = 'collapse'
        ,expand     = 'expand'
        ,svg = (action) => `${cfg.svgsPath}#def-${action}`
        ,expanded   = svg(collapse)
        ,collapsed  = svg(expand)
        ,ghost = create('GHOST')
        ,_publish = () => eb.pub(eTypes.View, {
            want:  [],
            arg: 'toggleThreadFired',
            args:  [],
            uri:   [],
        })
        ,publish = o.debounce(200, _publish)
        ,page = o.Page()

        // Toggle thread per action (idempotent)
        ,toggleThread = (thread, action) => {
            const 
                siblings = cssAll(`#${thread.id}>.thread`, thread)
                ,threads = cssAll(`#${thread.id} .thread`, thread)
                ,button  = css('.toggle .title svg use', thread)
                ,count   = css('.toggle .count-replies', thread)
                ,state   = {flag: undefined, href: undefined}

            if (!button) {
                return logErr(
                    '@ toggleThread(..) : falsey button : implies DUPLICATE IDs rendered:', 
                    {thread: thread, action: action}
                )
            }

            page.embedded && publish()

            ;(action === collapse) 
                && ( state.flag = 'true'
                    ,state.href = collapsed
                    ,button.parentNode.parentNode.dataset.title = 'Expand'
                    ,count.textContent = `${siblings.length}/${threads.length}`
                  ) 
            ;(action === expand) 
                && ( state.flag = ''
                    ,state.href = expanded
                    ,button.parentNode.parentNode.dataset.title = 'Collapse'
                    ,count.textContent = ''
                  )

            ;[...siblings].map(el => {
                el.dataset.selfCollapsed = state.flag  
            })

            button.setAttribute('href', state.href)
            thread.dataset.threadCollapsed = state.flag

            // FX @ class 'new'
            // TODO: segregate these doings; they should have their own script.
            //aDelay(10000, ()=>[...siblings].map(el => el.classList.remove('new')))
        }
        // Return the targeted thread given an event target. 
        ,getThread = (et) => { 

            const state = {eTarget: undefined, thread: undefined}

            // Filter out all but certain event targets, exploiting event delegation.
            ;(et.matches('.toggle .title')) 
                && (state.eTarget = et.parentNode) 
            ;(et.matches('.toggle .title svg')) 
                && (state.eTarget = et.parentNode.parentNode) 
            ;(et.matches('.toggle .title svg use')) 
                && (state.eTarget = et.parentNode.parentNode.parentNode) 

            // If event target is relevant, then return the targeted thread
            // which is referenced thereof at event-target's dataset '-msg-ref=#m-<MESSAGE_ID>'
            ;(state.eTarget) 
                && (state.thread = css(`#${state.eTarget.dataset.msgRef}`))

            // FX @ class 'new' :: remove class from target thread.
            // TODO: segregate these doings; they should have their own script.
            ;(state.thread) && state.thread.classList.remove('new')

            return state.thread 
        }
        // Toggle event-target thread per dataset '-thread-collapsed' state (idempotent)
        ,toggleReplies = (e) => {
            const thread = getThread(e.target)
            ;(thread) && (
                (thread.dataset.threadCollapsed) 
                    ? toggleThread(thread, expand) 
                    : toggleThread(thread, collapse)
            )
        }

        /***********************************************************************
         * MsgListMenu :: Expand/Collapse All 
         **********************************************************************/
        ,msgListMenuAllToggle = css('li.toggle', msgListMenu) || ghost
        ,msgListMenuAllToggleWord = css('em', msgListMenuAllToggle)
        ,msgListMenuAllToggleButton = css('svg', msgListMenuAllToggle)
        ,msgListMenuAllToggleSVG = css('use', msgListMenuAllToggleButton)

        // Toggle all threads of dataset '-thread-replies=true', per action
       ,toggleAll = (action) => {
            if (msgListMenuAllToggle.dataset.disable === 'true') 
                return //... disabled @ chron mode (flat list)

            ;[...(cssAll('.thread', msgListRoot) || [])].map(el => { 
                (el.dataset.threadReplies === 'true') 
                    && toggleThread(el, action)
            })
        }
        // MsgListMenu :: Expand/Collapse All :: word, per action
        ,toggleWord = (action) => setText(msgListMenuAllToggleWord, 
            ((action === collapse)
                ? 'Expand'
                : 'Collapse'
            )
        )
        // MsgListMenu :: Expand/Collapse All :: init per action 
        ,msgListMenuInit = (action) => {
            ;(action === collapse)
                && ( toggleAll(collapse), 
                    msgListMenuAllToggleSVG.setAttribute('href', collapsed), 
                    toggleWord(collapse)
                )
            ;(action === expand)
                && ( toggleAll(expand), 
                    msgListMenuAllToggleSVG.setAttribute('href', expanded), 
                    toggleWord(expand)
                )
        }
        // MsgListMenu :: Expand/Collapse All :: event, per toggler's state.
        ,onMsgListMenuAllToggle = (ev) => {
            if (msgListMenuAllToggle.dataset.disable === 'true') 
                return
                
            // Hover FX per mouse enter/leave
            const mouse = {enter: (ev.type === 'mouseenter'), leave: (ev.type === 'mouseleave')}
            ;(mouse.enter) && (msgListMenuAllToggleButton.classList.add('hover'))
            ;(mouse.leave) && (msgListMenuAllToggleButton.classList.remove('hover'))
            if ( mouse.enter || mouse.leave) return 

            // Expand/Collapse per click
            ;(msgListMenuAllToggleSVG.getAttribute('href') === expanded)
                ? msgListMenuInit(collapse)
                : msgListMenuInit(expand)
        }

        /*********************************************************************
         * onPub1(ebMsg)
         * 
         * @param {object}  {   node: NODE
         *                      ,dType: dTypes.{full, diff}
         *                      ,want: [WANT1, WANT2, ...]
         *                  }
         * (Re)Attach click listener to reckon DOM mutation(s).
         * One listener handles all threads per Event Delegation.
         * Also set the toggle state per ebMsg and config params. 
         ***/
        ,onMsgListChange = (ebMsg) => {

            const 
                init = ebMsg.want.includes('init')
                ,reset = ebMsg.want.includes('reset')
                ,collapseThread = ebMsg.want.includes('collapseThread')

            if (!msgListRoot || (!reset && !init)) 
                return srcID

            // Detach the event listener.
            msgListRoot.removeEventListener('click', toggleReplies)  

             // Reset all threads to state declared at config param, on init.
            ;(init) && (
                (cfg.collapseAll) 
                    ? toggleAll(collapse)
                    : toggleAll(expand)
            )

            // Collapse a thread per ebMsg params
            ;(collapseThread) 
                && toggleThread(ebMsg.node, 'collapse')
            
            // Attach the event listener. 
            msgListRoot.addEventListener('click', toggleReplies)

            // Remove class 'new' from all threads after delay.
            // TODO: segregate these doings; they should have their own script.
            aDelay(10000, ()=>[...cssAll('.thread', msgListRoot)]
                .map(el => el.classList.remove('new')))

            return srcID
        }
        // Initialize msgListMenu per config param, per ebMsg
        ,onMsgListMenuSelect = (ebMsg) => {
            ebMsg.then(obj=>{
                const init = (obj && obj.data && obj.data.msgListMenu)
                ;(init) && (
                    (cfg.collapseAll) 
                        ? msgListMenuInit(collapse)
                        : msgListMenuInit(expand)
                )
                return srcID
            }).catch(logErr)
        }

    /**************************************************************************
     * INIT 
     **************************************************************************/
    // Init sans event.
    //onPubEvent({want: 'init'}) 

    // Listen/handle :: hover and click events at message-list menu toggle
    msgListMenuAllToggle.addEventListener('mouseenter', onMsgListMenuAllToggle)
    msgListMenuAllToggle.addEventListener('mouseleave', onMsgListMenuAllToggle)
    msgListMenuAllToggle.addEventListener('click', throttle(dt, onMsgListMenuAllToggle))

    // Listen to Loader and View event types, 
    // and invoke onPubEvent per event pub (ebMsg) therefrom.
    eb.sub(eTypes.Loader, onMsgListChange)
    eb.sub(eTypes.View, onMsgListChange)
    eb.sub(eTypes.Action, onMsgListMenuSelect)

})( window[__APP__] = window[__APP__] || {} )
;(function(o, undefined){
    'use strict'
    /***********************************************************************************
     * Handle the message-submittal form; either the dynamic per-message reply form, 
     * #form-msg under #msg-list, or the static new-message form (#form-msg-new).
     * 
     * Toggle a single instance of the message-submittal form per 'click' event. 
     * (Re)Attach 'click' listeners per DOM mutations and click events; 
     * DOM mutations are signaled by eTypes.View per render event.
     *
     *  - One listener to the static new-message button. 
     *  - One listener to all the reply-message buttons; insert/remove #form-msg per.
     **********************************************************************************/
    const msgList = o.css('#msg-list')
    if (!msgList) return 

    const 
        cfg = o.cfg.view.msgs
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,srcID = 'form-msg'
        ,log = o.log(srcID)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = ''//o.log.debugOFF // ''
        ,logFocus = o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,css = o.css
        ,cssAll = o.cssAll
        ,create = o.create
        ,pathName = window.location.pathname
        ,svgReplyOpen = `${cfg.svgsPath}#def-reply-open`
        ,svgReplyClose = `${cfg.svgsPath}#def-reply-close`
        ,svgNewClose = `${cfg.svgsPath}#def-reply-close`
        ,ghost = create('GHOST')
        //,formMsgNew = css('#form-msg-new')
        //,formMsgNewButton = css('BUTTON', formMsgNew) //|| ghost 
        //... BUG if not exist; returns other button node.
        ,formMsgNew = css('#form-msg-new')
        ,formMsgNewButton = css('#form-msg-new BUTTON') || ghost
        ,formNewMsgStr = 'New Message'
        /********************************************************
         * There is always zero or one message form per page; 
         * this one form is inserted/removed per button click.
         ******************************************************/ 
        ,formMsgGet = () => css('#form-msg') 
        ,formMsg = `
             <div id="form-msg" class="form-msg">
                <form method="post" action=""> 
                    <fieldset name=inner class="">

                        <label for="title" class="">Title</label>
                        <textarea type="text" 
                            required
                            autocomplete=off
                            minlength=1
                            maxlength=128
                            name="title"
                            placeholder=""></textarea>
 
                        <label for="body" class="">Message</label>
                        <textarea type="text" 
                            required
                            autocomplete=off
                            minlength=1
                            maxlength=${cfg.maxShort}
                            name="body"
                            placeholder="&hellip;"></textarea>

                        <button type="submit">Publish</button>

                    </fieldset>
                </form>
            </div>
            `
        // Handle @ top or any child iframe ... 
        // https://stackoverflow.com/questions/580669/redirect-parent-window-from-an-iframe-action
        ,redirect = (path) => (window.top.location.href = path)
        ,targetState = {}

        /********************************
         * Init the target message form
         *******************************/
        ,initMsgForm = (target) => {
            /***********************************************************
             * Handle form input @ either 'New Message' or Reply
             * target: (svg.reply | #form-msg-new button.form-msg-new)
             **********************************************************/
            const 
                auth = o.Auth()
                ,ss = o.State().store
                ,isChnOwner = ss.owner ? (ss.owner.user_id === ss.auth.sub) : false
                ,isLongForm = ss.channel ? (ss.channel.msg_form === o.mForm.long) : false
                ,isThreadView = ss.view ? (ss.view.vname === 'thread-view') : false
                ,isReply = !(target === formMsgNewButton)
                // Dynamic elements : DOM mutates per click of reply-message button.
                ,form = css('FORM', formMsgGet())
                ,submit = css('BUTTON', form)
                ,bodyLabelNode = css('LABEL[for="body"]', form)
                ,titleLabelNode = css('LABEL[for="title"]', form) 
                ,bodyTextNode = css('TEXTAREA[name="body"]', form) 
                ,titleTextNode = css('TEXTAREA[name="title"]', form) 
                ,thread = target.closest('div.thread')
                ,chnID = (thread && thread.dataset.chnId) || ss.channel.chn_id
                ,toID = thread ? thread.id.replace('m-', '') : undefined
                /***********************************************************************
                 * Muster the message obj
                 * 
                 * Currrenly allowing only short-form (o.mForm.short) messages.
                 * TODO : msg.form : select per lTypes (pub or slug) and new or reply
                 **********************************************************************/
                ,msg = {
                    form: o.mForm.short
                    ,chn_id: chnID
                    ,to_id: toID
                    ,to_display: toID ? thread.dataset.authorDisplay : undefined
                    ,to_handle: toID ? thread.dataset.authorHandle : undefined
                    ,author_id: ss.auth.sub
                    ,author_display: ss.auth.user.display
                    ,author_handle: ss.auth.user.handle
                    ,author_avatar: ss.auth.user.avatar || o.cfg.view.avatarDefault
                    ,author_badges: ss.auth.user.badges
                    ,csrf: o.rand(22)
                }
                // @ User is no longer authenticated.
                ,handleNotAuthenticated = () => {
                    // Inform per button text, and redirect to login page on button click.
                    [bodyLabelNode, bodyTextNode, titleLabelNode, titleTextNode]
                        .map(el =>el.classList.add('hide'))
                    o.setText(submit, 'Login required')
                    submit && submit.addEventListener('click', (ev) => {
                        ev.preventDefault()
                        redirect('/app/login')
                    })
                }
                // @ Auth status object lacks auth.user object.
                ,handleMissingUser = (target) => {
                    // Retrieve auth.user record, then redirect back to target message.
                    const div = o.ancestor(target, 'div.thread')
                        ,frag = div ? `#${div.id}` : ''
                    auth.SubRecordGet().then(() => redirect(window.location.href+frag))
                }
                // Validate the form
                ,state = {invalid: true}
                ,validNodes = (isLongForm && isChnOwner && !isThreadView && !isReply) 
                    ? [bodyTextNode, titleTextNode]
                    : [bodyTextNode]
                ,chkValidity = () => (
                    validNodes.map(el => el.checkValidity() 
                        ? ( el.classList.remove('invalid')
                        )
                        : ( el.classList.add('invalid')
                            ,(state.invalid = true)
                        )
                    ),
                    (state.invalid)
                        ? ( submit.classList.add('disabled')
                            ,(submit.disabled = true)
                        )
                        : ( submit.classList.remove('disabled')
                            ,(submit.disabled = false)
                        )
                )
                ,doMsgSubmit = (ev) => {
                    ev.preventDefault()
                    const 
                        xid = (x) => {
                            switch (o.lTypes[ss.active.type]) {
                                case o.lTypes.chn:
                                    return ss.channel.chn_id 
                                case o.lTypes.pub:
                                case o.lTypes.sub:
                                    return ss.channel.owner_id
                                case o.lTypes.th:
                                    return x.body.msg_id
                                default:
                                    break
                            }
                        }
                        ,postHandler = resp => {
                            /***************************************************************
                             * Toggle the form. This nested ev.target is a submit button, 
                             * but send form toggler the original target (message button).
                             **************************************************************/
                            toggleFormMsg({target: target})
        
                            logDeb('@ postHandler : resp:', resp)

                            if (resp.meta && resp.meta.status > 399) 
                                return Promise.reject({
                                    body: resp.body,
                                    meta: resp.meta
                                })

                            /***************************************************
                             * Request fetch of newly created message.
                             * Response spawns another Action/State/View loop,
                             * thereby rendering the new message.
                             * 
                             * (Net module is subscribed to eTypes.View)
                             *************************************************/

                            eb.pub(eTypes.View, { 
                                dType: o.dTypes.diff
                                ,want: ['newer']
                                ,uri: ['ml', ss.active.type, xid(resp)]
                            })// uri: {pg, ml}, {pub, sub, chn, th}, xid, [, t [, n]] 
            
                            return resp //... abide middleware pattern.
                        }

                    
                    msg.title = titleTextNode.value
                    msg.body  = bodyTextNode.value
                    msg.form  = ss.channel.msg_form
                    ;(ss.owner.user_id !== ss.auth.sub)
                        && (msg.form = o.mForm.short)
                    ;(msg.to_id)
                        && (msg.form = o.mForm.short)

                    logDeb('@ doMsgSubmit : msg:', msg)
                    
                    auth.FetchAPI('POST', '/m', msg)
                            .then(postHandler)
                            .then(logDeb)
                            .catch(logErr)

                }

            // Conditionally show or hide title INPUT, and set focus accordingly.
            ;(isLongForm && isChnOwner && !isThreadView && !isReply) 
                ? titleTextNode && titleTextNode.focus()
                : ( [titleTextNode, titleLabelNode]
                        .map(el => el.classList.add('hide'))
                    ,bodyTextNode && bodyTextNode.focus()
                )

            /***********************************************
             * Handle form submittal per auth.FetchAPI(..)
             **********************************************/

            !targetState.svg && (
                (targetState.svg = target),
                (targetState.use = target.firstElementChild)
            )//... who cares? Was this for DEV/TEST ???

            if (!(ss.auth && o.ttl(ss.auth.r.exp))) {
                handleNotAuthenticated()
                return
            }
            if (!(ss.auth && ss.auth.user && ss.auth.user.handle)) {
                handleMissingUser(target)
                return
            }
            state.invalid = true
            chkValidity()

            // Listen/Manage : textarea; idempotent per key entry.
            form && form.addEventListener('keyup', 
                o.throttle(100, (ev) => {
                    state.invalid = false
                    chkValidity()
            }))

            submit && submit.addEventListener('click', doMsgSubmit)
        }

        /*********************************************
         * Toggle form : insert/remove per ev.target 
         * (target: svg.reply | button.form-new-msg)
         ********************************************/
        ,toggleFormMsg = (ev) => { 

            const 
                target = ev.target
                ,state = {
                    form: formMsgGet()
                    ,useReply: cssAll('#msg-list svg.reply use') || []
                    ,active:    undefined
                    ,button:    undefined
                    ,container: undefined
                }

            // Publish toggle request; See loader @ IFRAME
            eb.pub(eTypes.View, {
                node:  state.form,
                dType: null,
                want: [],
                arg:   'toggleFormRequest',
                args:  [],
                uri:   []
            }) 

            /***********************************************************
             * Find the intended target (button) from the event target
             **********************************************************/
            ;( (target && target.matches('svg.reply')) 
            || (target && target.matches('svg.new')) ) 
                && (
                    state.button = target,
                    state.active = state.button.querySelector('use')
                )
            ;( (target && target.matches('svg.reply use')) 
            || (target && target.matches('svg.new use')) ) 
                && (
                    state.active = target,
                    state.button = state.active.parentNode 
                )
            ;(state.button) 
                //&& (state.container = state.button.parentNode.parentNode.parentNode.parentNode)
                && (state.container = o.ancestor(state.button, 'div.options'))

            ;(target && (target === formMsgNewButton)) 
                && (
                    state.button = target,
                    state.container = css('#form-msg-new form') 
                    //... state.button.parentNode
                )

            // Prevent toggle if out of q 
            const ss = o.State().store
            if ((ss.auth && ss.auth.user && (ss.auth.user.tokens_q === 0))) {
                if (state.button) {
                    state.button.disabled = true
                }
                return
            }

            /*****************************************************
             * Toggle #form-msg : guarantee DOM has one or none.
             ****************************************************/
            // @ Case : no form is open.
            if (!state.form) {
                // const msgNode = o.ancestor(state.container, '.msg')
                // if (msgNode && msgNode.dataset.punished === 'true') 
                //     return 
                //... depricated; all actions are removed upon negative qToken count.
                // Append form to target
                if (state.button) {
                    state.container.insertAdjacentHTML('afterend', formMsg)
                    state.form = formMsgGet()
                    state.form.querySelector('textarea').focus()

                    initMsgForm(target)
                }
                if (state.button !== formMsgNewButton) {
                    // button FX @ reply-msg form
                    if (state.active) {
                        state.active.setAttribute('href', svgReplyClose)
                        state.button.classList.add('active')
                    }
                } else {
                    // button FX @ new-msg form
                    formMsgNewButton
                        && (formMsgNewButton.innerHTML = `
                            <svg class="new"><use href="${svgNewClose}"></use></svg>`
                        )
                }


            // @ Case : form is already open (anywhere).
            } else { 
                if (state.button) {
                    // find & close (remove) the form (wherever it is).
                    state.form.remove()
                    ;[...state.useReply].map(el => 
                        el.parentNode.classList.contains('active')
                            && (el.setAttribute('href', svgReplyOpen),
                                el.parentNode.classList.remove('active')
                            )
                    )
                    // button FX @ new-msg form 
                    formMsgNewButton
                        && (formMsgNewButton.innerHTML = formNewMsgStr)
                }
            }
        }
        /*****************************************************
         * (Re)Attach click listeners to reckon DOM changes.
         ****************************************************/
        ,onDemand = (ebMsg) => {
            if ((ebMsg.arg !== 'toggleFormRequest') && !ebMsg.want.includes('init'))

                return
           
            // Detach
            {
                formMsgNewButton 
                    && formMsgNewButton.removeEventListener('click', toggleFormMsg) 
                msgList 
                    && msgList.removeEventListener('click', toggleFormMsg)
            }
            // Re-attach
            {
                // @ form button : New message
                formMsgNewButton
                    && ( formMsgNewButton.innerHTML = formNewMsgStr
                        ,formMsgNewButton.addEventListener('click', toggleFormMsg)
                    )
                // @ form button : Reply message 
                msgList 
                    && msgList.addEventListener('click', toggleFormMsg)
            }

            return srcID
        }

    //;[msgList,formMsgNewButton].map(el =>logFocus({name: el.nodeName, id: el.id, class: el.className}))

    logDeb(debugOFF)

    // @ Init
    eb.sub(eTypes.Loader, onDemand)
    // @ DOM mutations 
    eb.sub(eTypes.View, onDemand)

    // Hide "New Message" form BUTTON @ /sub channel (Timeline tab: "Incoming+").
    ;(pathName.substring(pathName.length - 4) === '/sub')
            && (formMsgNew.style.display = 'none')

})( window[__APP__] = window[__APP__] || {} )
;(function (o, undefined) {
    'use-strict'
    /**********************************************************************************
     * View consumes State logs per state-published cursor, o.State.logs[cursor],
     * passing that indexed obj (got) to all renderers; o.View.components[key](got).
     *********************************************************************************/
    const 
        srcID = 'View'
        ,log = o.log(srcID)
        ,logWarn = o.logWarn(srcID)
        ,logErr = o.logErr(srcID)
        ,logDeb = o.logDeb(srcID)
        ,logFocus = o.logFocus(srcID)
        ,debugOFF = ''//o.log.debugOFF  // ''
        ,profOFF = o.log.profOFF    // ''
        ,prof = o.profile('View')
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,state = o.State()
        ,keys = {} 
        ,view = {
            log:      id => o.log(`${srcID}/${id}`)
            ,logDeb:   id => o.logDeb(`${srcID}/${id}`)
            ,logErr:   id => o.logErr(`${srcID}/${id}`)
            ,logFocus: id => o.logFocus(`${srcID}/${id}`)
            ,msglistHeader: o.css('#channel main h4') || o.create('GHOST')
            ,msglistNode: o.css('#msg-list')
            /*******************************************************************
             * Components/Renderers
             * 
             * Each view.components[key] is a DOM handler (renderer); 
             * an IIFE returning a closure over its init params. 
             * Thereafter, each is invoked per state, at entrypoint func,
             * and operates on its state-obj data (if its key exists therein). 
             * 
             * Such may be inlined (here) or declared in other app module(s):
             * keys = o.View().components, keys['foo'] = (()=>{..})()
             ******************************************************************/
            ,components: keys
            /********************************************************* 
             * Validate each component and its state.log[i] per key 
             ********************************************************/
            ,validate: {
                // Validate DOM component (once per init)
                node: (node, name) => {
                    if (!node) {
                        logDeb( `'${name}' : HTML node NOT EXIST.`)
                        return false
                    }
                    return true
                },
                /********************************************************
                 * Validate component data (current state log) per key, 
                 * so each component renderer is bypassed 
                 * at current state lest its key exists therein.
                 *******************************************************/
                key: (data, key) => {
                    if (!data.hasOwnProperty(key)) {
                        return false 
                    } else { 
                        if (typeof data[key] === 'undefined') return false
                    }
                    return true
                }
            }
            /************************************************************
             * Garbage collector deletes all keys of current-state obj,
             * except for saves, which is a CSV list of key names. 
             * The convention is to retain at least the primary keys, 
             * which reveal the state's spawn.
             ***********************************************************/
            ,gc: (obj, ...saves) => !!o.aDelay(2000, () => 
                Object.keys(obj).map(key => saves.includes(key) || delete obj[key]) 
                ,obj, ...saves
            )
            ,banner: (x) => x ? `${o.cfg.view.banners}/${x}` : `${o.cfg.view.banners}/ghost-1778x500.png`
            /******************************************************
             * Set avatar per 1st letter of word; its equivalent
             * MATHEMATICAL Bold FRAKTUR CAPITAL LETTER (MBF)
             *****************************************************/
            //,avatars = o.cfg.view.avatars
            ,avatar: (x) => x ? `${o.cfg.view.avatars}/${x}` : `${o.cfg.view.avatars}/user-x-00.png`
            //,avatar: (x) => `/sa/media/avatars/${x}`
            //... TODO : Align assets directories of cdn.uqrate.org and uqrate.org
            // https://cdn.uqrate.org/media/avatars/user-x-00.png
            ,avatarMBF: (word = 'A') => `${o.cfg.view.avatars}/unicode/mbf/cap-${word.substring(0,1).toLowerCase()}.svg`
            //,avatarMBF: (word = 'A') => `/sa/media/avatars/unicode/mbf/cap-${(word.substring(0,1)).toUpperCase()}.svg`
            //,avatarMBF: (word = 'A') => 'https://uqrate.org/logo-512.png' //  CSP
            //,avatarMBF: (word = 'A') => `https://cdn.uqrate.org/media/avatars/user-x-00.png`
            //,avatarMBF: (word = 'A') => `https://cdn.uqrate.org/media/avatars/crown.svg`
             /*************************************************
             * Set avatar per random MBF (Unicode) letter;
             * per code point of LATIN CAPITAL LETTER (ASCII)
             *************************************************/
            ,avatarMBFRand: () => `/sa/media/avatars/unicode/mbf/cap-${String.fromCharCode(65 + o.randInt(25))}.svg`
            ,avatarMBFStr: (word = 'A') => `
                <svg 
                    viewBox="0 -15.5 13 20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <style>
                            @font-face {
                                font-family: 'symbola-mbf';
                                font-weight: normal;
                                font-style: normal;
                                src: url('symbola-mbf.woff') format('woff');
                            }
                            .sbmf {
                                font-family: symbola-mbf;
                                fill: #333;
                            }
                        </style> 
                    </defs>
                    <text class="smbf">${(word.substring(0,1)).toUpperCase()}</text>
                </svg>
            `//... this does not mock img.src, which is what we want; 
            //     a standin until we allow for user-avatar (png, webp, ...) uploads.

            /***********************
             * Operational params
             **********************/
            // pToken button is hidden until sufficient qTokens accumulate.
            ,minMsgQ4P: o.cfg.view.msgs.minQ4P
            ,dtThrottle: 1000

            // Calibrate per viewport; 150 px is ~ 1 short message, nominally.
            ,headerSite: o.css('header>section.site')
            ,unitHeight: (this.headerSite && Math.round(2.1 * this.headerSite.scrollHeight)) || 150
            ,cfgMsgs: o.cfg.view.msgs
            
            //svgsPath: o.cfg.view.svgsPath,
            //avatars: o.cfg.view.avatars,
            ,dtReplayRender: 10
        }
        /***************************************************************
         * ENTRYPOINT function is invoked per published-state event,
         * taking the state's cursor, and passing o.State.logs[cursor] 
         * object as argument to all View components (keys).
         **************************************************************/
        ,render = (i) => {
            // Get the state logs data (object) at this index (i).
            const got = !isNaN(i) ? state.get(i) : state.get()
            // Fire all render handlers, passing to each the state object.
            Object.keys(view.components).map(key => view.components[key](got))
            logDeb('#',state.cursor, "@ render > mode:", got.mode)
        }

    // TEMPLATE : Component/Renderer example
    keys.foo = (() => {
        const 
            cName = 'foo'
            ,cSelector = `#${cName}`
            ,cNode = o.css(cSelector)

        // @ init : close over whatevs at this node.
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        const 
            auth = o.Auth()
            ,eb = o.EB()
            ,eTypes = eb.eTypes()
            ,state = o.State()
            ,keys = view.components
            ,logDeb = view.logDeb(cName)
            ,debugOFF = o.log.debugOFF  // ''
            ,logErr = view.logErr(cName)
            ,logFocus = view.logFocus(cName)
    
        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... handle/render if component key (cName) exists in this state log.
        }
    })()

    // INIT 
    o.View = () => view

    // LISTEN 
    eb.sub(eTypes.State, render) 

    // DEV/TEST
    true && (prof.start(profOFF), logDeb(debugOFF))
    //view.msglistHeader.textContent = `Messages @ ${o.nowUTC().substring(0,22)} GMT`

    //logFocus('=== view:',view)
    
})( window[__APP__] = window[__APP__] || {} )

/*********************************************************************************
 * Components (DOM handlers) are modularized for extraction to separate file(s).
 ********************************************************************************/

// View : COMPONENT (template)
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'COMPONENT' //... rather is per-state data key; NOT 1:1 map to DOM component
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,keys = view.components

    keys[cName] = (() => {
        // @ init : close over whatevs at this node.
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        const 
            auth = o.Auth()
            ,eb = o.EB()
            ,eTypes = eb.eTypes()
            ,logDeb = view.logDeb(cName)
            ,logErr = view.logErr(cName)
            ,logFocus = view.logFocus(cName)
        
        // @ Asynch listeners/handlers here
        // ...

        // @ render
        // Handler per content of this (cName) data key 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... handle/render if component key (cName) exists in this state log.
        }
    })()
//... To make keys[..] available app-wide, uncomment the invocation, 
//    thereby injecting this module's content into the app object (window namespace):
})//(window[__APP__] = window[__APP__] || {}) 

// View : http
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'http'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,state = o.State()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,log = view.log(cName)
        ,logDeb = view.logDeb(cName)
        ,debugOFF = o.log.debugOFF  // ''
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)

    logDeb(debugOFF)

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        /***********************************************************
         * Render a transient HTTP-status text to the target node.
         **********************************************************/
        const  // @ init
            /************************************************************* 
             * Track http-component state (hstate):
             * - Notify only on diff-to-diff HTTP code change or on 200.
             * - Collect timeout ids for cancellation across states.
             ************************************************************/
            hstate = {http: {}, last: '', cursor: 0, length: 0, ids: []}

            // Transient FX :: Add/Remove per hstate.
            ,transientFX = (ns, mode) => {

                if (mode === 0) return //... abort if replay.

                ;((ns.http.status === 200) && (ns.cursor !== 0)) 
                    ? ( (ns.length)
                            ? (cNode.textContent = `Messages: ${ns.length}`)
                            //: (cNode.textContent = `Message(s)`)
                            //: (cNode.textContent = `${ns.http.statusText.substring(0,11)} (${ns.http.status})`)
                            : (cNode.textContent = `${ns.http.statusText} (${ns.http.status})`)
                    )
                    //: (cNode.textContent = `${ns.http.statusText.substring(0,11)} (${ns.http.status})`)
                    : (cNode.textContent = `${ns.http.statusText} (${ns.http.status})`)

                // Transient FX :: Add
                cNode.classList.add('transient') 

                // Style per code category (HTTP Nnn), per (dataset API) value @ `data-net=<value>` 
                ;((199 < ns.http.status) && ( ns.http.status < 305))
                    ? (cNode.dataset.net = '')
                    : ( (ns.http.status < 200) 
                        ? (cNode.dataset.net = 'info')
                        : (cNode.dataset.net = 'fail')
                    ) 

                // Transient FX :: Remove
                ns.ids.push(o.aDelay(o.cfg.view.timeTransientFX, () => {
                    cNode.classList.remove('transient')
                    cNode.textContent = ''
                    cNode.dataset.net = ''
                }))//... collecting IDs of these delayed transients.
            }

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            if (!(data.http && data.http.status)) return 

            hstate.http   = data.http
            hstate.cursor = state.cursor
            hstate.length = (data.msg_list && data.msg_list.list.length) || 0

            // If http status is unchanged, then abort unless new content (HTTP 200).
            // If notify, then first cancel all (probably one) prior transient(s).
            ;((hstate.last !== hstate.http.status) || (hstate.http.status === 200)) 
                && ( hstate.ids.map(id => clearTimeout(id))
                    ,hstate.ids.length = 0
                    ,cNode.classList.remove('transient')
                    ,o.aDelay(222, transientFX, hstate, data.mode)
                )

            // Reckon new state, then garbage collect.
            hstate.last = hstate.http.status

            logDeb({
                code: data.http.status,
                text: data.http.statusText, 
                url:  data.http.req ? data.http.req.url : '???', 
            })

            ;( debugOFF && (hstate.http.status === 200) ) ? view.gc(data.http) : true

            return
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : channel : timeline|slug|thread channel
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'channel'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,keys = view.components

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 

        const 
            eb = o.EB()
            ,eTypes = eb.eTypes()
            ,logDeb = view.logDeb(cName)
            ,logErr = view.logErr(cName)
            ,logFocus = view.logFocus(cName)
            ,ghost = o.create('GHOST')
            ,chnMenu = o.css('#channel-header SECTION.menu')
            ,owner = o.css('#owner')
            ,aboutOwner = o.css('#owner .upper .about')
            ,chnButtons = o.css('#owner .channel .buttons')
            ,sponsor = !owner ? ghost : o.cssAll('.sponsor>div', owner)
            ,qTokens = !owner ? ghost : o.css('.sponsor span[data-title="qToken', owner)
            ,subers  = !owner ? ghost : o.css('.about .stats table[data-followers] td', owner)
            /*****************************************************************************
             * If auth-user is channel owner and view is not Single-thread, 
             * then show 'New Message' button (formMsgNew), which is hidden by default, 
             * else hide channel menu ('Outgoing', '+Incomming').
             ***************************************************************************/
            ,formMsgNew = o.css('#form-msg-new') 
            ,doShowIf = (oid) => (as) => (as.sub === oid) 
                            ? ((formMsgNew && !o.css('#article')) && formMsgNew.classList.remove('hide'))
                            : (chnMenu && chnMenu.classList.add('hide'))
            /***************************************************
             * (Re)Read DOM as message list renders;
             * scroll to hash-marked message if/when rendered.
             * 
             * TODO : Handle @ msg-list render loop;
             * scroll to message whenever it's rendered.
             **************************************************/
            ,goToHash = () => { 
                const 
                    validSelector = window.location.hash && isNaN(+window.location.hash.substring(1))
                    ,target = validSelector && o.css(`${window.location.hash}`)
                    ,yTarget = target ? target.getBoundingClientRect().top : 0
                
                if (!target) return

                window.scrollTo({
                    top: window.pageYOffset + yTarget - (20 + 40),
                    left: 0,
                    behavior: 'smooth'
                })
                o.aDelay(1000, () => window.removeEventListener('scroll', goToHash))
            }

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
    
            // @ /sub channel, show only a subset of #owner els
            if (data.channel.slug === 'sub') {
                aboutOwner.classList.add('hide')
                chnButtons.classList.add('hide')
            } else {
                //(Re)Set counts dynamically
                //  @ qTokens count 
                data.channel.tokens_q 
                    && o.setText(qTokens, data.channel.tokens_q.toLocaleString('en-US'))
                // @ Followers count 
                sc = (+data.channel.subers_free + +data.channel.subers_paid)
                o.setText(subers, sc.toLocaleString('en-US'))
            }
            // show/hide elements per auth-user status
            formMsgNew && eb.sub(eTypes.Auth, doShowIf(data.channel.owner_id))

            false && view.gc(data[cName], 'chn_id', 'slug')
            //... retain only what's required for net requests

            /*********************************************
             * Scroll to message whenever it's rendered.
             * TODO : Handle @ msg-list render loop;
             ********************************************/
            data.list && o.aDelay(1000, goToHash)
            data.list && window.addEventListener('scroll', goToHash)
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : owner : timeline channel
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'owner'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)
        ,state = {update: undefined}

    /*********************************************
     * Set #owner elements and FX
     * per either auth-status or state-log event.
     ********************************************/
    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        const 
            ghost = o.create('GHOST')
            ,badgesNode = o.css('.badges', cNode) || ghost
            ,chnID = o.css('#channel').dataset.channelId || ''
            //,subs = o.cssAll('#owner .upper .about .stats h3') || []
            //,subing = o.cssAll('#owner .upper .about .stats h3[data-following] span')[1] || ghost
            ,owner = o.id('#owner')
            ,avatar = o.css('#owner .upper img.avatar') || ghost
            ,banner = o.css('#owner .upper img.banner') || ghost

            ,state = {invalid: true, virgin: true}

            /***************************************************
             * FX : Set Follow/Unfollow and such per auth.user
             **************************************************/
            ,doAuthStatusFX = (as) => {
                const subed = []
                as.user && (
                    o.arrsConcat(subed, as.user.subed_paid),
                    o.arrsConcat(subed, as.user.subed_free)
                )
                const
                    follow = o.css('#owner .upper .channel .buttons .follow span[data-title]') || ghost
                    ,actxn = subed.filter(cid => (cid === chnID)).length 
                                ? 'Unfollow' : 'Follow'

                follow.dataset.title = actxn
                follow.textContent = actxn
            }

        // Listen to auth-status events (changes)
        eb.sub(eTypes.Auth, doAuthStatusFX) 

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            // Idempotent per owner.date_update 
            if (state.update === data.owner.date_update) return false

            // Set avatar per first letter of owner's display name
            //avatar.src && (avatar.src = view.avatarMBF(data.owner.display)) 
            // avatar.src &&  data.owner.avatar 
            //     ? (avatar.src = `/sa/media/avatars/${data.owner.avatar}`) 
            //     : (avatar.src = view.avatarLatin(data.owner.display)) 
            // avatar.src = data.owner.avatar 
            //                 ? `/sa/media/avatars/${data.owner.avatar}`
            //                 : view.avatarMBF(data.owner.handle)

            avatar.src = data.owner.avatar 
                ? view.avatar(data.owner.avatar) 
                : view.avatarMBF(data.owner.handle)

            banner.src = view.banner(data.owner.banner) 

            // Show owner badges, if any, else hide element.
            badgesNode 
                && data.owner.badges 
                    ? o.toDOM(badgesNode, o.makeBadgeNodes(data.owner.badges).join(' '))
                    : badgesNode.classList.add('hide')

            // Show Followers/Following count(s) if any, else hide, per count.
            // subs[0] 
            //     && !(+(subs[0].dataset.followers)) && (subs[0].classList.add('hide'))
            // subs[1] 
            //     && !(+(subs[0].dataset.following)) && (subs[1].classList.add('hide'))

            // Show Followers count if any; one-way unhide.
            // data.owner.subing && (o.setText(subing, 
            //         data.owner.subing.toLocaleString('en-US')
            //     )
            // )

            // Set idempotence flag
            state.update = data.owner.date_update

            false && view.gc(data[cName], 'user_id') 
            return true
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : msgListMenu
;(function (o, undefined) {
    'use-strict'
 
    // Abort if @ app/Centre page; its #msg-list-menu handled at other view key. 
    if (o.css('#centre')) return 

   // @ init
    const 
        cName = 'msgListMenu'
        ,cSelector = `#msg-list-menu`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)
        ,ss = o.State().store

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        /*****************************************************************************
         * This clickable msg-list menu is static, 
         * so its event handler is attached and closed over upon init. 
         * All dynamics are handled per event therein; no per-data doings here. 
         * Events (message-render requests) are published for Actions handler,
         * which sets mode and such, and then publishes for State.
         *****************************************************************************/
        const 
            msgListMenu = o.css('#msg-list-menu')
            ,menu = o.cssAll('li', msgListMenu) 
            ,newest = 'Newest'
            ,oldest = 'Oldest'
            ,reqChron   = menu[0]
            ,reqThreads = menu[1]
            ,reqToggle  = menu[2]
            
            /******************************************************
             * 2nd throttler keeps menu disabled whilst msg-list 
             * of dynamic length (re)renders in declarative time.
             *****************************************************/
            ,tally = () => o.cssAll('#msg-list div.msg').length || 3
            ,toggleChron = (order) => {
                reqChron.dataset.disable   = 'true'
                reqThreads.dataset.disable = 'true'
               o.aDelay((300 + view.dtReplayRender*tally()), () => {
                    reqChron.textContent = order
                    reqChron.dataset.disable   = ''
                    reqThreads.dataset.disable = ''
                })
            }

            ,active = 'active'
            ,setActive = (x) => {
                if (x.nodeName !== 'LI') return
                ;[...menu].map(li => li.classList.remove(active))
                x.classList.add(active)
            }
            ,onClick = (e) => {
                (e.target.textContent === 'Chron') 
                    && (e.target.textContent = oldest)

                const want = e.target.textContent

                // Conditionally disable 2nd throttler; dynamic per messages count. 
                if (menu[0].dataset.disable === 'true') 
                    return

                setActive(e.target)

                /********************************
                 * Publish the menu-click event
                 *******************************/
                want && eb.pub(eTypes.MsgListMenu, {want: want})

                /**************************************************************
                 * Menu FX
                 *
                 * Menu state set (per dataset) to value of want IIF oldest, 
                 * newest or thread; here to isolate from other/future wants.
                 *************************************************************/

                 // If chron request, then toggle order; disable menu during.
                ;(want === newest)
                    && toggleChron(oldest)
                ;(want === oldest)
                    && toggleChron(newest)

                // If either chron requested, then set menu state, 
                // and disable threads count and toggler.
                ;((want === oldest) || (want === newest))
                    && ( (reqToggle.dataset.disable = 'true')
                        ,(reqThreads.dataset.count = '')
                        ,(msgListMenu.dataset.state = want)
                    )

                // If Threads requested, then set menu state
                // and reset chron and enable threads toggler.
                ;(want === 'Threads')
                    && ( (reqChron.textContent = 'Chron')      // INIT
                        ,(reqToggle.dataset.disable = '')
                        ,(msgListMenu.dataset.state = want)
                    )
            }
            /****************************************************
             * Init menu by synthesizing a click event
             * at menu item selected per config param.
             * Fires on first eTypes.Net message; once and off.
             ***************************************************/
            ,ev = new Event('click', {"bubbles": true, "cancelable": false})
            ,menuInit = (ebMsg) => {
                // Initialize menu per config param
                !!(view.cfgMsgs.menuActive === 'Threads')
                    ? reqThreads.dispatchEvent(ev)
                    : reqChron.dispatchEvent(ev)
                // Remove event listener
                eb.off(eTypes.View, menuInit)
            }

        /*******************
         * Listen/Publish 
         *****************/
        msgListMenu && msgListMenu.addEventListener('click', o.throttle(view.dtThrottle, onClick))

        menuInit()

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... self is the only publisher of this key; once, on init.

            return
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

// View : centreListMenu
;(function (o, undefined) {
    'use-strict'

    return
    if (!o.css('#centre')) return 

    // @ init
    const 
        cName = 'centreListMenu'
        ,cSelector = `#msg-list-menu`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)
        ,ss = o.State().store

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        /*****************************************************************************
         * This clickable msg-list menu is static, 
         * so its event handler is attached and closed over upon init. 
         * All dynamics are handled per event therein; no per-data doings here. 
         * Events (message-render requests) are published for Actions handler,
         * which sets mode and such, and then publishes for State.
         *****************************************************************************/
        const 
            lTypeMenu = o.css('#msg-list-menu')

            ,menu = o.cssAll('LI', lTypeMenu) 
            ,newest = 'Newest'
            ,oldest = 'Oldest'
            ,reqChron   = menu[0]
            ,reqThreads = menu[1]
            ,reqToggle  = menu[2]
            
            /******************************************************
             * 2nd throttler keeps menu disabled whilst msg-list 
             * of dynamic length (re)renders in declarative time.
             *****************************************************/
            ,tally = () => o.cssAll('#msg-list div.msg').length || 3
            ,toggleChron = (order) => {
                reqChron.dataset.disable   = 'true'
                reqThreads.dataset.disable = 'true'
               o.aDelay((300 + view.dtReplayRender*tally()), () => {
                    reqChron.textContent = order
                    reqChron.dataset.disable   = ''
                    reqThreads.dataset.disable = ''
                })
            }

            ,active = 'active'
            ,setActive = (x) => {
                if (x.nodeName !== 'LI') return
                ;[...menu].map(li => li.classList.remove(active))
                x.classList.add(active)
            }
            ,onClick = (e) => {
                (e.target.textContent === 'Chron') 
                    && (e.target.textContent = oldest)

                const want = e.target.textContent

                // Conditionally disable 2nd throttler; dynamic per messages count. 
                if (menu[0].dataset.disable === 'true') 
                    return

                setActive(e.target)

                /********************************
                 * Publish the menu-click event
                 *******************************/
                want && eb.pub(eTypes.MsgListMenu, {want: want})

                /**************************************************************
                 * Menu FX
                 *
                 * Menu state set (per dataset) to value of want IIF oldest, 
                 * newest or thread; here to isolate from other/future wants.
                 *************************************************************/

                 // If chron request, then toggle order; disable menu during.
                ;(want === newest)
                    && toggleChron(oldest)
                ;(want === oldest)
                    && toggleChron(newest)

                // If either chron requested, then set menu state, 
                // and disable threads count and toggler.
                ;((want === oldest) || (want === newest))
                    && ( (reqToggle.dataset.disable = 'true')
                        ,(reqThreads.dataset.count = '')
                        ,(lTypeMenu.dataset.state = want)
                    )

                // If Threads requested, then set menu state
                // and reset chron and enable threads toggler.
                ;(want === 'Threads')
                    && ( (reqChron.textContent = 'Chron')      // INIT
                        ,(reqToggle.dataset.disable = '')
                        ,(lTypeMenu.dataset.state = want)
                    )
            }
            /****************************************************
             * Init menu by synthesizing a click event
             * at menu item selected per config param.
             * Fires on first eTypes.Net message; once and off.
             ***************************************************/
            ,ev = new Event('click', {"bubbles": true, "cancelable": false})
            ,menuInit = (ebMsg) => {
                // Initialize menu per config param
                !!(view.cfgMsgs.menuActive === 'Threads')
                    ? reqThreads.dispatchEvent(ev)
                    : reqChron.dispatchEvent(ev)
                // Remove event listener
                eb.off(eTypes.View, menuInit)
            }

        /*******************
         * Listen/Publish 
         *****************/
        lTypeMenu && lTypeMenu.addEventListener('click', o.throttle(view.dtThrottle, onClick))

        menuInit()

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... self is the only publisher of this key; once, on init.

            return
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 
// View : auth
;(function (o, undefined) {
    'use-strict'
    /***********************************************************
     * Process per auth status
     * 
     * Yet here relying on data key, not auth-status object, 
     * unlike all others. Why? Is this as reliable?
     * Always has auth.user ???
     **********************************************************/
    const 
        cName = 'auth'
        ,cSelector = `#view header section.action`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)

    keys[cName] = (() => {
        if (!view.validate.node(cNode, cSelector)) return function() {} 

        // @ init
        const
            actionNode = cNode
            ,actionNodeLogout = o.css('#view HEADER SECTION.menu UL LI A[href="/app/logout"]') 
            ,actionLogoutPerAuth = (is) => is 
                ? actionNodeLogout.style.display = 'block' 
                : actionNodeLogout.style.display = 'none'

            ,home =  o.css('#view HEADER SECTION.nav UL LI A[href="#home"]')
            
            ,menu =  o.css('#view HEADER SECTION.menu UL')
            ,start = o.css('#view HEADER SECTION.menu UL LI A[href="/app/start"]')
            ,menuIsDisplayed = menu && (menu.style.display !== 'none')

            ,atLogin = '/app/login'
            ,atLogout = '/app/logout'
            ,atLogoutRedirect = '/app/centre'
            ,atSignup = '/app/signup'
            
            ,actionLoginSignup = `<span><a href="${atLogin}">Login</a>|<a href="${atSignup}">Signup</a></span>`
            ,actionLogout = `<span><a href="${atLogout}">Logout</a>`

            ,onClick = (ev) => {
                /**********************************************************************
                 * Events that warrant a purge of auth credentials are handled hereby.
                 * Prior to satisfying the click request, the auth store is purged 
                 * and the AOA service is called per async request 
                 * to EXPIRE the auth-reference and nonce COOKIES.
                 *********************************************************************/
                ev.preventDefault()
                const target = ev.target.pathname 

                // Redirect @ Logout
                ;(target === atLogout)
                    && ( auth.Purge().then(() => (o.aDelay(100, 
                        () => window.location.href = atLogoutRedirect
                    ))))

                // Redirect @ Login/Signup
                ;((target === atLogin) || (target === atSignup))
                    && ( auth.Purge().then(() => (o.aDelay(100, 
                        () => window.location.href = target
                    ))))
            }

        /*************
         * Listeners
         ***********/

        actionNode && actionNode
            .addEventListener('click', o.throttle(555, onClick))

        actionNodeLogout && actionNodeLogout
            .addEventListener('click', o.throttle(555, onClick))

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            if (!data.auth.a || !data.auth.r) return false
            if (!data.auth.user) return false

            const 
                authenticated = !!o.ttl(data.auth.r.exp)
                ,authorized   = !!o.ttl(data.auth.a.exp)

            /*******************************************************************************
             * - Show Home anchor and set its href per auth-user.
             * - Set apropos Login/Signup or Logout, per auth state, 
             *   at either menu or action node, per viewport width.
             *      - Login/Signup displays at action node regardless of viewport width.
             *      - Logout displays at menu node if slim (dropdown), else at action node.
             * 
             * Logout button FAIL @ edge-case: 
             *      If auth'ed @ slim viewport and then change to wide, 
             *      sans page reload, then Logout action is lost until page reload.
             ******************************************************************************/
            ;(authenticated || authorized)
                ? ( o.purge(actionNode)
                    ,(menuIsDisplayed && o.toDOM(actionNode, actionLogout))
                    ,home.classList.remove('hide')
                    ,(home.href = `/${data.auth.user.handle}/pub`)
                    ,start.classList.add('hide')
                )
                : ( o.purge(actionNode)
                    ,actionLogoutPerAuth(false)
                    ,o.toDOM(actionNode, actionLoginSignup) 
                )

            // If not authenticated, then purge auth store and request logout service. 
            !!authenticated || auth.Purge()
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 
;(function (o, undefined) {
    'use strict'
    /****************************************************************
     * @ /app/SLUG : Account | Exchange | Profile | Centre
     * 
     * Listen for Auth events; reset per auth-status obj; 
     * listen, edit and such on targeted click events thereafter.
     ***************************************************************/

     // TODO : Segregate : one JS file per page; this file has grown too muddled.

    const 
        app = o.css('#app') //... @ app-owned channels (pages)
        ,install =  app && o.css('#install')
        ,account =  app && o.css('#account') 
        ,exchange = app && o.css('#exchange')
        ,profile =  app && o.css('#profile')
        ,chnMenu =  app && o.css('#channel-header .menu')

    if (!install && !account && !exchange && !profile && !chnMenu) 

        return 

    const 
        cfg = o.cfg.view
        ,srcID = 'chns'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = ''//o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,ss = o.State().store

        // DOM
        ,ghost = o.create('GHOST')
        //,header = o.css('HEADER')
        ,header = o.css('SECTION.wrapper')
        ,accountH1= o.css('#account H1')
        ,chnMenuButtons = chnMenu ? {
            one: o.css('LI A[href="#1"]', chnMenu),
            two: o.css('LI A[href="#2"]', chnMenu),
            three: o.css('LI A[href="#3"]', chnMenu),
        } : null
        ,content = o.cssAll('#app .content>*')
        ,contentIDs = content ? [...content].map(el => el.id) : []

        // DOM : Exchange page
        ,addP = exchange && o.css('#add-p dt a')
        ,exch = exchange ? {
            addQ: {
                dt: o.css('#add-q dt'), 
                dd: o.cssAll('#add-q dd'),
                a: o.css('#add-q dt a')
            },
            redeemP: {
                dt: o.css('#redeem-p dt'), 
                dd: o.cssAll('#redeem-p dd')
            },
            sponsor: {
                dt: o.css('#sponsor dt'), 
                dd: o.cssAll('#sponsor dd'),
                a: o.css('#sponsor dt a')
            },
            subscribe: {
                dt: o.css('#subscribe dt'), 
                dd: o.cssAll('#subscribe dd')
            },
        } : {}
        ,doToggleExch = (dd) => (ev) => {
            dd[0].classList.toggle('hide') 
            dd[1].classList.toggle('hide')

            // @ Add q, guard the internal form against unauthorized users.
            !!(ss.auth && ss.auth.sub) || (dd[1].dataset.def === "q") && (
                dd[1].innerHTML = `
                    <h1 class="center">
                        <a href="/app/login" class="button">
                            Requires Login
                        </a>
                    </h1>&nbsp;</h1>
                `
            )
        }
        ,ddAll = exchange ? o.cssAll('DL', exchange) : []
        ,dlHashTargets = exchange ? {
            addq: o.css('#add-q'),
            //redeem: o.css('#redeem'),
            sponsor: o.css('#sponsor'),
            subscribe: o.css('#subscribe'), 
            inform: o.css('#inform'),
        } : { install: install}

        // Exchange : Form P2q : Add q 
        ,formP2q = o.css('#add-q form')
        ,amount = formP2q && o.css('input[name="amount', formP2q)
        ,submit = formP2q ? o.css('button', formP2q) : ghost
        ,chkValidity = (ev) => amount 
                                && amount.checkValidity() 
                                    ? ( amount.classList.remove('invalid')
                                        ,(submit.disabled = false)
                                        ,true
                                    )
                                    : ( amount.classList.add('invalid')
                                        ,(submit.disabled = true)
                                        ,false
                                    )

        // DOM : Profiles page 
        /****************************************************
         * UPDATE
         * Segregated the add-a-profile page into two
         * separate pages, /app/profile-{buyin,payout},
         * accessed through selection page; /app/profiles .
         * 
         * This to satisfy the host script, AcceptUI.js, 
         * which expects its ONE contact form present 
         * upon page load.
         ***************************************************/
        ,formContainer = o.css('#form-container')
        ,addBuyinProfile = o.css('#profile-buyin dt')
        ,addPayoutProfile = o.css('#profile-payout dt')
        ,profileInfo = o.css('.profile-info', profile)
        ,doToggleAddBuyinProfile = () => {
            if (hostScriptFail()) return
            formContainer.classList.toggle('hide') 
            profileInfo.classList.toggle('hide')
        }
        ,doToggleAddPayoutProfile = () => {
            if (hostScriptFail()) return
            formContainer.classList.toggle('hide') 
            profileInfo.classList.toggle('hide')
        }

        ,h2 = o.css('#profile-buyin dt a h2')
        // If fail @ AcceptUI.js 
        ,hostScriptFail = () => h2 && (h2.dataset.hostScriptFail === "1")

        // DOM : Account page
        ,settings = o.css('#settings')
        ,edit    = settings ? o.css('H2 a[href="#edit"]', settings)   : ghost
        ,save    = settings ? o.css('H2 a[href="#save"]', settings)   : ghost
        ,cancel  = settings ? o.css('H2 a[href="#cancel"]', settings) : ghost
        ,editElsNew = {}

        // as.user : Element keys are model key names
        ,asUserEdits = account ? {
            handle:   o.cssAll('#handle td')[1]  || ghost
            ,display: o.cssAll('#display td')[1] || ghost
            ,about:   o.cssAll('#about td')[1]   || ghost
            ,email:   o.cssAll('#email td')[1]   || ghost
        } : {}
        ,asUserStatics = account ? {
            tokens_p:  o.cssAll('#token-p td')[1] || ghost
            ,tokens_q: o.cssAll('#token-q td')[1] || ghost
            ,qrate:    o.cssAll('#qrate td')[1]   || ghost
            ,profile_buyin:  o.cssAll('#buyin td')[0]  || ghost
            ,profile_payout: o.cssAll('#payout td')[0] || ghost
            ,subing: o.css('#subscriptions h2 .count') || ghost
        } : {}
        
        ,paidSubs = o.css('#subscriptions table')
        ,ownedChns = o.css('#channels table')
        
        ,state = {as: {}, subs: [], idem: false}
        
        ,input = (name, val) => {
            // Set asUserEdits[name] to input el if val, else reset to and return input.value .
            // In effect, toggle target as editable or not, per val, capturing its current state.
            if (!asUserEdits[name]) 
                return 

            if (val) { 
                // Make name editable 
                asUserEdits[name].innerHTML = `
                    <input type="text" 
                        name="${name}" 
                        value="${val.trim()}"
                        required
                        pattern=[A-Za-z0-9]{3,256}>
                `
                // TODO ...
                // ;(name === 'about') 
                //     && (asUserEdits[name].innerHTML = `
                //             <textarea type="text" 
                //                 name="${name}"
                //                 value="${val.trim()}"
                //                 required
                //                 pattern=[A-Za-z0-9]{3,256}></textarea>
                //         `)
            } else {
                // Make name uneditable
                const input = o.css('input', asUserEdits[name])
                asUserEdits[name].innerHTML = input ? input.value : '--'
                return input ? input.value : '--'
            }

        }
        ,doEdit = (ev) => {
            if (!(state.as && state.as.user))
                return //... should never be.

            // PUT changes on Save (click)
            if (ev.target.href.substring(ev.target.href.length - 5) === '#save') {
                Object.keys(asUserEdits).map(name => (editElsNew[name] = input(name).trim()))

                putChanges(state.as)
            }

            // Toggle Edit/Save/Cancel anchors, 
            ;[edit, save, cancel].map(el => el.classList.toggle('hide'))

            // Set all asUserEdits (els) as either editable or not, per status of the edit element. 
            edit.classList.contains('hide') 
                ? Object.keys(asUserEdits).map(name => input(name, (state.as.user[name]) || ' '))
                : Object.keys(asUserEdits).map(name => (asUserEdits[name].innerHTML = state.as.user[name]))
        }
        ,putChanges = (as) => {
            const 
                uri = `/u/${as.sub}`
                ,payload = {csrf: o.rand(22)}

            // Send only changed-value key(s); abort if none.
            var flag = false
            Object.keys(editElsNew).map(name => 
                (editElsNew[name] !== as.user[name])
                    && ((payload[name] = editElsNew[name])
                        ,(flag = true)
                    )
            )
            if (!flag) return

            logDeb('@putChanges(..)', 'payload', payload)

            // PUT the updated user keys per AJAX
            auth.FetchAPI('PUT', uri, payload)
                .then(r => (r.meta.status === 204) ? r : Promise.reject(r))
                .then(logDeb)
                // Get updated user record, and update the DOM (Settings) with it.
                .then(() => o.Auth().SubRecordGet())
                .then((u) => Object.keys(asUserEdits)
                                .map(name => (asUserEdits[name].innerHTML = u[name]))
                )
                .catch(logErr)
        }
        ,getSubscriptions = (as) => {
            /********************************************************
             * Retrieve this auth-user's paid-subscriptions record,
             * and insert the info into apropos DOM elements.
             * 
             * Currently, only channel models are handled.
             * TODO: user and group subscriptions.
             ******************************************************/
            const 
                // Set uri per subject user's ID retrieved from auth-status.
                uri = as.sub ? `/cl/paid/${as.sub}` : ''

                // DOM insertions : each table row is a channel.SponSub record.
                ,respHandler = (resp) => {
                    logDeb('@ getSubscriptions(as) : respHandler(resp) : resp:', resp)
                    const paidSubsRows = o.cssAll('tr', paidSubs)
                    state.subs = resp.body ? resp.body : [] //... save for doUnsubscribe(..)
                    // Remove all rows except that of heading
                    ;[...paidSubsRows].map((tr,i) => (i > 0) && (tr.remove())) //... 96% !!!
                    // Insert sponsub(s) per table row
                    if (!(state.subs && state.subs.list && state.subs.list.length)) return
                    state.subs = state.subs.list
                    state.subs.map((sub) => o.toDOM(paidSubs, `
                        <tr>
                            <td class="text-left"><a href="${sub.uri_local}">${sub.uri_local}</a></td>
                            <td>${sub.payment}</td>
                            <td>${sub.interval ? sub.interval : 'once'}</td>
                            <td>${Math.round((o.UTCtoSec(sub.date_expiry) - o.nowSec())/86400)}</td>
                            ${sub.interval ? `<td><a href="#${sub.id}" class="button">✕</a></td>` : '<td>&nbsp;</td>'}
                        </tr>
                    `))
                }

            logDeb('@ getSubscriptions(as) : as:', as)

            /*********************************************
             * Response body is of []channel.SponSub{..}
             ********************************************/
            uri ? auth.FetchAPI('GET', uri)
                        .then(respHandler)
                        .catch(logErr)
                : logErr('@ getSubscriptions(as)')
        }
        ,getOwnedChns = (as) => {
            /********************************************************
             * Retrieve this auth-user's (owner's) channel records,
             * and insert the info into apropos DOM elements.
             ******************************************************/
            const 
                // Set uri per subject user's ID retrieved from auth-status.
                uri = as.sub ? `/cl/owned/${as.sub}` : ''

                // DOM insertions : each table row is a channel.Channel record.
                ,respHandler = (resp) => {
                    logDeb('@ getOwnedChns(as) : respHandler(resp) : resp:', resp)
                    const ownedChnRows = o.cssAll('tr', ownedChns)
                    // Remove all rows except that of heading
                    ;[...ownedChnRows].map((tr,i) => (i > 0) && (tr.remove())) //... 96% !!!
                    if (!(resp.body && resp.body.list && resp.body.list.length)) return
                    // Insert channel(s) per table row; skip timeline channels
                    resp.body.list.map((chn) => true
                        && o.toDOM(ownedChns, `
                            <tr>
                                <td class="text-left">
                                    <a href="/${as.user.handle}/${chn.slug}">${as.user.handle}/${chn.slug}</a>
                                </td>
                                <td>${chn.sub_rate}</td>
                                <td><a href="/app/channel/#${chn.chn_id}" class="button">Edit</a></td>
                            </tr>
                        `)
                    )
                }

            logDeb('@ getOwnedChns(as) : as:', as)
            /*********************************************
             * Response body is of []channel.Channel{..}
             ********************************************/
            uri ? auth.FetchAPI('GET', uri)
                        .then(respHandler)
                        .catch(logErr)
                : logErr('@ getOwnedChns(as)')
            
        }
        ,doUnsubscribe = (ev) => {
            if (ev.target.nodeName !== 'A') return
            if (!ev.target.hash.substring(1)) return
            const
                target = ev.target.hash.substring(1)
                ,payee = state.subs.filter((sub) => (target === sub.id))[0].payee_id
                ,txn = payee ? {
                    act: o.TxnAct.Subscribe,
                    xid: ev.target.hash.substring(1),
                    xis: o.TxnXIS.Channel,
                    payer_id: ss.auth.sub,
                    payee_id: payee,
                    tokens_q: -2,
                    tokens_p: 0,
                    csrf: o.rand(22)
                } : null
                ,uri = '/x'
                ,respHandler = (resp) => {
                    /****************************************
                     * @ Success, update auth-user record, 
                     * and then reset DOM's Subscriptions. 
                     ***************************************/
                    if (resp.meta.status === 201) {
                        o.Auth().SubRecordGet()
                                .catch(logErr)
                    } else {
                        logErr('FAIL @ doUnsubscribe(as) : respHandler(resp) : resp:', resp)
                    }
                }

            txn && auth.FetchAPI('POST', uri, txn)
                        .then(respHandler)
                        .catch(logErr)
        }
        ,doDeleteProfile = (ev) => {
            /**********************************************************************
             * TODO: This is a simple update of a user record; sans transaction.
             **********************************************************************/
        }
        ,doPerAuthStatus = (as) => {
            state.as = as
            logDeb('@ doPerAuthStatus(as) : as:', as)
            /************************************************
             * Reset DOM els per (auth-status obj) user keys
             ***********************************************/
            // Abort lest valid auth-status obj
            if (!o.ttl(as.r.exp) || !as.user) {
                edit && edit.classList.add('warn')
                return
            } 

            // Show user-account handle (replace 'Account') 
            o.setText(accountH1, `/${as.user.handle}`)

            // Show user-account fields per matching key
            Object.keys(asUserEdits)
                .map(name => o.setText(asUserEdits[name], as.user[name]))

            // Show other user-account elements
            Object.keys(asUserStatics)
                .map(name => o.setText(asUserStatics[name], as.user[name].toLocaleString('en-US')))

            // Show/Reset subscriptions count to that of paid only (recurring + one-off)
            ;(as.user && asUserStatics.subing) 
                && o.setText(asUserStatics.subing, 
                    (as.user.subed_recur.length + as.user.subed_once.length).toLocaleString('en-US')
                )

            // Subscriptions : Get/Show all paid subscriptions of auth-user
            getSubscriptions(as)
            // Channels : Get/Show all channels owned by auth-user
            getOwnedChns(as)
            
            // Listen @ Edit/Save/Cancel
            settings && [edit, save, cancel].map(el => el 
                && el.addEventListener('click', doEdit)
            )

            // Set Exchange mode per user's buyin-profile status
            addP && (as.user.profile_buyin
                ? addP.href = '/app/c4' // per profile
                : addP.href = '/app/c3' // per card info (hosted popup form)
            )
        }
        ,doP2qExchange = () => {
            if (state.idem)  return
            state.idem = true 
            submit.disabled = true

            const 
                txn = {
                    act: o.TxnAct.P2q,
                    xid: ss.auth.sub,
                    xis: o.TxnXIS.User,
                    payer_id:  ss.auth.sub,
                    payee_id: ss.channel.owner_id,
                    tokens_q: 0,
                    tokens_p: parseInt(amount.value, 10) || 0,
                    csrf: o.rand(22)
                }
                ,uri = '/x'
                ,respHandler = (resp) => {
                    const 
                        success = () => (
                            exch.addQ.dd[1].innerHTML = `<h1>SUCCESS : <a href="/app/account">Account</a> updated</h1>`
                        ) 
                    // @ Fail, inform.
                    resp.body.error && (exch.addQ.dd[1].innerHTML = `<h1>FAIL : ${resp.body.error}</h1>`)
                    // @ Success, update auth-user record and inform.
                    ;(resp.meta.status === 201) && (
                        o.Auth().SubRecordGet()
                            .then(success)
                            .catch(logErr)
                    )
                }

            auth.FetchAPI('POST', uri, txn)
                    .then(respHandler)
                    .catch(logErr)
        }
        ,doGoToHash = (ev) => {
            if (ev.target.innerText && ev.target.innerText.includes('WordPress Plugin'))
                return
            if (!ev.target.hash && !window.location.hash) 
                return
            if (o.getText(ev.target) === 'Account') 
                return
            if (ev.target.innerText === 'Requires Login')
                return
            ev.preventDefault()
            if ((ev.target.nodeName !== 'A') && (ev.target.nodeName !== '#document')) {
                return
            }
            if (ev.target.hash || window.location.hash) {
                const 
                    target = (ev.target.hash && o.css(`${ev.target.hash}`))
                            || (window.location.hash && o.css(`${window.location.hash}`))
                    ,yTarget = target ? target.getBoundingClientRect().top : 0

                window.scrollTo({
                    top: window.pageYOffset + yTarget - (20 + header.clientHeight),
                    left: 0,
                    behavior: 'smooth'
                })
            }
        }
        ,doGoToCentre = (ev) => {
            /**********************************************************
             * @ /app/centre : scroll to content per menu selection
             * DEPRICATED: Instead of scroll to content, using
             * chnMenu click listen/handle : doShowContent(..)
             *********************************************************/
            logFocus(ev.target)
            if (!ev.target.dataset.item) return 
             
            const 
                target = o.css(`#${ev.target.dataset.item}`)
                ,yTarget = target ? target.getBoundingClientRect().top : 0

            window.scrollTo({
                top: window.pageYOffset + yTarget - header.clientHeight,
                left: 0,
                behavior: 'smooth'
            })
        }
        ,doShowContent = (ev) => {
            /*********************************************
             * Toggle content per click @ chnMenu item
             ********************************************/
            contentIDs.filter((id,i) => 
                (ev.target.hash === `#${i+1}`)
                    ? o.css(`#${id}`).classList.remove('hide')
                    : o.css(`#${id}`).classList.add('hide')
            )
        }

    logDeb(debugOFF)

    // If channel has a header menu, then add margin-top, else shrink logo
    chnMenu && (app.style.marginTop = '1em') //: logo.classList.add('small')

    // LISTENers

    // @ Any page having chnMenu
    chnMenu && chnMenu.addEventListener('click', doShowContent)

    // @ Account|Exchange page
    ;(account || exchange) && eb.sub(eTypes.Auth, o.throttle(3000, doPerAuthStatus))

    // @ Account : Unsubscribe
    paidSubs && paidSubs.addEventListener('click', doUnsubscribe)

    // @ Account : Delete Payment Profile 
    // TODO: ... this; a simple user update; sans transaction.

    // @ Exchange page
    Object.keys(exch).map(x => 
        exch[x].dt && exch[x].dt.addEventListener('click', doToggleExch(exch[x].dd))
    )
    if (exchange && !profile || install) {
        // Scroll to bookmark (hash) if exist
        self.addEventListener('load', doGoToHash) 
        Object.values(dlHashTargets).map(el => el.addEventListener('click', doGoToHash))
    }
    // Form : Add-q (P2q exchange)
    amount && amount.addEventListener('keyup', chkValidity)
    amount && chkValidity()
    formP2q && submit.addEventListener('click', doP2qExchange)

    // @ Profiles : Buyin / Payout
    //addBuyinProfile && addBuyinProfile.addEventListener('click', doToggleAddBuyinProfile)
    //addPayoutProfile&& addPayoutProfile.addEventListener('click', doToggleAddPayoutProfile)

    // Centre 
    //chnMenu && chnMenu.addEventListener('click', doGoToCentre)


})(window[__APP__] = window[__APP__] || {}) 

// View : msgList
;(function (o, undefined) {
    'use-strict'
    // @ init
    const 
        cName = 'msg_list'
        ,cSelector = `#msg-list`
        ,cNode = o.css(cSelector)

    if (!cNode) return 
    
    const 
        auth = o.Auth()
        ,view = o.View()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,log = view.log(cName)
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)
        ,prof = o.profile('View/msgList')
        ,debugOFF = o.log.debugOFF  // ''
        ,profOFF = o.log.profOFF    // ''
        ,inIframe = (window !== window.top)

    true && (prof.start(profOFF), logDeb(debugOFF))

    // @ init per page load
    keys[cName] = (() => { 
        if (!view.validate.node(cNode, cSelector)) return function() {} 
        /**********************************************************************
         * Messages are rendered in declarative time by one of two renderers, 
         * per thread or ad hoc, per state; dispatched per dType, full|diff. 
         * Multiple instances of both renderers, one per state, may run 
         * 'concurrently' (multiplexed), issuing requests for older 
         * messages per scroll events, per event-bus messaging. 
         *
         * Upon initial state, this function makes one request for newer 
         * messages, which triggers the Net module to schedule recurring 
         * requests for such, all of which are handled by ad-hoc renderer.
         * 
         * Caller is responsible for assuring uniqueness of messages.
         *********************************************************************/
        const  
            ss = o.State().store
            ,centre = o.css('#centre') //... top lists (popular, trending, newest)
            ,msgListMenu = o.css('#msg-list-menu')
            ,msgListMenuEls = o.cssAll('#msg-list-menu li') 
            ,msglistNode = o.css('#msg-list')
            ,articleNode = o.id('article')
            /***********************************
             * Render root msg @ thread view
            ***********************************/
            ,articleNodeAttr = (article) => {
                if (!articleNode) return false
                articleNode.dataset.articleId = article.id
                articleNode.dataset.authorId = article.author_id
                articleNode.classList.add('msg')
                return true
            }
            ,renderArticle = o.once((article) => articleNodeAttr(article) && o.toDOM(articleNode, `
                    <div class="msg">
                            <!-- 
                            <a href="/${article.path}#m-${article.id}">
                            -->
                                <h2 class="title">
                                    <div>
                                        ${article.title ? article.title : 'Thread Root'}
                                    </div>
                                    <div class="date" data-utc-time="${article.date}">
                                        <span>${o.ageNow(article.date)}</span>
                                    </div>
                                </h2>
                            <!-- 
                            </a>
                            -->
                        <div class="body">
                            ${article.body ? article.body : ''}
                            <div class="body-footer">
                                ${article.uri_other
                                ? '<a href="'+ss.channel.host_url+article.uri_other
                                    +'">Read @ '+ss.channel.host_url.split("/")[2]+'</a>' 
                                : ''
                                }
                            </div>
                        </div>
                        <div class="meta">
                            <div class="keywords"></div>
                        </div>
                    </div>
                `)
            )
            ,msgZero = {article: undefined}
            ,svgsPath = o.cfg.view.svgsPath
            ,avatars = o.cfg.view.avatars
            ,unitHeight = view.unitHeight
            ,h0 = unitHeight * 15 // ~ 2265
            ,t0 = o.nowMsec()
            // Multiplex rendering states/processes
            ,dormant = 1
            ,mutating = 0
            ,mutex = {messages: {full: dormant, diff: dormant}}  
            // List of thread object(s) whereof root node is a reply message 
            // awaiting a recipient that does not exist in the log at this state.
            ,awaitingRecipient = [] //... recipients are older than oldest fetched at current state.
            // Accumulated totals (across all states)
            ,dataAcc = {threads: 0, messages: 0, newest: 0, oldest: Infinity}
            // Collect IDs of async-scheduled renderings to allow for cancelling
            ,asyncIDs = [] 
            ,updateMsgsAge = () => {
                /************************************************************
                 * Age (text) of all messages is updated periodically
                 * per scheduler, onSchUpdateMsgsAge(), 
                 * launched once on first render. 
                 * Thereafter, updateMsgsAge() re-reads the (mutating) DOM 
                 * and updates the age text on each, per scheduled call.
                ***********************************************************/
                const messages = o.cssAll('#msg-list div.msg') || ''
                ;[...messages].map(msg => {
                    const
                        dateEl = o.css('div.date', msg)  
                        ,ageEl = o.css('div.date>span', msg) 

                    ;(dateEl && ageEl)
                        && o.setText(ageEl, o.ageNow(dateEl.dataset.utcTime))
                })
                !debugOFF && logDeb('Update Age of all :', messages.length,'@', o.nowUTC())
            }
            ,onSchUpdateMsgsAge = o.once(() => {
                logDeb("@ onSchUpdateMsgsAge() : LAUNCH")
                const waitSeq = [1,2,5].map(t => 60000*t)
                o.aScheduleSeq(o.seqArr(waitSeq, 0), updateMsgsAge)
            })
            // Set counts @ msgList menu. If rendering flat list (chron), then disable Threads count.
            ,menuTallys = (m, t, isChron) => {
                if (!(msgListMenuEls && msgListMenuEls.length)) return
                m && (msgListMenuEls[0].dataset.count = m)
                t && (msgListMenuEls[1].dataset.count = t)
                isChron && (msgListMenuEls[1].dataset.count = 'n/a')
            }
            // Read the (mutating) DOM
            ,tallyDOM = () => { 
                const 
                    tally = {//... counts of all rendered ...
                        messages: o.cssAll('#msg-list div.msg').length     // ALL messages
                        ,threads: o.cssAll('#msg-list>div.thread').length  // All primary threads
                    }
                //menuTallys(tally.messages, tally.threads)
                return tally 
            }

            // Dynamic scroll trigger for lazy fetch/render; account for dynamic DOM @ "infinite scroll".
            ,trigger = (ymax) => {
                const h = Math.round(msglistNode.scrollHeight) // dynamic; ~ 2650 @ 13 threads
                // Don't be too lazy too early lest view starved of content.
                return !!(Math.round(0.90*h*(1 - h0/h) - 3*unitHeight - ymax) < 0) 
            }

            /*************************************************************************
             * toggler : Expand/Collapse
             * - Expanded state has Collapse-titled button/graphic (#def-collapse).
             * - Collapsed state has Expand-titled button/graphic  (#def-expand).
             ***********************************************************************/
            ,toggleState = {expanded: 'collapse', collapsed: 'expand'}
            ,toggleInit = view.cfgMsgs.collapseAll ? toggleState.collapsed : toggleState.expanded
            ,togglerSet = (state, ra) => {
                const 
                    title = (state === toggleState.collapsed) ? 'Expand' : 'Collapse'
                    ,ct = {siblings: 0, total: 0, html: ''}
                
                if (ra) { // Replies-array arg (ra) required to set msg counts (siblings/total).
                    const total = (ra) => ra && ra[0] && ra.reduce((acc, el) => {
                            (el.replies) 
                                ? (acc += total(el.replies)) 
                                : (acc += 0) 
                            return acc
                        }, ra.length)

                    ct.siblings = ra ? ra.length : 0
                    ct.total    = ra ? total(ra) : 0
                    ;(ct.total) && (ct.html = `${ct.siblings}/${ct.total}`)
                }
                return `
                    <span class="count-replies">${ct.html}</span>
                    <div class=title data-title="${title}">
                        <svg>
                            <use href="${svgsPath}#def-${state}"></use>
                        </svg>
                    </div>`
            }

            ,toNest = (acc, msg, i) => {
                /***********************************************************
                 * This is the reduce function that tranforms the msg list 
                 * from flat to recursively nested message-reply threads.
                ***********************************************************/
                if ('to_id' in msg) {//... message is a reply.
                    // If reply has no recipient (at this state) then relegate it to the awaiting list.
                    const i_to_id = acc.findIndex(k => (k.id === msg.to_id)) 
                    if (i_to_id < 0) {//... recipient message does not exist (at this state).
                        msg.awaitingRecipient = 1   //... flag as unrenderable (at this state).
                        awaitingRecipient.push(msg) //... relegate for future-state rendering.
                        return acc
                    }
                    // Create recipient's replies list (array) if not exist; nestable component of a thread. 
                    acc[i_to_id].replies ? acc[i_to_id].replies : acc[i_to_id].replies = []
                    // Push this renderable reply message to its recipient's replies array.
                    acc[i_to_id].replies.push(msg) 
                    msg.redundant = 1 //... flag to discard the reply now absorbed by recipient thread.
                }
                return acc
            }

        // @ render per state key
        return (data) => {
            if (!view.validate.key(data, cName)
                || (!(data.msg_list && data.msg_list.list))
            ) return false 
            // Continue even if no messages 

            const 
                state = o.State()
                // MsgList params 
                ,msgs = data.msg_list
                ,cacheTotal = data.msg_list.count || 0
                ,flat = 1   // Message format (received).
                ,nest = 2   // Message format (received).

                // Resource params (URI); to publish requests for older or newer messages
                ,chnID = data.channel.chn_id
                ,ownerID = data.owner.user_id
                ,lType = data.msg_list.type 
                ,lTypeURI = o.lTypeName(lType)
                ,xid = (lType === o.lTypes.chn) 
                            ? chnID 
                            : ( (lType === o.lTypes.th) 
                                    ? ((msgZero.article && msgZero.article.id) || msgs.list[0].id) 
                                    : ownerID
                            )
                ,uriArr = (oldest) => (lType > o.lTypes.th) 
                                        ? ['ml', 'top', o.lTypeName(lType), oldest]
                                        : ['ml', o.lTypeName(lType), xid, oldest] 

                /*****************************************************************************
                 * @ Single-thread view, the 0th message (of 1st payload) is the article;
                 * all others are replies thereto or of subthreads thereunder.
                 * Only its gutted shell (enlarged action buttons) is rendered in that list.
                 * So rendering the article's shell preserves all list-event dynamics.
                 * The complete article (thread root) is rendered outside (above) the list.
                 ****************************************************************************/
                ,singleThread = (lType === o.lTypes.th) ? true : false
                //,article = singleThread ? (msgZero.article ? msgZero.article : msgs.list[0]) : {}
                ,article = (msg) => (singleThread ? (msgZero.article ? msgZero.article : msg) : {})
                
                // Get status; allow for interlacing of renderer(s) instances across states:
                ,mutexFull = () => mutex.messages.full  // `perThread()`
                ,mutexDiff = () => mutex.messages.diff  // `perMessage()`
                ,chron = msgListMenu ? {
                    /*****************************************************************************
                     * Both chron-active views (Newest/Oldest) are flat lists (versus threads)
                     * rendered with no distinction between new/reply messages.
                     * The perMessage() renderer handles all chron-active views 
                     * regardless of mode (replay or not).
                     * 
                     * The chron object tracks both the active state of msgListMenu (node)
                     * and whether the current state rendering is of the replay requesting it.
                     * 
                     * The perThread() renderer abides replay requests, 
                     * but not chron requests; it always prepends newer threads.
                     **************************************************************************/
                    // True IIF this state is a (replay) request for chron-ordered flat list Newest|Oldest
                    wanted: (data.msgListMenu && data.msgListMenu.want)
                                ? ((data.msgListMenu.want !== 'Threads')
                                    ? !!(data.msgListMenu.want)
                                    : false
                                )
                                : false 
                    // msgListMenu (node) state (dataset value)
                    ,state: (  (msgListMenu.dataset.state == 'Oldest') 
                            || (msgListMenu.dataset.state == 'Newest') 
                            )   ? msgListMenu.dataset.state 
                                : ''
                } : {wanted: false, state: false}
                // Flag the replays 
                ,replayFlag = (data.mode === 0)

                ,replay = (data) => {
                    /********************************************************************
                     * replay(..) handles initialization on replay mode:
                     * 
                     *  - Cancels all (async) renderers.
                     *  - Purges the DOM node. 
                     *  - Resets all cross-states counters.
                     * 
                     * Replay mode is that of any state created per msgListMenu event;
                     * any user request for a different view of the same list;
                     * Newer, Older, Threads.
                     * 
                     * From the perspective of the View module, 
                     * replay is identical to initial-state rendering.
                     **************************************************/ 
                    // @ asynch schedulers (cancellable)
                    asyncIDs.map(id => clearTimeout(id))
                    o.aSchedulerP.abort()
                    // @ DOM 
                    o.purge(msglistNode)
                    // @ Accum (cross-states) counters
                    awaitingRecipient.length = 0
                    dataAcc.threads = 0
                    dataAcc.messages = 0 
                    dataAcc.oldest = Infinity

                    // Set the renderer
                    ;(data && data.msgListMenu && data.msgListMenu.want)
                        && (data.msgListMenu.want === 'Threads')
                            ? data.dType = o.dTypes.full
                            : data.dType = o.dTypes.diff // @ Chron (Newer|Older)
                }
                /*********************************************************************************** 
                 * abort() signals renderers of all other states to abort on replay mode.
                 * The signal is used to set their renderable-objects array to zero length.   
                 * An older-state perMessage renderer may continue, depending upon scroll events,
                 * by absorbing the new awaiting list. Either scenario functions well.
                 **********************************************************************************/
                ,abort = () => (
                        (state.logs[state.logs.length-1].mode === o.aModes.replay) 
                     && ((state.logs.length-1) !== data.cursor)
                )
                // redirect(..) is used to pop out of IFRAME 
                ,redirect = (path) => (window.top.location.href = path)

                ,blank = inIframe ? ` target="_blank"` : ''
                /***********************************************************************
                 * thread() recursively populates a message(s)-(sub)thread(s) template.
                 * Called by both msg-list renderers. 
                 *************************************/
                ,thread = (j) => { 
                    /**********************************************************************
                     *  Dataset (Web API) Attributes/Values:  
                     *  
                     *  data-thread-replies="true"   
                     *  - Utilized by JS toggleAll() to expand/collapse all.
                     *
                     *  data-thread-collapsed="true" 
                     *  - Utilized by JS toggleReplies(), per toggle.
                     * 
                     *  data-self-collapsed="true"   
                     *  - Utilized by JS toggleThread() 
                     *    and by CSS @ `.thread.reply[data-self-collapsed=true]` 
                     *    to hide; `display: none;`.
                     * 
                     *  data-title="<ACTION>" 
                     *  - Utilized by JS toggleThread(), 
                     *    and by CSS @ `.options .title::after` .
                     * 
                     *  data-msg-ref="${j.id}"
                     *  - Utilized by JS getThread(), renderReply() .
                     * 
                     *  data-utc-time="${j.date}"
                     *  - Utilized by JS to periodically update message age (text).
                     * 
                     *  data-author-id="${j.author_id}"
                     *  - Utilized by JS getTxn(..).
                     * 
                     * data-author-display="${j.author_display}"
                     * data-author-handle="${j.author_handle}"
                     *  - Utilized by JS doMsg(..)
                     **********************************************************************/
                    const
                        data_collapsed = `
                            data-thread-collapsed="${(j.replies) ? 'true' : ''}"
                            data-self-collapsed="${(j.to_id) ? 'true' : ''}"
                            `
                        ,data_expanded = `
                            data-thread-collapsed=""
                            data-self-collapsed=""
                            `
                        ,comment = (id) => `<!-- id="m-${id}" has replies (recurse). -->`
                        ,toggle = (state) => {
                            if (state === toggleState.collapsed) 
                                return [data_collapsed, togglerSet(toggleInit, j.replies)]
                            if (state === toggleState.expanded) 
                                return [data_expanded,  togglerSet(toggleInit)] 
                            return ['FAIL@toggle(state)[0]', 'FAIL@toggle(state)[1]']
                        }
                        ,recent = (j.date > t0) ? ' new' : ''
                        // Set class @ this thread node if j is article (0th message) @ single-thread view.
                        ,singleThMode = j => (
                            (singleThread) && (msgZero.article && (msgZero.article.id === j.id))
                        ) ? ' single-thread' : ''

                        /********************************************************************
                         * Actions : buttons displayed per group : yea, non, pub, toggle
                         *******************************************************************/
                        // Actions : qToken | pToken 
                        ,yea = j => `
                            <div class="yea">
                                <div class="title" data-title="qToken">
                                    <svg>
                                        <use href="${svgsPath}#def-token-q"></use>
                                    </svg>
                                    <span>${j.tokens_q ? j.tokens_q : ''}</span>
                                </div>
                                <div 
                                    class="title${
                                        (  (j.tokens_q < view.minMsgQ4P) && (j.tokens_p === 0)
                                            && !(msgZero.article && (msgZero.article.id === j.id))
                                        ) 
                                            ? ' hide' 
                                            : ''
                                    }" 
                                    data-title="pToken">
                                    <svg>
                                        <use href="${svgsPath}#def-token-p"></use>
                                    </svg>
                                    <span>${j.tokens_p ? j.tokens_p : ''}</span>
                                </div>
                            </div>
                            `
                        // Actions : Punish
                        ,non = j => `
                            <div class="non">
                                ${(j.to_id) ? `
                                <div class="title" data-title="Punish">
                                    <svg>
                                        <use href="${svgsPath}#def-punish"></use>
                                    </svg>
                                    <span></span>
                                </div>`
                                : ''}
                            </div>
                            `
                        // Actions : Reply | Repost
                        ,pub = j => !centre 
                            ? `
                            <div class="pub">
                                <div class="title" data-title="Reply">
                                    <svg class="reply">
                                        <use href="${svgsPath}#def-reply-open"></use>
                                    </svg>
                                </div>
                                <!-- Not yet implemented -->
                                <div class="title hide" data-title="Repost">
                                    <svg>
                                        <use href="${svgsPath}#def-repost"></use>
                                    </svg>
                                </div>
                            </div>
                            ` 
                            : `
                            <div class="pub">
                            </div>
                            `
                        /*******************************************************************
                         * Upon 'Punish' action resulting in negative q, 
                         * content of yea(j) is replaced with that of punish(j).
                         * Thereafter some buttons are hidden and no actions are allowed.
                         ******************************************************************/
                        ,punished = j => `
                            <div class="yea">
                                ${(j.to_id) ? `
                                <div class="title" data-title="Punish">
                                    <svg>
                                        <use href="${svgsPath}#def-punish"></use>
                                    </svg>
                                    <span></span>
                                </div>`
                                : ''}
                                <div class="title" data-title="qToken">
                                    <svg>
                                        <use href="${svgsPath}#def-token-q"></use>
                                    </svg>
                                    <span>${j.tokens_q ? j.tokens_q : ''}</span>
                                </div>
                                <div 
                                    class="title${((j.tokens_q < view.minMsgQ4P) && (j.tokens_p === 0)) ? ' hide' : ''}" 
                                    data-title="pToken">
                                    <svg>
                                        <use href="${svgsPath}#def-token-p"></use>
                                    </svg>
                                    <span>${j.tokens_p ? j.tokens_p : ''}</span>
                                </div>
                            </div>
                            `
                    // Avatar alternatives
                    // <!-- 
                    // <img src="${view.avatarMBFRand()}" alt="">
                    // <img src="${view.avatarMBF(j.author_display)}" alt="">
                    // <img src="${view.avatarMBFRand()}" alt="">
                    // <img src="${view.avatarMBF(j.author_display)}" alt="">
                    // <img src="${avatars}/${j.author_avatar}" alt=""> 
                    // -->

                    return `\n
                    <!-- Thread 
                         @ m-${j.id} 
                         @ c-${j.chn_id} 
                    -->
                    <div 
                        id="m-${j.id}" 
                        class="thread${j.to_id ? ' reply' : ''}${replayFlag ? '' : recent}${singleThMode(j)}" 
                        data-chn-id="${j.chn_id}"
                        data-thread-replies="${j.replies ? 'true' : ''}"
                        data-author-id="a-${j.author_id}" 
                        data-author-display="${j.author_display}" 
                        data-author-handle="${j.author_handle}" 
                        ${toggle(toggleInit)[0]}
                    >
                        <div ${(msgZero.article && (msgZero.article.id === j.id)) ? 'id="msg-zero"' : ''}
                            class="msg"
                            data-punished="${(j.tokens_q < 0) ? 'true' : ''}">
                            <div class="graphics">
                                <div>
                                    <img src="${j.author_avatar 
                                                    ? view.avatar(j.author_avatar) 
                                                    : view.avatarMBF(j.author_handle)}" alt="">
                                    <div class=badges>${
                                        j.author_badges 
                                            /* Whitespace required by Chrome, else no wrap. */
                                            ? o.makeBadgeNodes(j.author_badges).join(' ') 
                                            : ''
                                    }</div>
                                </div>
                            </div>
                            <div class="main">
                                
                                    ${j.title ? '<a class="msg-title" href="/m/thread/'+j.id+'"'+blank+'><h2>'+j.title+' <span>&nbsp;&#x25b6</span></h2></a>' : ''}
                               
                                <h3>
                                    <div class="author">
                                        ${(j.uri_local && (j.uri_local !== window.location.pathname)) 
                                            ? '<a href="'+j.uri_local+'#m-'+j.id+'"'+blank+'>'+j.author_display+' <span>/'+j.author_handle+'</a>' 
                                            : '<a href="/'+j.author_handle+'/pub'+'#m-'+j.id+'"'+blank+'>'+j.author_display+' <span>/'+j.author_handle+'</a>' 
                                        }
                                        ${j.to_id ? '<div><a href="/'+j.to_handle+'/pub#m-'+j.to_id+'"'+blank+'>Reply to /'+j.to_handle+'</a></div>' : ''}
                                    </div>
                                    <div>
                                        ${(j.to_id || j.title) ? '' : '<a href="/m/thread/'+j.id+'" class="button"'+blank+'>&nbsp;&#x25b6</a>'}
                                    </div>
                                    <div class="date" data-utc-time="${j.date}">
                                        <span>${o.ageNow(j.date)}</span>
                                    </div>
                                </h3>
                                <div class="body">
                                    <p>
                                        ${(j.form === o.mForm.short) 
                                            ? j.body 
                                            : (j.summary ? j.summary : '')
                                        } 
                                        <!-- | m-${j.id.substring(0,7)} -->
                                    </p>
                                    <p class="sponsor ${(j.sponsub) ? '' : 'hide'}">
                                        ${j.sponsub}<span>P</span>
                                    </p>
                                </div>
                                <div class="options">

                                    <div class="actions">
                                        ${(j.tokens_q < 0) ? punished(j) : yea(j) + pub(j) + non(j)}
                                    </div>

                                    <div class="toggle" data-msg-ref="m-${j.id}">
                                        ${j.replies ? toggle(toggleInit)[1] : ''}
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                        ${j.replies ? comment(j.id): ''}
                        ${j.replies ? j.replies.map(thread).join('') : ''}
                    </div>
                    <!-- END Thread @ m-${j.id.substring(0,7)} -->\n`
                }

            function perThread() {
                /****************************************************************************
                 * perThread() renderer for messages and their recursively nested replies. 
                 * Chronologically ordered, all messages render eventually,
                 * per scroll, which dynamically triggers request(s) for older; 
                 * older than oldest message of all multiplexed renderers' states.
                 * 
                 * This renderer must never process any message newer 
                 * than the newest of initial state; state.logs[0].
                 * 
                 * Multiple states of this renderer may run multiplexed,
                 * sharing the common awaiting-recipient list,
                 * which is also shared with any similarly running perMessage() renderers.
                 **************************************************************************/ 
                mutex.messages.full = mutating // lock

                // Push the unrendered awaiting-reply message(s) from prior state onto current list ...
                o.arrsConcat(msgs.list, awaitingRecipient) 
                awaitingRecipient.length = 0 //... and reckon that.

                if (msgs.list.length === 0) {
                    logDeb('@ perThread() : NO MESSAGES in this state.')
                    mutex.messages.full = dormant 
                    return 
                }
                const 
                    thList = [] // Threads list; HTML-string elements.
                    ,oldest = msgs.list[0].date 

                var mList = [] // Messages list (of objects) mutates from flat to nest (threads).
                // Reformat messages list from flat (msgs) to nest (mList):
                switch (msgs.format) {//... received.
                    case flat: // If flat, transform to nested; to thread(s) list.
                        /************************************************************************
                         * Recursively embed replies into recipients.
                         * Filter out the residue; replies absorbed into their recipient, 
                         * and replies having no recipient at this state (saved future states).
                         ***********************************************************************/
                        mList = msgs.list.reduce(toNest, msgs.list).filter(msg => ( 
                                    (msg.redundant !== 1) && (msg.awaitingRecipient !== 1) 
                                ))

                        if ((lType === o.lTypes.pub) || (lType === o.lTypes.sub)) {
                            /****************************************************************************
                             * @ /pub or /sub, all reply messages to other channels from the owner 
                             * were relegated to awaiting list (@ toNest), some of which would forever 
                             * await their other-channel recipient. So, those are added back to list 
                             * of renderables to be rendered here as new, each at its own thread. 
                             * This is reckoned by removing them from the awaiting list hereby.
                             * 
                             * Some replies thereto (absent here) would forever await at this renderer, 
                             * at this state, so are made transferable to the per-message (ad-hoc) 
                             * renderer by being on the awaiting list; a list shared by both renderers, 
                             * and across states. (Multiple states may be renderering, multiplexed.)
                             * 
                             * All non-chn type lists (pub, sub, th, centre) have similar edge-case 
                             * issues, each with differing particulars.
                             **************************************************************************/
                            awaitingRecipient.forEach((msg, i) => (
                                (msg.chn_id !== chnID) && (msg.author_id === ownerID)) && (
                                    mList.push(msg)
                                    ,awaitingRecipient.splice(i, 1)
                            ))
                        }

                        // if (lType === o.lTypes.th) {
                        //     /*************************************************
                        //      * @ /thread, all are renderable at this state;
                        //      * the oldest message is the root (0th) message.
                        //      * UPDATE : No. Something is wrong here.
                        //      ************************************************/
                        //     awaitingRecipient.forEach((msg, i) => ( 
                        //         mList.push(msg)
                        //         ,awaitingRecipient.splice(i, 1)
                        //     ))
                        // }

                        //logFocus(msgs.list)
                        
                        // Re-sort threads chronologically, in place.
                        mList.sort((a, b) => (a.date - b.date))

                        /************************************************************
                         * Set and render the article content once per page load,
                         * else 0th message of subsequent fetches appear as article
                         ***********************************************************/
                        if (lType === o.lTypes.th) {
                            const 
                                article = (mList[0] && singleThread) 
                                                ? (msgZero.article ? msgZero.article : mList[0]) 
                                                : {}
                            // Set once per page load
                            ;(article.id && !msgZero.article) && (
                                (article.path = state.key)
                                ,(msgZero.article = article)
                                ,renderArticle(article)
                            )
                            //logFocus({now: article, ini: msgZero.article})
                        }

                        // Build thread(s) markup; an array of template literals, each a thread.
                        o.arrsConcat(thList, mList.map(thread))

                        // Accumulate threads count across states
                        dataAcc.threads += thList.length + awaitingRecipient.length 

                        break 

                    case nest: //... if arrived already as such.
                        // ***************************************************
                        //  DEPRICATED case; not maintained [2020-09]
                        // ***************************************************
                        mList = msgs.list.filter(msg => !('to_id' in msg))
                        //... assure no nested-reply-message residue.
                        o.arrsConcat(thList, mList.map(thread)) 
                        break

                    default:
                        logErr('@ state #', data.cursor, ': perThread() : msgs.format :'
                            + `${msgs.format} (INVALID)`
                        )
                } 

                // Purge this consumed component from state logs (at this state).
                // Timing issue @ very large threads; thList hasn't time to absorb it?
                // Delay causes redundancies in thList
                //o.aDelay(1000, () => {
                    msgs.list = []
                    //;(debugOFF) ? gc(data.msg_list, 'count', 'etag') : (msgs.list = [])
                //})

                // If none renderable at this state.
                if (thList.length === 0) { 
                    if (awaitingRecipient.length !== 0) {
                        // Launch ad-hoc renderer, to which awaitingRecipient list is transfered
                        perMessage()

                        logDeb('@ perThread() : NO RENDERABLE threads. |'
                            ,awaitingRecipient.length, 'AWAITING recipients.'
                        )
                    }
                    mutex.messages.full = dormant 
                    return 
                }

                mutex.messages.full = dormant 

                // Dispense threads per scheduler, per scroll event.
                ;(() => {
                    const 
                        saveCountThreads = thList.length
                        ,maxThreads = 12   //... per scroll event or on first render.
                        ,waitThread = 220  // Threads are dispensed per indexed delay (wait * i).
                        ,timeScroll = 100  // scroll-event throttle time.
                        ,y = {acc: 0, max: 0, last: 0, trigger: unitHeight}

                        ,dispenseThreads = (yacc) => {
                            // Adaptive-trigger reckons the mutating content height.
                            if (dataAcc.messages && !trigger(y.max)) return
                            if (yacc) {
                                // Set the number of threads to render 
                                // by the distance scrolled; upper bounded.
                                var n = Math.round(yacc/unitHeight + 1) || maxThreads
                                ;(n > maxThreads) && (n = maxThreads)
                                const afew = (thList.length > n) ? n : thList.length
                            } else { // @ init call
                                //afew = maxThreads
                                afew = (thList.length < maxThreads) ? thList.length : maxThreads
                                n = afew
                            } 
                            
                            // Render a few thread(s) per indexed delay(s).
                            for (let i = 0; i < afew; i++) {
                                /*******************************************************************
                                 * The declarative-time scheduler limits the rate of DOM mutations 
                                 * regardless of the rate at which events trigger them. 
                                 * Renderings so scheduled are cancellable, which is exploited
                                 * by future (multiplexed) states rendering per replay request.
                                 **************************************************************/
                                asyncIDs.push(o.aDelay((waitThread * i), () => {
                                    mutex.messages.full = mutating
                                    prof.start('toDOM')

                                    /************************************************************
                                     * Render (consume) a thread, appending it to last sibling;
                                     * a primary thread already in the DOM; LIFO (newest first).
                                     ***********************************************************/
                                    o.toDOM(msglistNode, thList.pop()) 
                                    prof.stop() // ~ 3 ms; want < 16 ms 
                                    mutex.messages.full = dormant
                                }))
                            }
                            // Report status
                            !debugOFF && logDeb('#', data.cursor, '@ dispenseThreads(', n, ') :' 
                                ,thList.length, '/', saveCountThreads,'(remain/total) threads. |'
                                ,awaitingRecipient.length,'AWAITING recipients.'
                            )
                            !debugOFF && o.aDelay(1000, ()=> logDeb('#', data.cursor
                                ,': DOM @ perThread() :', tallyDOM() 
                            ))
                        }
                        // Scroll handler
                        ,onScroll = o.throttle(timeScroll, () => {
                            (abort()) && (thList.length = 0)

                            if (window.scrollY < y.max) 
                                return 

                            if (thList.length !== 0) {
                            // Record max and accumulate scroll changes
                                y.max = window.scrollY
                                y.acc += y.max - y.last 
                                ;(y.acc > y.trigger) && ( 
                                    dispenseThreads(y.acc)
                                    ,(y.acc = 0) //... reset regardless
                                )
                                // Recalibrate to current scroll position, and dismiss upward scrolls.
                                y.last = y.max;(y.acc < 0) && (y.acc = 0) 

                            } else {// After rendering all RENDERABLE threads ...
                                window.removeEventListener('scroll', onScroll) 
                                //... detach this listener

                                // Report this state's render status:
                                !(awaitingRecipient.length)
                                    ? log('#', data.cursor,': perThread() : RENDERED ALL', 
                                        saveCountThreads, 'threads of state','#', data.cursor
                                    )
                                    : log('#', data.cursor,': perThread() : RENDERED'
                                        ,saveCountThreads, 'of', dataAcc.threads,'threads. |'
                                        , awaitingRecipient.length, 'AWAITING recipients.'
                                    )
                                // If oldest at this state is oldest across all states,
                                // then request more (older messages).
                                
                                ;(dataAcc.oldest >= oldest)
                                    && eb.pub(eTypes.View, {
                                        node: msglistNode
                                        ,dType: o.dTypes.full
                                        //,dType: o.dTypes.scroll
                                        ,want: ['older']
                                        //,uri: ['ml', lTypeURI, xid, oldest, 111]
                                        ,uri: uriArr(oldest)
                                    }) // uri: {pg, ml}, {pub, sub, chn}, xid, [, t [, n]]

                                // Request reset of toggler/listener (messages node), regardless.
                                eb.pub(eTypes.View, {
                                    node: msglistNode
                                    ,dType: o.dTypes.full
                                    ,want: ['reset']
                                })

                                // Conditionally launch the ad-hoc (per-message) renderer, 
                                // to which this list of awaiting messages is transferred.
                                awaitingRecipient.length && perMessage() 
                            } 
                        })

                    dataAcc.oldest = (oldest > dataAcc.oldest) ? dataAcc.oldest : oldest

                    dispenseThreads() // init 

                    menuTallys(cacheTotal, dataAcc.threads, chron.wanted)

                    window.addEventListener('scroll', onScroll) //... dispense a few threads.
                })()
                //return toDOM(msglistNode, list) //... simpler; why not use? It badly blocks DOM. 
                // ...to use, change to `list.join('')` here or above @ `all()` func.
            }

            function perMessage() { 
                /*******************************************************************
                 * perMessage() is the ad-hoc renderer. 
                 * It handles both newer and older messages;
                 * age relative to initial state (state.logs[0]). 
                 * Several of these ad-hoc renderers may run concurrently 
                 * (multiplexed) across states. 
                 * 
                 * This handles, e.g., the reply message awaiting the
                 * arrival and render of its recipient message, which may exist
                 * at another state, rendering per its own scroll-event listener.
                 *****************************************************************/
                if (msgs.format !== flat) {
                    logErr('@ state #', data.cursor, ': perMessage() : msgs.format :'
                        + `${msgs.format} (MISMATCHED)`
                    )
                    return false
                }

                mutex.messages.diff = mutating  // lock

                const 
                    mList = msgs.list   // Instead of mutating the iterable mList, ...
                    ,rendered = []      // ... filter out elements as rendered, per id.
                    ,oldest = msgs.list[0] && msgs.list[0].date || o.nowMsec()
                    ,newest = msgs.list[0] && msgs.list[msgs.list.length-1].date || o.nowMsec()
                    ,isNewer = !!(oldest > dataAcc.newest) //... is data from request for 'newer'
                // Message placement :: prepend|append
                var prepend //... per active view (Newest/Oldest/Threads @ msgListMenu)

                dataAcc.oldest = (oldest > dataAcc.oldest) ? dataAcc.oldest : oldest
                dataAcc.newest = (newest < dataAcc.newest) ? dataAcc.newest : newest

                // Garbage collect this view component at this state
                msgs.list = [] //... state logs are consumed.
                //;(debugOFF) ? gc(data.msg_list, 'count', 'etag') : (msgs.list = [])

                mutex.messages.diff = dormant  // unlock

                // Dispense messages per schedule, per scroll event.
                ;(() => {
                    const 
                        aSchSignal = o.aSchedulerP.signal
                        // Interval for new messages appearing atop `#msg-list`.
                        ,waitNew = (replayFlag || chron.state) ? view.dtReplayRender : 260
                        //waitNew = chron.state ? view.dtReplayRender : 260
                        //waitNew = 260
                        ,waitReply = 10     // Interval for replies inserted ad hoc (static||scroll).

                        ,timeScroll = 200   // Interval for scroll-event throttling.
                        ,perScroll = {count: 0, max: 7} // Max mucks with fetch-request scheme.
                        ,priority = {new: 0, reply: 0} // Prioritize (index the delay) per data type.
                        ,y = {acc: 0, max: 0, last: 0, trigger: unitHeight}

                        ,schedule = (waitType, increment) => { 
                            /**********************************************************************
                             * The render scheduler sets delays per index and type (new vs reply).
                             * Such declarative time assures limits on DOM mutations
                             * regardless of the rate at which external event(s) trigger them.
                             *********************************************************************/
                            var delay 
                            if (waitType === waitNew) { 
                                delay = priority.new
                                ;(increment) ? (priority.new += 1) : (priority.new -= 1)
                            } else {
                                delay = priority.reply
                                ;(increment) ? (priority.reply += 1) : (priority.reply -= 1)
                            } 
                            return delay * waitType 
                        }
                        // Recon the rendering of a message
                        ,reckon = (rtn) => {
                            // Decrement the scheduling index (priority).
                            schedule(rtn.wType)
                            // If message rendered ...
                            ;(rtn.msg) && (
                                rendered.push(rtn.msg.id) 
                                ,dataAcc.messages++ 
                                ,(rendered.length <= mList.length) 
                                    && (!debugOFF 
                                            && logDeb('#', data.cursor, '@ dispenseMessages() :'
                                                    ,'(', rendered.length, '/', mList.length, ')'
                                                    ,(rtn.wType === waitReply) ? `Reply` : `New` 
                                                )
                                    )
                            )
                            return rtn
                        }
                        ,renderReply = (msg) => { 
                            if (rendered.includes(msg.id)) return undefined
                            /***********************************************************
                             * flagAsNew handles edge cases at non-chn type channels: 
                             * Reply message published to other channel is rendered
                             * at this channel (pub, sub, tops) as new (root) thread,
                             * else would forever await recipient.
                             * So, such are displayed regardless of toggle state. 
                             **********************************************************/
                            var flagAsNew = false

                            const // Must (re)read the mutating DOM each call.
                                toThread = o.css(`#m-${msg.to_id}`, msglistNode)
                                ,option  = o.css(`#m-${msg.to_id} .toggle[data-msg-ref=m-${msg.to_id}]`, toThread) 
                                ,expanderExists = o.css(`#m-${msg.to_id} .count-replies`)

                            ;(option && !expanderExists && !centre) 
                                && o.toDOM(option, togglerSet(toggleState.collapsed, msg.replies))

                            toThread //... recipient exists or not
                                && o.toDOM(toThread, thread(msg)) 
                                || o.toDOM(msglistNode, thread(msg)) && (flagAsNew = true)

                            centre && link(msg)
                            return (toThread || flagAsNew) ? msg : undefined
                        }
                        ,renderNew = (msg) => {
                            if (rendered.includes(msg.id)) return undefined
                            o.toDOM(msglistNode, thread(msg), prepend)
                            centre && link(msg)
                            return msg
                        }
                        ,link = (msg) => o.toDOM(
                            o.css(`#m-${msg.id} .toggle[data-msg-ref=m-${msg.id}]`)
                            // ,(  msg.to_id 
                            //         ? `<a href="/${msg.path}#m-${msg.id}" class="button">&nbsp;&#x25b6</a>` 
                            //         : `<a href="/thread/${msg.id}" class="button">&nbsp;&#x25b6</a>`
                            // )//... WIP : if a reply, then Single-thread view fails to render @ Thread (default) view.
                            // ,`<a href="/${msg.path}#m-${msg.id}" class="button">
                            //     <svg>
                            //         <use href="${svgsPath}#def-play"></use>
                            //     </svg>
                            // </a>`
                        )// 279c, 1405, 27a4, ▶ 25b6

                        // Render per async scheduler (cancellable); index delays.
                        ,render = (msg) => {
                            if (rendered.includes(msg.id)) return undefined

                            /********************************************************************
                             * Unless Chron mode and Newest requested (chron.state: 'Oldest'), 
                             * limit perScroll.count to maintain lazy loading; 
                             * lest all render in one big dump over (waitNew * length) seconds.
                            ********************************************************************/
                            if (    chron.state 
                                    && (chron.state !== 'Oldest') 
                                    && (perScroll.count++ >= perScroll.max)
                            ) { return undefined }//... lest all render at once.

                            //logFocus(msg.tokens_p,msg.tokens_q)

                            if (msg.to_id && !chron.state) {
                                // @ REPLY message (if not chron)
                                o.aSchedulerP(schedule(waitReply, true, aSchSignal), 
                                    renderReply)(msg)
                                    .then((m) => reckon({
                                            msg: m,
                                            wType: waitReply
                                        })
                                    ) 
                            } else {
                                // @ NEW message (or chron active)
                                o.aSchedulerP(schedule(waitNew, true, aSchSignal), 
                                    renderNew)(msg)
                                    .then((m) => reckon({
                                            msg: m,
                                            wType: waitNew
                                        })
                                    ) 
                            }
                        }
                        // Dispense new and reply messages per declarative-time renderers.
                        ,dispenseMessages = () => {
                            //logFocus(mList.map(el => [el.tokens_p,el.tokens_q]))
                            var count = 0
                            mutex.messages.diff = mutating  // lock
                            mList.map(render)
                            mutex.messages.diff = dormant   // unlock

                            // Update age of all messages
                            o.aDelay(view.dtReplayRender*(tallyDOM().messages + 1), updateMsgsAge)
                        }

                        // Scroll handler
                        ,onScroll = o.throttle(timeScroll, () => {
                            (abort()) && (mList.length = 0)
                            if (window.scrollY < y.max) return
                            perScroll.count = 0

                            // Record max and accumulate scroll changes
                            y.max = window.scrollY
                            y.acc += y.max - y.last 
                            ;(y.acc > y.trigger) && (
                                (trigger(y.max)) && dispenseMessages()
                                ,(y.acc = 0) //... reset regardless
                            )

                            // TODO: SIMPLER SCHEME (sans differentials)
                            //logErr('===', y.max, msglistNode.getBoundingClientRect()) // 99% CanIUse.com

                            // Recalibrate to current scroll position, and dismiss upward scrolls.
                            y.last = y.max;(y.acc < 0) && (y.acc = 0)  

                            /*******************************************************
                             * If messages remain (awaiting), 
                             * and this state's oldest is oldest of all,
                             * then request more (older messages), 
                             * unless chron-active view is 'Oldest', 
                             * where user is scrolling toward newest.
                             * 
                             * Delegate (per dType) the rendering of such 
                             * to perThread handler unless chron-active view.  
                             ******************************************************/

                            if ((rendered.length < mList.length)) {
                                ((dataAcc.oldest > oldest) && (chron.state !== 'Oldest')) 
                                    && eb.pub(eTypes.View, {
                                        node: msglistNode
                                        ,dType: (chron.state ? o.dTypes.diff : o.dTypes.full)
                                        //,dType: o.dTypes.scroll
                                        ,want: ['older']
                                        //,uri: ['ml', lTypeURI, xid, oldest] // TODO : handle /top/:lt
                                        ,uri: uriArr(oldest)
                                    }) // uri: {pg, ml}, {pub, sub, chn}, xid, [, t [, n]]
                                       // uri: ml, top/:lt [, n] @ /app/Centre

                                // Report render status.
                                !debugOFF && logDeb('#', data.cursor,'@ perMessage() :', 
                                                rendered.length, '/', mList.length, '(rendered/total)'
                                                ,'|', dataAcc.messages, 'acc'
                                                ,'|', (mList.length - rendered.length),'UNRENDERED.'
                                            )

                            // Else all messages (of this state) rendered, so: 
                            } else {
                                // Remove this renderer's scroll-event listener.
                                window.removeEventListener('scroll', onScroll)
                                // Request reset of toggler listener.
                                eb.pub(eTypes.View, {
                                    node: msglistNode,
                                    dType: o.dTypes.diff,
                                    want: ['reset']
                                }) 

                                // Report render status
                                log('#', data.cursor,'@ perMessage() :', 
                                    rendered.length, '/', mList.length, '(rendered/total)'
                                    ,'|', dataAcc.messages, 'acc'
                                    ,'| RENDERED ALL messages of state', '#', data.cursor
                                )

                                !debugOFF && o.aDelay(1000, ()=> logDeb('#', data.cursor
                                    ,': DOM @ perMessage() :', tallyDOM() 
                                ))//... costly, so only if debug mode.
                            }
                        })

                    if (lType === o.lTypes.pub) { 
                        /************************************************************************* 
                         * If this is pub-type channel, 
                         * then transfer the awaiting list from the per-thread renderer.
                         * 
                         * Note the awaitingRecipient messages are in (recursively) nested format,
                         * so future-state invocations of this renderer may find recipients 
                         * unfound at this state, depending on user-scroll behavior.
                         * 
                         * Unlike the awaiting list passed between renderers across states,
                         * the ad-hoc message list itself is not passed across states.
                         * That is, there is no attempt at reducing the number 
                         * of ad-hoc renderers running multiplexed.
                         *************************************************************************/
                        o.arrsConcat(mList, awaitingRecipient) 
                        log('#', data.cursor
                            ,'@ perMessage() > ABSORB list of awaiting-recipients :'
                            ,awaitingRecipient.length, 'threads.'
                        )
                        awaitingRecipient.length = 0 //... and reckon that.

                        // Re-sort chronologically (oldest first), in place.
                        // Unlike perThread, perMessage renders per list order.
                        mList.sort((a, b) => a.date - b.date)
                    }

                    prepend = (chron.state) ? false : true
                    ;(isNewer && chron.state === 'Oldest')      // @ Newest
                        && (prepend = true)

                    // Conditionally sort for rendering in that order (append). 

                    // @ Newest, sort to newest first (reverse chron)
                    ;(!prepend && (chron.state === 'Oldest'))  
                        && mList.sort((a, b) => b.date - a.date)

                    //@ TopList : Popular, sort by tokens_p then by tokens_q (both descending).
                    ;(centre && (chron.state !== 'Oldest')) 
                        && mList.sort((a, b) => (b.tokens_p - a.tokens_p) 
                                                    ? (b.tokens_p - a.tokens_p) 
                                                    : (b.tokens_q - a.tokens_q)
                    )
                    //... mind the chron.state and prepend flags
                    //logFocus('WTF',chron.state,prepend,mList.map(el => [el.tokens_p,el.tokens_q,el.to_handle]))

                    dispenseMessages() //... init.

                    menuTallys(cacheTotal, dataAcc.threads, chron.wanted)

                    window.addEventListener('scroll', onScroll)

                })()
            }

            // Purge messages node on first render if view type is page.
            ;( (data.cursor === 0) && (data.view.type === o.vTypes.page) ) 
                && o.purge(msglistNode)

            // @ Replay mode, cancel all (async) renderers, 
            // purge msgList node, and perform the requested replay (rendering).
            ;(replayFlag) && replay(data)

            // Publish first-render event; requesting newer messages.
            // (Triggers Net module to schedule recurring requests for newer messages.)
            ;((data.cursor === 0) && !centre)
                && eb.pub(eTypes.View, { 
                    dType: o.dTypes.diff
                    ,want: ['newer']
                    //,uri: ['ml', lTypeURI, xid]
                    ,uri: uriArr(dataAcc.newest)
                })// uri: {pg, ml}, {pub, sub, chn}, xid, [, t [, n]] 

            /*********************************************************************
             * Call the relevant renderer per chron.state and dType.
             * 
             * One renderer per state, interlacing such across states.
             * Sharing the messages-awaiting list across states
             * necessitates the wait function to assure atomicity
             * of such per-state initializations;
             * abides 'mutex' lock until 'dormant' condition.
             * 
             * See declarative-time labs for usage/demo.
             * 
             * NOTE: 
             * Current scheme differs from that of per-renderer mutex code,
             * Better to have one global mutex to handle the awaiting list ???
            *********************************************************************/ 
           
            /************************************************************************
             * Force use of perMessage() renderer if ListType is Thread,
             * else if root message is itself a reply, 
             * then it would not render lest Chron mode.
             * 
             * FAILing; breaks the Expander.
             * Unncessary for MVP: Single-thread view is mainly for hosted comments 
             * whereof thread root (article) is a new long-form message.
             ***********************************************************************/
            //;(lType === o.lTypes.th) && (data.dType = o.dTypes.diff)
            //;(lType === o.lTypes.th) && msglistNode.classList.add('single-thread')

            // Set renderer per dType : perThread only on first msg list
            ;(!chron.state && ((data.dType === o.dTypes.full) || (!dataAcc.messages && !dataAcc.threads))) 
                ? o.waitUntil(mutexFull, o.seq125(), perThread)   
                : o.waitUntil(mutexDiff, o.seq125(), perMessage)  

            //waitUntil(mutexFull, seq125(), perThread)  
            //waitUntil(mutexDiff, seq125(), perMessage)
            onSchUpdateMsgsAge()

            // If URL declares a requested message, #m-HHH..., 
            // then highlight it whenever it renders; mind the lazy loading.
            
            window.location.hash && o.aScheduleSeq(o.seq125(), () => {
                const msgWant = (window.location.hash.substring(1, 2) === 'm') 
                                    && o.css(window.location.hash)
        
                msgWant && msgWant.classList.add('new')
            })

            /*****************************************************************************
             * Example : DISQUS : hosts comments for destructoid.com
             * Dynamics: 
             * 1. Click on author opens modal (left sliding in) @ left-half of screen
             * 2. Click on member thereof opens member's DISQUS page in new tab.
             * 
             * TODO: Implement those dynamics; 
             *  pop out of iframe on anchor click, and open modal @ a higher-z iframe.
             * 
             * This caused sponsub modal to partially fail; all checkbox and radio
             * buttons were inoperable; workaround for that "unknown" cause 
             * was to explicitly set such per click. See deadSet(..) @ txn.js .
             ****************************************************************************/
            false && inIframe && window.addEventListener('click', (ev) => {
                ev.preventDefault()
                let et = ev.target
                et.href || (et = et.parentNode)
                ;((et.nodeName === 'A') && (et.href))
                    && redirect(et.href)
            })

            log('#', data.cursor, 'dType :', 
                data.dType, data.msg_list.list.length, '/', cacheTotal, '(state/cache)'
            ) 
            //logFocus(state.store)
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 



// View : txn
;(function (o, undefined) {
    'use-strict'
    const 
        cName = 'txn'
        /********************************************************************
         * Token transactions may occur at message, channel, user or group.
         * Such spawn network fetches and DOM mutations before and after.
         * Though a View key, this IIFE is not of a view component per se. 
         * It operates on events per listeners/handlers attached on init, 
         * rendering and such thereby rather than per State log.
         * 
         * It handles all transaction events at
         * #owner, #msg-list, and modal(s) launched therefrom; 
         * POSTs transactions and fetches updated targets per AJAX, 
         * and publishes under several eTypes, some of which spawn a 
         * View/Action/State loop, affecting other View keys downstream.
         * 
         * @ #owner 
         *  - q, P (Sponsor/Subscribe)
         * @ #msg-list
         *  - q, P (Sponsor), Punish
         ******************************************************************/
        ,view = o.View()
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,keys = view.components
        ,logDeb = view.logDeb(cName)
        ,logErr = view.logErr(cName)
        ,logFocus = view.logFocus(cName)

    keys[cName] = (() => {
 
        // @ init 
        const 
            /*************************************************
            * modalCtnr is a popup form to get user input 
            * for sponsor/subscribe transaction of p-tokens.
            *************************************************/
            articleNode = o.css('#article')
            ,modalCtnr = o.css("#modal-sponsub")
            ,modal = modalCtnr ? {
                wrapper: o.css('.wrapper', modalCtnr)
                ,heading: o.css('.header H1', modalCtnr)
                ,main: o.css('.main', modalCtnr)
                ,close: o.css('.close', modalCtnr)
                ,submitForm: o.css('#submit', modalCtnr)
                ,submitButton: o.css('#submit BUTTON', modalCtnr)
                ,limit: o.css('.main .fund-source label SPAN B', modalCtnr)
                // INPUT elements
                ,one: o.css('#radio-amount-one', modalCtnr)
                ,two: o.css('#radio-amount-two', modalCtnr)
                ,five: o.css('#radio-amount-five', modalCtnr)
                ,other: o.css('#text-amount-other', modalCtnr)
                ,source: o.css('#check-fund-source', modalCtnr)
                ,sponsor: o.css('#radio-action-sponsor', modalCtnr)
                ,subscribe: o.css('#radio-action-subscribe', modalCtnr)

                ,message: o.css('.main .message TEXTAREA', modalCtnr)
            } : {}
            ,txnMsg = modalCtnr ? {
                get: function _get() { return modal.message.value; },
                set: function _set(msg) { msg ? (modal.message.value = msg) : modal.message.value = ''; }
            } : {get:()=>{}, set:()=>{}}
            ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
            ,ghost = o.create('GHOST')
            ,subscribeInput = modalCtnr ? o.css('.main .action[data-action="subscribe"]', modalCtnr) : ghost
            ,channel = o.css('#channel') || ghost
            ,over = o.css('#overlay-2')  || ghost
            ,blur = 'blur'
            ,hide = 'none'
            ,show = 'block'
            ,closeModal = (save) => {
                save || stateReset()
                txnMsg.set()
                
                modalCtnr.removeEventListener('keyup', o.debounce(100, doKeyUp))
                modalCtnr.removeEventListener('click', o.debounce(200, doClick))

                modalCtnr.classList.add('hide') 
                channel.classList.remove(blur)
                modal.close.classList.add('rotate')
                over.style.display = hide 

                subscribeInput.classList.remove('hide')
            }
            ,resetModal = (content) => {//... failed attempt at spinner
                const overlay = () => `<div class="modal-overlay spin">${content}</div>`
                o.toDOM(modal.wrapper, overlay())
            }
            /***************************************************************
             * Local state obj shares transaction state across DOM states;
             * a less restrictive alternative to Dataset k-v pairs.
             **************************************************************/
            ,state = {
                channel: {},
                valid: false,   // Enable|Disable the submit button
                virgin: true,   // False on 1st keyup (idempotent)
                gw: false,      // Payment-gateway flag (per toggled source of funds)
                limit: 0,       // User.TokensP count
                psp: {},        // User.PSP state
                txn: {},        // DOM state 
                x: {},          // POST-payload state
            }
            ,stateReset = () => { //... per popup.
                state.valid = false
                state.virgin = true
                state.gw = false 
                state.limit = 0
                state.txn = {}
                state.x = {}
            }
            ,headingReset = () => {// Interval in weeks
                const interval = Math.floor(+state.txn.amount/state.channel.sub_rate * 4.33)
                                    // Add one extra week per additional month
                                    + Math.floor((+state.txn.amount/state.channel.sub_rate) - 1)
                // Reset heading lest amount is zero
                state.txn.amount && (modal.heading.innerHTML = `
                    ${+state.txn.amount} <span class="token">P</span> buys ${interval} weeks
                `)
            }
            /**************************************************************
            * @ keyup, uncheck radio buttons on user input @ modal.other.
            **************************************************************/
            ,doKeyUp = (ev) => {
                (modal.other.value) 
                    && [modal.one, modal.two, modal.five]
                            .map(el => (el.checked = false))
                validate()
                headingReset()

                state.virgin && (
                    (modal.other.placeholder = '')
                    ,(state.virgin = false)
                )
                validate()
                state.valid && logDeb('@ doKeyUp : valid state:', state)
            }
            /******************************************************
             * UPDATE : Issue caused by redirect out of IFRAME
             * @ msg-list.js . See line 1225+
             * *********************************************
             * Explicitly set checked attribute per target.
             * Inexplicably, all radio and checkbox INPUT targets
             * of the modal are dead if in WordPress IFRAME.
             *****************************************************/
            ,deadSet = (target) => (
                // Radio : check
                (+target.dataset.x === 1) && (modal.one.checked = true)
                ,(+target.dataset.x === 2) && (modal.two.checked = true)
                ,(+target.dataset.x === 5) && (modal.five.checked = true)
                ,(+target.dataset.recur === 0) && (modal.sponsor.checked = true)
                ,(+target.dataset.recur === 1) && (modal.subscribe.checked = true)
                // Checkbox : toggle
                ,(target.dataset.source === 'existing') && (
                    (modal.source.checked === true) 
                        ? (modal.source.checked = false) 
                        : (modal.source.checked = true) 
                )
                //,logFocus(`'${target.dataSource}'`)
            )
            /*****************************************************
            * @ click, publish on submit, else clear modal.other 
            * value if any radio-amount checked.
            *****************************************************/
            ,doClick = (ev) => {
                // modal.one.checked = true // Okay; can force
                // deadSet(ev.target)
                // logFocus(ev.target.innerHTML,modal.one, modal.subscribe)
                !![modal.one, modal.two, modal.five].map(el => 
                    (el.checked === true) && (modal.other.value = '')
                )
                validate()
                headingReset()

                const 
                    action = 'sponsor' //(+state.x.act === 2) ? 'subscribe to' : 'sponsor'    
                    ,xis = ((+state.x.xis === 1) && 'message')
                                || ((+state.x.xis === 2) && 'channel')
                                    || ((+state.x.xis === 3) && 'channels')
                    ,msgText = `I appreciate your ${xis}.`

                txnMsg.get() || txnMsg.set(msgText)

                !!(state.valid && (ev.target.nodeName === 'BUTTON'))
                    && publishModal()
            }
            /****************************************************
            * Validate modal input and reset state accordingly.
            * Disable submit button lest state is valid.
            ****************************************************/
            ,max = (max) => max || 10 //... psp.lastMax
            ,validate = () => {
                state.valid = false
                
                // If other is valid, then set txn.amount to it; set FX accordingly.
                if (modal.other.checkValidity()) {
                    modal.other.classList.remove('invalid') 
                    state.txn.amount = modal.other.value
                    state.valid = true
                } else {
                    modal.other.classList.add('invalid')
                    state.valid = false
                }

                // If other is empty, then set txn.amount per checked radio-amount-* button
                if (!modal.other.value) {
                    state.valid = false
                    ;[modal.one, modal.two, modal.five].map(el => {
                        if (el.checked === true) {
                            state.txn.amount = el.value
                            state.valid = true
                        }
                    })
                }

                // Set gateway flag per source checkbox (toggle)
                if (modal.source.checked === true) {
                    state.gw = false
                    limit(state.limit)
                } else {
                    state.gw = true
                    limit((2 * max(state.psp.lastMax)))
                }

                // Set amount limit per toggled source of funds
                if (state.gw) {
                    // If using payment gateway, then limit amount per user history (psp.lastMax)
                    if (state.txn.amount > (2 * max(state.psp.lastMax))) {
                        state.valid = false
                        modal.other.classList.add('invalid')
                        modal.limit.classList.add('invalid')
                    } else {
                        modal.limit.classList.remove('invalid')
                    }
                } else {
                    // If sans gateway, then limit amount per User.TokensP (existing tokens)
                    if (state.txn.amount > state.limit) {
                        state.valid = false
                        modal.other.classList.add('invalid')
                        modal.limit.classList.add('invalid')
                    } else {
                        modal.limit.classList.remove('invalid')
                    }
                }
    
                // Set x.act per checked radio-action-* button
                ;[modal.sponsor, modal.subscribe].map(el => 
                    (el.checked === true) && (state.x.act = el.value)
                )

                // Enable submit button if valid, else disable; set FX accordingly.
                if (state.valid) {
                    modal.submitButton.disabled = false
                    modal.submitButton.classList.remove('disabled')
                } else {
                    modal.submitButton.disabled = true
                    modal.submitButton.classList.add('disabled')
                }
            }
           ,limit = (p) => o.setText(modal.limit, p)
            /*****************************************************
            * Publish the modal-modified transaction payload (x)
            *****************************************************/
            ,publishModal = () => {
               // Synch txn and x amounts (int); preserve txn.action (DOM string)
                state.txn.amount = +state.txn.amount
                state.x.tokens_p = +state.txn.amount
                state.x.act      = +state.x.act
                state.txn.msg    = txnMsg.get()
 
                // FAILing attempts @ spinner
                //resetModal(`<h1 class="heart-beat">Processing</h1>`)
                //resetModal(`<svg><use href="${svgLogoDef}"></use></svg>`)
                
                closeModal(true)

                eb.pub(eTypes.Modal, state.x)
            }
            /*************************************************************
            * Launch and init modal, and attach its listeners/handlers.
            *************************************************************/
            ,openModal = (ev) => {
                const ss = o.State().store
                state.psp = o.Auth().UserPSP(ss.auth)
                state.limit = (ss.auth && ss.auth.user.tokens_p) ? ss.auth.user.tokens_p : 0
                state.channel = ss.channel
                state.owner = ss.owner

                // Set modal position (y) : directly over the target to handle all cases.
                //modalCtnr.style.top = `${o.top(ev.target)}px` 

                o.aDelay(350, () => {//... delay modal popup to allow heartbeat FX.
                    /****************************************************************
                     * Hide the Subscribe option if target is a Message, 
                     * or if target is Channel to which user is already subscribed.
                     * Whereof allow only Sponsor transaction.
                     ***************************************************************/ 
                    if ((state.txn.xis === o.TxnXIS.Message)
                        || ((state.txn.xis === o.TxnXIS.Channel) 
                            && (ss.auth.user.subed_recur.includes(ss.channel.chn_id))
                        )) {
                        subscribeInput.classList.add('hide')
                        modal.subscribe.checked = false
                        modal.sponsor.checked = true
                    }

                    modal.heading.innerHTML = `Monthly Rate: 
                        ${state.channel.sub_rate} <span class="token">P</span>
                    `

                    modalCtnr.classList.remove('hide') 
                    // If no payment-gateway profile, then abort transaction and inform/link.
                    if (!state.x.anet.profile_customer_id || !state.x.anet.profile_payment_id) {
                        const 
                            header = o.css('.header H1', modalCtnr)
                            ,wrapper = o.css('.wrapper', modalCtnr)

                        wrapper.classList.add('abort')
                        header.innerHTML = `
                            <a href="/app/profile-buyin" class="button">
                                Add a Payment Profile
                            </a>
                        `

                        ;[modal.main, modal.submitForm].map(el => el.classList.add('hide'))

                        state.txn.actionNode.classList.add('warn')
                    }

                    modal.other.value = ''
                    over.style.display = show 
                    modal.close.classList.add('rotate')
                    channel.classList.add(blur)
                    validate()

                    attachListenersOnce()
                })
            }
            ,attach = () => {
                modalCtnr.addEventListener('keyup', o.debounce(100, doKeyUp))
                /********************************************************************** 
                 * BUG @ button type="submit"
                 * @ debounce : doClick : ev.preventDefault FAILs to prevent default
                 * @ throttle : doClick : validate() fires TWICE per click.
                 * 
                 * Workaround: change type="button"
                 ********************************************************************/
                modalCtnr.addEventListener('click', o.debounce(200, doClick))
            }
            ,attachListenersOnce = o.once(attach)
 
            /******************************************************
             * nodes are transaction-location targets (XID, XIS)
             *****************************************************/
            ,nodes = {
                msgList: o.css('#msg-list')
                ,owner: o.css('#owner-chn-buttons')
                //,channel: o.css('#channel') 
                //... No. channel listener overlaps msgList listener
            }
            ,authFail = 'auth-fail'
            ,toSelf = 'to-self'
            ,outOfq = 'out-of-q'
            /*******************************************
             * postTxnHandler(..) fetches the affected 
             * txn target (xid) and updates its view.
             ******************************************/
            ,postTxnHandler = (r) => {
                const x = r.body
                if (!(x && x.txn_id) || !(x.tokens_q || x.tokens_p)) {
                    // action-node FX @ txn FAIL
                    r.meta.status 
                        && ((r.meta.status >= 400) || (r.meta.status === 111))
                            && state.txn.actionNode.classList.add('warn')
                            //... still not catching Offline case; too far downstream.

                    return Promise.reject({
                        why: 'Transaction failed.', 
                        what: {
                            resp: r,
                            txn: state.txn
                        },
                        where: 'postTxnHandler(..)'
                    })
                }

                const
                    /********************************************************************************
                     * Ephemeral FX prior to txn pub spawning Action/State/View loop; 
                     * thereafter, cache is updated, so message rendering accounts for all txns.
                    ********************************************************************************/
                    xidMsgNode = o.css(`#m-${x.xid}`) //... not exist if x.xis is not of message type
                    ,actions = o.css('.actions', xidMsgNode)
                    ,qTokenNode = o.css(`.title[data-title=qToken]`, actions)
                    ,pTokenNode = o.css(`.title[data-title=pToken]`, actions)
                    ,punishNode = o.css(`.title[data-title=Punish]`, actions)
                    ,msgTknCount = {
                        qToken: o.css(`SPAN`, qTokenNode),
                        pToken: o.css(`SPAN`, pTokenNode),
                        Punish: o.css(`SPAN`, punishNode),
                    }
                    ,reckonCount = (span, amount) => {
                        var n = +(o.getText(span))
                        n = n ? (n + amount) : amount 
                        o.setText(span, `${n}`)
                    }
                    ,punished = () => {
                        // FX @ Punish 
                        const yea = o.css('.yea', actions)
                        o.setText(o.css(`SPAN`, punishNode), '')
                        o.purge(actions)
                        o.append(actions, yea)
                        o.append(yea, punishNode)
                        o.append(yea, qTokenNode)//... TODO: want qrate, not q

                        o.css('.msg', xidMsgNode).dataset.punished = 'true'
                    }
                    ,respHandle = r => r.body ? r.body : Promise.reject(r.meta)
                    ,yeaHandler = (txn) => {
                        // Reckon token count @ DOM : add txn amount to current/prior count.
                        reckonCount(msgTknCount[txn.action], txn.amount)
                        // Display pToken button (otherwise hidden) 
                        // only if qToken count exceeds minMsgQ4P.
                        ;(+(o.getText(msgTknCount['qToken'])) > view.minMsgQ4P) 
                            && (pTokenNode.classList.remove('hide'))
                        return x
                    }
                    ,nayHandler = (x) => {
                        // Reckon token count @ DOM : set per updated-msg data.
                        o.setText(msgTknCount['qToken'], x.tokens_q)
                        ;(o.getText(msgTknCount['qToken']) < 0) && punished()
                        return x
                    }
                    ,pubEvent = x => {
                        // Update state/store with txn-key data : spawn Action/State/View loop 
                        eb.pub(eTypes.Txn, x)
                        return x
                    }

                /***********************************
                 * Handle per action (r.body.act)
                 **********************************/

                //logFocus('postTxnHandler(..) : msgTknCount', msgTknCount)
                logDeb('postTxnHandler(..) : x:', x, 'state:', state)

                switch (true) {
                    /*****************************************************************
                     * Nominally, message transactions are reckoned by summing 
                     * the transacted token value with that read from the DOM, 
                     * but not so of Punish action, 
                     * whereof qToken cost is per qRate of punished member, 
                     * which changes per API-service function (unknown by client), 
                     * and so must fetch updated target prior to reckoning. 
                     * 
                     * If action is Follow/Unfollow (3), the affected target 
                     * is the subscriptions list of the authenticated user, 
                     * so their updated record is fetched/published.
                     * 
                     * In all cases, publish to spawn Action/State/View loop,
                     * updating affected target in cache, else txns are ephemeral.
                     ****************************************************************/
                    // XIS @ Message : punish (act=0, q=-1)
                    case (x.act === 0):
                        // Fetch the affected message; apply Punish-action FX; publish.
                        auth.FetchAPI('GET', `/m/${x.xid}`)
                            .then(respHandle)
                            .then(nayHandler)
                            .then(pubEvent)
                            .catch(logErr)
                        break

                    // XIS @ Message : reward (0 < act < 3, q|p > 0) 
                    case ((x.act === 1) && (x.xis === o.TxnXIS.Message)):
                        yeaHandler(state.txn)
                        // Fetch the affected message; publish
                        auth.FetchAPI('GET', `/m/${x.xid}`)
                            .then(respHandle)
                            .then(pubEvent)
                            .catch(logErr)
                        break

                    // XIS @ Channel, User, or Group
                    case (  ((x.act === 1) || (x.act === 2)) 
                            && (x.xis >= o.TxnXIS.Channel) 
                            && ((x.tokens_q !== 0) || x.tokens_p !== 0)
                        ):

                        if (x.tokens_p !== 0) {
                            /*********************************************************************
                             * Show gratitude on success of pTokens sponsor/subscribe @ Channel.
                             * Show amount and thank-you note (#owner pTokens button).
                             * Ephemeral; does not survive page reload. 
                             * 
                             * TODO: 
                             * We're not showing accumulated total channel.tokens_p, 
                             * yet that is publicly exposed. Pick one; either show or protect.
                             *******************************************************************/
                            var ghost  = ghost || o.create('GHOST')
                                ,owner = owner || o.css('#owner')
                            const pTokens = !owner ? ghost : o.css('.sponsor span[data-title="pToken', owner)
                            o.toDOM(pTokens, `${x.tokens_p.toLocaleString('en-US')} <em class="thanks">&hellip; Thank you!</em>`)
                        }

                        // Get and publish updated auth-user record.
                        o.Auth().SubRecordGet()

                        // Publish request for updated channel
                        eb.pub(eTypes.View, {
                            dType: o.dTypes.full
                            ,want: ['channel']
                            ,uri: ['c', x.xid]
                        })

                        break
                }

                if (x.tokens_p === 0) return r  
                /**************************************************************
                 * If txn is of P tokens, then publish a txn-notify message 
                 * regardless of txn target
                 *************************************************************/
                const 
                    ss = o.State().store
                    ,lType = Object.keys(o.lTypes)[ss.msg_list.type-1]
                    ,xid = (lType === o.lTypes.chn) ? ss.channel.chn_id : ss.channel.owner_id
                    ,postMsgHandler = x => {
                        /***************************************************
                         * Request fetch of newly created message.
                         * Response spawns another Action/State/View loop,
                         * thereby rendering the new message.
                         * 
                         * (Net module is subscribed to eTypes.View)
                         *************************************************/
                        eb.pub(eTypes.View, { 
                            dType: o.dTypes.diff
                            ,want: ['newer']
                            ,uri: ['ml', lType, xid]
                        })// uri: {pg, ml}, {pub, sub, chn}, xid, [, t [, n]] 

                        return x //... abide middleware pattern.
                    }
                    /***************************************************************
                     * xidMsg : If txn-target type (XIS) was message, 
                     * then reconstruct keys from Dataset API reads at its id, 
                     * else set target to a logically-adjacent recipient message;
                     * if at thread view (#article), 
                     * then to owner's oldest (thread-root) new message
                     * (#article.dataset.articleId), 
                     * else to owner's newest new message.
                     * Such are captured @ State().store log.
                     **************************************************************/
                    ,xidMsg = xidMsgNode 
                                ? {
                                    id: xidMsgNode.id.replace('m-', '')
                                    ,author_display: xidMsgNode.dataset.authorDisplay
                                    ,author_handle: xidMsgNode.dataset.authorHandle
                                }
                                : ( (article && ss.msg_list && ss.msg_list.oldest_owner_new)
                                    || (ss.msg_list && ss.msg_list.newest_owner_new) || {}
                                )
                    ,msg = {
                        form: o.mForm.short
                        ,to_id: xidMsg.id
                        ,to_display: xidMsg.author_display
                        ,to_handle: xidMsg.author_handle
                        ,chn_id: ss.channel.chn_id
                        ,author_id: ss.auth.sub
                        ,author_display: ss.auth.user.display
                        ,author_handle: ss.auth.user.handle
                        ,author_avatar: ss.auth.user.avatar || o.cfg.view.avatarDefault
                        ,author_badges: ss.auth.user.badges
                        ,body: state.txn.msg
                        ,sponsub: state.txn.amount
                    }

                logDeb('msg:', msg, 'state:', state)
                
                auth.FetchAPI('POST', '/m', msg)
                        .then(postMsgHandler)
                        .then(logDeb)
                        .catch(logErr)

                return r //... abide middleware pattern.
            }
            ,failHandle = err => {//... auth.FetchAPI publishes (upstream), so why here too?
                eb.pub(eTypes.Net, {
                    data: {http: {status: err.status, statusText: err.statusText}}, 
                    mode: o.aModes.promise
                })
                logErr(err)
            }
            /***********************************************************
             * getTxn(..) returns a transaction object containing 
             * all params required of API's transaction request, 
             * per event target (et) at either msgList or owner node.
             **********************************************************/
            ,getTxn = (et) => { 
                const 
                    ss = o.State().store
                    ,txn = {
                        actionNode: undefined, 
                        action: undefined, 
                        xid: '', 
                        xis: '',
                        payee: '', 
                        payer: '', 
                        amount: 0,
                        psp: auth.UserPSP(ss.auth),
                        msg: '',
                    }

                // Validate user is authenticated
                if (!(ss.auth && ss.auth.sub && ss.auth.r && o.ttl(ss.auth.r.exp))) {
                    txn.action = authFail 
                }

                // Filter out all but certain event targets, exploiting event delegation.
                // This is required due to one listener having multiple targets.

                // @ Message 
                txn.xis = o.TxnXIS.Message
                et.matches('.actions .title')
                    && (txn.actionNode = et) 
                et.matches('.actions .title svg')
                    && (txn.actionNode = et.parentNode) 
                et.matches('.actions .title svg use')
                    && (txn.actionNode = et.parentNode.parentNode) 

                // @ Channel 
                if (!txn.actionNode) {
                    txn.xis = o.TxnXIS.Channel
                    et.matches('span[data-title="Follow"]')
                        && (txn.actionNode = et) 
                    et.matches('span[data-title="Unfollow"]')
                        && (txn.actionNode = et) 

                    et.matches('use[href="#def-token-q')
                        && (txn.actionNode = et.parentNode) 
                    et.matches('svg[data-title="qToken"]')
                        && (txn.actionNode = et) 

                    et.matches('use[href="#def-token-p')
                        && (txn.actionNode = et.parentNode) 
                    et.matches('svg[data-title="pToken"]')
                        && (txn.actionNode = et) 
                }

                if (!txn.actionNode) return txn

                switch (txn.xis) {

                    case o.TxnXIS.Channel:
                        txn.payee = ss.channel.owner_id
                        txn.xid   = ss.channel.chn_id 
                        break

                    case o.TxnXIS.Message:
                        const targetMsg = o.ancestor(txn.actionNode, 'DIV.thread')
                        txn.payee = o.getID(targetMsg.dataset.authorId)
                        txn.xid   = o.getID(targetMsg.id)
                        break 
                }

                // Set payer per Auth object
                txn.payer = ss.auth.sub
                // Flag fail mode
                !!( (txn.payee === txn.payer) 
                    && (txn.actionNode.dataset.title !== 'Reply') 
                    && (txn.actionNode.dataset.title !== 'Repost')
                ) && (txn.action = toSelf)

                ss.auth.user && (ss.auth.user.tokens_q === 0) && (txn.action = outOfq)

                // Set action per dataset.title or fail mode
                txn.action = ((txn.action === authFail) || (txn.action === toSelf) || (txn.action == outOfq))
                                ? txn.action 
                                : txn.actionNode.dataset.title

                switch (txn.action) {
                    case 'qToken':
                    case 'Follow':
                        txn.amount = 1
                        break
                    case 'pToken':
                        txn.amount = 1 
                        break
                    case 'Punish':
                    case 'Unfollow':
                        txn.amount = -1
                        break
                    default:
                        txn.amount = 0
                        break
                }
                return txn 
            }
            /**************************************************
             * onTxn(..) handles all token-transaction events.
             * (Currently, none @ POST of form-msg.)
             **************************************************/
            ,onTxn = (ev) => {
                //ev.preventDefault()// FAILs to prevent @ IFRAME : other listeners attached ?
                const 
                    txn = getTxn(ev.target)
                    ,msgNode = txn.actionNode && o.ancestor(txn.actionNode, '.msg')

                if (!txn.actionNode) 
                    return 

                logDeb('onTxn(ev) : txn:', txn)

                if (msgNode && (msgNode.dataset.punished === 'true')) 
                    return

                // Conditionally abort and set FX per txn status
                switch (true) {
                    case (txn.action === authFail):
                        txn.amount = 0
                        //txn.actionNode.dataset.title = 'Login!' // killed by flex
                        txn.actionNode.classList.add('warn')
                        return
                    case (txn.action === toSelf):
                        txn.amount = 0
                        //txn.actionNode.dataset.title = 'To/From Self ???' // killed by flex
                        txn.actionNode.classList.add('warn')
                        return
                    case (txn.action === outOfq):
                        txn.amount = 0
                        //txn.actionNode.dataset.title = 'To/From Self ???' // killed by flex
                        txn.actionNode.classList.add('warn')
                        return
                    default:
                        txn.actionNode.classList.add('heart-beat')
                        o.aDelay(550, () => txn.actionNode.classList.remove('heart-beat'))
                        break
                }

                if ((txn.action === 'Reply') || (txn.action === 'Repost')) 
                    return

                // Normalize : create payload (x) from txn
                var x = {
                    act: 9999,
                    xid: txn.xid, 
                    xis: txn.xis,
                    payer_id: txn.payer, 
                    payee_id: txn.payee, 
                    tokens_q: 0,
                    tokens_p: 0,
                    anet: {},
                    csrf: o.rand(22),
                }

                switch (txn.action) {
                    case 'Punish':
                        x.act = o.TxnAct.Punish
                        x.tokens_q = txn.amount 
                        break
                    case 'qToken':
                    case 'Reward':
                        x.act = o.TxnAct.Sponsor
                        x.tokens_q = txn.amount
                        break
                    case 'Follow':
                    case 'Unfollow':
                        x.act = o.TxnAct.Subscribe
                        x.tokens_q = txn.amount
                        break
                    case 'pToken':
                        x.act = o.TxnAct.Sponsor
                        x.tokens_p = txn.amount
                        x.anet = {
                            profile_customer_id: txn.psp.cid,
                            profile_payment_id: txn.psp.pid, 
                        }
                        break
                }

                stateReset()
                state.txn = txn
                state.x = x

                logDeb('onTxn(..) :', {state: state, x: x, txn: txn})
                
                if (x.tokens_p) {
                    openModal(ev)
                } else {
                    doFetchAPI(x)
                }
            }
            /***********************************************************************
             * POST the transaction payload (x), then handle FX and after-actions.
             * 
             * Payment-gateway flag (state.gw) implies a two-step transaction;
             * first an ExchBuyin, adding x.tokens_p for cash drawn from gateway,
             * then either Sponsor or Subscribe (per x.act), 
             * sending the newly-acquired tokens to the target (payee).
             * Sans gateway flag, transaction draws from payer's existing tokens.
             *********************************************************************/
            ,doFetchAPI = (x) => {
                const uri = state.gw ? '/anet/ss' : '/x'
                auth.FetchAPI('POST', uri, x)
                        .then(postTxnHandler)
                        .then(logDeb)
                        .catch(failHandle)
            }

        /*************************************************
         * Close over the list of target nodes (XID/XIS)
         * whereof a token transaction may occur.
         ************************************************/
        nodes.keys = Object.keys(nodes).filter(key => (nodes[key] && nodes[key].id))
        
        if (!nodes.keys.length) return function() {} 

        /**************************************************
        * Attach a throttled click listener to each node.
        **************************************************/
        nodes.keys.map(key => nodes[key].addEventListener('click', o.throttle(777, onTxn)))

        /*******************************************************************
         * Attach click listener to selected targets, closing the modal
         * on any click anywhere else (over), or at its own close button.
        *******************************************************************/
        modalCtnr && [over, modal.close].map(el => el.addEventListener('click', closeModal))

        /***********************************
        * Listen to modal-published events
        ***********************************/
        eb.sub(eTypes.Modal, doFetchAPI) 

        // @ render 
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //... nothing left to do per State event.
            logDeb('published : data.txn:', data.txn)
        }
    })()
})(window[__APP__] = window[__APP__] || {}) 

/***********************************************
 * This file has 2 IIFEs 
 *  - "Add/Edit Channel" page (#channel-post)
 *  - "Get API Key" page (#apikey)
 **********************************************/

// #channel-post
;(function (o, undefined) {
    'use strict'
    /****************************************************************
     * Channel : Add/Edit
     ***************************************************************/
    const chnPost = o.css('#channel-post')
    
    if (!chnPost) return 

    const 
        cfg = o.cfg.view
        ,srcID = 'chns'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = ''//o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,ss = o.State().store
        ,dl = o.css('DL', chnPost)
        ,dt = o.css('DL DT', chnPost)
        ,action = o.css('A', dt)
        ,h2     = o.css('H2', dt)
        ,dd     = o.cssAll('DD', chnPost) // 0: form, 1: inform
        ,form   = o.css('FORM', chnPost)
        ,chn = {
            chn_id:     ''
            ,title:     o.css('#form-channel-title')
            ,slug:      o.css('#form-channel-slug')
            ,about:     o.css('#form-channel-about')
            ,rate:      o.css('#form-channel-rate')
            ,host_url:  o.css('#form-channel-host')
            ,tags:      o.css('#form-channel-tags')
            ,privacy:   o.cssAll('FIELDSET.privacy INPUT[type="radio"', chnPost)
        }
        ,chkValidityEls = ['title', 'slug', 'about', 'host_url', 'rate']
        ,rate = o.css('FIELDSET.rate', chnPost)
        ,submit = o.css('FORM INPUT[type="submit"]', chnPost)
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef

        ,state = {chn: {}, mode: '', invalid: true, chnID: ''}

        ,subjChnSlug = () => (state.mode === 'add') && (state.chn.slug || '...') 
                            || (state.mode === 'edit') && (chn.slug.value || '...') || '...'

        ,doToggleForm = (ev) => {
            ev.preventDefault()
            if (!ev.target.dataset.action) return
            ;[...dd].map(el => el.classList.toggle('hide'))

            if( !(ss.auth && ss.auth.sub) ) {
                o.purge(dd[0])
                o.toDOM(dd[0], `
                    <div id="guard-form">
                        <h3>
                            <a href="/app/login" class="button">
                                Requires Login
                            </a>
                        </h3>
                    </div>
                `)
                return
            }
            /**************************************************
             * Subscription Rate : Hide that input element 
             * lest channel has the min-required subscribers.
             *************************************************/
            ;(ss.auth.user.subed_recur.length < 100) && rate.classList.add('hide')

            h2.textContent = `@ /${ss.auth.user.handle}/${subjChnSlug()}`

            // Focus on first empty input
            const emptyNode = Object.keys(chn)
                .filter(node => ( ( (node !== 'chn_id') && (node!== 'privacy') ) && !chn[node].value) )
            emptyNode.length && chn[emptyNode[0]].focus()
        }
        ,doKeyup = (ev) => {
            const name = ev.target.name
            ;(chn.rate.value !== "") ? (chn.rate.required = true) : (chn.rate.required = false)

            if (name === 'rate') {
                ;(chn.rate.value !== "") && (chn.rate.value = +chn.rate.value)
            }
            if (name === 'title') {
                ;['|', '\\', '^', '*', '`' ]
                    .map((ch) => (chn.title.value = o.replaceAll(chn.title.value, ch, '')))
                chn.title.value = o.replaceAll(chn.title.value, '  ', ' ')
            }
            if (name === 'slug') {
                if (state.mode === 'edit') return 
                ;['|', '\\', '(',')', '[', ']', '{', '}', '\>', '\<', '/', '%', 
                    '^', '?', '@', '#', '$', '&', '*', ':', ';', '+', '=', '--', 
                    '!', '~', '`', ',', '"', '.', '\'\''
                    ].map((ch) => (chn.slug.value = o.replaceAll(chn.slug.value, ch, '')))
                chn.slug.value = o.replaceAll(chn.slug.value, ' ', '-')
                chn.slug.value = o.replaceAll(chn.slug.value, '--', '-')
                chn.slug.value = o.replaceAll(chn.slug.value, '__', '_')
            }
            if (name === 'tags') {
                ;['|', '\\', '(',')', '[', ']', '{', '}', '\>', '\<', '/', '%', 
                    '^', '?', '@', '#', '$', '&', '*', ':', ';', '+', '=', '-', 
                    '_', '!', '~', '`', ',,', '"', '.', '\'\''
                    ].map((ch) => (chn.tags.value = o.replaceAll(chn.tags.value, ch, '')))
                chn.tags.value = o.replaceAll(chn.tags.value, ' ', '')
            }
            // Update state 
            chn[name] && (state.chn[name] = chn[name].value)
            //h2.textContent = `@ /${ss.auth.user.handle}/${state.chn.slug ? state.chn.slug : '...'}`
            h2.textContent = `@ /${ss.auth.user.handle}/${subjChnSlug()}`
            chkValidity()
            resetSubmitButtonState()
        }
        ,chkValidity = () => {
            // (In)Validate the form; idempotent.
            const chk = (name) => 
                    chn[name].checkValidity() 
                        ? chn[name].classList.remove('invalid') 
                        : ( chn[name].classList.add('invalid')
                            ,(state.invalid = true)
                        )
            state.invalid = false
            chkValidityEls.map(chk)
        }
        ,resetSubmitButtonState = () => {
            // Enable/Disable + FX
            if (state.invalid) {
                submit.classList.add('disabled')
                submit.disabled = true
            } else {
                submit.classList.remove('disabled')
                submit.disabled = false
            }
        }
        ,httpStatus = (resp) => `${resp.meta.statusText} (${resp.meta.status})`
        ,reportFail = (resp) => `
            <div class="report">
                <h3>
                    Error : <code>${httpStatus(resp)} ${resp.body && (' : ' + resp.body.error)}</code>
                </h3>
            </div>
        `
        ,doSubmit = (ev) => {
            /****************************************
             * POST/PUT (Add/Edit) the channel obj.
             * ... DEPRICATED : Use upsert endpoint.
             * 
             * POST : Upsert the channel obj.
             ***************************************/
            ev.preventDefault()
            if (form.dataset.idempotent) return
            form.dataset.idempotent = o.rand()
            spinner(ev)
            const 
                method = 'POST'    //(state.mode === 'add') ? 'POST' : 'PUT'
                ,uri = '/c/upsert' //(state.mode === 'add') ? '/c' : '/c/' + state.chnID
                ,anchorGetKey = state.chn.host_url ? `
                        or <a href="/app/apikey" class="button">Get API Key</a>
                    ` : ``
                ,reportOkay = (msg) => `
                    <div class="report">
                        <h3>
                            <em>${msg}</em>
                            <a href="/app/account"class="button">See Account Page</a>
                            ${anchorGetKey}
                        </h3>
                    </div>
                `
                ,respHandler = (resp) => {
                    // Replace spinner with result report.
                    if (resp.meta && (+resp.meta.status < 299)) {
                        // @ Okay
                        logDeb('resp:', resp)
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportOkay('Success!'))

                    } else {
                        // @ Fail
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportFail(resp))

                        return Promise.reject({
                            why: `${method} : HTTP response code : ${resp.meta.status}`, 
                            what: {resp: resp},
                            where: 'respHandler(..)'
                        })
                    }
                }

            /***************************************
             * TODO : Allow/handle privacy settings
            ***************************************/
            // // Get the checked privacy setting
            // ;[...chn.privacy].map(el => {
            //     if (el.checked === true) {
            //         payload.privacy = +el.value
            //     }
            // })

            // If tag(s), then map CSV to array and clean it up.
            state.chn.tags && (
                (state.chn.tags = state.chn.tags.split(',')),
                (state.chn.tags = state.chn.tags.map(tag => tag.trim())),
                (state.chn.tags = state.chn.tags.filter(tag => tag))
            )
            const payload = {} 

            // Add keys to payload only if their state changed
            Object.keys(state.chn).map(key => (state.chn[key] && (payload[key] = state.chn[key])))
            // @ rate : string to integer
            ;(+state.chn.rate) && (payload.rate = +state.chn.rate) 
            
            // Abort and report on no change.
            if (!Object.keys(payload).length) {
                o.purge(dd[0])
                o.toDOM(dd[0], reportOkay('No changes.'))

                return 
            }
            payload.csrf = o.rand(22)
            ;(state.mode == 'edit') && (payload.chn_id = state.chnID)

            logDeb('doSubmit : payload:', payload)
            //return

            // Request upsert
            return auth.FetchAPI(method, uri, payload)
                    .then(respHandler)
                    .catch(logErr)
        }
        ,chnPrivacySet = (v) => [...chn.privacy].map((el) => 
                (+el.value === v) ? (el.checked = true) : (el.checked = false)
            )
        ,spinner = (ev = false) => {
            /*******************************************************
             * The spinner func animates the ev.target svg of 
             * an oauthProvider(..) node under the MAIN tag,
             * if exist, else it creates the app-logo equivalent.
             * Regardless, it purges MAIN of all other content.
            *******************************************************/
            const 
                logo = () => {
                    const 
                        span = o.create('SPAN')
                        ,svg = `
                            <svg>
                                <use href="${svgLogoDef}"></use>
                            </svg>`
    
                    o.toDOM(span, svg)
                    return span
                }
                ,selected = (ev.target && ev.target.closest('SPAN')) || logo()
                ,spinner = o.create('DIV')

            selected.classList.add('selected')
            spinner.classList.add('spinner')

            o.purge(dd[0])
            dd[0].append(spinner)
            spinner.append(selected)
            o.aDelay(500, () => spinner.classList.add('spin'))
        }
        ,mode = (action) => {
            switch (action) {
                case 'add':
                    state.mode = 'add'
                    h2.dataset.action = state.mode
                    h2.textContent = 'Add Channel'
                    break
                case 'edit':
                    state.mode = 'edit'
                    h2.dataset.action = state.mode
                    h2.textContent = `Edit Channel`
                    break
            }
        }

    // Set mode and such per URL hash (containing the ID of the channel to be edited).
    if (!window.location.hash) {
        mode('add')
    } else {
        /***********************************************
         * @ Edit mode, retrieve the target channel
         **********************************************/
        const 
            labels = {
                title: o.css('FORM FIELDSET.text LABEL[for="form-channel-title"]', chnPost)
                ,slug: o.css('FORM FIELDSET.text LABEL[for="form-channel-slug"]', chnPost)
                ,host: o.css('FORM FIELDSET.text LABEL[for="form-channel-host"]', chnPost)
            }
            ,hideFields = (strArr) => strArr.map(field => {
                chn[field].classList.add('hide')
                labels[field].classList.add('hide')
            })
            ,respHandler = (resp) => {
                
                // @ Fail
                if (!(resp.body && (resp.body.chn_id === state.chnID))) {
                    o.purge(dd[0])
                    o.toDOM(dd[0], reportFail(resp))

                    return Promise.reject({
                        why: 'Failed to retrieve channel.', 
                        what: {resp: resp},
                        where: 'respHandler(..)'
                    })
                }

                // @ Okay

                // Initialize form-input values
                chn.title.value     = resp.body.title
                chn.slug.value      = resp.body.slug
                chn.about.value     = resp.body.about
                chn.rate.value      = resp.body.sub_rate
                chn.host_url.value  = resp.body.host_url
                chn.tags.value      = resp.body.tags
                // TODO : Allow/handle privacy settings
                //chnPrivacySet(resp.body.privacy)

                // Hide the immutable slug input on edit
                hideFields(['slug'])

                // Hide other immutables if Timeline channels (pub, sub)
                ;((chn.slug.value === 'pub') || (chn.slug.value === 'sub')) && (
                    hideFields(['title', 'host'])
                )
                chkValidity()
                resetSubmitButtonState()
            }
        
        mode('edit')

        // Capture the target channel ID from the URL
        state.chnID = window.location.hash.substr(1)

        // Retrieve the target channel for editing
        auth.FetchAPI('GET', '/c/'+state.chnID)
                .then(respHandler)
                .catch(logErr)
    }

    // Toggle the form on click
    action.addEventListener('click', doToggleForm)

    // @ keyed form input
    form && form.addEventListener('keyup', o.throttle(100, doKeyup))

    // @ submit button
    form && form.addEventListener('submit', doSubmit)

    // Init the form button 
    submit.classList.add('disabled')
    chkValidity()
    resetSubmitButtonState()

})(window[__APP__] = window[__APP__] || {}) 

// #apikey
;(function (o, undefined) {
    'use strict'
    /****************************************************************
     * API Key : Get per user select of a hosted channel
     ***************************************************************/
    const section = o.css('#apikey')
    
    if (!section) return 

    const 
        cfg = o.cfg.view
        ,srcID = 'apikey'
        ,log = o.log(srcID)
        ,logDeb= o.log(srcID, o.log.levels.DEBUG)
        ,debugOFF = ''//o.log.debugOFF // ''
        ,logFocus= o.log(srcID, o.log.levels.FOCUS)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,auth = o.Auth()
        ,eb = o.EB()
        ,eTypes = eb.eTypes()
        ,ss = o.State().store
        ,dl = o.css('DL', section)
        ,dt = o.css('DL DT', section)
        ,h2 = o.css('H2', dt)
        ,action = o.css('A', dt)
        ,dd = o.cssAll('DD', section) // 0: form, 1: inform
        ,form       = o.css('FORM', section)
        ,title      = o.css('FORM FIELDSET.channel H3')
        ,radioCtnr  = o.css('FORM FIELDSET.channel', section)
        ,submit     = o.css('FORM INPUT[type="submit"]', section)
        ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef

        ,state = {cid: '', channels: [], mode: '', invalid: true, resp: {}}

        ,chkValidity = () => o.aDelay(200, () => {
            [...state.channels].map(el => (
                (el.checked === true) 
                    && ((state.invalid = false),
                        (state.cid = el.dataset.cid),
                        (title.classList.add('alpha50'))
                    )
            ))
            resetSubmitButtonState()
        })
        ,resetSubmitButtonState = () => {
            // Enable/Disable + FX
            if (state.invalid) {
                submit.classList.add('disabled')
                submit.disabled = true
            } else {
                submit.classList.remove('disabled')
                submit.disabled = false
            }
        }
        ,httpStatus = (resp) => `${resp.meta.statusText} (${resp.meta.status})`
        ,reportFail = (resp) => `
            <div class="report">
                <h3>
                    Error : <code>${httpStatus(resp)} ${resp.body && (' : ' + resp.body.error)}</code>
                </h3>
                ${(+resp.meta.status === 403) && help()}

            </div>
        `
        ,help = () => `
            <p>
                 <b>Logout then login again</b> to update your newly-acquired role.
                 You will then be authorized to get an API key. Pardon the trouble.
            </p>
            `
        ,spinner = (ev = false) => {
            /*******************************************************
             * The spinner func animates the ev.target svg of 
             * an oauthProvider(..) node under the MAIN tag,
             * if exist, else it creates the app-logo equivalent.
             * Regardless, it purges MAIN of all other content.
            *******************************************************/
            const 
                logo = () => {
                    const 
                        span = o.create('SPAN')
                        ,svg = `
                            <svg>
                                <use href="${svgLogoDef}"></use>
                            </svg>`
    
                    o.toDOM(span, svg)
                    return span
                }
                ,selected = (ev.target && ev.target.closest('SPAN')) || logo()
                ,spinner = o.create('DIV')

            selected.classList.add('selected')
            spinner.classList.add('spinner')

            o.purge(dd[0])
            dd[0].append(spinner)
            spinner.append(selected)
            o.aDelay(500, () => spinner.classList.add('spin'))
        }
        ,getOwnedChns = (as) => {
            /********************************************************
             * Retrieve this auth-user's (owner's) channel records,
             * and insert the info into apropos DOM elements.
             ******************************************************/
            const 
                // Set uri per subject user's ID retrieved from auth-status.
                uri = as.sub ? `/cl/owned/${as.sub}` : ''
                ,radioInput = (chn) => `
                    <label for="c_${chn.IDx}">
                        <input 
                            type="radio" 
                            name="channel" 
                            data-cid="${chn.chn_id}" 
                            id="c_${chn.IDx}" 
                            value="${chn.IDx}">
                        <span>${chn.slug}</span>
                    </label>
                `
                ,respHandler = (resp) => {
                    logDeb('@ getOwnedChns(as) : respHandler(resp) : resp:', resp)

                    // @ Fail

                    if (!(resp.body && resp.body.list && resp.body.list.length) || (+resp.meta.status >= 400)) {

                        o.purge(dd[0])
                        o.toDOM(dd[0], reportFail(resp))

                        return Promise.reject({
                            why: 'Failed to retrieve channel.', 
                            what: {resp: resp},
                            where: 'respHandler(..)'
                        })
                    }

                    // @ Okay

                    // `/${as.user.handle}/${chn.slug}`
                    resp.body.list.map((chn) => (chn.slug !== 'pub' && chn.slug !== 'sub') 
                        && o.toDOM(radioCtnr, radioInput(chn))
                    )
                    state.channels = o.cssAll('FIELDSET.channel INPUT', section)
                }
            /*********************************************
             * Response body is of []channel.Channel{..}
             ********************************************/
            uri && auth.FetchAPI('GET', uri)
                    .then(respHandler)
                    .catch(logErr)
                //: logErr('@ getOwnedChns(as) : Auth status (as) :', as)
        }
        ,doToggleForm = (ev) => {
            ev.preventDefault()
            if (!ev.target.dataset.action) return
            ;[...dd].map(el => el.classList.toggle('hide'))

            if( !(ss.auth && ss.auth.sub) ) {
                o.purge(dd[0])
                o.toDOM(dd[0], `
                    <div id="guard-form">
                        <h3>
                            <a href="/app/login" class="button">
                                Requires Login
                            </a>
                        </h3>
                    </div>
                `)
                return
            }
        }
        ,doRadio = (ev) => chkValidity()
        ,doSubmit = (ev) => {
            /************************************************
             * PATCH : Channel's API Key
             * 
             * Body contains CSRF Double-submit cookie val.
             ***********************************************/
            ev.preventDefault()
            if (form.dataset.idempotent) return
            form.dataset.idempotent = o.rand()
            spinner(ev)
            const 
                method = 'PATCH'
                ,uri = `/c/key/${state.cid}`
                ,payload = {csrf: o.rand(22)} 
                ,fname = 'uqrate_key.json'
                ,reportOkay = (resp) => `
                    <div class="report success">
                        <h3>
                            <code>
                                <input type="text" id="apikey-got" value="${resp.body.key}">
                            </code>
                        </h3>
                        <h4 id="apikey-got-buttons">
                            <button data-action="copy" class="button copy">Copy key</button> 
                            <button data-action="download" class="button download">Download file</button> 
                        </h4>
                    </div>
                `
                ,respHandler = (resp) => {
                    logDeb('doSubmit() : resp:', resp)
                    // Replace spinner with result report.
                    if (resp.body && resp.meta && (resp.meta.status < 299)) {
                        // @ Okay
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportOkay(resp))
                        state.resp = resp
                        action.removeEventListener('click', doToggleForm)
                        o.purge(dt)
                        o.toDOM(dt, `<h2><em class="center alpha50">Store your SECRET key securely.</em></h2>`)
                        return true
                    } else {
                        // @ Fail
                        o.purge(dd[0])
                        o.toDOM(dd[0], reportFail(resp))

                        return Promise.reject({
                            why: `${method} : HTTP response code : ${resp.meta.status}`, 
                            what: {resp: resp},
                            where: 'respHandler(..)'
                        })
                    }
                }
                ,doButtons = (ev) => { // Copy | Download
                    ev.preventDefault()
                     const input = o.id('apikey-got')

                    logDeb(ev.target, ev)

                    // @ Copy
                    ;(ev.target.dataset.action === 'copy')
                        && Promise.resolve(o.copyToClipboard(input))
                            .then(() => (ev.target.innerHTML = 'TEXT COPIED'))

                    // @ Download
                    if (ev.target.dataset.action === 'download') {
                        const 
                            arr = [JSON.stringify(state.resp.body)]
                            ,blob = new Blob(arr, {type : 'application/json'})
                            ,fname = `uqrate${
                                (state.resp.body.chn_slug) 
                                    ? ( '.' + state.resp.body.chn_slug )
                                    : ''
                            }.json`
                            ,a = document.createElement('a')
                            ,href = URL.createObjectURL(blob)

                        a.classList.add('hide')
                        a.setAttribute('download', fname)
                        a.href = href
                        a.setAttribute('target', '_blank')
                        Promise.resolve(a.click(),o.Delay(1000))
                            .then(() => URL.revokeObjectURL(href))
                            .then(() => (ev.target.innerHTML = 'JSON DOWNLOADED'))
                    }
                }
                ,keyHandler = () => {
                    const buttonBox = o.id('apikey-got-buttons')
                    return buttonBox.addEventListener('click', o.throttle(200, doButtons))
                }

            return auth.FetchAPI(method, uri, payload)
                        .then(respHandler)
                        .then(keyHandler)
                        .catch(logErr)
        }

    eb.sub(eTypes.Auth, o.throttle(200, getOwnedChns))

    // Toggle the form on click
    action.addEventListener('click', doToggleForm)

    // @ radio button/chkbox input
    form && form.addEventListener('click', o.throttle(200, doRadio))

    // @ submit button
    form && form.addEventListener('submit', doSubmit)

    // Init the form button 
    submit.classList.add('disabled')

    chkValidity()
    resetSubmitButtonState()

})(window[__APP__] = window[__APP__] || {}) 
;(function (o, undefined) {
    'use strict'
    /*********************************************************************
     * Centre : Top lists : Messages|Channels : Newest, Trending, Popular
     ********************************************************************/
    const 
        cName = 'centre'
        ,cSelector = `#${cName}`
        ,cNode = o.css(cSelector)
        ,view = o.View()
        ,keys = view.components

    if (!cNode) return 

    keys[cName] = (() => {
        const 
            logDeb      = view.logDeb(cName)
            ,logErr     = view.logErr(cName)
            ,logFocus   = view.logFocus(cName)
            ,debugOFF   = ''//o.log.debugOFF // ''
            ,eb = o.EB()
            ,eTypes = eb.eTypes()
            ,ss = o.State().store

            // Model 
            ,modelMenu = o.css('#channel-header .menu')
            ,modelMenuItems = o.cssAll('#channel-header .menu LI A')
            ,lTypeMenu = o.css('#msg-list-menu')
            ,contents = o.cssAll('#app .content>*')
            ,channels = o.css('#chn-list')
            ,messages = o.css('#msg-list')

            ,purgeContents = () => (
                [...contents].map(node => o.purge(node))
                ,(state.idsRendered = [])
            )

            // List type : user selection
            ,lTypesEls = o.cssAll('LI', lTypeMenu)
            ,lType = () => lTypesEls && [...lTypesEls]
                                .filter(li => (li.classList.contains('active')))[0].textContent.toLowerCase()
            ,setActiveLType = (node) => {
                if (node.nodeName !== 'LI') return
                ;[...lTypesEls].map(li => li.classList.remove('active'))
                node.classList.add('active')
            }

            /*********************************************************************
             * Local (IIFE) state per page load; init/defaults.
             * Render state is managed locally, unlike at msg-list renderers,
             * which relies entirely on external o.State for render integrity.
             * 
             * This scheme is better; simpler, more robust; abides subsidiarity.
             ********************************************************************/
            ,initModel = 'Message' // Per data-model @ class="active" @ /centre/channel.gohtml
            ,state = {
                model:          o.ModelName(o.Models[initModel]),
                list:           o.ListName(o.Models[initModel]),
                ltype:          lType(),
                scroll:         false,
                tag:            '',
                idsRendered:    [],
                length:         -1,
            }

            ,resetView = () => {
                state.tag = ''
                o.removeHash()
                purgeContents()
            }
            ,uriRoot = (model) => (o.Models[model] === o.Models.Channel)
                                    ? 'cl/top' : 'ml/top'

            // @ Click : user selects list model, type, and tag (optional list filter)

            ,doSelectModel = (ev) => {
                resetView()
                if (!ev.target.dataset.model)
                    return false
                state.model = ev.target.dataset.model
                state.list  = o.ListName(o.Models[ev.target.dataset.model])
                state.ltype = lType()

                return doTopLists()
            }
            ,doSelectLType = (ev) => {
                resetView()
                setActiveLType(ev.target)
                state.ltype = lType()

                return doTopLists()
            }
            ,doHashTag = (ev) => {
                if (ev.target.nodeName !== 'A') return
                if (ev.target.classList.contains('active')) return
                /**************************************************
                 * Set state.tag; the content filter upon render.
                 *************************************************/
                o.aDelay(10, () => (
                    (window.location.hash) && (
                        (state.tag = window.location.hash.substring(1)))
                        ,doTopLists()
                ))
            }

            ,doTopLists = () => {
                /********************************************************************
                 * Publish request for content of user-selected model and list type
                 *******************************************************************/
                //if (!ss.msg_list) return
                eb.off(eTypes.State, doTopLists)
                state.tag && window.scrollTo(0, 0)
                state.scroll = false

                eb.pub(eTypes.View, {
                    dType: o.dTypes.diff
                    ,want: ['top']
                    ,uri:  [uriRoot(state.model), state.ltype]
                })
            }

            // @ Render

            ,avatarHide = true
            ,avatar = (x) => x ? x : 'uqrate-avatar.png'
            ,banner = (x) => x ? x : 'uqrate-banner.webp'
            ,about = (chn) => chn.owner_about ? chn.owner_about : chn.about 
            ,exclTags = ["Uncategorized", "Column", "Latest", "Links"]
            ,includesTag = (tags, tag) => tags.filter(x => (o.replaceAll(x,' ', '') === tag)).length
            ,htmlTags = (arr = [], selected = '') => arr.filter(tag => !exclTags.includes(tag)).map(tag => `
                <span>
                    <a 
                        class="${(o.replaceAll(tag,' ', '') === selected) ? 'bold' : ''}"
                        href="#${o.replaceAll(tag,' ', '')}">${tag}</a>
                </span>
            `)
            ,html = {
                Channel: (chn, tag = '') => (tag ? (includesTag(chn.tags, tag)) : true) 
                                                && (chn.slug !== 'sub') && `
                    <div class="channel-of-list">

                        <div class="banner${!chn.owner_banner ? ' hide' : ''}">
                            <img src="${o.cfg.view.banners}/${banner(chn.owner_banner)}">
                        </div>

                        <div class="main">
                            <div class="head">
                                <div class="avatar${avatarHide ? ' hide' : ''}">
                                    <img src="${o.cfg.view.avatars}/${avatar(chn.owner_avatar)}">
                                </div>
                                <h4>
                                    <a href="/${chn.owner_handle}/${chn.slug}">${chn.owner_handle}/${chn.slug}</a>
                                </h4>
                            </div>
                            <p>
                                ${(about(chn) !== 'proxy') ? about(chn) : 'This channel mirrors the blog.'}
                            </p>
                            <div class="tags${chn.tags.length ? '' : ' hide'}">
                                ${htmlTags(chn.tags, tag).join('<span class="sep">|</span> ')}
                            </div>
                        </div>
                    </div>
                `,
                Message: (msg) => `<h4>${msg.idx} by ${msg.author_handle} @ ${msg.date}</h4>`,
            }
        
        // @ init : close over whatevs at this node.
        if (!view.validate.node(cNode, cSelector)) return function() {} 

        /***********************************************************************
         * Hide all data-model contents where page-menu anchor is not 'active'
         * (Also affected by doShowContent(..) @ channels.js)
         **********************************************************************/
        ;[...modelMenuItems].filter(el => (!el.classList.contains('active')))
            .map(a => [...contents].map(el => (
                (a.dataset.model === el.dataset.model) && el.classList.add('hide')
            ))
        )
        purgeContents()

        // Listen : (initial page) state
        eb.sub(eTypes.State, doTopLists)

        // @ model menu
        modelMenu && modelMenu.addEventListener('click', doSelectModel)

        // @ list-type menu
        lTypeMenu && lTypeMenu.addEventListener('click', doSelectLType)
        
        // @ tag (filter) select
        cNode.addEventListener('click', doHashTag)

        // @ render per state
        return (data) => {
            if (!view.validate.key(data, cName)) return false
            //data.list = data.lists[state.list][state.ltype] //... copy by reference.
            if (!(data.list && data.list.length)) 
                return true

            // Messages model rendering handled elsewhere (See msg-list.js).
            if (data.active.model === o.ModelName(o.Models.Message)) 
                return true

            const 
                a  = data.list[0].date
                ,b = data.list[data.list.length -1].date
                ,oldest = (a - b > 0) ? b : a // ss.active.oldest.date

                ,onScroll = () => {
                    /*************************************************************************
                     * Publish request for older data if near page bottom of ltype 'newest',
                     * only once per data. This is "infinite scroll".
                     ************************************************************************/
                    if (o.scrollPagePct() < 90) 
                        return 

                    if (state.ltype !== o.lTypeName(o.lTypes.newest)) 
                        return

                    state.scroll = true
                    window.removeEventListener('scroll', onScroll)

                    //logFocus({a: a, b: b})

                    eb.pub(eTypes.View, {
                        //dType: o.dTypes.scroll
                        dType: o.dTypes.diff
                        ,want: ['top']
                        ,uri:  [uriRoot(state.model), state.ltype, oldest, 50]
                    })
                }

                ,idKey = (state.model === o.ModelName(o.Models.Channel)) ? 'chn_id' : 'msg_id'
                ,ctnr  = (state.model === o.ModelName(o.Models.Channel)) ? channels : messages 
                /**********************************************************************************
                 * Render scheme is much simpler and somewhat faster than those of msg-list.js, 
                 * yet has all the benefits of those declarative-time schedulers.
                 * Scheduling per count, abiding rIC and rAF, with eventual render guaranteed.
                 *********************************************************************************/
                ,render = (node, obj, i) => {
                    // Forbid duplicates.
                    if (state.idsRendered.includes(obj.id)) return 

                    // Schedule politely yet guarantee this element renders (within about i*30 frames).
                    o.rIC(() => o.toDOMrAF(node, html[state.model](obj, state.tag)), (i * 500))

                    //logFocus(obj.idx, obj.id, obj.owner_handle)

                    // Reckon the rendered element.
                    state.idsRendered.push(obj.id)
                }

            // Purge content lest data is continuation of current list (@ scroll event)
            !state.scroll && purgeContents()

            // Assure reverse-chron order (newest first) if list type is 'newest'.
            !!((state.ltype === o.lTypeName(o.lTypes.newest)) && (b > a)) 
                && data.list.sort((a,b) => (b.date - a.date))

            // Render the list lest of Message model
            data.list.map((obj, i) => render(ctnr, obj, i))

            // Reattach the scroll listener after list renders if any.
            !!(state.length !== state.idsRendered.length) 
                && window.addEventListener('scroll', onScroll)
            state.length = state.idsRendered.length
        }
    })()

})(window[__APP__] = window[__APP__] || {}) 
;(function (o, undefined) {
    'use-strict'
    /**************************************************************************
     * Add to Home Screen (Button) for PWAs : 87% (CanIUse.com)
     * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen 
     * Install CRITERIA     : https://web.dev/install-criteria/
     * manifest.webmanifest : https://www.w3.org/TR/appmanifest/#typical-structure
     * 
     * Service worker fetch-event listener/handler is used by browser vendors 
     * to validate PWA functionality. If such is missing or faux (caching nothing),
     * then browsers may prevent this pop-up button from functioning.
     *************************************************************************/
    const srcID = 'A2HS'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus = o.log(srcID, o.log.levels.FOCUS)
        ,debugOFF = o.log.debugOFF
        //,eb = o.EB()
        //,eTypes = eb.eTypes()
        ,css = o.css    
        //,header = css('header')
        ,button = css('#a2hs')
        //,pwaPrompt = 'beforeinstallprompt'
        ,state = {defer: undefined}
        //,peek = true // true @ TEST (preview)

    if (!button) return

    // Append/declare aBtn at header
    //o.toDOM(header, `<button class="a2hs">Install : Add to home screen</button>`)
    //header.innerHTML = `<button class="a2hs">Install : Add to home screen?</button>`
    //const aBtn = css('.a2hs')
    //!peek && (button.style.display = 'none')

    //logFocus('@ loaded')
    window.addEventListener('beforeinstallprompt', (ev) => {
        ev.preventDefault()
        state.defer = ev
        //button.style.display = 'block'
        button.classList.remove('hide')
        logFocus('@ beforeinstallprompt :', ev)

        button.addEventListener('click', (ev) => {
            logFocus('@ click :', ev)
            //button.style.display = 'none'
            button.classList.add('hide')
            state.defer.prompt()
            state.defer.userChoice.then((u) => {
                if (u.outcome === 'accepted') {
                    log('user ACCEPTED')
                } else {
                    log('user REJECTED')
                }
                state.defer = null
            })
        })
    })

})( window[__APP__] = window[__APP__] || {} )
;(function(o, undefined){
    'use-strict'
    /**************************************************************************
     * Loader is the application initialization script 
     *************************************************************************/
    //console.log('@',(document.currentScript.src).split('/').reverse()[0])

    // Reset scroll to top on (just before) page reload  
    window.addEventListener('beforeunload', () => window.scrollTo(0, 0))
    //... https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event

    // @ Page load 
    window.addEventListener('load', () => {

        // Load cfg object else die.
        if ((typeof o.cfg === 'undefined') || (typeof o.cfg.loader === 'undefined')) {
            console.log('@ Loader : FAIL @ cfg')
            return
        }

        const 
            srcID = 'Loader'
            ,log = o.log(srcID)
            ,logDeb = o.log(srcID, o.log.levels.DEBUG)
            ,debugOFF = ''//o.log.debugOFF  // ''
            ,logFocus = o.log(srcID, o.log.levels.FOCUS)
            ,logErr = o.log(srcID, o.log.levels.ERROR)
            ,cfg = o.cfg.loader
            ,eb = o.EB()
            ,eTypes = eb.eTypes() 
            ,filltext = o.filltext
            ,svgLogoDef = o.cfg.view && o.cfg.view.svgLogoDef
            ,pageView = o.css('#view')
            ,page = o.Page()

            // @ DEV/TEST : Bypass IFRAME-source validation.
            ,mockValid = false

            ,iframeHandler = (state) => {
                /****************************************************************
                 * This runs once, initializing IFRAME monitoring and messaging.
                 * 
                 * If @ IFRAME and parent validate, then listen to View events, 
                 * and post iframeStatus message to parent, per thread toggle,
                 * passing it the new pageView.clientHeight .
                 * 
                 * Also ... ???
                 * Send chn_id; client sends back chn_id and article obj, 
                 * which includes msg_id; we upsert using msg_id.
                 ***************************************************************/
                const 
                    eb = o.EB()
                    /***************************************************
                     * Post iframe height to parent:
                     * - per thread toggle.
                     * - per scheduled sequence.
                     **************************************************/
                    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage 
                    //,post = (msg) => page.parent.postMessage(msg, "*")
                    ,post = (msg) => page.parent.postMessage(msg, page.referrer)
                    ,iframeStatus = () => ({
                        referrer: page.referrer,
                        height: pageView.clientHeight,
                        state: {key: state.key, channel: state.channel}
                    })
                    ,onToggle = (ebMsg) => (
                        (ebMsg.arg === 'toggleFormRequest') || (ebMsg.arg === 'toggleThreadFired')
                    ) && o.aDelay(100, () => post(iframeStatus()))
                    ,schStatus = () => o.aScheduleSeq(o.seq125(200), () => post(iframeStatus()))

                // Per schedule
                schStatus()

                // Per toggle of any height-changing element
                eb.sub(eTypes.View, onToggle)
    
                window.addEventListener("message", (ev) => {
                    /********************************************************
                     * Listen for messages from parent page.
                     * Abort lest message source is (top-most) parent page.
                     *******************************************************/
                    if (page.top !== ev.source) return

                    /**********************************************************
                     * UPSERT the thread-root message (blog article or such) 
                     * of parent page; that for which we are hosting comments.
                     *********************************************************/
                    const 
                        article = (dataset) => dataset ? ({
                            chnOwner: dataset.chnOwner,
                            chnSlug: dataset.chnSlug,
                            msgId: dataset.msgId,
                            msgTitle: dataset.msgTitle,
                            msgSummary: dataset.msgSummary,
                            chnId: dataset.chnId, //... sent & returned
                        }) : undefined
                        // REDUNDANT : channelNode is REDUNDANT 
                        // See #article node : data-article-id="TID"
                        //,channelNode = o.css('#channel')
                        
                        // UPDATE : Client handles upsert
                        ,upsert = article(ev.data.dataset)
                        ,doUpsert = (article) => logDeb('TODO : UPSERT per Fetch / dataset API :', article)

                    // upsert && (upsert.chnId === state.channel.chn_id) && doUpsert(upsert)
                    
                    // REDUNDANT : Set TID/MID (thread-root message) per Dataset API (data-tid="TID")
                    //channelNode && ev.data.dataset && ev.data.dataset.msgId 
                    //    && (channelNode.dataset.tid = ev.data.dataset.msgId)

                    logDeb('Got msg from PARENT :', { 
                        data: ev.data,
                        top: page.top,          // https://fify.news/   (Restricted object)
                            ev: {
                            origin: ev.origin,  // https://fify.news    (String)
                            source: ev.source,  // https://fify.news/   (Restricted object)
                            target: ev.target,  // https://swarm.now/thread/MSG_ID  (This iframe)
                        },
                    })
                }, false)
            }

            /***************************************************************
             * validateParent(..) matches host against referrer;
             * page.referrer (window) v. channel.host_url (uqrate record).
             **************************************************************/
            ,validateParent = (url) => (
                    url && (page.referrer.indexOf(url) !== -1)
                ) ? true : false
            ,onState = (i) => {
                /****************************************
                 * Launch iframeHandler(..) and die.
                 ***************************************/
                const state = o.State().get(i)
                // Do nothing until state.channel key arrives. 
                if (!state.channel) return

                // Stop listening regardless
                eb.off(eTypes.State, onState)

                // Validate the iframe upon arrival of State's channel key.
                if (mockValid || validateParent(state.channel.host_url)) {
                    iframeHandler(state) // @ Success

                } else {                 // @ Fail
                    /*********************************************************
                     * On parent-validation fail, replace entire page view
                     * with a static content.
                     ********************************************************/
                    logDeb('state :', state ) 

                    // Replace this embedded-page content with static content.
                    const obj = JSON.stringify({ 
                            comment: (state.channel.slug === "404") 
                                ? 'Parent article NOT FOUND' : 'Channel host-referrer MISMATCH',
                            referrer: page.referrer,
                            chnHostURL: (state.channel.slug === "404") 
                                        ? 'N/A' : (state.channel.host_url || 'NONE'),
                            replies: (state.channel.slug === "404") 
                                        ? '404 (Not Found)' : 'N/A',
                        }, null, '\t')

                    // Static content @ fail : banner link, blurb, and meta-object str.
                    pageView.innerHTML = `
                        <div class="iframe-guard">
                            <a target="_parent" href="${cfg.origin}">
                                <svg>
                                    <use href="#def-uqrate-banner"></use>
                                </svg>
                            </a>
                            <p>
                                Speak your mind,<br>
                                mind your <span>P</span>s and <span>q</span>s,<br>
                                and <b>prosper</b>.
                            </p>
                            <div class="pre">
                                <pre>obj: ${obj}</pre>
                            </div>
                        </div>
                    `
                    return
                }

            }

        /****************
         * INIT the app
         ***************/

        /*******************************************************
         * IF in IFRAME, then hide most markup, mute colors, 
         * and listen to State for channel key,
         * whence iframe is validated/initialized.
        *******************************************************/
        page.embedded && ([
                o.css('HEADER'), 
                o.css('FOOTER'), 
                o.id('article'), 
                o.css('#owner .banner'), 
                o.css('#owner .channel H3'), 
                o.css('#owner .channel P'), 
                o.css('#owner .badge')
            ].map(el => el && el.classList.add('hide'))
            // ...o.cssAll('ASIDE.right') //... NO. Else main right-justified @ wide view

            ,page.embedded && pageView.classList.add('iframe-grayscale')

            ,eb.sub(eTypes.State, onState)
        )

        /*************************************************************
         * Regardless, publish load-event want(s) over the event bus.
         ************************************************************/
        eb.pub(eTypes.Loader, {want: ['init']})

        logDeb(debugOFF)
        logDeb('is @ iframe :', (page.embedded && page)) 

        /******************************
         * Service Worker : Register
         *****************************/
        ;(() => {
            const 
                onResolved = (registration) => {
                    log('REGISTERed \'' + cfg.sw + '\' @ SCOPE:'
                        ,registration.scope.replace(location.origin, '')
                    )
                }
                ,onRejected = (err) => {
                    logErr('FAILed @ REGISTERing', cfg.sw, '::', err)
                }

            ;('serviceWorker' in navigator)
                ? navigator.serviceWorker.register(cfg.sw)
                    .then(onResolved, onRejected)
                : log('NO SUPPORT for ServiceWorker API @ Browser')
        })//()

        /***************
         * LAB
         **************/
         ;(() => {   
            const buttonGroup = o.id('group-1')
            // buttons group click event bind/handle
            !!(buttonGroup) && buttonGroup
                .addEventListener('click', function (e) {
                    var f = e.target.innerHTML.replace('()','')
                    if (typeof o[f] === 'function') { 
                        o[f]()
                    }
                })

            // Populate `.filltext` class
            ;(typeof filltext === 'function') && (
                !![...document.querySelectorAll('.filltext')]
                    .map(el => el.textContent = filltext(el.dataset.sentences))
            )
        })//()

    })
})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
)
