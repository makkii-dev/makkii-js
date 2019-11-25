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
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const bignumber_js_1 = require("bignumber.js");
const lib_common_util_js_1 = require("../lib_api/node_modules/lib-common-util-js");
const network_1 = require("./network");
const ledger_1 = require("./ledger");
exports.signTransaction = (transaction, network = 'BTC') => __awaiter(void 0, void 0, void 0, function* () {
    const { private_key, compressed, utxos, amount: amount_, to_address, change_address, byte_fee, extra_param, } = transaction;
    const mainnet = network_1.networks[network];
    const amount = new bignumber_js_1.default(amount_);
    const fee = network === 'BTC' || network === 'BTCTEST' ? exports.estimateFeeBTC(utxos.length, 2, byte_fee || 10) : exports.estimateFeeLTC;
    let balance = new bignumber_js_1.default(0);
    for (let ip = 0; ip < utxos.length; ip += 1) {
        balance = balance.plus(new bignumber_js_1.default(utxos[ip].amount));
    }
    if (balance.isLessThan(amount.plus(fee))) {
        throw new Error('error_insufficient_amount');
    }
    const needChange = balance.isGreaterThan(amount.plus(fee));
    const txb = new bitcoinjs_lib_1.TransactionBuilder(mainnet);
    for (let ip = 0; ip < utxos.length; ip += 1) {
        txb.addInput(utxos[ip].hash, utxos[ip].index, 0xffffffff, Buffer.from(utxos[ip].script, 'hex'));
    }
    txb.addOutput(to_address, amount.toNumber());
    if (needChange) {
        txb.addOutput(change_address, balance.minus(amount).minus(fee).toNumber());
    }
    if (extra_param && extra_param.type === '[ledger]') {
        const { sender, derivationIndex } = extra_param;
        const { address, publicKey } = yield ledger_1.getAccountByLedger(derivationIndex, network);
        if (sender !== address) {
            throw new Error('ledger.wrong_device');
        }
        const coinType = network.startsWith('BTC') ? 0 : 2;
        const tx = txb.buildIncomplete();
        const inputs = [];
        const paths = [];
        for (let ip = 0; ip < utxos.length; ip += 1) {
            const preTx = ledger_1.wallet.splitTransaction(utxos[ip].raw);
            inputs.push([
                preTx,
                utxos[ip].index,
            ]);
            paths.push(`m/49'/${coinType}'/0'/0/${derivationIndex}`);
        }
        const tx2 = ledger_1.wallet.splitTransaction(tx.toHex());
        const outputScriptHex = ledger_1.wallet.serializeTransactionOutputs(tx2).toString('hex');
        const encoded = yield ledger_1.wallet.createPaymentTransactionNew(inputs, paths, undefined, outputScriptHex, 0, 1, false);
        return { encoded };
    }
    const keyPair = bitcoinjs_lib_1.ECPair.fromPrivateKey(Buffer.from(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), 'hex'), {
        network: mainnet,
        compressed,
    });
    for (let ip = 0; ip < utxos.length; ip += 1) {
        txb.sign(ip, keyPair);
    }
    const tx = txb.build();
    return { encoded: tx.toHex() };
});
exports.estimateFeeBTC = (m, n, byte_fee) => bignumber_js_1.default(148 * m + 34 * n + 10).times(byte_fee);
exports.estimateFeeLTC = bignumber_js_1.default(20000);
//# sourceMappingURL=transaction.js.map