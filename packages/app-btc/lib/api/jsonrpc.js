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
var bignumber_js_1 = require("bignumber.js");
var lib_common_util_js_1 = require("lib-common-util-js");
var network_1 = require("../network");
var getBalance = function (address, network) {
    if (network === void 0) { network = 'BTC'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, data, balance, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = network_1.config.networks[network].jsonrpc + "/addr/" + address;
                    console.log("[" + network + " getBalance req]: " + url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, lib_common_util_js_1.HttpClient.get(url)];
                case 2:
                    data = (_a.sent()).data;
                    console.log("[" + network + " getBalance resp]:", data);
                    balance = data.balance;
                    return [2, bignumber_js_1.default(balance)];
                case 3:
                    e_1 = _a.sent();
                    throw Error("[" + network + " getBalance error]: " + e_1);
                case 4: return [2];
            }
        });
    });
};
exports.getBalance = getBalance;
var getUnspentTx = function (address, network) {
    if (network === void 0) { network = 'BTC'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, _a, data, utxos_1, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = network_1.config.networks[network].jsonrpc + "/addr/" + address + "/utxo";
                    console.log("[" + network + " getUnspentTx req]: " + url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, lib_common_util_js_1.HttpClient.get(url)];
                case 2:
                    _a = (_b.sent()).data, data = _a === void 0 ? [] : _a;
                    console.log("[" + network + " getUnspentTx resp]:", data);
                    utxos_1 = [];
                    data.forEach(function (tx) {
                        utxos_1.push({
                            script: tx.scriptPubKey,
                            amount: tx.satoshis,
                            hash: tx.txid,
                            index: tx.vout,
                        });
                    });
                    return [2, utxos_1];
                case 3:
                    e_2 = _b.sent();
                    throw Error("[" + network + " getUnspentTx error]: " + e_2);
                case 4: return [2];
            }
        });
    });
};
exports.getUnspentTx = getUnspentTx;
var getRawTx = function (txhash, network) {
    if (network === void 0) { network = 'BTC'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, _a, data, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = network_1.config.networks[network].jsonrpc + "/rawtx/" + txhash;
                    console.log("[" + network + " getRawTx req]: " + url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, lib_common_util_js_1.HttpClient.get(url)];
                case 2:
                    _a = (_b.sent()).data, data = _a === void 0 ? {} : _a;
                    return [2, data.rawtx];
                case 3:
                    e_3 = _b.sent();
                    throw Error("[" + network + " getRawTx error]: " + e_3);
                case 4: return [2];
            }
        });
    });
};
exports.getRawTx = getRawTx;
var broadcastTransaction = function (encoded, network) { return __awaiter(void 0, void 0, void 0, function () {
    var url, resp, payload, e_4, _a, _b, txid, tx;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                url = "" + network_1.config.networks[network].broadcast;
                console.log("[" + network + " broadcastTransaction req]: " + url);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                payload = network.match('TEST') ? { rawtx: encoded } : { tx: encoded };
                return [4, lib_common_util_js_1.HttpClient.post(url, payload, true)];
            case 2:
                resp = _c.sent();
                console.log("[" + network + " broadcastTransaction resp]:", resp);
                return [3, 4];
            case 3:
                e_4 = _c.sent();
                throw Error("[" + network + " broadcastTransaction error]: " + e_4);
            case 4:
                _a = (resp || {}).data, _b = _a === void 0 ? {} : _a, txid = _b.txid, tx = _b.tx;
                if (txid || tx) {
                    return [2, txid || tx.hash];
                }
                throw Error("[" + network + " broadcastTransaction error]: " + resp.data);
        }
    });
}); };
exports.broadcastTransaction = broadcastTransaction;
var getTransactionStatus = function (txId, network) {
    if (network === void 0) { network = 'BTC'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, data, blockheight, blocktime, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = network_1.config.networks[network].jsonrpc + "/tx/" + txId;
                    console.log("[" + network + " getTransactionStatus req]: " + url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, lib_common_util_js_1.HttpClient.get(url)];
                case 2:
                    data = (_a.sent()).data;
                    console.log("[" + network + " getTransactionStatus resp]:", data);
                    blockheight = data.blockheight, blocktime = data.blocktime;
                    return [2, {
                            status: true,
                            blockNumber: blockheight,
                            timestamp: blocktime,
                        }];
                case 3:
                    e_5 = _a.sent();
                    throw Error("[" + network + " getTransactionStatus error]: " + e_5);
                case 4: return [2];
            }
        });
    });
};
exports.getTransactionStatus = getTransactionStatus;
var getTransactionsByAddress = function (address, page, size, timestamp, network) {
    if (timestamp === void 0) { timestamp = undefined; }
    if (network === void 0) { network = 'BTC'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, data, _a, getTxs, txs_1, e_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = network_1.config.networks[network].jsonrpc + "/txs/?address=" + address + "&pageNum=" + page;
                    console.log("[" + network + " getTransactionsByAddress req]: " + url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, lib_common_util_js_1.HttpClient.get(url)];
                case 2:
                    data = (_b.sent()).data;
                    console.log("[" + network + " getTransactionsByAddress resp]:", data);
                    _a = data.txs, getTxs = _a === void 0 ? [] : _a;
                    txs_1 = {};
                    getTxs.forEach(function (t) {
                        var tx = {};
                        tx.hash = t.txid;
                        tx.timestamp = t.time * 1000;
                        tx.blockNumber = t.blockheight;
                        tx.status = 'CONFIRMED';
                        var vin = t.vin, vout = t.vout;
                        tx.from = _aggregateItems(vin);
                        tx.to = _aggregateItems(vout);
                        tx.fee = t.fees;
                        if (tx.blockNumber > 0) {
                            txs_1[tx.hash] = tx;
                        }
                    });
                    return [2, txs_1];
                case 3:
                    e_6 = _b.sent();
                    throw Error("[" + network + " getTransactionsByAddress error]: " + e_6);
                case 4: return [2];
            }
        });
    });
};
exports.getTransactionsByAddress = getTransactionsByAddress;
var COIN = 100000000;
var _aggregateItems = function (items) {
    if (!items)
        return [];
    var l = items.length;
    var ret = [];
    var tmp = {};
    var u = 0;
    for (var i = 0; i < l; i++) {
        var notAddr = false;
        if (items[i].scriptSig && !items[i].addr) {
            items[i].addr = "Unparsed address [" + u++ + "]";
            items[i].notAddr = true;
            notAddr = true;
        }
        if (items[i].scriptPubKey && !items[i].scriptPubKey.addresses) {
            items[i].scriptPubKey.addresses = ["Unparsed address [" + u++ + "]"];
            items[i].notAddr = true;
            notAddr = true;
        }
        if (items[i].scriptPubKey && items[i].scriptPubKey.addresses.length > 1) {
            items[i].addr = items[i].scriptPubKey.addresses.join(',');
            ret.push(items[i]);
            continue;
        }
        var addr = items[i].addr || (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);
        if (!tmp[addr]) {
            tmp[addr] = {};
            tmp[addr].valueSat = 0;
            tmp[addr].count = 0;
            tmp[addr].addr = addr;
            tmp[addr].items = [];
        }
        tmp[addr].isSpent = items[i].spentTxId;
        tmp[addr].doubleSpentTxID = tmp[addr].doubleSpentTxID || items[i].doubleSpentTxID;
        tmp[addr].doubleSpentIndex = tmp[addr].doubleSpentIndex || items[i].doubleSpentIndex;
        tmp[addr].dbError = tmp[addr].dbError || items[i].dbError;
        tmp[addr].valueSat += Math.round(items[i].value * COIN);
        tmp[addr].items.push(items[i]);
        tmp[addr].notAddr = notAddr;
        if (items[i].unconfirmedInput) {
            tmp[addr].unconfirmedInput = true;
        }
        tmp[addr].count += 1;
    }
    Object.values(tmp).forEach(function (v) {
        v.value = v.value || parseInt(v.valueSat) / COIN;
        ret.push(v);
    });
    return ret;
};
//# sourceMappingURL=jsonrpc.js.map