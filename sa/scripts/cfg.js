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
