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
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const lib_common_util_js_1 = require("lib-common-util-js");
const transaction_1 = require("./transaction");
const network_1 = require("./network");
class BtcLocalSigner {
    constructor() {
        this.signTransaction = (transaction, params) => __awaiter(this, void 0, void 0, function* () {
            const txb = transaction_1.process_unsignedTx(transaction, params);
            const { utxos, network } = transaction;
            const { compressed, private_key } = params;
            const mainnet = network_1.networks[network];
            const keyPair = bitcoinjs_lib_1.ECPair.fromPrivateKey(Buffer.from(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), "hex"), {
                network: mainnet,
                compressed
            });
            for (let ip = 0; ip < utxos.length; ip += 1) {
                txb.sign(ip, keyPair);
            }
            const tx = txb.build();
            return tx.toHex();
        });
    }
}
exports.default = BtcLocalSigner;
//# sourceMappingURL=local_signer.js.map