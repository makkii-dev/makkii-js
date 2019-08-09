const assert = require("assert");
const describe = require("mocha").describe;
const fs = require('fs');
const path = require("path");
const {keyPair} = require('../coins/aion/keystore/keyPair');
const {fromV3} = require('../coins/aion/keystore/keyfile');

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
});