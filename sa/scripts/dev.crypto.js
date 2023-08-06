;(function(o, undefined){
    'use strict'
    // ==============
    // ===  DEV  ===
    // ==============
    ;(() => {
        const srcID = 'DEV'
            ,log = o.log(srcID, o.log.levels.INFO)
            ,logErr = o.log(srcID, o.log.levels.ERROR)
            ,logDeb = o.log(srcID, o.log.levels.DEBUG)
            ,debugOFF = o.log.debugOFF // ''
            ,profOff = o.log.profOFF   // ''
            ,{  aFetch
                ,parseJWT
                ,css
                ,toDOM
                ,nowUTC
                ,UTCtoSec
            } = o
            ,baseAOA = o.cfg.net.baseAOA
            ,tokensTTL = 5
            
            ,cookieDel = (...k) => o.Cookies.del(...k)
            ,cookieGet = (k)    => o.Cookies.get(k)
            ,cookieSet = (k, v, days) => o.Cookies.set(k, v, days = tokensTTL)
            ,showCookie = (k) => logDeb('cookie >',k, ':', cookieGet(k))

            ,main = css('#channel main')
            
            ,respHandle = resp => resp.body ? resp.body : resp.meta
            ,jwt = (tkn) => ({header: tkn.header, payload: tkn.payload})
            ,jwtExpired = (tkn) => (tkn.payload && ( tkn.payload.exp < UTCtoSec(nowUTC()) ))
            ,showTokens = (at, rt) => (
                 logDeb(`at:`, jwt(parseJWT(at)))
                ,logDeb('rt:', jwt(parseJWT(rt)))
                ,logDeb('Expired Access Token?', jwtExpired(parseJWT(at))
                    , '@', UTCtoSec(nowUTC()), (new Date()).toUTCString()
                )
            )

        // =================================================================
        //   NOTE: Scripts have no access to cookies of other paths
        // =================================================================
        logDeb("All available cookies:", cookieGet())
        Object.keys(cookieGet())
            .map((k) => toDOM(main, 
                `<li><code><span>${k}:</span> ${cookieGet(k)}</code></l>`
            ))

        ;(() => {// health
            const 
                hdrs = new Headers({
                    //'Content-Type': 'application/json'
                })
                ,params = {
                    method: 'GET'
                    ,headers: hdrs
                }
                ,url = `${window.location.origin}/${baseAOA}/liveness`
                ,req = new Request(url, params)

            aFetch(req)
                .then(respHandle)
                .then(x => logDeb('liveness:', x))
        })//()

        ;(() => {// login, then get login-user data 
            const 
                loginHandle = (x) => {
                    if (!x) return Promise.reject(`FAIL @ loginHandle() > ${x}`)
                    logDeb('@ loginHandle', x)
                    ;(x.url) || (
                        (x.r) && (authStore.set(keyR, x.r))
                        ,(x.a) && (authStore.set(keyA, x.a))
                        ,showTokens(x.a, x.r)
                    )
                    return Promise.resolve(x.a)
                }

                ,refresh = () => {// Refresh Access Tkn using Refresh Tkn as authorization.
                    Promise.resolve(authStore.get(keyR))
                        .then((tkn) =>{
                            logDeb('@ refresh()', tkn)
                            const 
                                hdrs = new Headers({
                                    'Authorization': `Bearer ${tkn}`
                                })
                                ,params = {
                                    method: 'GET'
                                    ,headers: hdrs
                                }
                                ,url = `${window.location.origin}/${baseAOA}/a/refresh`
                                ,req = new Request(url, params)

                                ,refreshHandle = (x) => {
                                    if (!x) return Promise.reject('FAIL @ Refresh Handle')
                                    logDeb('@ refreshHandle', x)
                                    if (!x.url) {
                                        if (x.a) { 
                                            authStore.set(keyA, x.a)
                                        }
                                    }
                                    return Promise.resolve(x.a)
                                }

                            aFetch(req)
                                .then(respHandle)
                                .then(refreshHandle)
                                .catch(logErr)
                        })
                        .catch(logErr)
                }

                // make an authorized request
                ,getUser = (tkn) => {// Request logged-in-user's record
                    if (!tkn) return Promise.reject(`FAIL @ getUser() > ${tkn}`)
                    logDeb('@ getUser')
                    const at = parseJWT(tkn) 
                        ,uri = at ? at.payload.sub : 'No.access.token'
                        ,hdrs = new Headers({
                            'Authorization': `Bearer ${tkn}`
                        })
                        ,url = `${window.location.origin}/${baseAOA}/a/${uri}`
                        ,params = {
                            method: 'GET'
                            ,headers: hdrs
                        }
                        ,req = new Request(url, params)

                    return aFetch(req).then(respHandle).catch(logErr)
                }
                ,getUserHandle = (x) => {
                    if (!x) return Promise.reject(`FAIL @ getUser() > ${x}`)
                    ;(x.url) //... logout @ 401, refresh @ 403, else redirect to user's page. 
                        ? (logDeb('@ getUserHandle > meta:', x) 
                            ,(  (x.status === 401) && (
                                    authStore.del(keyA)
                                    ,authStore.del(keyR)
                                )
                                ,(x.status === 403) && refresh()
                            )
                        )
                        : logDeb(`@ getUserHandle > user:`, x) 
                        //|| window.location.href = `/${x.handle}` //... redirect to user's home.

                    return x
                }
                ,authStore = o.AuthStore() //o.Store('auth', 'storage','idb')
                //,otherStore = o.Store()
                ,keyA = 'at'
                ,keyR = 'rt'
                ,doLogin = () => {
                    const user = 'user@example.com'
                        ,pass = 'gophersnow'
                        ,creds = user +":"+ pass
                        ,hdrs = new Headers({
                            'Authorization': `Basic ${o.base64Encode(creds)}`
                        })
                        ,params = {
                            method: 'GET'
                            ,headers: hdrs
                        }
                        ,url = `${window.location.origin}/${baseAOA}/a/login`
                        //,url = `${window.location.origin}/health`
                        //,url = '/app/404'
                        ,req = new Request(url, params)

                    aFetch(req)
                        .then(respHandle)
                        .then(loginHandle)
                        .then(getUser)
                        .then(getUserHandle)
                        .catch(logErr)
                }

            // Treat authStore as async regardless of underlying api synchrony: 
            Promise.all([authStore.get(keyA), authStore.get(keyR)])
                .then((tkns) =>{
                    const at = tkns[0], rt = tkns[1]
                    logDeb('AuthStore.api:', authStore.api)
                    showTokens(at, rt)
                    //refresh()
                    switch (!!rt) {
                        case true:
                            getUser(at)
                                .then(getUserHandle)
                                .catch(logErr)
                            break
        
                        case false:
                            doLogin()
                            break
                    }
                })
                .catch(logErr)
        })()

        ;(() => {// WebCrypto API  
            if (!crypto.subtle) return false
            // https://dev.to/voraciousdev/a-practical-guide-to-the-web-cryptography-api-4o8n
            const algo = 'AES-GCM'
                // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
                // 95% @ CanIuse.com !!!
                ,generateKey = async () => {
                    return window.crypto.subtle.generateKey({
                                name: algo,
                                length: 256,
                            }, true, ['encrypt', 'decrypt'])
                }
                // https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
                ,encode = (data) => {
                    const encoder = new TextEncoder()
                    return encoder.encode(data)
                }
                // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
                ,generateIv = () => {//... use one PER KEY
                    // https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
                    // 97% @ CanIuse.com
                    return window.crypto.getRandomValues(new Uint8Array(12))
                }
                // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
                ,encrypt = async (data, key) => {
                    const encoded = encode(data)
                        ,iv = generateIv()
                        ,cipher = await window.crypto.subtle.encrypt({
                                        name: algo,
                                        iv: iv,
                                    }, key, encoded)
    
                    return {
                        cipher,
                        iv,
                    }
                }
                // https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
                ,pack = (buffer) => {//... to base64-encoded string
                    return window.btoa(
                        String.fromCharCode.apply(null, new Uint8Array(buffer))
                    )
                }
                // https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
                ,unpack = (packed) => {
                    const string    = window.atob(packed)
                        ,buffer     = new ArrayBuffer(string.length)
                        ,bufferView = new Uint8Array(buffer)
    
                    for (let i = 0; i < string.length; i++) {
                        bufferView[i] = string.charCodeAt(i)
                    }
                    return buffer
                }
                // https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
                ,decode = (bytestream) => {
                    const decoder = new TextDecoder()
                    return decoder.decode(bytestream)
                }
                // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
                // 95% @ CanIuse.com
                ,decrypt = async (cipher, key, iv) => {
                    const encoded = await window.crypto.subtle.decrypt({
                                        name: algo,
                                        iv: iv,
                                    }, key, cipher)
    
                    return decode(encoded)
                }
    
            // EXAMPLE 
            ;(() => {
                const app = async () => {
                // encrypt message
                    const msg = 'Hello, World!'
                        ,key = await generateKey()
                        ,{  cipher
                            ,iv 
                        } = await encrypt(msg, key)
    
                    logDeb('cipher:', cipher)
                    // pack and transmit
                    await fetch('/test', {
                            method: 'POST',
                            body: JSON.stringify({
                                        cipher: pack(cipher),
                                        iv: pack(iv),
                                    }),
                            })
    
                    // retrieve
                    const response = await fetch('/test').then(res => res.json())
    
                    // unpack and decrypt message
                    const final = await decrypt(unpack(response.cipher), key, unpack(response.iv))
                    logDeb("secret: ", final) // logs 'Hello, World!'
                }

                app()
            })//()
    
        })//()

    })()
    ;(() => {})//()

})( (typeof window !== 'undefined') 
        && (window[__APP__] = window[__APP__] || {})
            || (typeof global !== 'undefined') 
                && (global[__APP__] = global[__APP__] || {})
)
