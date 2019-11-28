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
const lib_hw_ledger_js_1 = require("lib-hw-ledger-js");
const lib_common_util_js_1 = require("lib-common-util-js");
const transaction_1 = require("../../lib_keystore/transaction");
const rlp = require('aion-rlp');
class AionLedger {
    constructor() {
        this.hardware = {};
        this.getAccount = (index) => __awaiter(this, void 0, void 0, function* () {
            const { address } = yield this.hardware.getAccount(index);
            return { address, index };
        });
        this.getHardwareStatus = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.getAccount(0);
                return !!res;
            }
            catch (e) {
                return false;
            }
        });
        this.signTransaction = (tx, params) => __awaiter(this, void 0, void 0, function* () {
            const { index } = params;
            const rlpEncoded = transaction_1.process_unsignedTx(tx);
            const account = yield this.hardware.getAccount(index);
            const signature = yield this.hardware.sign(0 + index, rlpEncoded);
            const fullSignature = Buffer.concat([Buffer.from(lib_common_util_js_1.hexutil.stripZeroXHexString(account.pubKey), 'hex'),
                Buffer.from(lib_common_util_js_1.hexutil.stripZeroXHexString(signature), 'hex')]);
            const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);
            const rawTransaction = rlp.encode(rawTx);
            return `0x${rawTransaction.toString('hex')}`;
        });
        this.setLedgerTransport = (transport) => {
            this.hardware = new lib_hw_ledger_js_1.AionApp(transport);
            return this;
        };
    }
}
exports.default = AionLedger;
//# sourceMappingURL=index.js.map