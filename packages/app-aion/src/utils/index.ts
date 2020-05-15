/* eslint-disable no-bitwise */
import * as crypto from "crypto";

function hmacSha512(key: string, str) {
    const hmac = crypto.createHmac("sha512", Buffer.from(key, "utf-8"));
    return hmac.update(Buffer.from(str)).digest();
}

const longToByteArray = (long: number) => {
    // we want to represent the input as a 8-bytes array
    const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let index = 0; index < byteArray.length; index++) {
        const byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
    }

    return byteArray;
};

function ab2str(buf: Buffer) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export { hmacSha512, longToByteArray, crypto, ab2str };
