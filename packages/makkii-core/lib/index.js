"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiClient_1 = require("./apiClient");
const keystoreClient_1 = require("./keystoreClient");
const apiClient = () => {
    return new apiClient_1.default();
};
exports.apiClient = apiClient;
const keystoreClient = () => {
    return new keystoreClient_1.default();
};
exports.keystoreClient = keystoreClient;
//# sourceMappingURL=index.js.map