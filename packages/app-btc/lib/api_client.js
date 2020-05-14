"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var lib_api_1 = require("./lib_api");
var network_1 = require("./network");
var BtcApiClient = (function () {
    function BtcApiClient(config) {
        var _this = this;
        this.getNetwork = function () { return _this.config.network; };
        this.updateConfiguration = function (config) {
            _this.config = __assign(__assign({}, _this.config), config);
            _this.api = lib_api_1["default"](_this.config);
        };
        this.getBlockByNumber = function (blockNumber) {
            throw new Error("[" + _this.config.network + "] getBlockByNumber not implemented.");
        };
        this.getBlockNumber = function () {
            throw new Error("[" + _this.config.network + "] getBlockNumber not implemented.");
        };
        this.getTransactionStatus = function (hash) {
            return _this.api.getTransactionStatus(hash);
        };
        this.getTransactionExplorerUrl = function (hash) {
            return _this.api.getTransactionUrlInExplorer(hash);
        };
        this.getBalance = function (address) {
            return _this.api.getBalance(address);
        };
        this.getTransactionsByAddress = function (address, page, size) {
            return _this.api.getTransactionsByAddress(address, page, size);
        };
        this.sendTransaction = function (unsignedTx, signer, signerParams) {
            return _this.api.sendTransaction(unsignedTx, signer, signerParams);
        };
        this.sameAddress = function (address1, address2) {
            return _this.api.sameAddress(address1, address2);
        };
        this.sendAll = function (address, byte_fee) {
            return _this.api.sendAll(address, byte_fee);
        };
        this.buildTransaction = function (from, to, value, options) {
            return _this.api.buildTransaction(from, to, value, options);
        };
        var restSet;
        ["network", "insight_api"].forEach(function (f) {
            if (!(f in config)) {
                throw new Error("config miss field " + f);
            }
        });
        if (config.network === "BTC") {
            restSet = network_1["default"].BTC;
            this.symbol = "BTC";
        }
        else if (config.network === "BTCTEST") {
            restSet = network_1["default"].BTCTEST;
            this.symbol = "BTC";
        }
        else if (config.network === "LTC") {
            restSet = network_1["default"].LTC;
            this.symbol = "LTC";
        }
        else if (config.network === "LTCTEST") {
            restSet = network_1["default"].LTCTEST;
            this.symbol = "LTC";
        }
        else {
            throw new Error("BtcApiClient Unsupport nework: " + config.network);
        }
        this.config = __assign(__assign({}, restSet), config);
        this.api = lib_api_1["default"](this.config);
    }
    return BtcApiClient;
}());
exports["default"] = BtcApiClient;
