"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networks = {
    BTC: {
        messagePrefix: "\x18Bitcoin Signed Message:\n",
        bech32: "bc",
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    BTCTEST: {
        messagePrefix: "\x18Bitcoin Signed Message:\n",
        bech32: "tb",
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    },
    LTC: {
        messagePrefix: "\x19Litecoin Signed Message:\n",
        bip32: {
            public: 0x019da462,
            private: 0x019d9cfe
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0
    },
    LTCTEST: {
        messagePrefix: "\x19Litecoin Signed Message:\n",
        bip32: {
            public: 0x0436ef7d,
            private: 0x0436f6e1
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    }
};
//# sourceMappingURL=network.js.map