/* eslint-disable no-bitwise */
const bs58check = require("bs58check");

const longToByteArray = long => {
    // we want to represent the input as a 8-bytes array
    const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let index = 0; index < byteArray.length; index++) {
        const byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
    }

    return byteArray;
};

function base58check2HexString(str) {
    return bs58check.decode(str).toString("hex");
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function deepMergeObject(obj1, obj2) {
    Object.keys(obj2).forEach(key => {
        obj1[key] =
            obj1[key] && obj1[key].toString() === "[object Object]"
                ? deepMergeObject(obj1[key], obj2[key])
                : (obj1[key] = obj2[key]);
    });
    return obj1;
}

export { longToByteArray, base58check2HexString, deepMergeObject, ab2str };
