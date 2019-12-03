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
const network_1 = require("../../lib_keystore/network");
const transaction_1 = require("../../lib_keystore/transaction");
class BtcLedger {
    constructor() {
        this.hardware = {};
        this.getAccount = (index, params) => __awaiter(this, void 0, void 0, function* () {
            const { network } = params;
            const coinType = network.startsWith("BTC") ? 0 : 2;
            const network_ = network_1.networks[network];
            const path = `m/49'/${coinType}'/0'/0/${index}`;
            let { publicKey } = yield this.hardware.getWalletPublicKey(path);
            publicKey = getCompressPublicKey(publicKey);
            const { address } = bitcoinjs_lib_1.payments.p2pkh({
                pubkey: Buffer.from(publicKey, "hex"),
                network: network_
            });
            return { address, index, publicKey };
        });
        this.getHardwareStatus = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getAccount(0, { network: "BTC" });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.setLedgerTransport = (transport) => {
            this.hardware = new hw_app_btc_1.default(transport);
            return this;
        };
        this.signTransaction = (transaction, params) => __awaiter(this, void 0, void 0, function* () {
            const { utxos, network } = transaction;
            const txb = transaction_1.process_unsignedTx(transaction, params);
            const { derivationIndex } = params;
            const tx = txb.buildIncomplete();
            const coinType = network.startsWith("BTC") ? 0 : 2;
            const inputs = [];
            const paths = [];
            for (let ip = 0; ip < utxos.length; ip += 1) {
                const preTx = this.hardware.splitTransaction(utxos[ip].raw);
                inputs.push([preTx, utxos[ip].index]);
                paths.push(`m/49'/${coinType}'/0'/0/${derivationIndex}`);
            }
            const tx2 = this.hardware.splitTransaction(tx.toHex());
            const outputScriptHex = this.hardware
                .serializeTransactionOutputs(tx2)
                .toString("hex");
            const encoded = yield this.hardware.createPaymentTransactionNew(inputs, paths, undefined, outputScriptHex, 0, 1, false);
            return encoded;
        });
    }
}
exports.default = BtcLedger;
function getCompressPublicKey(publicKey) {
    let compressedKeyIndex;
    if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
        compressedKeyIndex = "03";
    }
    else {
        compressedKeyIndex = "02";
    }
    return compressedKeyIndex + publicKey.substring(2, 66);
}
//# sourceMappingURL=index.js.map