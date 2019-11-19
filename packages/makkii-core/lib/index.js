"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apiClient_1 = require("./apiClient");
var keystoreClient_1 = require("./keystoreClient");
var apiClient = function () {
    return new apiClient_1.default();
};
exports.apiClient = apiClient;
var keystoreClient = function () {
    return new keystoreClient_1.default();
};
exports.keystoreClient = keystoreClient;
//# sourceMappingURL=index.js.map