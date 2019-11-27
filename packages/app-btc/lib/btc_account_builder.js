"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_keystore_1 = require("./lib_keystore");
class BtcAccountBuilder {
    constructor(network = 'BTC') {
        this.__Address = '';
        this.__type = { type: 'undefined' };
        this.setAddress = (address) => {
            if (lib_keystore_1.default.validateAddress(address, this.network)) {
                this.__Address = address;
                return this;
            }
            throw new Error('Invalid Address');
        };
        this.setPrivateKey = (privateKey, _compressed = true) => {
            if (privateKey && privateKey !== "") {
                this.__type = {
                    type: '[local]',
                    private_key: privateKey,
                    compressed: _compressed
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
        this.build = () => {
            if (this.__Address === '') {
                throw new Error('missing Address');
            }
            if (this.__type.type === 'undefined') {
                throw new Error('missing Account Type');
            }
            return {
                address: this.__Address,
                type: this.__type.type,
                compressed: this.__type.compressed,
                private_key: this.__type.private_key,
                derivationIndex: this.__type.derivationIndex
            };
        };
        this.network = network;
    }
}
exports.default = BtcAccountBuilder;
//# sourceMappingURL=btc_account_builder.js.map