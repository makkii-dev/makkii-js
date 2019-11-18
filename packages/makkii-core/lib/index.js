"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiClient_1 = require("./apiClient");
const keystoreClient_1 = require("./keystoreClient");
const apiClient = (support_coin_lists, isTestNet) => {
    return new apiClient_1.default(support_coin_lists, isTestNet);
};
exports.apiClient = apiClient;
const keystoreClient = (support_coin_lists, isTestNet) => {
    return new keystoreClient_1.default(support_coin_lists, isTestNet);
};
exports.keystoreClient = keystoreClient;
//# sourceMappingURL=index.js.map