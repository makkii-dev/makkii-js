import * as jsSha3 from "js-sha3";

export const pubToAddress = (pub: Buffer) => {
    if (pub.length !== 64) {
        throw new Error(`invalid Pubkey length: ${pub.length}`);
    }
    return jsSha3.keccak256(pub).slice(-20);
};

export const toChecksumAddress = (address: string) => {
    address = address.startsWith("0x")
        ? address.slice(2).toLowerCase()
        : address.toLowerCase();
    const hash = jsSha3.keccak256(address);
    let ret = "0x";

    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase();
        } else {
            ret += address[i];
        }
    }

    return ret;
};
