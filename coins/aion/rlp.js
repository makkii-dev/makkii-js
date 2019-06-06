import * as RLP from 'rlp';
import BigNumber from 'bignumber.js';

const padTo16Bytes = (bigNumber) => {
    let hexNr = bigNumber.toString(16);
    if (hexNr.length %2 !== 0 ) {
        hexNr = '0' + hexNr;
    }
    for (let i = 0; i < 16 - hexNr.length; i++ ) {
        hexNr = '0' + hexNr;
    }
    return '0x00' + hexNr;
};

const encodeLength = (len , offset) => {
    if (len < 56) {
        return Buffer.from([len + offset]);
    } else {
        const hexLength = intToHex(len);
        const lLength = hexLength.length / 2;
        const firstByte = intToHex(offset + 55 + lLength);
        return Buffer.from(firstByte + hexLength, 'hex');
    }
};

const intToHex = (i) => {
    let hex = i.toString(16);
    return hex.length % 2 ? '0' + hex : hex;
};

export class AionRlp {
    static encode = (input) => {
        if (input instanceof Array) {
            throw new Error('Use encodeList to encode arrays');
        }
        return RLP.encode(input);
    };

    static encodeLong = (input) => {
        let number = new BigNumber(input);
        if (!number.isGreaterThan(new BigNumber('0x00000000FFFFFFFF'))) {
            return AionRlp.encode(input);
        }
        return RLP.encode(padTo16Bytes(number));
    };

    static encodeList = (input) => {
        if (!(input instanceof Array)) {
            throw new Error('input is not array');
        }

        for (let i = 0; i < input.length; i++) {
            if (!Buffer.isBuffer(input[i])) {
                throw new Error('encode list accepts only buffers');
            }
        }
        let buf = Buffer.concat(input);
        return Buffer.concat([encodeLength(buf.length, 192), buf]);
    };
}