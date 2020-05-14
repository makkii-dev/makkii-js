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
var hw_app_btc_1 = require("@ledgerhq/hw-app-btc");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var network_1 = require("../../lib_keystore/network");
var transaction_1 = require("../../lib_keystore/transaction");
var BtcLedger = (function () {
    function BtcLedger(network) {
        var _this = this;
        this.hardware = {};
        this.getAccount = function (index) { return __awaiter(_this, void 0, void 0, function () {
            var coinType, network_, path, publicKey, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        coinType = 0;
                        network_ = network_1.networks[this.network];
                        path = "m/49'/" + coinType + "'/0'/0/" + index;
                        return [4, this.hardware.getWalletPublicKey(path)];
                    case 1:
                        publicKey = (_a.sent()).publicKey;
                        publicKey = getCompressPublicKey(publicKey);
                        address = bitcoinjs_lib_1.payments.p2pkh({
                            pubkey: Buffer.from(publicKey, "hex"),
                            network: network_
                        }).address;
                        return [2, { address: address, index: index, publicKey: publicKey }];
                }
            });
        }); };
        this.getHardwareStatus = function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getAccount(0)];
                    case 1:
                        _a.sent();
                        return [2, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2, false];
                    case 3: return [2];
                }
            });
        }); };
        this.setLedgerTransport = function (transport) {
            _this.hardware = new hw_app_btc_1["default"](transport);
            return _this;
        };
        this.signTransaction = function (transaction, params) { return __awaiter(_this, void 0, void 0, function () {
            var utxos, txb, derivationIndex, tx, coinType, inputs, paths, ip, preTx, tx2, outputScriptHex, encoded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utxos = transaction.utxos;
                        txb = transaction_1.process_unsignedTx(transaction, this.network);
                        derivationIndex = params.derivationIndex;
                        tx = txb.buildIncomplete();
                        coinType = 0;
                        inputs = [];
                        paths = [];
                        for (ip = 0; ip < utxos.length; ip += 1) {
                            preTx = this.hardware.splitTransaction(utxos[ip].raw);
                            inputs.push([preTx, utxos[ip].index]);
                            paths.push("m/49'/" + coinType + "'/0'/0/" + derivationIndex);
                        }
                        tx2 = this.hardware.splitTransaction(tx.toHex());
                        outputScriptHex = this.hardware
                            .serializeTransactionOutputs(tx2)
                            .toString("hex");
                        return [4, this.hardware.createPaymentTransactionNew(inputs, paths, undefined, outputScriptHex, 0, 1, false)];
                    case 1:
                        encoded = _a.sent();
                        return [2, encoded];
                }
            });
        }); };
        this.network = network;
    }
    return BtcLedger;
}());
exports["default"] = BtcLedger;
function getCompressPublicKey(publicKey) {
    var compressedKeyIndex;
    if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
        compressedKeyIndex = "03";
    }
    else {
        compressedKeyIndex = "02";
    }
    return compressedKeyIndex + publicKey.substring(2, 66);
}
