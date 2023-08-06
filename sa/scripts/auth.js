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
