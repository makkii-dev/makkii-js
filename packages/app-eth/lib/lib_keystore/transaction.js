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
const lib_common_util_js_1 = require("lib-common-util-js");
const ledger_1 = require("./ledger");
const EthereumTx = require('ethereumjs-tx');
const KEY_MAP = [
    'amount',
    'nonce',
    'gasLimit',
    'gasPrice',
    'to',
    'private_key',
];
exports.signTransaction = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { network, amount, nonce, gasLimit, gasPrice, to, private_key, data, extra_param } = transaction;
    const privateKey = Buffer.from(lib_common_util_js_1.hexutil.removeLeadingZeroX(private_key), 'hex');
    KEY_MAP.forEach(k => {
        if (!transaction.hasOwnProperty(k)) {
            throw new Error(`${k} not found`);
        }
    });
    let txParams = {
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
        txParams = Object.assign(Object.assign({}, txParams), { data });
    }
    const tx = new EthereumTx(txParams);
    if (extra_param && extra_param.type === '[ledger]') {
        const { sender, derivationIndex } = extra_param;
        const path = `44'/60'/0'/0/${derivationIndex}`;
        const { address } = yield ledger_1.wallet.getAddress(path, false);
        if (address !== sender) {
            throw new Error('ledger.wrong_device');
        }
        console.log('try sign=>', tx.serialize().toString('hex'));
        const res = yield ledger_1.wallet.signTransaction(path, tx.serialize().toString('hex'));
        const sig = {};
        sig.r = Buffer.from(res.r, 'hex');
        sig.s = Buffer.from(res.s, 'hex');
        sig.v = parseInt(res.v, 16);
        Object.assign(tx, sig);
        const validSig = tx.verifySignature();
        console.log('validSig=>', validSig);
        console.log('tx=>', tx.serialize().toString('hex'));
        return { encoded: `0x${tx.serialize().toString('hex')}`, r: tx.r.toString('hex'), s: tx.s.toString('hex'), v: tx.v.toString('hex') };
    }
    tx.sign(privateKey);
    console.log('tx=>', tx.serialize().toString('hex'));
    return { encoded: `0x${tx.serialize().toString('hex')}`, r: tx.r.toString('hex'), s: tx.s.toString('hex'), v: tx.v.toString('hex') };
});
const getChainId = (network) => {
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