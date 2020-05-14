"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
function appendHexStart(str) {
    var str1 = str.startsWith("0x") ? str.substring(2) : str;
    var str2 = str1.length % 2 ? "0" + str1 : str1;
    return "0x" + str2;
}
exports.appendHexStart = appendHexStart;
function hexStringToInt(str) {
    var strNo0x = str.startsWith("0x") ? str.substring(2) : str;
    return parseInt(strNo0x, 16);
}
exports.hexStringToInt = hexStringToInt;
function hexToAscii(hex) {
    var str = "";
    var i = 0;
    var l = hex.length;
    if (hex.substring(0, 2) === "0x") {
        i = 2;
    }
    for (; i < l; i += 2) {
        var code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
    }
    return str;
}
exports.hexToAscii = hexToAscii;
function stripZeroXHexString(str) {
    if (isHex(str)) {
        str = str.toLowerCase();
        str = str.startsWith("0x") ? str.slice(2) : str;
        return str;
    }
    throw Error("input must be a hex string");
}
exports.stripZeroXHexString = stripZeroXHexString;
function isHex(val) {
    return (typeof val === "string" && /^(-0x|0x)?[0-9a-f]+$/i.test(val) === true);
}
exports.isHex = isHex;
function removeLeadingZeroX(val) {
    return /^0x/i.test(val) === true ? val.replace(/^0x/i, "") : val;
}
exports.removeLeadingZeroX = removeLeadingZeroX;
function hexString2Array(str) {
    if (str.startsWith("0x")) {
        str = str.substring(2);
    }
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }
    return result;
}
exports.hexString2Array = hexString2Array;
function padZeros(arr_, len) {
    var arr = arrayify(arr_);
    if (arr.length > len) {
        throw new Error("cannot pad");
    }
    var buffer = Buffer.alloc(len, 0);
    buffer.set(arr, len - arr.length);
    return buffer;
}
exports.padZeros = padZeros;
function arrayify(arr) {
    if (Buffer.isBuffer(arr)) {
        return Buffer.from(arr);
    }
    if (Array.isArray(arr)) {
        return Buffer.from(arr);
    }
    arr = String(arr);
    if (arr.startsWith("0x") || isHex(arr)) {
        arr = stripZeroXHexString(arr);
        arr = arr.length % 2 === 0 ? arr : "0" + arr;
        return Buffer.from(stripZeroXHexString(arr), "hex");
    }
    return Buffer.from(arr);
}
exports.arrayify = arrayify;
function toHex(value) {
    if (!value) {
        return "0x00";
    }
    if (typeof value === "string") {
        return appendHexStart(value);
    }
    if (value instanceof Buffer) {
        return appendHexStart(value.toString("hex"));
    }
    if (typeof value === "number") {
        return appendHexStart(value.toString(16));
    }
    if (value instanceof Uint8Array) {
        return appendHexStart(Buffer.from(value).toString("hex"));
    }
    if (bignumber_js_1["default"].isBigNumber(value)) {
        return appendHexStart(value.toString(16));
    }
    throw value;
}
exports.toHex = toHex;
