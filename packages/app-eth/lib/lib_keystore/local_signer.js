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
const lib_common_util_js_1 = require("lib-common-util-js");
const transaction_1 = require("./transaction");
class EthLocalSinger {
    constructor() {
        this.signTransaction = (transaction, params) => __awaiter(this, void 0, void 0, function* () {
            const unsigned = transaction_1.process_unsignedTx(transaction);
            const { private_key } = params;
            const privateKey = Buffer.from(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), "hex");
            unsigned.sign(privateKey);
            return `0x${unsigned.serialize().toString("hex")}`;
        });
    }
}
exports.default = EthLocalSinger;
//# sourceMappingURL=local_signer.js.map