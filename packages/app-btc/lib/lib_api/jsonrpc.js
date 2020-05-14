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
var makkii_utils_1 = require("@makkii/makkii-utils");
exports["default"] = (function (config) {
    var getBalance = function (address) { return __awaiter(void 0, void 0, void 0, function () {
        var url, data, balance, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = config.insight_api + "/addr/" + address;
                    console.log("[" + config.network + " req] getBalance: " + url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, makkii_utils_1.HttpClient.get(url)];
                case 2:
                    data = (_a.sent()).data;
                    console.log("[" + config.network + " resp] getBalance:", data);
                    balance = data.balance;
                    return [2, new bignumber_js_1["default"](balance)];
                case 3:
                    e_1 = _a.sent();
                    throw new Error("[" + config.network + " getBalance error]: " + e_1);
                case 4: return [2];
            }
        });
    }); };
    var getUnspentTx = function (address) { return __awaiter(void 0, void 0, void 0, function () {
        var url, _a, data, utxos, i, tx, rawtx, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = config.insight_api + "/addr/" + address + "/utxo";
                    console.log("[" + config.network + " req] getUnspentTx: " + url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4, makkii_utils_1.HttpClient.get(url)];
                case 2:
                    _a = (_b.sent()).data, data = _a === void 0 ? [] : _a;
                    console.log("[" + config.network + " resp] getUnspentTx:", data);
                    utxos = [];
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < data.length)) return [3, 6];
                    tx = data[i];
                    return [4, getRawTx(tx.txid)];
                case 4:
                    rawtx = _b.sent();
                    utxos.push({
                        script: tx.scriptPubKey,
                        amount: tx.satoshis,
                        hash: tx.txid,
                        index: tx.vout,
                        raw: rawtx
                    });
                    _b.label = 5;
                case 5:
                    i += 1;
                    return [3, 3];
                case 6: return [2, utxos];
                case 7:
                    e_2 = _b.sent();
                    throw new Error("[" + config.network + " error] getUnspentTx: " + e_2);
                case 8: return [2];
            }
        });
    }); };
    var getRawTx = function (txhash) { return __awaiter(void 0, void 0, void 0, function () {
        var url, _a, data, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = config.insight_api + "/rawtx/" + txhash;
                    console.log("[" + config.network + " req] getRawTx: " + url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, makkii_utils_1.HttpClient.get(url)];
                case 2:
                    _a = (_b.sent()).data, data = _a === void 0 ? {} : _a;
                    return [2, data.rawtx];
                case 3:
                    e_3 = _b.sent();
                    throw new Error("[" + config.network + " error] getRawTx: " + e_3);
                case 4: return [2];
            }
        });
    }); };
    var broadcastTransaction = function (encoded) { return __awaiter(void 0, void 0, void 0, function () {
        var url, resp, payload, e_4, _a, data, txid, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = "" + config.broadcast;
                    console.log("[" + config.network + " req] broadcastTransaction: " + url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    payload = config.network.match("TEST")
                        ? { rawtx: encoded }
                        : { tx: encoded };
                    return [4, makkii_utils_1.HttpClient.post(url, payload, true)];
                case 2:
                    resp = _b.sent();
                    console.log("[" + config.network + " resp] broadcastTransaction:", resp);
                    return [3, 4];
                case 3:
                    e_4 = _b.sent();
                    throw new Error("[" + config.network + " error] broadcastTransaction: " + e_4);
                case 4:
                    _a = (resp || {}).data, data = _a === void 0 ? {} : _a;
                    txid = data.txid, tx = data.tx;
                    if (txid || tx) {
                        return [2, txid || tx.hash];
                    }
                    throw new Error("[" + config.network + "  error] broadcastTransaction: " + resp.data);
            }
        });
    }); };
    var getTransactionStatus = function (txId) { return __awaiter(void 0, void 0, void 0, function () {
        var url, data, blockheight, blocktime, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = config.insight_api + "/tx/" + txId;
                    console.log("[" + config.network + " req] getTransactionStatus: " + url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, makkii_utils_1.HttpClient.get(url)];
                case 2:
                    data = (_a.sent()).data;
                    console.log("[" + config.network + " resp] getTransactionStatus:", data);
                    blockheight = data.blockheight, blocktime = data.blocktime;
                    return [2, {
                            status: true,
                            blockNumber: blockheight,
                            timestamp: blocktime
                        }];
                case 3:
                    e_5 = _a.sent();
                    return [2, null];
                case 4: return [2];
            }
        });
    }); };
    var getTransactionsByAddress = function (address, page, size) { return __awaiter(void 0, void 0, void 0, function () {
        var url, data, _a, getTxs, txs_1, e_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = config.insight_api + "/txs/?address=" + address + "&pageNum=" + page;
                    console.log("[" + config.network + " req] getTransactionsByAddress: " + url);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, makkii_utils_1.HttpClient.get(url)];
                case 2:
                    data = (_b.sent()).data;
                    console.log("[" + config.network + " resp] getTransactionsByAddress:", data);
                    _a = data.txs, getTxs = _a === void 0 ? [] : _a;
                    txs_1 = {};
                    getTxs.forEach(function (t) {
                        var tx = {};
                        tx.hash = t.txid;
                        tx.timestamp = t.time * 1000;
                        tx.blockNumber = t.blockheight;
                        tx.status = "CONFIRMED";
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
                    throw new Error("[" + config.network + " error] getTransactionsByAddress: " + e_6);
                case 4: return [2];
            }
        });
    }); };
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
            if (items[i].scriptPubKey &&
                items[i].scriptPubKey.addresses.length > 1) {
                items[i].addr = items[i].scriptPubKey.addresses.join(",");
                ret.push(items[i]);
                continue;
            }
            var addr = items[i].addr ||
                (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);
            if (!tmp[addr]) {
                tmp[addr] = {};
                tmp[addr].valueSat = 0;
                tmp[addr].count = 0;
                tmp[addr].addr = addr;
                tmp[addr].items = [];
            }
            tmp[addr].isSpent = items[i].spentTxId;
            tmp[addr].doubleSpentTxID =
                tmp[addr].doubleSpentTxID || items[i].doubleSpentTxID;
            tmp[addr].doubleSpentIndex =
                tmp[addr].doubleSpentIndex || items[i].doubleSpentIndex;
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
    return {
        broadcastTransaction: broadcastTransaction,
        getBalance: getBalance,
        getTransactionStatus: getTransactionStatus,
        getTransactionsByAddress: getTransactionsByAddress,
        getUnspentTx: getUnspentTx,
        getRawTx: getRawTx
    };
});
