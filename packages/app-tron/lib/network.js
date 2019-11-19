"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    network: {
        "mainnet": {
            "jsonrpc": "https://api.trongrid.io",
            "explorer_api": "https://apilist.tronscan.org/api",
            "explorer": "https://tronscan.org/#/transaction"
        },
        "shasta": {
            "jsonrpc": "https://api.shasta.trongrid.io",
            "explorer_api": "https://api.shasta.tronscan.org/api",
            "explorer": "https://shasta.tronscan.org/#/transaction"
        }
    }
};
function deepMergeObject(obj1, obj2) {
    Object.keys(obj2).forEach(key => {
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