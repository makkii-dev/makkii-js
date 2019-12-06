const assert = require('assert');
const describe = require('mocha').describe;
const expect = require('expect.js');

const { TronApiClient } = require('../lib/index');

const client = new TronApiClient({
    network: 'mainnet',
    trongrid_api: 'https://api.trongrid.io'
});

const testAddress = 'TJi6cKW1Mz5HhVaLGmLnoZeECLMbtCJ5FT';
const TIME_OUT = 50*1000;
describe('Tron Api client function test', function(){
    it('Test get Transaction status', async function(){
        this.timeout(TIME_OUT);
        const status = await client.getTransactionStatus('2ba3785f4b67ce4cae6de07daa589c043d8b60a5bd7f55d4017e6842305b7647');
        expect(status).keys(['status','blockNumber'])
    })
    it('Test get balance', async function(){
        this.timeout(TIME_OUT);
        const balance = await client.getBalance(testAddress);
        expect(balance.toNumber()).greaterThan(0)
    })
    it('Test get Transcation by address', async function(){
        this.timeout(TIME_OUT);
        const txs = await client.getTransactionsByAddress(testAddress,0, 10);
        expect(Object.keys(txs).length).greaterThan(0)
    })
    it('Test same address', function(){
        const address = 'TJi6cKW1Mz5HhVaLGmLnoZeECLMbtCJ5FT'
        expect(client.sameAddress(address, testAddress)).equal(true)
        expect(client.sameAddress(address.toLowerCase(), testAddress)).equal(false)
    })
    it('Test build Transaction', async function(){
        this.timeout(TIME_OUT);
        const tx = await client.buildTransaction(testAddress, testAddress, 0);
        expect(tx).keys([
            'owner',
            'to',
        ])
    })
})