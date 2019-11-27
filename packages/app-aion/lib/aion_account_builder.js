"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const lib_keystore_1 = require("./lib_keystore");
class AionAccountBuilder {
    constructor() {
        this.__Tokens = {};
        this.__Address = '';
        this.__balance = new bignumber_js_1.default(0);
        this.__type = { type: 'undefined' };
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
                this.__type = {
                    type: '[local]',
                    private_key: privateKey
                };
                return this;
            }
            throw new Error('Invalid PrivateKey');
        };
        this.setLedgerIndex = (index) => {
            this.__type = {
                type: "[ledger]",
                derivationIndex: index
            };
            return this;
        };
        this.addToken = (symbol, name, contractAddr, tokenDecimal, balance = new bignumber_js_1.default(0)) => {
            this.__Tokens[symbol] = {
                symbol,
                name,
                contractAddr,
                tokenDecimal,
                balance,
            };
        };
        this.build = () => {
            if (this.__Address === '') {
                throw new Error('missing Address');
            }
            if (this.__type.type === 'undefined') {
                throw new Error('missing Account Type');
            }
            return {
                symbol: 'AION',
                address: this.__Address,
                balance: this.__balance,
                tokens: this.__Tokens,
                type: this.__type.type,
                private_key: this.__type.private_key,
                derivationIndex: this.__type.derivationIndex
            };
        };
    }
}
exports.default = AionAccountBuilder;
//# sourceMappingURL=aion_account_builder.js.map