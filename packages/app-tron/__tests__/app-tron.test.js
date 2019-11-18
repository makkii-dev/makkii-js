const TRXValidateAddress = require("../lib/keystore/address").validateAddress;
const assert = require("assert");
const describe = require("mocha").describe;

describe('test tron', function () {
    describe('validate address', function () {
            it('valid', async function () {
                const address = 'TZD6Gbgfzr6oqopzNRiPDgrLrHdrWKRYKH';
                const res = await TRXValidateAddress(address);
                assert.strictEqual(true, res);
            });
            it('invalid', async function() {
                const address = '3QMVR9k1YZFU6PkK8LPQWUteYE2W8nWywK';
                const res = await TRXValidateAddress(address);
                assert.strictEqual(false,res);
            })
        })
});
