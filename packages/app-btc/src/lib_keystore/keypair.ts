import { ECPair, payments } from "bitcoinjs-lib";
import { networks } from "./network";
/**
 * @hidden
 */
export const keyPair = (priKey, options) => {
    if (typeof priKey === "string") {
        if (priKey.startsWith("0x")) {
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, "hex");
    }
    let network = networks.BTC;
    if (options && options.network) {
        network = networks[options.network];
    }
    try {
        const key = ECPair.fromPrivateKey(priKey, {
            network,
            compressed:
                options.compressed === undefined ? true : options.compressed
        });
        const { privateKey } = key;
        const { publicKey } = key;
        const { address } = payments.p2pkh({ pubkey: key.publicKey, network });
        return {
            privateKey: privateKey.toString("hex"),
            publicKey: publicKey.toString("hex"),
            address,
            sign: hash => key.sign(hash),
            toWIF: () => key.toWIF()
        };
    } catch (e) {
        return undefined;
    }
};
/**
 * @hidden
 */
export const keyPairFromWIF = (WIF, options) => {
    let network = networks.BTC;
    if (options && options.network) {
        network = networks[options.network];
    }
    try {
        const key = ECPair.fromWIF(WIF, network);
        const { privateKey } = key;
        const { publicKey } = key;
        const { address } = payments.p2pkh({ pubkey: key.publicKey, network });
        return {
            privateKey: privateKey.toString("hex"),
            publicKey: publicKey.toString("hex"),
            address,
            sign: hash => key.sign(hash),
            toWIF: () => key.toWIF(),
            compressed: key.compressed
        };
    } catch (e) {
        return undefined;
    }
};
