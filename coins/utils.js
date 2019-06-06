import * as crypto from 'react-native-crypto';
import BigNumber from 'bignumber.js';

function hmacSha512(key, str) {
    const hmac = crypto.createHmac('sha512', new Buffer(key, 'utf-8'));
    return hmac.update(new Buffer(str,'utf-8')).digest();
}

function appendHexStart(str){
    let str1 = str.startsWith('0x')? str.substring(2): str;
    let str2 = str1.length % 2 ? '0' + str1: str1;
    return '0x' + str2;
}

function toHex(value) {
    if (!value) {
        return '0x00';
    } else if (typeof value === 'string') {
        return appendHexStart(value);
    } else if (value instanceof Buffer) {
        return appendHexStart(value.toString('hex'));
    } else if (typeof value === 'number') {
        return appendHexStart(value.toString(16));
    } else if (value instanceof Uint8Array) {
        return appendHexStart(Buffer.from(value).toString('hex'));
    } else if (BigNumber.isBigNumber(value)) {
        return appendHexStart(value.toString(16));
    } else {
        throw value;
    }
}

const hexString2Array=(str)=>{
    if (str.startsWith('0x')) {
        str = str.substring(2);
    }

    let result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }

    return result;
};

const longToByteArray =  (long) => {
    // we want to represent the input as a 8-bytes array
    let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let index = 0; index < byteArray.length; index++) {
        let byte = long & 0xff;
        byteArray[ index ] = byte;
        long = (long - byte) / 256
    }

    return byteArray
};

export {
    toHex,
    hmacSha512,
    hexString2Array,
    longToByteArray
};