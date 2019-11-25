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
const bip39 = require("bip39");
const utils_1 = require("../utils");
const keyPair_1 = require("./keyPair");
const ED25519_CURVE = 'ed25519 seed';
const HARDENED_KEY_MULTIPLIER = 0x80000000;
const getHardenedNumber = (nr) => Buffer.from(((HARDENED_KEY_MULTIPLIER | nr) >>> 0).toString(16), 'hex');
const getMasterKeyFromSeed = (seed) => utils_1.hmacSha512(ED25519_CURVE, seed);
const replaceDerive = (val) => val.replace("'", '');
const pathRegex = new RegExp("^m(/\\d+'?){3}/[0,1]/\\d+'?$");
const isValidPath = (path) => {
    if (!pathRegex.test(path)) {
        return false;
    }
    return !path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .some((n) => isNaN(n));
};
const CKDPriv = (key, index) => {
    const parentPrivateKey = key.slice(0, 32);
    const parentChainCode = key.slice(32, 64);
    const offset = getHardenedNumber(index);
    const parentPaddedKey = new Uint8Array(1 + parentPrivateKey.length + 4);
    parentPaddedKey.set(parentPrivateKey, 1);
    parentPaddedKey.set(offset, parentPrivateKey.length + 1);
    return utils_1.hmacSha512(parentChainCode, parentPaddedKey);
};
const derivePath = (path, seed) => {
    if (!isValidPath(path)) {
        throw new Error('Invalid derivation path');
    }
    const key = getMasterKeyFromSeed(seed);
    const segments = path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .map((el) => parseInt(el, 10));
    const ret = segments.reduce((parentKey, el) => CKDPriv(parentKey, el), key);
    return keyPair_1.keyPair(ret.slice(0, 32));
};
function getAccountFromMnemonic(mnemonic, index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const path = `m/44'/425'/0'/0/${index}`;
            const seed = yield bip39.mnemonicToSeed(mnemonic);
            const keyPair_ = derivePath(path, seed);
            return {
                private_key: keyPair_.privateKey, public_key: keyPair_.publicKey, address: keyPair_.address, index,
            };
        }
        catch (e) {
            throw Error(`get Key AION failed: ${e}`);
        }
    });
}
exports.getAccountFromMnemonic = getAccountFromMnemonic;
//# sourceMappingURL=hdkey.js.map