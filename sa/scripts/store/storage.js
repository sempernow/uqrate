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
}