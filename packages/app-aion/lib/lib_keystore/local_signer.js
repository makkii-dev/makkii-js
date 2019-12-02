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
const keyPair_1 = require("./keyPair");
const blake2b = require('blake2b');
const nacl = require('tweetnacl');
const rlp = require('aion-rlp');
class AionLocalSigner {
    constructor() {
        this.signTransaction = (tx, params) => __awaiter(this, void 0, void 0, function* () {
            const { private_key } = params;
            const rlpEncoded = transaction_1.process_unsignedTx(tx);
            const ecKey = keyPair_1.keyPair(private_key);
            const rawHash = blake2b(32).update(rlpEncoded).digest();
            const signature = ecKey.sign(rawHash);
            if (nacl.sign.detached.verify(rawHash, signature, Buffer.from(lib_common_util_js_1.hexutil.hexString2Array(ecKey.publicKey))) === false) {
                throw new Error('Could not verify signature.');
            }
            const fullSignature = Buffer.concat([Buffer.from(lib_common_util_js_1.hexutil.stripZeroXHexString(ecKey.publicKey), 'hex'), signature]);
            const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);
            const rawTransaction = rlp.encode(rawTx);
            return `0x${rawTransaction.toString('hex')}`;
        });
    }
}
exports.default = AionLocalSigner;
//# sourceMappingURL=local_signer.js.map