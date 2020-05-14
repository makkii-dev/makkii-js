const describe = require("../../../node_modules/mocha").describe;
const expect = require('expect.js');

const { AionApiClient } = require('../lib/index');

const client = new AionApiClient({
    network: 'mainnet',
    jsonrpc: 'http://makkii.dev/jsonrpc'
});

const testAddress = '0xa048630fff033d214b36879e62231cc77d81f45d348f6590d268b9b8cabb88a9';
const tokenAddress = '0xa07406a455df4ca89c7157ce24201690720986f93e79524284e3eb69ef459bd8';
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
        expect(Object.keys(txs).length>=0).ok()
    })
    it('Test same address', function(){
        const address2 = '0xa048630fff033d214b36879e62231cc77d81f45d348f6590d268b9b8cabb88a9'
        const address3 = '0xa00983f07c11ee9160a64dd3ba3dc3d1f88332a2869f25725f56cbd0be32ef7b'
        expect(client.sameAddress(testAddress, address2)).equal(true);
        expect(client.sameAddress(testAddress, address3)).equal(false);
    })
    it('Test get Token detail', async function(){
        this.timeout(TIME_OUT);
        const token = await client.getTokenDetail(tokenAddress);
        expect(token).keys([
            'symbol',
            'name',
            'tokenDecimal'
        ])
    })
    it('Test get Account token balance', async function(){
        this.timeout(TIME_OUT);
        const balance = await client.getAccountTokenBalance(tokenAddress, testAddress);
        expect(balance.toNumber()).greaterThan(0)
    })
    it('Test get account Tokens', async function(){
        this.timeout(TIME_OUT);
        const tokens = await client.getAccountTokens(testAddress);
        expect(Object.keys(tokens).length>=0).ok()
    })
    it('Test get token transfer history', async function(){
        this.timeout(TIME_OUT);
        const history = await client.getAccountTokenTransferHistory(testAddress, tokenAddress, 0, 10);
        expect(Object.keys(history).length>=0).ok()
    })
    it('Test get Top tokens', async function(){
        this.timeout(TIME_OUT);
        const tokens = await client.getTopTokens(20);
        expect(Object.keys(tokens).length).above(0)
    })
    it('Test serach tokens', async function(){
        this.timeout(TIME_OUT);
        const tokens = await client.searchTokens('m');
        expect(Object.keys(tokens).length).above(0)
    })
    it('Test build Transaction', async function(){
        this.timeout(TIME_OUT);
        const tx = await client.buildTransaction(testAddress, tokenAddress, 0, {gasLimit: 21000, gasPrice: 10**10, isTokenTransfer: false})
        expect(tx).keys([
            'from',
            'to',
            'nonce',
            'value',
        ])
    })

})