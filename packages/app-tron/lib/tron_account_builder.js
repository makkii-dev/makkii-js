"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_keystore_1 = require("./lib_keystore");
class TronAccountBuilder {
    constructor() {
        this.__Tokens = {};
        this.__Address = '';
        this.__balance = new bignumber_js_1.default(0);
        this.__private_key = '';
        this.setAddress = (address) => {
            if (lib_keystore_1.default.validateAddress(address)) {
                this.__Address = address;
                return this;
            }
            throw new Error('Invalid Address');
        };
        this.setBalance = (balance) => {
            this.__balance = bignumber_js_1.default.isBigNumber(balance) ? balance : new bignumber_js_1.default(balance);
            return this;
        };
        this.setPrivateKey = (privateKey) => {
            if (privateKey && privateKey !== "") {
                this.__private_key = privateKey;
                return this;
            }
            throw new Error('Invalid PrivateKey');
        };
        this.build = () => {
            if (this.__Address === '') {
                throw new Error('missing Address');
            }
            if (this.__private_key === '') {
                throw new Error('missing private key');
            }
            return {
                address: this.__Address,
                balance: this.__balance,
                private_key: this.__private_key,
            };
        };
    }
}
exports.default = TronAccountBuilder;
//# sourceMappingURL=tron_account_builder.js.map