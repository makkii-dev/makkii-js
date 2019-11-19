"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const network_1 = require("./network");
exports.keyPair = function (priKey, options) {
    if (typeof priKey === 'string') {
        if (priKey.startsWith('0x')) {
            priKey = priKey.substring(2);
        }
        priKey = Buffer.from(priKey, 'hex');
    }
    let network = network_1.networks.BTC;
    if (options && options.network) {
        network = network_1.networks[options.network];
    }
    try {
        const key = bitcoinjs_lib_1.ECPair.fromPrivateKey(priKey, { network, compressed: options.compressed });
        const { privateKey } = key;
        const { publicKey } = key;
        const { address } = bitcoinjs_lib_1.payments.p2pkh({ pubkey: key.publicKey, network });
        return {
            privateKey: privateKey.toString('hex'),
            publicKey: publicKey.toString('hex'),
            address,
            sign: (hash) => key.sign(hash),
            toWIF: () => key.toWIF(),
        };
    }
    catch (e) {
        return undefined;
    }
};
exports.keyPairFromWIF = function (WIF, options) {
    let network = network_1.networks.BTC;
    if (options && options.network) {
        network = network_1.networks[options.network];
    }
    try {
        const key = bitcoinjs_lib_1.ECPair.fromWIF(WIF, network);
        const { privateKey } = key;
        const { publicKey } = key;
        const { address } = bitcoinjs_lib_1.payments.p2pkh({ pubkey: key.publicKey, network });
        return {
            privateKey: privateKey.toString('hex'),
            publicKey: publicKey.toString('hex'),
            address,
            sign: (hash) => key.sign(hash),
            toWIF: () => key.toWIF(),
            compressed: key.compressed,
        };
    }
    catch (e) {
        return undefined;
    }
};
//# sourceMappingURL=keypair.js.map