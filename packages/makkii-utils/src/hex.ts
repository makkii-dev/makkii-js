import BigNumber from "bignumber.js";

export type Arrayish = string | ArrayLike<number>;

function appendHexStart(str: string) {
    const str1 = str.startsWith("0x") ? str.substring(2) : str;
    const str2 = str1.length % 2 ? `0${str1}` : str1;
    return `0x${str2}`;
}

function hexStringToInt(str: string) {
    const strNo0x = str.startsWith("0x") ? str.substring(2) : str;
    return parseInt(strNo0x, 16);
}

function hexToAscii(hex: string) {
    // if (!isHexStrict(hex))
    //     throw new Error('The parameter must be a valid HEX string.');

    let str = "";
    let i = 0;
    const l = hex.length;
    if (hex.substring(0, 2) === "0x") {
        i = 2;
    }
    for (; i < l; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
    }

    return str;
}

function stripZeroXHexString(str: string) {
    if (isHex(str)) {
        str = str.toLowerCase();
        str = str.startsWith("0x") ? str.slice(2) : str;
        return str;
    }
    throw Error("input must be a hex string");
}

function isHex(val: string) {
    return (
        typeof val === "string" && /^(-0x|0x)?[0-9a-f]+$/i.test(val) === true
    );
}

function removeLeadingZeroX(val: string) {
    return /^0x/i.test(val) === true ? val.replace(/^0x/i, "") : val;
}

function hexString2Array(str: string) {
    if (str.startsWith("0x")) {
        str = str.substring(2);
    }

    const result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }

    return result;
}

function padZeros(arr_: Arrayish, len: number): Buffer {
    const arr = arrayify(arr_);
    if (arr.length > len) {
        throw new Error("cannot pad");
    }
    const buffer = Buffer.alloc(len, 0);
    buffer.set(arr, len - arr.length);
    return buffer;
}

function arrayify(arr: Arrayish) {
    if (Buffer.isBuffer(arr)) {
        return Buffer.from(arr);
    }
    if (Array.isArray(arr)) {
        return Buffer.from(arr);
    }
    arr = String(arr);
    if (arr.startsWith("0x") || isHex(arr)) {
        arr = stripZeroXHexString(arr);
        arr = arr.length % 2 === 0 ? arr : `0${arr}`;

        return Buffer.from(stripZeroXHexString(arr), "hex");
    }
    return Buffer.from(arr);
}

function toHex(value: any) {
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
    if (BigNumber.isBigNumber(value)) {
        return appendHexStart(value.toString(16));
    }
    throw value;
}

export {
    arrayify,
    toHex,
    padZeros,
    appendHexStart,
    hexStringToInt,
    hexToAscii,
    stripZeroXHexString,
    isHex,
    removeLeadingZeroX,
    hexString2Array
};
