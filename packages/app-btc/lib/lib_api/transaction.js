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
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
var jsonrpc_1 = require("./jsonrpc");
var transaction_1 = require("../lib_keystore/transaction");
exports["default"] = (function (config) {
    var _a = jsonrpc_1["default"](config), broadcastTransaction = _a.broadcastTransaction, getUnspentTx = _a.getUnspentTx;
    var sendTransaction = function (unsignedTx, signer, signerParams) { return __awaiter(void 0, void 0, void 0, function () {
        var singedTx, txId, to, from, value, fee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, signer.signTransaction(unsignedTx, signerParams)];
                case 1:
                    singedTx = _a.sent();
                    return [4, broadcastTransaction(singedTx)];
                case 2:
                    txId = _a.sent();
                    to = unsignedTx.to, from = unsignedTx.from, value = unsignedTx.value, fee = unsignedTx.fee;
                    return [2, {
                            from: from,
                            to: to,
                            value: value,
                            fee: fee,
                            hash: txId,
                            status: "PENDING"
                        }];
            }
        });
    }); };
    var getTransactionUrlInExplorer = function (txHash) {
        return config.explorer + "/" + txHash;
    };
    var buildTransaction = function (from, to, value, options) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, byte_fee, utxos, valueIn, fee, vout;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = options.byte_fee, byte_fee = _a === void 0 ? 10 : _a;
                    value = bignumber_js_1["default"].isBigNumber(value) ? value : new bignumber_js_1["default"](value);
                    return [4, getUnspentTx(from)];
                case 1:
                    utxos = _b.sent();
                    valueIn = utxos.reduce(function (valueIn_, el) { return valueIn_.plus(new bignumber_js_1["default"](el.amount)); }, new bignumber_js_1["default"](0));
                    fee = config.network.match("LTC")
                        ? transaction_1.estimateFeeLTC(byte_fee || 10)
                        : transaction_1.estimateFeeBTC(utxos.length, 2, byte_fee || 10);
                    vout = [{ addr: to, value: value.toNumber() }];
                    if (valueIn.toNumber() >
                        value.shiftedBy(8).toNumber() + fee.toNumber()) {
                        vout.push({
                            addr: from,
                            value: valueIn
                                .minus(value.shiftedBy(8))
                                .minus(fee)
                                .shiftedBy(-8)
                                .toNumber()
                        });
                    }
                    return [2, {
                            from: [{ addr: from, value: valueIn.shiftedBy(-8).toNumber() }],
                            to: vout,
                            fee: fee.shiftedBy(-8).toNumber(),
                            to_address: to,
                            change_address: from,
                            value: value,
                            utxos: utxos,
                            byte_fee: byte_fee
                        }];
            }
        });
    }); };
    return {
        sendTransaction: sendTransaction,
        buildTransaction: buildTransaction,
        getTransactionUrlInExplorer: getTransactionUrlInExplorer
    };
});
