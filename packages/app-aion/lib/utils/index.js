"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let crypto = {};
exports.crypto = crypto;
if (global.platform && global.platform === 'mobile') {
    try {
        exports.crypto = crypto = require('react-native-crypto');
    }
    catch (e) {
        exports.crypto = crypto = require('crypto-browserify');
    }
}
else {
    exports.crypto = crypto = require('crypto-browserify');
}
const bs58check_1 = require("bs58check");
function hmacSha512(key, str) {
    const hmac = crypto.createHmac('sha512', Buffer.from(key, 'utf-8'));
    return hmac.update(Buffer.from(str, 'utf-8')).digest();
}
exports.hmacSha512 = hmacSha512;
const longToByteArray = (long) => {
    let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
        let byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
    }
    return byteArray;
};
exports.longToByteArray = longToByteArray;
function base58check2HexString(str) {
    return bs58check_1.default.decode(str).toString('hex');
}
exports.base58check2HexString = base58check2HexString;
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
exports.ab2str = ab2str;
function deepMergeObject(obj1, obj2) {
    Object.keys(obj2).forEach(key => {
        obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
            deepMergeObject(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    });
    return obj1;
}
exports.deepMergeObject = deepMergeObject;
//# sourceMappingURL=index.js.map