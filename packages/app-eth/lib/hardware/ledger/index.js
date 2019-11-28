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
const transaction_1 = require("../../lib_keystore/transaction");
class EthLedger {
    constructor() {
        this.hardware = {};
        this.getAccount = (index) => __awaiter(this, void 0, void 0, function* () {
            const path = `44'/60'/0'/0/${index}`;
            const { address, publicKey } = yield this.hardware.getAddress(path, false);
            return { address, index, publicKey };
        });
        this.getHardwareStatus = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getAccount(0);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.signTransaction = (transaction, params) => __awaiter(this, void 0, void 0, function* () {
            const unsigned = transaction_1.process_unsignedTx(transaction);
            const { derivationIndex } = params;
            const path = `44'/60'/0'/0/${derivationIndex}`;
            const res = yield this.hardware.signTransaction(path, unsigned.serialize().toString('hex'));
            const sig = {};
            sig.r = Buffer.from(res.r, 'hex');
            sig.s = Buffer.from(res.s, 'hex');
            sig.v = parseInt(res.v, 16);
            Object.assign(unsigned, sig);
            const validSig = unsigned.verifySignature();
            if (!validSig) {
                throw new Error('sign error: invalid signature');
            }
            return `0x${unsigned.serialize().toString('hex')}`;
        });
    }
}
exports.default = EthLedger;
//# sourceMappingURL=index.js.map