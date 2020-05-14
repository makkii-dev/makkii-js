const assert = require("assert");
const describe = require("../../../node_modules/mocha").describe;
const { TronKeystoreClient, TronLocalSigner } = require('../lib/index.js');

const mnemonic = 'transfer exhibit feel document display chalk response whisper strong walk shock ivory';
const client = new TronKeystoreClient();
const signer = new TronLocalSigner();

describe('Tron Keystore Client function test', function () {
    it('Test generateMnemonic', function () {
        const mnemonic_ = client.generateMnemonic();
        assert.strictEqual(mnemonic_.split(' ').length, 12);
    })
    describe('Test validateAddress', function () {
        it('Test valid address', function () {
            const address1 = 'TZD6Gbgfzr6oqopzNRiPDgrLrHdrWKRYKH';
            assert.strictEqual(true, client.validateAddress(address1))
        })
        it('Test invalid address ', function () {
            const address1 = '3QMVR9k1YZFU6PkK8LPQWUteYE2W8nWywK';
            assert.strictEqual(false, client.validateAddress(address1))
        })
    })
    it('Test get account from mnemonic', async function () {
        const { address, private_key } = await client.getAccountFromMnemonic(0, mnemonic);
        assert.strictEqual('TFEkCMY5wEJ949keNhsB2b18zT3D1Sgsw4', address);
        assert.strictEqual('4c3ef1a69c7497a9561f7f9ed3d6703798d6174f7739b46c47b06bb9cefc9829', private_key);
    })
    it('Test recover keypair by privatekey', async function () {
        const { address, private_key } = await client.recoverKeyPairByPrivateKey("4c3ef1a69c7497a9561f7f9ed3d6703798d6174f7739b46c47b06bb9cefc9829");
        assert.strictEqual('TFEkCMY5wEJ949keNhsB2b18zT3D1Sgsw4', address);
        assert.strictEqual('4c3ef1a69c7497a9561f7f9ed3d6703798d6174f7739b46c47b06bb9cefc9829', private_key);
    })
    it('Test sign Transaction', async function(){
        //TODO
    })

})