"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function base58check2HexString(str) {
    return bs58check.decode(str).toString('hex');
}
exports.base58check2HexString = base58check2HexString;
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
exports.ab2str = ab2str;
function deepMergeObject(obj1, obj2) {
    Object.keys(obj2).forEach(function (key) {
        obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
            deepMergeObject(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    });
    return obj1;
}
exports.deepMergeObject = deepMergeObject;
//# sourceMappingURL=index.js.map