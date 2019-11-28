"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto-browserify');
exports.crypto = crypto;
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
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
exports.ab2str = ab2str;
//# sourceMappingURL=index.js.map