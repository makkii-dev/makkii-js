"use strict";
exports.__esModule = true;
var crypto = require("crypto-browserify");
exports.crypto = crypto;
function hmacSha512(key, str) {
    var hmac = crypto.createHmac("sha512", Buffer.from(key, "utf-8"));
    return hmac.update(Buffer.from(str, "utf-8")).digest();
}
exports.hmacSha512 = hmacSha512;
var longToByteArray = function (long) {
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (var index = 0; index < byteArray.length; index++) {
        var byte = long & 0xff;
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
