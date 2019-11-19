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
var hw_app_eth_1 = require("@ledgerhq/hw-app-eth");
var wallet = {};
exports.wallet = wallet;
var isConnect = false;
var initWallet = function (transport) {
    transport.on('disconnect', function () {
        isConnect = false;
    });
    exports.wallet = wallet = new hw_app_eth_1.default(transport);
};
exports.initWallet = initWallet;
var getWalletStatus = function () { return isConnect; };
exports.getWalletStatus = getWalletStatus;
var signByLedger = function (index, sender, msg) {
    msg = Buffer.isBuffer(msg) ? msg : Buffer.from(msg);
    var path = "44'/60'/0'/0/" + index;
    return new Promise(function (resolve, reject) {
        try {
            wallet.getAddress(path).then(function (account) {
                if (account.address !== sender) {
                    reject(new Error('error.wrong_device'));
                }
                wallet.signPersonalMessage(path, msg.toString('hex')).then(function (result) {
                    var v = result.v - 27;
                    v = v.toString(16);
                    if (v.length < 2) {
                        v = "0" + v;
                    }
                    var signature = result.r + result.s + v;
                    resolve({ signature: signature, publicKey: account.publicKey });
                }, function (err) {
                    console.log("sign tx error: " + err);
                    reject(new Error(err.code));
                });
            }, function (error) {
                console.log("get account error: " + error);
                reject(new Error(error.code));
            });
        }
        catch (e) {
            reject(new Error('error.wrong_device'));
        }
    });
};
exports.signByLedger = signByLedger;
var getKeyByLedger = function (index) { return __awaiter(void 0, void 0, void 0, function () {
    var path, _a, address, publicKey;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                path = "44'/60'/0'/0/" + index;
                return [4, wallet.getAddress(path, false)];
            case 1:
                _a = _b.sent(), address = _a.address, publicKey = _a.publicKey;
                return [2, { address: address, index: index, publicKey: publicKey }];
        }
    });
}); };
exports.getKeyByLedger = getKeyByLedger;
//# sourceMappingURL=ledger.js.map