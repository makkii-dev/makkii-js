"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hw_app_btc_1 = require("@ledgerhq/hw-app-btc");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const network_1 = require("./network");
let wallet = {};
exports.wallet = wallet;
const initWallet = (transport) => {
    exports.wallet = wallet = new hw_app_btc_1.default(transport);
};
exports.initWallet = initWallet;
const getWalletStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getAccountByLedger(0, 'BTC');
        return true;
    }
    catch (e) {
        return false;
    }
});
exports.getWalletStatus = getWalletStatus;
const getAccountByLedger = (index, network) => __awaiter(void 0, void 0, void 0, function* () {
    const coinType = network.startsWith('BTC') ? 0 : 2;
    const network_ = network_1.networks[network];
    const path = `m/49'/${coinType}'/0'/0/${index}`;
    let { publicKey } = yield wallet.getWalletPublicKey(path);
    publicKey = getCompressPublicKey(publicKey);
    const { address } = bitcoinjs_lib_1.payments.p2pkh({ pubkey: Buffer.from(publicKey, 'hex'), network: network_ });
    return { address, index, publicKey };
});
exports.getAccountByLedger = getAccountByLedger;
function getCompressPublicKey(publicKey) {
    let compressedKeyIndex;
    if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
        compressedKeyIndex = '03';
    }
    else {
        compressedKeyIndex = '02';
    }
    return compressedKeyIndex + publicKey.substring(2, 66);
}
const signByLedger = (index, sender, msg, network) => __awaiter(void 0, void 0, void 0, function* () {
    msg = Buffer.isBuffer(msg) ? msg : Buffer.from(msg);
    const ret = yield getAccountByLedger(index, network);
    if (ret.address !== sender) {
        throw new Error('error.wrong_device');
    }
    const coinType = network.startsWith('BTC') ? 0 : 2;
    const path = `m/49'/${coinType}'/0'/0/${index}`;
    const result = yield wallet.signMessageNew(path, msg.toString('hex'));
    return { signature: result.r + result.s };
});
exports.signByLedger = signByLedger;
//# sourceMappingURL=ledger.js.map