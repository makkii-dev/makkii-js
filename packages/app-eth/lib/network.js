"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    mainnet: {
        jsonrpc: "https://mainnet.infura.io/v3/64279947c29a4a8b9daf61f4c6c426b5",
        explorer_api: {
            provider: "ethplorer",
            url: "http://api.ethplorer.io",
            key: "freekey"
        },
        explorer: {
            provider: "etherchain",
            url: "https://www.etherchain.org/tx"
        }
    },
    ropsten: {
        jsonrpc: "https://ropsten.infura.io/v3/64279947c29a4a8b9daf61f4c6c426b5",
        explorer_api: {
            provider: "etherscan",
            url: "https://api-ropsten.etherscan.io/api",
            key: "W97WSD5JD814S3EJCJXHW7H8Y3TM3D2UK2"
        },
        explorer: {
            provider: "etherscan",
            url: "https://api-ropsten.etherscan.io/tx"
        }
    },
};
//# sourceMappingURL=network.js.map