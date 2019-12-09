const assert = require("assert");
const describe = require("mocha").describe;
const fs = require('fs');
const path = require("path");
const { AionKeystoreClient, AionLocalSigner } = require('../lib/index.js');

const mnemonic = 'transfer exhibit feel document display chalk response whisper strong walk shock ivory';
const client = new AionKeystoreClient();
const signer = new AionLocalSigner();

describe('AION Keystore Client function test', function () {
    it('Test generateMnemonic', function () {
        const mnemonic_ = client.generateMnemonic();
        assert.strictEqual(mnemonic_.split(' ').length, 12);
    })
    describe('Test validateAddress', function () {
        it('Test valid address', function () {
            const address1 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c963';
            const address2 = 'a0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c963';
            assert.strictEqual(true, client.validateAddress(address1))
            assert.strictEqual(true, client.validateAddress(address2))
        })
        it('Test invalid address (invalid length)', function () {
            const address1 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c96323';
            const address2 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6c';
            assert.strictEqual(false, client.validateAddress(address1))
            assert.strictEqual(false, client.validateAddress(address2))
        })
        it('Test invalid address (invalid character', function () {
            const address1 = '0xa0e08bf1df768bb3f40e795dd5c487889c17f6c54111f8d9a5553783a1e6cxxx';
            const address2 = '0xa0e08bf1df768bb3f40e795dd5c487889c17fzzz11f8d9a5553783a1e6c';
            assert.strictEqual(false, client.validateAddress(address1))
            assert.strictEqual(false, client.validateAddress(address2))
        })
    })
    it('Test get account from mnemonic', async function () {
        const { address, private_key } = await client.getAccountFromMnemonic(0, mnemonic);
        assert.strictEqual('0xa0c91885a5c2e13502cb4ef41725b6aa9adbc4f14c23cb928499468eb876a981', address);
        assert.strictEqual('56fa36dfe15b15d203a944a6c9d70961ef8be16289803e6520fb6e76859e24232a7e3ea5789ee57c85814a90503eeee3430f82c8dcfb0bbb0267cdb48809ad18', private_key);
    })
    it('Test recover keypair by privatekey', async function () {
        const { address, private_key } = await client.recoverKeyPairByPrivateKey("56fa36dfe15b15d203a944a6c9d70961ef8be16289803e6520fb6e76859e24232a7e3ea5789ee57c85814a90503eeee3430f82c8dcfb0bbb0267cdb48809ad18");
        assert.strictEqual('0xa0c91885a5c2e13502cb4ef41725b6aa9adbc4f14c23cb928499468eb876a981', address);
        assert.strictEqual('56fa36dfe15b15d203a944a6c9d70961ef8be16289803e6520fb6e76859e24232a7e3ea5789ee57c85814a90503eeee3430f82c8dcfb0bbb0267cdb48809ad18', private_key);
    })
    it('Test recover keypair from keyfile', async function(){
        this.timeout(5000);
        const content = fs.readFileSync(path.resolve(__dirname, './UTC--2018-11-08T02-57-21.335Z--a05ed4fcb3fd1c2b8d65f7a9cbff0e280e53b40e6399f9887c3e28b37b5d09bf'));
        const {address} = await client.recoverKeyPairByKeyFile(content, 'password');
        assert.strictEqual(address, '0xa05ed4fcb3fd1c2b8d65f7a9cbff0e280e53b40e6399f9887c3e28b37b5d09bf');
    })
    it('Test sign Transaction', async function(){
        const unsignedTx = {
            to:'0xa03c27530d83ad581bf73627a8aa65a698a3bf70d65152d13aed5afd26b119ef',
            from: '0xa03c27530d83ad581bf73627a8aa65a698a3bf70d65152d13aed5afd26b119ef',
            nonce: 0,
            value: 0,
            gasPrice:10**10,
            gasLimit:210000,
            timestamp: 1567572012327
        };
        const encodeTx = await client.signTransaction(unsignedTx, signer, {private_key: '0x900050df31286e102017a0ddceebac54de5fbb4a6a57026756fdd2bcd3cad1d1077f311cd0a00867e8b8ddede69e9f543d13c3bde9416295c25fc0a0ac448114'});
        const expected_rawTx = '0xf89c00a0a03c27530d83ad581bf73627a8aa65a698a3bf70d65152d13aed5afd26b119ef0080870591b2ccf46058830334508800000002540be40001b860077f311cd0a00867e8b8ddede69e9f543d13c3bde9416295c25fc0a0ac448114db019670396ed7dc4c27e5df4f3a8d3ba9841c0dd5ede015733ad3781644f0c99bedee17d37e9ffdc2475099c465c272914a0a87be5dbbf42f618933bbd35e0b'
        assert.strictEqual(encodeTx, expected_rawTx);
    })

})
