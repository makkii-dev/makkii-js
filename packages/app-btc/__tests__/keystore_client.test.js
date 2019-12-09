const assert = require("assert");
const describe = require("mocha").describe;

const { BtcKeystoreClient, BtcLocalSigner } = require('../lib/index');

const mnemonic = 'transfer exhibit feel document display chalk response whisper strong walk shock ivory';
const client = new BtcKeystoreClient('BTC');
const signer = new BtcLocalSigner('BTC');

describe('BTC Keystore Client function test', function () {
    it('Test generateMnemonic', function () {
        const mnemonic_ = client.generateMnemonic();
        assert.strictEqual(mnemonic_.split(' ').length, 12);
    })
    describe('Test validateAddress', function () {
        it('base58 standard1', function () {
            const address = '3QMVR9k1YZFU6PkK8LPQWUteYE2W8nWywK';
            const res = client.validateAddress(address);
            assert.strictEqual(res, true);
        });
        it('base58 standard2', function () {
            const address = '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr';
            const res = client.validateAddress(address);
            assert.strictEqual(res, true);
        });
        it('bench32 standard1', function () {
            const address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
            const res = client.validateAddress(address);
            assert.strictEqual(res, true);
        });
        it('bench32 standard2', function () {
            const address = 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3';
            const res = client.validateAddress(address);
            assert.strictEqual(res, true);
        });
        it('base58 invalid1', function () {
            const address = '7SeEnXWPaCCALbVrTnszCVGfRU8cGfx';
            const res = client.validateAddress(address);
            assert.strictEqual(res, false);
        });
        it('base58 invalid2', function () {
            const address = 'j9ywUkWg2fTQrouxxh5rSZhRvrjMkEUfuiKe';
            const res = client.validateAddress(address);
        });
        it('bench32 invalid1', function () {
            const address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5';
            const res = client.validateAddress(address);
            assert.strictEqual(res, false);
        });
        it('bench32 invalid1', function () {
            const address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5';
            const res = client.validateAddress(address);
            assert.strictEqual(res, false);
        });
    })
    it('Test get account from mnemonic', async function () {
        const { address, private_key } = await client.getAccountFromMnemonic(0, mnemonic);
        assert.strictEqual('18XMZ1CTnomoygzFwVN9h6AhzPnEwF1vZy', address);
        assert.strictEqual('575e56f06ee5c5ed8bae5f727ed93c3f9c79c23769067ab6ea52e30cc21cac05', private_key);
    })
    describe('Test recover keypair by privatekey', function () {
        it('Test compressed', async function(){
            const { address, private_key, public_key } = await client.recoverKeyPairByPrivateKey("0000000000000000000000000000000000000000000000000000000000000001", {compressed: true});
            assert.strictEqual('0000000000000000000000000000000000000000000000000000000000000001', private_key);
            assert.strictEqual('0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', public_key);
            assert.strictEqual('1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH', address);
        })
        it('Test uncompressed', async function(){
            const { address, private_key, public_key } = await client.recoverKeyPairByPrivateKey("0000000000000000000000000000000000000000000000000000000000000001", {compressed: false});
            assert.strictEqual('0000000000000000000000000000000000000000000000000000000000000001', private_key);
            assert.strictEqual('0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', public_key);
            assert.strictEqual('1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm', address);
        })
    })
    it('Test recover keypair by wif', async function () {
        const { address, private_key } = await client.recoverKeyPairByWIF("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn");
        assert.strictEqual('1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH', address);
        assert.strictEqual('0000000000000000000000000000000000000000000000000000000000000001', private_key);
    })
    it('Test signTransaction', async function(){
        // TODO
    })
})