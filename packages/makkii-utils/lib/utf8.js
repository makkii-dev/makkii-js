"use strict";
exports.__esModule = true;
var hex_1 = require("./hex");
var UnicodeNormalizationForm;
(function (UnicodeNormalizationForm) {
    UnicodeNormalizationForm["current"] = "";
    UnicodeNormalizationForm["NFC"] = "NFC";
    UnicodeNormalizationForm["NFD"] = "NFD";
    UnicodeNormalizationForm["NFKC"] = "NFKC";
    UnicodeNormalizationForm["NFKD"] = "NFKD";
})(UnicodeNormalizationForm = exports.UnicodeNormalizationForm || (exports.UnicodeNormalizationForm = {}));
function toUtf8Bytes(str, form) {
    if (form === void 0) { form = UnicodeNormalizationForm.current; }
    if (form !== UnicodeNormalizationForm.current) {
        checkNormalize();
        str = str.normalize(form);
    }
    var result = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 0x80) {
            result.push(c);
        }
        else if (c < 0x800) {
            result.push((c >> 6) | 0xc0);
            result.push((c & 0x3f) | 0x80);
        }
        else if ((c & 0xfc00) === 0xd800) {
            i++;
            var c2 = str.charCodeAt(i);
            if (i >= str.length || (c2 & 0xfc00) !== 0xdc00) {
                throw new Error("invalid utf-8 string");
            }
            c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
            result.push((c >> 18) | 0xf0);
            result.push(((c >> 12) & 0x3f) | 0x80);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
        else {
            result.push((c >> 12) | 0xe0);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
    }
    return hex_1.arrayify(result);
}
exports.toUtf8Bytes = toUtf8Bytes;
function toUtf8String(bytes, ignoreErrors) {
    bytes = hex_1.arrayify(bytes);
    var result = "";
    var i = 0;
    while (i < bytes.length) {
        var c = bytes[i++];
        if (c >> 7 === 0) {
            result += String.fromCharCode(c);
            continue;
        }
        var extraLength = null;
        var overlongMask = null;
        if ((c & 0xe0) === 0xc0) {
            extraLength = 1;
            overlongMask = 0x7f;
        }
        else if ((c & 0xf0) === 0xe0) {
            extraLength = 2;
            overlongMask = 0x7ff;
        }
        else if ((c & 0xf8) === 0xf0) {
            extraLength = 3;
            overlongMask = 0xffff;
        }
        else {
            if (!ignoreErrors) {
                if ((c & 0xc0) === 0x80) {
                    throw new Error("invalid utf8 byte sequence; unexpected continuation byte");
                }
                throw new Error("invalid utf8 byte sequence; invalid prefix");
            }
            continue;
        }
        if (i + extraLength > bytes.length) {
            if (!ignoreErrors) {
                throw new Error("invalid utf8 byte sequence; too short");
            }
            for (; i < bytes.length; i++) {
                if (bytes[i] >> 6 !== 0x02) {
                    break;
                }
            }
            continue;
        }
        var res = c & ((1 << (8 - extraLength - 1)) - 1);
        for (var j = 0; j < extraLength; j++) {
            var nextChar = bytes[i];
            if ((nextChar & 0xc0) !== 0x80) {
                res = null;
                break;
            }
            res = (res << 6) | (nextChar & 0x3f);
            i++;
        }
        if (res === null) {
            if (!ignoreErrors) {
                throw new Error("invalid utf8 byte sequence; invalid continuation byte");
            }
            continue;
        }
        if (res <= overlongMask) {
            if (!ignoreErrors) {
                throw new Error("invalid utf8 byte sequence; overlong");
            }
            continue;
        }
        if (res > 0x10ffff) {
            if (!ignoreErrors) {
                throw new Error("invalid utf8 byte sequence; out-of-range");
            }
            continue;
        }
        if (res >= 0xd800 && res <= 0xdfff) {
            if (!ignoreErrors) {
                throw new Error("invalid utf8 byte sequence; utf-16 surrogate");
            }
            continue;
        }
        if (res <= 0xffff) {
            result += String.fromCharCode(res);
            continue;
        }
        res -= 0x10000;
        result += String.fromCharCode(((res >> 10) & 0x3ff) + 0xd800, (res & 0x3ff) + 0xdc00);
    }
    return result;
}
exports.toUtf8String = toUtf8String;
function checkNormalize() {
    try {
        ["NFD", "NFC", "NFKD", "NFKC"].forEach(function (form) {
            try {
                "test".normalize(form);
            }
            catch (error) {
                throw new Error("missing " + form);
            }
        });
        if (String.fromCharCode(0xe9).normalize("NFD") !==
            String.fromCharCode(0x65, 0x0301)) {
            throw new Error("broken implementation");
        }
    }
    catch (error) {
        throw Error("platform missing String.prototype.normalize");
    }
}
