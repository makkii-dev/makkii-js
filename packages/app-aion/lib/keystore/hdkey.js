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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require("bip39");
var utils_1 = require("../utils");
var keyPair_1 = require("./keyPair");
var ED25519_CURVE = 'ed25519 seed';
var HARDENED_KEY_MULTIPLIER = 0x80000000;
var getHardenedNumber = function (nr) { return Buffer.from(((HARDENED_KEY_MULTIPLIER | nr) >>> 0).toString(16), 'hex'); };
var getMasterKeyFromSeed = function (seed) { return utils_1.hmacSha512(ED25519_CURVE, seed); };
var replaceDerive = function (val) { return val.replace("'", ''); };
var pathRegex = new RegExp("^m(/\\d+'?){3}/[0,1]/\\d+'?$");
var isValidPath = function (path) {
    if (!pathRegex.test(path)) {
        return false;
    }
    return !path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .some(function (n) { return isNaN(n); });
};
var CKDPriv = function (key, index) {
    var parentPrivateKey = key.slice(0, 32);
    var parentChainCode = key.slice(32, 64);
    var offset = getHardenedNumber(index);
    var parentPaddedKey = new Uint8Array(1 + parentPrivateKey.length + 4);
    parentPaddedKey.set(parentPrivateKey, 1);
    parentPaddedKey.set(offset, parentPrivateKey.length + 1);
    return utils_1.hmacSha512(parentChainCode, parentPaddedKey);
};
var derivePath = function (path, seed) {
    if (!isValidPath(path)) {
        throw new Error('Invalid derivation path');
    }
    var key = getMasterKeyFromSeed(seed);
    var segments = path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .map(function (el) { return parseInt(el, 10); });
    var ret = segments.reduce(function (parentKey, el) { return CKDPriv(parentKey, el); }, key);
    return keyPair_1.keyPair(ret.slice(0, 32));
};
function getKeyFromMnemonic(mnemonic, index) {
    return __awaiter(this, void 0, void 0, function () {
        var path, seed, keyPair_, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    path = "m/44'/425'/0'/0/" + index;
                    return [4, bip39.mnemonicToSeed(mnemonic)];
                case 1:
                    seed = _a.sent();
                    keyPair_ = derivePath(path, seed);
                    return [2, {
                            private_key: keyPair_.privateKey, public_key: keyPair_.publicKey, address: keyPair_.address, index: index,
                        }];
                case 2:
                    e_1 = _a.sent();
                    throw Error("get Key AION failed: " + e_1);
                case 3: return [2];
            }
        });
    });
}
exports.getKeyFromMnemonic = getKeyFromMnemonic;
//# sourceMappingURL=hdkey.js.map