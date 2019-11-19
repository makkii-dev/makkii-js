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
const hw_app_eth_1 = require("@ledgerhq/hw-app-eth");
let wallet = {};
exports.wallet = wallet;
const initWallet = transport => {
    exports.wallet = wallet = new hw_app_eth_1.default(transport);
};
exports.initWallet = initWallet;
const getWalletStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getKeyByLedger(0);
        return true;
    }
    catch (e) {
        return false;
    }
});
exports.getWalletStatus = getWalletStatus;
const signByLedger = (index, sender, msg) => {
    msg = Buffer.isBuffer(msg) ? msg : Buffer.from(msg);
    const path = `44'/60'/0'/0/${index}`;
    return new Promise((resolve, reject) => {
        try {
            wallet.getAddress(path).then(account => {
                if (account.address !== sender) {
                    reject(new Error('error.wrong_device'));
                }
                wallet.signPersonalMessage(path, msg.toString('hex')).then(result => {
                    let v = result.v - 27;
                    v = v.toString(16);
                    if (v.length < 2) {
                        v = `0${v}`;
                    }
                    const signature = result.r + result.s + v;
                    resolve({ signature, publicKey: account.publicKey });
                }, err => {
                    console.log(`sign tx error: ${err}`);
                    reject(new Error(err.code));
                });
            }, error => {
                console.log(`get account error: ${error}`);
                reject(new Error(error.code));
            });
        }
        catch (e) {
            reject(new Error('error.wrong_device'));
        }
    });
};
exports.signByLedger = signByLedger;
const getKeyByLedger = (index) => __awaiter(void 0, void 0, void 0, function* () {
    const path = `44'/60'/0'/0/${index}`;
    const { address, publicKey } = yield wallet.getAddress(path, false);
    return { address, index, publicKey };
});
exports.getKeyByLedger = getKeyByLedger;
//# sourceMappingURL=ledger.js.map