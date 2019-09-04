const assert = require("assert");
const describe = require("mocha").describe;
const fs = require('fs');
const path = require("path");
const {keyPair} = require('../coins/aion/keystore/keyPair');
const {fromV3} = require('../coins/aion/keystore/keyfile');
const {signTransaction} = require('../coins/aion/keystore/transaction');
const {validator} = require('lib-common-util-js');

describe('test AION',function () {
    describe('test keypair',function () {
        it('test private_child 0', function () {
            const key1 = keyPair('0x91805827f72842531cd3b5f4e488e6556f764cc08a04eee0587f53b5b1c4f021d24339d38554265d0fda57e4bda904f80f3b76f0842415a607d2ee78c50f3af2');
            assert.strictEqual(key1.address, '0xa0014115968c43a785fd1aeeafdb8999c8415fd386aa4e518829b57d4b375b38');
            assert.strictEqual(key1.privateKey, '91805827f72842531cd3b5f4e488e6556f764cc08a04eee0587f53b5b1c4f021d24339d38554265d0fda57e4bda904f80f3b76f0842415a607d2ee78c50f3af2');

        });
        it('test private_child 2', function () {
            const key1 = keyPair('0x900050df31286e102017a0ddceebac54de5fbb4a6a57026756fdd2bcd3cad1d1077f311cd0a00867e8b8ddede69e9f543d13c3bde9416295c25fc0a0ac448114');
            assert.strictEqual(key1.address, '0xa03c27530d83ad581bf73627a8aa65a698a3bf70d65152d13aed5afd26b119ef');
        });
        it('test sign', function () {
            const key1 = keyPair('0x900050df31286e102017a0ddceebac54de5fbb4a6a57026756fdd2bcd3cad1d1077f311cd0a00867e8b8ddede69e9f543d13c3bde9416295c25fc0a0ac448114');
            const digest = '0f35699c5ea859907ba372e5fab2abfc18fab4a9b70513971ae95015a11cbba2';
            let res = key1.sign(digest);
            res = Buffer.concat([Buffer.from(key1.publicKey,'hex'),res]);
            assert.strictEqual('0x'+res.toString('hex'), '0x077f311cd0a00867e8b8ddede69e9f543d13c3bde9416295c25fc0a0ac44811494ab971999504cd308da0cffc962f7f1702645e75cee300acb16c1f07ce0c6857a755a20c1f075b55ab75b3bfaa9a3c686c07e3b51f00ce3731d511695720600');
        });
        it('test sign Tx', async  function () {
            const acc =  keyPair('0x900050df31286e102017a0ddceebac54de5fbb4a6a57026756fdd2bcd3cad1d1077f311cd0a00867e8b8ddede69e9f543d13c3bde9416295c25fc0a0ac448114');
            const expected_rawTx = '0xf89c00a0a03c27530d83ad581bf73627a8aa65a698a3bf70d65152d13aed5afd26b119ef0080870591b2ccf46058830334508800000002540be40001b860077f311cd0a00867e8b8ddede69e9f543d13c3bde9416295c25fc0a0ac448114db019670396ed7dc4c27e5df4f3a8d3ba9841c0dd5ede015733ad3781644f0c99bedee17d37e9ffdc2475099c465c272914a0a87be5dbbf42f618933bbd35e0b'

            const tx  = {amount: 0, nonce:0, to: acc.address, gasLimit:210000,gasPrice:10**10, timestamp: 1567572012327000,private_key: acc.privateKey};
            const {encoded}  = await signTransaction(tx);
            assert.strictEqual('0x'+encoded, expected_rawTx);

        })
    });
    describe('test keyfile', function () {
        it('test fromV3 case 1', async function () {
            const content = fs.readFileSync(path.resolve(__dirname, './res/UTC--2019-08-08T02:54:38.611Z--a0014115968c43a785fd1aeeafdb8999c8415fd386aa4e518829b57d4b375b38'));
            const key = await fromV3(content, 'password');
            assert.strictEqual(key.address, '0xa0014115968c43a785fd1aeeafdb8999c8415fd386aa4e518829b57d4b375b38');
        });
        it('test fromV3 case 2', async function () {
            this.timeout(10000);

            const content = fs.readFileSync(path.resolve(__dirname, './res/UTC--2018-11-08T02-57-21.335Z--a05ed4fcb3fd1c2b8d65f7a9cbff0e280e53b40e6399f9887c3e28b37b5d09bf'));
            const key = await fromV3(content, 'password');
            assert.strictEqual(key.address, '0xa05ed4fcb3fd1c2b8d65f7a9cbff0e280e53b40e6399f9887c3e28b37b5d09bf');
        });
    });
    describe('test validateMnemonic', function() {
        it('empty mnemonic', async function() {
            let result = validator.validateMnemonic('');
            assert.strictEqual(result, false);
        });
        it('11 words', async function() {
            let result = validator.validateMnemonic('rescue surge feature damage erase body noise always void wet mechanic');
            assert.strictEqual(result, false);
        });
        it('12 words', async function() {
            let result = validator.validateMnemonic('rescue surge feature damage erase body noise always void wet mechanic waste');
            assert.strictEqual(result, true);
        });
    });
});