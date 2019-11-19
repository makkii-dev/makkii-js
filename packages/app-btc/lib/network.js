"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    networks: {
        BTC: {
            jsonrpc: 'https://insight.bitpay.com/api',
            explorer: 'https://insight.bitpay.com/tx',
            broadcast: 'https://api.blockcypher.com/v1/btc/main/txs/push?token=718a0597d85f48259c457136eecb80da',
        },
        BTCTEST: {
            jsonrpc: 'https://test-insight.bitpay.com/api',
            explorer: 'https://test-insight.bitpay.com/tx/',
            broadcast: 'https://test-insight.bitpay.com/api/tx/send',
        },
        LTC: {
            jsonrpc: 'https://insight.litecore.io/api',
            explorer: 'https://insight.litecore.io/tx',
            broadcast: 'https://api.blockcypher.com/v1/ltc/main/txs/push?token=718a0597d85f48259c457136eecb80da',
        },
        LTCTEST: {
            jsonrpc: 'https://testnet.litecore.io/api',
            explorer: 'https://testnet.litecore.io/tx',
            broadcast: 'https://insight.litecore.io/api/tx/send',
        },
    }
};
function deepMergeObject(obj1, obj2) {
    Object.keys(obj2).forEach(function (key) {
        obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
            deepMergeObject(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    });
    return obj1;
}
function customNetwork(object) {
    exports.config = deepMergeObject(exports.config, object);
}
exports.customNetwork = customNetwork;
//# sourceMappingURL=network.js.map