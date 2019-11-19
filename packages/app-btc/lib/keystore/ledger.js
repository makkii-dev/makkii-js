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
var hw_app_btc_1 = require("@ledgerhq/hw-app-btc");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var network_1 = require("./network");
var wallet = {};
exports.wallet = wallet;
var isConnect = false;
var initWallet = function (transport) {
    transport.on('disconnect', function () {
        isConnect = false;
    });
    exports.wallet = wallet = new hw_app_btc_1.default(transport);
};
exports.initWallet = initWallet;
var getWalletStatus = function () { return isConnect; };
exports.getWalletStatus = getWalletStatus;
var getKeyByLedger = function (index, network) { return __awaiter(void 0, void 0, void 0, function () {
    var coinType, network_, path, publicKey, address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                coinType = network.startsWith('BTC') ? 0 : 2;
                network_ = network_1.networks[network];
                path = "m/49'/" + coinType + "'/0'/0/" + index;
                return [4, wallet.getWalletPublicKey(path)];
            case 1:
                publicKey = (_a.sent()).publicKey;
                publicKey = getCompressPublicKey(publicKey);
                address = bitcoinjs_lib_1.payments.p2pkh({ pubkey: Buffer.from(publicKey, 'hex'), network: network_ }).address;
                return [2, { address: address, index: index, publicKey: publicKey }];
        }
    });
}); };
exports.getKeyByLedger = getKeyByLedger;
function getCompressPublicKey(publicKey) {
    var compressedKeyIndex;
    if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
        compressedKeyIndex = '03';
    }
    else {
        compressedKeyIndex = '02';
    }
    return compressedKeyIndex + publicKey.substring(2, 66);
}
var signByLedger = function (index, sender, msg, network) { return __awaiter(void 0, void 0, void 0, function () {
    var ret, coinType, path, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msg = Buffer.isBuffer(msg) ? msg : Buffer.from(msg);
                return [4, getKeyByLedger(index, network)];
            case 1:
                ret = _a.sent();
                if (ret.address !== sender) {
                    throw new Error('error.wrong_device');
                }
                coinType = network.startsWith('BTC') ? 0 : 2;
                path = "m/49'/" + coinType + "'/0'/0/" + index;
                return [4, wallet.signMessageNew(path, msg.toString('hex'))];
            case 2:
                result = _a.sent();
                return [2, { signature: result.r + result.s }];
        }
    });
}); };
exports.signByLedger = signByLedger;
//# sourceMappingURL=ledger.js.map