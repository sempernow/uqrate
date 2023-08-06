;(function(o, undefined){
    'use strict'
    
    // DEPRICATED : OAuth implemented synchronously

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
     * The Auth/OAuth service (AOA) handles client authentication for the other services; 
     * currently API and PWA services. Authenticated clients are issued Access and Refresh tokens. 
     * Protected endpoints are acessed per request header: `Authorization: Bearer <ACCESS_TOKEN>`.  
     * Additionally, each token is paired to a secure, http-only, domain-locked reference cookie, 
     * thereby tethering the Refresh token to the client whose successful authentication (login) acquired it. 
     * This affects token-cookie pairs that proxy authentication (Refresh) and authorization (Access).
     * 
     * Moreover, validation dynamics do not require clients to store the tokens themselves in cookies, 
     * so tokens needn't be sent with requests unnecessarily. 
     * Conversely, requests to protected endpoints are validated sans reference-cookie processing, 
     * nominally; only upon Access-token expiry or during a refresh request are the cookies considered. 
     * 
     * Further, the max-secured reference cookie paired to the long-lived (Refresh) token 
     * contains the source from which the token's claims issuer (a hash) is generated. 
     * A mismatch triggers `HTTP 401 Unauthorized` response, 
     * thus mitigating entire categories of attacks against bearer tokens. 
     * 
     * This scheme also lowers the nominal (sans auth) request-headers size down to about 500 bytes, 
     * and that of protected-endpoint requests to that plus that of one token. 
     * As a final note, the scheme allows for updating (refreshing) 
     * the refresh-token's issuer claim (a)periodically, further tightening security.
     * 
     * Security Model regarding token-cookie pairs: 
     *  Tokens are visible to attacker, but domain-locked cookies are not.
     *  Exploiting that, the refresh token's issuer claim must validate
     *  against its cookie reference, whereof iss: hash(value(__Host-r)).
     *  Yet the attacker cannot recreate/send that reference-cookie's value.
     *************************************************************************/
    const srcID = 'Auth'
        ,log = o.log(srcID, o.log.levels.INFO)
        ,logErr = o.log(srcID, o.log.levels.ERROR)
        ,logDeb = o.log(srcID, o.log.levels.DEBUG)
        ,logFocus = o.log(srcID, o.log.levels.FOCUS)
        ,logWarn = o.log(srcID, o.log.levels.WARN)
        ,debugOFF = ''//o.log.debugOFF // '' | o.log.debugOff 

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
            ttl
        } = o
        ,{
            rootAOA,
            baseAOA,
            rootAPI,
            baseAPI,
            rootPWA,
            basePWA,
        } = o.cfg.net
        ,urlAOA = (path) => `${rootAOA}${baseAOA}${path}`
        ,urlAPI = (path) => `${rootAPI}${baseAPI}${path}`
        ,urlPWA = (path) => `${rootPWA}${basePWA}${path}`

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

        // ,ttl = (exp) => {
        //     if (isNaN(exp)) return 0
        //     const now = UTCtoSec(nowUTC())
        //     return (exp > now) ? (exp - now) : 0
        // }
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
        ,ttlGet = (tkn) => {
            const x = parseJWT(tkn)
            return (x && x.payload && x.payload.exp) 
                        ? ttl(x.payload.exp) : 0
        }
        ,subGet = (tkn) => {
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
        ,tknGetValidSub = key => tknGetValid(key).then(subGet)
        ,tknGetValidTTL = key => tknGetValid(key).then(ttlGet) 

        ,isTknValid = (key) => tknGetValid(key).then(is => (is ? true : false))

        // AuthStore : Get/Set status (object at 'status' key)

        /****************************************************************
         * authStatus contains per-token expiries, sub claim, auth mode, 
         * provider (if per OAuth), and auth-error flag. 
         * Per-token expiry keys: exp (epoch) and expUTC.
         ***************************************************************/
        ,authStatus = {a: {}, r: {}, sub: '', mode: '', provider: '', err: {a: true, r: true}}
        ,statusGet = () => authStore.get('status')
        ,statusSet = (as) => authStore.set('status', as)
        /****************************************************************
         * statusEnhance(as) attaches the (unstorable) TTL() method,
         * per token (under key 'exp'), of a retrieved authStatus (as).
         * This function is an internal of Auth.StatusGet().
         ***************************************************************/
        ,statusEnhance = as => { 
            if (typeof as === 'undefined') 
                as = authStatus
            //as.a.TTL = () => ttl(as.a.exp) 
            //as.r.TTL = () => ttl(as.r.exp)
            
            as.a.ttl = `${Math.floor(ttl(as.a.exp)/60)} min ${ttl(as.a.exp)%60} sec`
            as.r.ttl = `${Math.floor(ttl(as.r.exp)/60)} min ${ttl(as.r.exp)%60} sec`

            return as
        }
        /****************************************************************
         * statusMake(..) parses a tkns payload,
         * and returns a (storable) authStatus object, 
         * which is an authStatus sans its (unstorable) TTL method. 
         * 
         * (Hence statusEnhance(..), which attaches the TTL method.)
         ***************************************************************/
        ,statusMake = (tkns) => {
            if (!tkns) return
            const 
                parsePayload = (rtn) => {
                    return {
                        mode: rtn.mode
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
         * statusPub() publishes/returns an enhanced authStatus obj.
         * This should occur per token event (logon and refresh).
         *************************************************************/
        ,statusPub = () => auth.StatusGet()
            .then(as => (eb.pub(eTypes.Auth, as), as)) 

        // AuthStore : store tokens and status

        /************************************************************
         * store(tkns) sets o.AuthStore keys per tokens payload,
         * and then publishes and returns an enhanced authStatus, 
         * else rejects on fail. 
         * 
         * This async function is called once per token(s) fetch; 
         * per login and all refresh responses thereafter.
         * 
         * ARGs: {
         *          a:        JWT, 
         *          r:        JWT, 
         *          mode:     o.AuthModes.MODE, 
         *          provider: PROVIDER (if per OAuth)
         *      }
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
         /***************************************************************
         * Login purges auth, then redirects to PWA-service login page. 
         * This is the lone inter-service redirect of Auth module.
         * 
         * TODO: Publish the purge event; let View handle redirect.
         ***************************************************************/
        ,login = () => purge().then(
            () => window.location.href = urlPWA('/app/login')
        )

        // Access token

        /*******************************************************************************
         * Refresh the Access tkn using Refresh tkn 
         * and its paired domain-locked cookie as authorization. 
         * If Refresh tkn is expired, i.e., if no longer authenticated, 
         * then REDIRECT TO lOGIN PAGE. Else return Access tkn, else reject on fail.
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
                         * so this response code SHOULD NEVER OCCUR here;
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
                         * so this response code SHOULD NEVER OCCUR here; 
                         * authentication was validated just prior to this call.
                         ***********************************************************/
                        if (r.meta.status === 401) 
                            return Promise.reject({
                                why: `Authentication expired`, 
                                what: r.meta,
                                where: 'refreshHandle(..)'
                            })
                        /************************************************************
                         * This HTTP 423 Locked response occurs 
                         * IIF authorization (Access) is expired, 
                         * AND authentication (Refresh) is valid.
                         * But we test for that prior to this call, 
                         * so this response code SHOULD NEVER OCCUR unless
                         * expiry of cookie differs from that of its paired token.
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

        /******************************************************************
         * aFetchAuthAPI(..) fetches auth-protected API service endpoints.
         * Abides its CORS filter. Supports its CSRF filter modes:
         *  - CustomAJAXHeader
         *  - SourceTargetHeaders
         *  - DomainLockedDouble   (if body)
         * 
         * (Caller is responsible for handling response.)
         * https://javascript.info/fetch-api
         ****************************************************************/
        ,aFetchAuthAPI = (verb, path, body = undefined) => {
            return accessGet().then(tkn => {
                const 
                    csrf = rand(15) //... regardless
                    ,hdrs = new Headers({
                        'Authorization': `Bearer ${tkn}`,
                        'X-CSRF-Token': csrf,
                    })
                    ,url = urlAPI(path)
                    ,init = {
                        method: verb,
                        headers: hdrs,
                        credentials: (body && csrf) ? "include" : "same-origin", 
                        //... creds required for csrf cookie.
                        //body: body ? JSON.stringify(Object.assign(body, {csrf: csrf})) : undefined

                        body: body ? JSON.stringify(body) : undefined
                    }//... if body, then append csrf token and serialize to JSON.
                    ,req = new Request(url, init)
                    ,cleanup = r => (body && cookieDel(keyCSRF), r)
                    //,respHandle = r => r.body ? r.body : Promise.reject(r.meta)
                    //... typical resp handler, but caller many want different.

                //csrf && hdrs.set('X-CSRF-Token', csrf)     //... fails @ Firefox
                //csrf && hdrs.append('X-CSRF-Token', csrf)  //... fails @ Firefox
                
                // Set CSRF token to domain-locked cookie for CSRF mode: DomainLockedDouble
                body && cookieSet(keyCSRF, csrf)
                
                return aFetch(req).then(cleanup)
            })
        }

        /********************************************************************
         * Fetch the user record of token-claims subject (sub), 
         * which is the user_id; return user-record object; reject on fail.
        ********************************************************************/
        ,SubRecordGet = () => {
            const respHandle = r => r.body ? r.body : Promise.reject(r.meta)
            return accessGet().then(subGet)
                    .then(uid => uid 
                        ? aFetchAuthAPI('GET', `/u/${uid}`)
                            .then(respHandle)
                        : Promise.reject({
                            why: 'Authorization expired.', 
                            what: {sub: uid},
                            where: 'SubRecordGet(..)'
                        })
                    )
                    .catch(logErr)
        }
        /*******************************************************************
         * tknsHandle stores the tokens of a login (aFetch) response body,
         * along with a created authStatus object, and returns the latter.
         * All on success, else rejects. Deletes nonces regardless.
         ******************************************************************/
        ,tknsHandle = (r) => {
            cookieDel(keyNa, keyNb, keyNc)
            if (r.meta.status !== 200) 
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
             * Where `err` imply the tkn failed to store @ AuthStore. 
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
             * Process:
             *  Server sets cookie key `kR` (HttpOnly) 
             *  to to the Refresh Token. 
             *  The response body (d.json) is Access Token,
             *  which is store at cookie key: `kA`. 
             * 
             * Summary/Assessment of OBA:
             *  - Encrypted creds of OBA mode are only obscured, not secured. 
             *  - Relies on TLS when algo obscurity fails. Thus "obfuscated".
             *  - Mitigates timing-based attacks utilizing server and client nonces.
             ***********************************************************************/ 
            function _ba(user, pass) {
                const 
                    // Get server-generated nonces
                    na = cookieGet(keyNa) || `${rand()}`
                    ,nc = cookieGet(keyNc) || `${rand()}`
                    // Override nonce (nb) with the client-generated one (nc)
                    ,nb = isString(nc) ? nc : cookieGet(keyNb)
                    //... Prefer client-generated `nb` to better mitigate timing-based attacks; 
                    //    fallback to both nonces being server-generated. 

                    ,u = obfuscate // XOR(<user-id>, REV(na))
                            ? xor(user, rev(na)) 
                            : user 
                    ,p = obfuscate // XOR(<pass>, XOR(na, REV(nb)))
                            ? xor(pass, xor(na, rev(nb)))
                            : pass
    
                    ,creds = u +":"+ p
                    ,csrf = o.rand(15)
                    ,hdrs = new Headers({
                        'Authorization': `Basic ${base64Encode(creds)}`,
                        'X-CSRF-Token': csrf,
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
                if (!nc) return Promise.reject({
                    why: 'Failed to generate client-side nonce cookie.', 
                    what: {key: keyNc, val: nc},
                    where: '_ba(..)'
                })
                logDeb(cookieGet())

                // Authenticate :: return tokens object; abides ebMsg signature of eTypes.Auth
                return aFetch(req)
                        .then(tknsHandle)
            }

            // Server infers auth mode (BA|OB) per nonce cookies,
            // so delete them unless OB mode.
            ;(obfuscate) || cookieDel(keyNa, keyNb, keyNc)

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
            return (!!crypto.subtle) 
                        ? ( sha512(cryptObj.getRandomValues(new Uint32Array(1))[0])
                                .then(h => cookieSet(keyNc, h))
                                .then(ba)
                        )
                        : ba()
        }
        ,basicAuth = (user, pass) => 
            auth.Authenticated()
                .then(is => is ? false : _basicAuth(user, pass))

        /**********************************************************
         * OAuth is handled synchronously through AOA service
         * on click event of the target-provider's button.
         * 
         * THESE oauth FUNCTIONS ARE UNUSED.
         * 
         * Final response writes a cookie (keyOA);
         * a serialized, base64-encoded JSON payload 
         * containing the token pair and its meta:
         * {a: TKN, r: TKN, mode: AUTH_MODE, provider: PROVIDER}
         *********************************************************/
        ,oafin = o => {
            logFocus(o.meta.req.url) // http://localhost:3333/v1/aoa/o/github
            // CORS error on request to our own server !!!
            // CORS ERR : Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at 
            //https://github.com/login/oauth/authorize?client_id=f740989239446af72144&redirect_uri=http%3A%2F%2Flocalhost%2Fv1%2Faoa%2Fo%2Fgithub%2Fcallback&response_type=code&scope=user%3Aemail&state=lpXiQ7ijiaSewWX0-ThH7YIQyhV_T0pv0KM8A20sNziWxv6Q9Ok87pcJUj-pWCiLbqU0kvHMNxWe5MtVI1gVWQ%3D%3D. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing)
            
            const 
                init = {
                    method: 'GET',
                    //mode: 'cors', // MUST
                    //redirect: 'follow',
                    //credentials: 'omit',
                    //referrer: '',
                    //referrerPolicy: "unsafe-url",
                    // https://javascript.info/fetch-api#referrer-referrerpolicy
                }
                ,req = new Request(o.meta.req.url, init) 

            
            aFetch(req)
                .then(logDeb)
        }
        ,_oauth = (url) => {
            /*******************************************************************
             * AJAX req/resp; analog to Basic Auth;
             * server generates tokens; we store, 
             * then getUser, then redirect.
             * 
             * Fetch API has redirect options 
             * https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
             * 
             * App's nominal CSP settings block loading of redirect url 
             * 
             * Currently, OAuth process ends ...
             * @ http://localhost/v1/aoa/o/github/callback?
             *      code=59943859c3d65cf3cc9a
             *      &state=gVX-A...D9_W1mQ==
             *******************************************************************/
            //cookieSet(keyNa, url)
            //return

            const 
                init = {
                    method: 'GET',
                    mode: 'no-cors', //... allows safe cross-origin, 
                    //... but response.type is 'opaque'; severely restricted; can't access full url to manually redirect
                    redirect: 'follow',
                    credentials: 'omit',
                    referrerPolicy: 'origin-when-cross-origin'
                }
                ,req1 = new Request(url, init) 
                // https://javascript.info/fetch-api

                //logDeb(req)
            // Authenticate
            return aFetch(req1)
                    .then(logFocus)
                    //.then(oAfin)
                    .catch(logErr)
                    //.then(loginHandle)
        }
        // Authenticate if not already; return access token else reject.
        ,oauth = (url) => 
            auth.Token.getValid(keyR)
                .then(tkn => tkn ? false : _oauth(url))

        /**************************************************
         * Signup per jForm obj that includes CSRF token
         * 
         * CSRF mode: DomainLockedDouble
         *************************************************/
        ,signup = (jForm) => {
            const 
                hdrs = new Headers({
                    //'Content-Type': 'application/json'
                    //'X-CSRF-Token': jForm.csrf 
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

            logDeb('Sending:', params.body, '@ Request:', req)

            cookieSet(keyCSRF, jForm.csrf)
            return aFetch(req)
                    .then(tknsHandle)
        }

        /**********************************************
         * initStatus() publishes authStatus object 
         * read from the AuthStore 'status' key;
         * once per page load
        **********************************************/
        ,initStatus = (cursor) => (cursor === 0) && statusPub()
        
        /*****************************************************
         * Test for successful OAuth condition, 
         * whereof the server redirects back to login page
         * after its sets the oauth-tokens cookie.
         * If so, store tkns and their status object 
         * in AuthStore, and then delete the cookie.
         ****************************************************/ 
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
                        // Login endpoint 423 Locked if valid keyOA cookie exists.
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
             * Signup/Login/Logout are natively asymmetrical. 
             * Signup is per async, returning no payload;
             * (O)BA is per async, returning JSON; 
             * OAuth is per synch, returning cookie;
             * tokens are under client's control;
             * token-ref cookies are under service's control;
             **************************************************/
            Purge: purge,               // Purge AuthStore (tokens and status).
            Login: login,               // Purge and redirect to (PWA) Login page.
            Signup: signup,             // Signup then authenticate per (O)BA. 
            Basic: basicAuth,           // (O)BA
            //OAuth: oauth,               // unused
            CheckOAuth: checkOAuth,     // Result (cookie) of (synch) OAuth process. 
            Authenticated: () => isTknValid(keyR), // bool
            Authorized:    () => isTknValid(keyA), // bool
            AccessGet: accessGet,       // Return valid access token or false; refreshed if needed.
            StatusGet: () => statusGet().then(statusEnhance),
            SubRecordGet: SubRecordGet, // Fetch the User record of (authenticated) subject.
            Store: o.AuthStore(),
            // Low level
            Token: {
                A: keyA, 
                R: keyR, 
                TTL: ttlGet,
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
