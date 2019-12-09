"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    BTC: {
        insight_api: "https://insight.bitpay.com/api",
        explorer: "https://insight.bitpay.com/tx",
        broadcast: "https://api.blockcypher.com/v1/btc/main/txs/push?token=718a0597d85f48259c457136eecb80da"
    },
    BTCTEST: {
        insight_api: "http://172.104.190.127:3001/api",
        explorer: "https://test-insight.bitpay.com/tx/",
        broadcast: "http://172.104.190.127:3001/api/tx/send"
    },
    LTC: {
        insight_api: "https://insight.litecore.io/api",
        explorer: "https://insight.litecore.io/tx",
        broadcast: "https://api.blockcypher.com/v1/ltc/main/txs/push?token=718a0597d85f48259c457136eecb80da"
    },
    LTCTEST: {
        insight_api: "https://testnet.litecore.io/api",
        explorer: "https://testnet.litecore.io/tx",
        broadcast: "https://testnet.litecore.io/api/tx/send"
    }
};
//# sourceMappingURL=network.js.map