const assert = require("assert");
const describe = require("mocha").describe;
const { EthKeystoreClient, EthLocalSigner } = require('../lib/index.js');

const mnemonic = 'transfer exhibit feel document display chalk response whisper strong walk shock ivory';
const client = new EthKeystoreClient();
const signer = new EthLocalSigner();


describe('Eth Keystore Client function test', function () {
    it('Test generateMnemonic', function () {
        const mnemonic_ = client.generateMnemonic();
        assert.strictEqual(mnemonic_.split(' ').length, 12);
    })
    describe('Test validateAddress', function () {
        it('Test valid address', function () {
            const address1 = '0x0000000000000000000000000000000000000000';
            assert.strictEqual(true, client.validateAddress(address1))
        })
        it('Test invalid address (invalid length)', function () {
            const address1 = '0x0000000000000000000000000000000000000000000';
            assert.strictEqual(false, client.validateAddress(address1))
        })
        it('Test invalid address (invalid character', function () {
            const address1 = '0x000000000000000000000000000000000000000xx00';
            assert.strictEqual(false, client.validateAddress(address1))
        })
    })
    it('Test get account from mnemonic', async function () {
        const { address, private_key } = await client.getAccountFromMnemonic(0, mnemonic);
        assert.strictEqual('0xd2E7e98d0f951877311553B7A3B43f040A550761', address);
        assert.strictEqual('63620632688f8fa2ff215aea40f20d0af3307f046eabd7dd98c5cf8565120889', private_key);
    })
    it('Test recover keypair by privatekey', async function () {
        const { address, private_key } = await client.recoverKeyPairByPrivateKey("63620632688f8fa2ff215aea40f20d0af3307f046eabd7dd98c5cf8565120889");
        assert.strictEqual('0xd2E7e98d0f951877311553B7A3B43f040A550761', address);
        assert.strictEqual('63620632688f8fa2ff215aea40f20d0af3307f046eabd7dd98c5cf8565120889', private_key);
    })
    it('Test sign Transaction', async function(){
        const unsignedTx = {
            to:'0xd2E7e98d0f951877311553B7A3B43f040A550761',
            from: '0xd2E7e98d0f951877311553B7A3B43f040A550761',
            nonce: 0,
            value: 0,
            gasPrice:10**10,
            gasLimit:210000,
            network: 'mainnet',
        };
        const encodeTx = await client.signTransaction(unsignedTx, signer, {private_key: '63620632688f8fa2ff215aea40f20d0af3307f046eabd7dd98c5cf8565120889'});
        const expected_rawTx = '0xf865808502540be4008303345094d2e7e98d0f951877311553b7a3b43f040a550761808025a00326ab331ce5fa071e2e72aa4ea7e1fa164f3202a65751220209f74c80cfdbf4a003605dee81b7298dd9cf20adc4410d41a75ccd7cc39ebbde665ff8117eeeac60'
        assert.strictEqual(encodeTx, expected_rawTx);
    })

})