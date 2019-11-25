const validateAddress = require("../lib/lib_keystore/address").validateAddress;
const assert = require("assert");
const describe = require("mocha").describe;

describe('test address', function () {
    describe('validate', function () {
        describe('btc mainnet', function () {
            it('base58 standard1', async function () {
                const address = '3QMVR9k1YZFU6PkK8LPQWUteYE2W8nWywK';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, true);
            });
            it('base58 standard2', async function () {
                const address = '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, true);
            });
            it('bench32 standard1', async function () {
                const address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, true);
            });
            it('bench32 standard2', async function () {
                const address = 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, true);
            });
            it('base58 invalid1', async function () {
                const address = '7SeEnXWPaCCALbVrTnszCVGfRU8cGfx';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, false);
            });
            it('base58 invalid2', async function () {
                const address = 'j9ywUkWg2fTQrouxxh5rSZhRvrjMkEUfuiKe';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, false);
            });
            it('bench32 invalid1', async function () {
                const address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, false);
            });
            it('bench32 invalid1', async function () {
                const address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5';
                const res = await validateAddress(address, 'BTC');
                assert.strictEqual(res, false);
            });
        });
        describe('btc testnet', function () {
            it('base58 standard1', async function () {
                const address = 'mrCDrCybB6J1vRfbwM5hemdJz73FwDBC8r';
                const res = await validateAddress(address, 'BTCTEST');
                assert.strictEqual(res, true);
            });
            it('base58 standard2', async function () {
                const address = '2NByiBUaEXrhmqAsg7BbLpcQSAQs1EDwt5w';
                const res = await validateAddress(address, 'BTCTEST');
                assert.strictEqual(res, true);
            });
            it('bench32 standard1', async function () {
                const address = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
                const res = await validateAddress(address, 'BTCTEST');
                assert.strictEqual(res, true);
            });
            it('bench32 standard2', async function () {
                const address = 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7';
                const res = await validateAddress(address, 'BTCTEST');
                assert.strictEqual(res, true);
            });
        });
        describe('ltc mainnet', function () {
            it('base58 standard1', async function () {
                const address = 'MCZjFcwYJwwYqXAbd3bbnxaCVGs81cp43Z';
                const res = await validateAddress(address, 'LTC');
                assert.strictEqual(res, true);
            });
            it('base58 standard2', async function () {
                const address = 'LUxXFcwXFPpRZdMv4aYu6bDwPdC2skQ5YW';
                const res = await validateAddress(address, 'LTC');
                assert.strictEqual(res, true);
            });
            // it('bench32 standard1', async function () {
            //     const address = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
            //     const res = await validateAddress(address, 'LTC');
            //     assert.strictEqual(res, true);
            // });
            // it('bench32 standard2', async function () {
            //     const address = 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7';
            //     const res = await validateAddress(address, 'LTC');
            //     assert.strictEqual(res, true);
            // });
        });
        describe('ltc testnet', function () {
            it('base58 standard1', async function () {
                const address = 'n2dqkKbeVfY15GDM84Kb19KUSmNScSyKd3';
                const res = await validateAddress(address, 'LTCTEST');
                assert.strictEqual(res, true);
            });
            it('base58 standard2', async function () {
                const address = 'QX6H1NNHNJ64AwfSsV3X62KePjAPAzPrfg';
                const res = await validateAddress(address, 'LTCTEST');
                assert.strictEqual(res, true);
            });
            // it('bench32 standard1', async function () {
            //     const address = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
            //     const res = await validateAddress(address, 'LTC');
            //     assert.strictEqual(res, true);
            // });
            // it('bench32 standard2', async function () {
            //     const address = 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7';
            //     const res = await validateAddress(address, 'LTC');
            //     assert.strictEqual(res, true);
            // });
        });
    })
});
