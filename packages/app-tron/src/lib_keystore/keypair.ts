import { keccak256, sha256 } from "../utils";

const bs58 = require("bs58");
const ec = require("elliptic").ec("secp256k1");

const prefix = "41";

const padTo32 = msg => {
    while (msg.length < 32) {
        msg = Buffer.concat([Buffer.from([0]), msg]);
    }
    if (msg.length !== 32) {
        throw new Error(`invalid key length: ${msg.length}`);
    }
    return msg;
};

const computeAddress = publicKey => {
    if (publicKey.length === 65) {
        publicKey = publicKey.slice(1);
    }
    const hash = keccak256(publicKey).toString("hex");
    let addressHex = hash.substring(24);
    addressHex = prefix + addressHex;
    return addressHex;
};

const getBase58checkAddress = address => {
    const hash0 = sha256(Buffer.from(address, "hex"));
    const hash1 = sha256(hash0);
    const checkSum = hash1.slice(0, 4);
    const addressBytes = Buffer.from(address, "hex");
    return bs58.encode(Buffer.concat([addressBytes, checkSum]));
};

/**
 *
 * @hidden
 * @private
 */
export const keyPair = priKey => {
    if (typeof priKey === "string") {
        if (priKey.startsWith("0x")) {
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, "hex");
    }
    const key = ec.keyFromPrivate(priKey);
    const bip32pubKey = key.getPublic().toJSON();
    const publicKey = Buffer.concat([
        padTo32(Buffer.from(bip32pubKey[0].toArray())),
        padTo32(Buffer.from(bip32pubKey[1].toArray()))
    ]);
    let address = computeAddress(publicKey);
    address = getBase58checkAddress(address);
    return {
        privateKey: key.getPrivate("hex"),
        publicKey: publicKey.toString("hex"),
        address,
        sign: hash => key.sign(hash)
    };
};
