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
exports = module.exports = stringify
exports.getSerialize = serializer

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
            var thisPos = stack.indexOf(this)
            ;(~thisPos) ? stack.splice(thisPos + 1): stack.push(this)
            ;(~thisPos) ? keys.splice(thisPos, Infinity, key): keys.push(key)
            if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
        } else stack.push(value)

        return replacer == null ? value : replacer.call(this, key, value)
    }
}