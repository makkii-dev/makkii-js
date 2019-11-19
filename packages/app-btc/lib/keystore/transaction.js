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
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var bignumber_js_1 = require("bignumber.js");
var lib_common_util_js_1 = require("lib-common-util-js");
var network_1 = require("./network");
var ledger_1 = require("./ledger");
var jsonrpc_1 = require("../api/jsonrpc");
exports.signTransaction = function (transaction, network) {
    if (network === void 0) { network = 'BTC'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var private_key, compressed, utxos, amount_, to_address, change_address, byte_fee, extra_param, mainnet, amount, fee, balance, ip, needChange, txb, ip, sender, derivationIndex, _a, address, publicKey, coinType, tx_1, inputs, paths, ip, preTxhex, preTx, tx2, outputScriptHex, encoded, keyPair, ip, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    private_key = transaction.private_key, compressed = transaction.compressed, utxos = transaction.utxos, amount_ = transaction.amount, to_address = transaction.to_address, change_address = transaction.change_address, byte_fee = transaction.byte_fee, extra_param = transaction.extra_param;
                    mainnet = network_1.networks[network];
                    amount = new bignumber_js_1.default(amount_);
                    fee = network === 'BTC' || network === 'BTCTEST' ? exports.estimateFeeBTC(utxos.length, 2, byte_fee || 10) : exports.estimateFeeLTC;
                    balance = new bignumber_js_1.default(0);
                    for (ip = 0; ip < utxos.length; ip += 1) {
                        balance = balance.plus(new bignumber_js_1.default(utxos[ip].amount));
                    }
                    if (balance.isLessThan(amount.plus(fee))) {
                        throw new Error('error_insufficient_amount');
                    }
                    needChange = balance.isGreaterThan(amount.plus(fee));
                    txb = new bitcoinjs_lib_1.TransactionBuilder(mainnet);
                    for (ip = 0; ip < utxos.length; ip += 1) {
                        txb.addInput(utxos[ip].hash, utxos[ip].index, 0xffffffff, Buffer.from(utxos[ip].script, 'hex'));
                    }
                    txb.addOutput(to_address, amount.toNumber());
                    if (needChange) {
                        txb.addOutput(change_address, balance.minus(amount).minus(fee).toNumber());
                    }
                    if (!(extra_param && extra_param.type === '[ledger]')) return [3, 7];
                    sender = extra_param.sender, derivationIndex = extra_param.derivationIndex;
                    return [4, ledger_1.getKeyByLedger(derivationIndex, network)];
                case 1:
                    _a = _b.sent(), address = _a.address, publicKey = _a.publicKey;
                    if (sender !== address) {
                        throw new Error('ledger.wrong_device');
                    }
                    coinType = network.startsWith('BTC') ? 0 : 2;
                    tx_1 = txb.buildIncomplete();
                    inputs = [];
                    paths = [];
                    ip = 0;
                    _b.label = 2;
                case 2:
                    if (!(ip < utxos.length)) return [3, 5];
                    return [4, jsonrpc_1.getRawTx(utxos[ip].hash, network)];
                case 3:
                    preTxhex = _b.sent();
                    preTx = ledger_1.wallet.splitTransaction(preTxhex);
                    inputs.push([
                        preTx,
                        utxos[ip].index,
                    ]);
                    paths.push("m/49'/" + coinType + "'/0'/0/" + derivationIndex);
                    _b.label = 4;
                case 4:
                    ip += 1;
                    return [3, 2];
                case 5:
                    tx2 = ledger_1.wallet.splitTransaction(tx_1.toHex());
                    outputScriptHex = ledger_1.wallet.serializeTransactionOutputs(tx2).toString('hex');
                    return [4, ledger_1.wallet.createPaymentTransactionNew(inputs, paths, undefined, outputScriptHex, 0, 1, false)];
                case 6:
                    encoded = _b.sent();
                    return [2, { encoded: encoded }];
                case 7:
                    keyPair = bitcoinjs_lib_1.ECPair.fromPrivateKey(Buffer.from(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), 'hex'), {
                        network: mainnet,
                        compressed: compressed,
                    });
                    for (ip = 0; ip < utxos.length; ip += 1) {
                        txb.sign(ip, keyPair);
                    }
                    tx = txb.build();
                    return [2, { encoded: tx.toHex() }];
            }
        });
    });
};
exports.estimateFeeBTC = function (m, n, byte_fee) { return bignumber_js_1.default(148 * m + 34 * n + 10).times(byte_fee); };
exports.estimateFeeLTC = bignumber_js_1.default(20000);
//# sourceMappingURL=transaction.js.map