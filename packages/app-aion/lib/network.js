"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    networks: {
        mainnet: {
            jsonrpc: 'https://aion.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=c8b8ebb4f10f40358b635afae72c2780',
            explorer_api: 'https://mainnet-api.theoan.com',
            explorer: 'https://mainnet.theoan.com/#/transaction',
        },
        mastery: {
            jsonrpc: 'https://aion.api.nodesmith.io/v1/mastery/jsonrpc?apiKey=c8b8ebb4f10f40358b635afae72c2780',
            explorer_api: 'https://mastery-api.theoan.com',
            explorer: 'https://mastery.theoan.com/#/transaction',
        },
    }
};
exports.remote = {
    qa: 'http://45.118.132.89:8080',
    prod: 'https://www.chaion.net/makkii',
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
function customRemote(object) {
    exports.remote = deepMergeObject(exports.remote, object);
}
exports.customRemote = customRemote;
//# sourceMappingURL=network.js.map