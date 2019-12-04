const assert = require("assert");
const describe = require("mocha").describe;
const {AionKeystoreClient} = require('../lib/index.js');

const mnemonic = 'transfer exhibit feel document display chalk response whisper strong walk shock ivory';
const client = new AionKeystoreClient();

describe('AION Keystore Client function test', function(){
    it('Test generateMnemonic', function(){
        const mnemonic_ = client.generateMnemonic();
        assert.strictEqual(mnemonic_.split(' ').length, 12);
    })
    describe('Test validateAddress', function(){
        it('Test valid address', function(){
            const address1 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c963';
            const address2 = 'a0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c963';
            assert.strictEqual(true, client.validateAddress(address1))
            assert.strictEqual(true, client.validateAddress(address2))
        })
        it('Test invalid address (invalid length)', function(){
            const address1 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c96323';
            const address2 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c';
            assert.strictEqual(false, client.validateAddress(address1))
            assert.strictEqual(false, client.validateAddress(address2))
        })
        it('Test invalid address (invalid character', function(){
            const address1 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6cxxx';
            const address2 = '0xa0e08bf1df768bb3f40e795dd5c487889c17fzzz11f8d9a5553783a1e6c';
            assert.strictEqual(false, client.validateAddress(address1))
            assert.strictEqual(false, client.validateAddress(address2))
        })
    })


})
