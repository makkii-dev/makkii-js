"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    "networks": {
        "mainnet": {
            "jsonrpc": "https://mainnet.infura.io/v3/64279947c29a4a8b9daf61f4c6c426b5",
            "explorer_api": {
                "provider": "ethplorer",
                "url": "http://api.ethplorer.io"
            },
            "explorer": {
                "provider": "etherchain",
                "url": "https://www.etherchain.org/tx"
            }
        },
        "ropsten": {
            "jsonrpc": "https://ropsten.infura.io/v3/64279947c29a4a8b9daf61f4c6c426b5",
            "explorer_api": {
                "provider": "etherscan",
                "url": "https://api-ropsten.etherscan.io/api"
            },
            "explorer": {
                "provider": "etherscan",
                "url": "https://api-ropsten.etherscan.io/tx"
            }
        },
        "pokket": {
            "jsonrpc": "http://45.118.132.89:8080/pokketchain",
            "explorer_api": {
                "provider": "etherscan",
                "url": "https://api-ropsten.etherscan.io/api"
            },
            "explorer": {
                "provider": "etherscan",
                "url": "https://api-ropsten.etherscan.io/tx"
            }
        }
    },
    "etherscanApikey": "W97WSD5JD814S3EJCJXHW7H8Y3TM3D2UK2",
    "ethplorerApiKey": "freekey"
};
exports.remote = {
    qa: 'http://45.118.132.89:8080',
    prod: 'https://www.chaion.net/makkii',
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
function customRemote(object) {
    exports.remote = deepMergeObject(exports.remote, object);
}
exports.customRemote = customRemote;
//# sourceMappingURL=network.js.map