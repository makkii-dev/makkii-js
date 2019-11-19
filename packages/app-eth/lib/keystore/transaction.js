"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var ethereumjs_tx_1 = require("ethereumjs-tx");
var lib_common_util_js_1 = require("lib-common-util-js");
var ledger_1 = require("./ledger");
var KEY_MAP = [
    'amount',
    'nonce',
    'gasLimit',
    'gasPrice',
    'to',
    'private_key',
];
exports.signTransaction = function (transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var network, amount, nonce, gasLimit, gasPrice, to, private_key, data, extra_param, privateKey, txParams, tx, sender, derivationIndex, path, address, res, sig, validSig;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                network = transaction.network, amount = transaction.amount, nonce = transaction.nonce, gasLimit = transaction.gasLimit, gasPrice = transaction.gasPrice, to = transaction.to, private_key = transaction.private_key, data = transaction.data, extra_param = transaction.extra_param;
                privateKey = Buffer.from(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), 'hex');
                KEY_MAP.forEach(function (k) {
                    if (!transaction.hasOwnProperty(k)) {
                        throw new Error(k + " not found");
                    }
                });
                txParams = {
                    nonce: lib_common_util_js_1.hexutil.toHex(nonce),
                    gasPrice: lib_common_util_js_1.hexutil.toHex(gasPrice),
                    gasLimit: lib_common_util_js_1.hexutil.toHex(gasLimit),
                    to: lib_common_util_js_1.hexutil.toHex(to),
                    value: lib_common_util_js_1.hexutil.toHex(amount),
                    chainId: getChainId(network),
                    v: getChainId(network),
                    r: "0x00",
                    s: "0x00",
                };
                if (data) {
                    txParams = __assign(__assign({}, txParams), { data: data });
                }
                tx = new ethereumjs_tx_1.default(txParams);
                if (!(extra_param && extra_param.type === '[ledger]')) return [3, 3];
                sender = extra_param.sender, derivationIndex = extra_param.derivationIndex;
                path = "44'/60'/0'/0/" + derivationIndex;
                return [4, ledger_1.wallet.getAddress(path, false)];
            case 1:
                address = (_a.sent()).address;
                if (address !== sender) {
                    throw new Error('ledger.wrong_device');
                }
                console.log('try sign=>', tx.serialize().toString('hex'));
                return [4, ledger_1.wallet.signTransaction(path, tx.serialize().toString('hex'))];
            case 2:
                res = _a.sent();
                sig = {};
                sig.r = Buffer.from(res.r, 'hex');
                sig.s = Buffer.from(res.s, 'hex');
                sig.v = parseInt(res.v, 16);
                Object.assign(tx, sig);
                validSig = tx.verifySignature();
                console.log('validSig=>', validSig);
                console.log('tx=>', tx.serialize().toString('hex'));
                return [2, { encoded: "0x" + tx.serialize().toString('hex'), r: tx.r.toString('hex'), s: tx.s.toString('hex'), v: tx.v.toString('hex') }];
            case 3:
                tx.sign(privateKey);
                console.log('tx=>', tx.serialize().toString('hex'));
                return [2, { encoded: "0x" + tx.serialize().toString('hex'), r: tx.r.toString('hex'), s: tx.s.toString('hex'), v: tx.v.toString('hex') }];
        }
    });
}); };
var getChainId = function (network) {
    if (network.toLowerCase() === 'morden') {
        return 2;
    }
    if (network.toLowerCase() === 'ropsten') {
        return 3;
    }
    if (network.toLowerCase() === 'rinkeby') {
        return 4;
    }
    if (network.toLowerCase() === 'goerli') {
        return 5;
    }
    if (network.toLowerCase() === 'kovan') {
        return 42;
    }
    return 1;
};
//# sourceMappingURL=transaction.js.map