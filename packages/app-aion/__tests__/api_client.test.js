const assert = require('assert');
const describe = require('mocha').describe;
const expect = require('expect.js');

const { AionApiClient } = require('../lib/index');

const client = new AionApiClient({
    network: 'mainnet',
    jsonrpc: 'https://aion.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=c8b8ebb4f10f40358b635afae72c2780'
});

const testAddress = '0xa00983f07c11ee9160a64dd3ba3dc3d1f88332a2869f25725f56cbd0be32ef7a'
const TIME_OUT = 20*1000;
describe('AION Api Client function test', function () {
    it('Test get block by number', async function(){
        this.timeout(TIME_OUT);
        const block = await client.getBlockByNumber('0x0');
        return expect(block).keys([
            'number',
            'nonce'
        ])  
    })
    it('Test get block number', async function(){
        this.timeout(TIME_OUT);
        const blkNum = await client.getBlockNumber();
        return expect(blkNum).greaterThan(0);
    })
    it('Test get Balance', async function(){
        this.timeout(TIME_OUT);
        const amount = await client.getBalance(testAddress);
        return expect(amount.toNumber()).greaterThan(0);
    })
    it('Test Transaction status', async function(){
        this.timeout(TIME_OUT);
        const status = await client.getTransactionStatus('0x7336c484f0a209fff14351267947b244fa98f63da9448aae15846ce8fa9ab49e');
        return expect(status.status).equal(true)
    })
    it('Test get Transaction by address', async function(){
        this.timeout(TIME_OUT);
        const txs = await client.getTransactionsByAddress(testAddress, 0, 10);
        return expect(Object.keys(txs).length).greaterThan(0)
    })
    it('Test same address', function(){
        const address2 = '0xa00983f07c11ee9160a64dd3ba3dc3d1f88332a2869f25725f56cbd0be32ef7A'
        const address3 = '0xa00983f07c11ee9160a64dd3ba3dc3d1f88332a2869f25725f56cbd0be32ef7b'
        expect(client.sameAddress(testAddress, address2)).equal(true);
        expect(client.sameAddress(testAddress, address3)).equal(false);
    })

})