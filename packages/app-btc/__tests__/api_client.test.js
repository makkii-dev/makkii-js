const assert = require('assert');
const describe = require('mocha').describe;
const expect = require('expect.js');

const { BtcApiClient, BtcLocalSigner } = require('../lib/index');

const client = new BtcApiClient({
    network: 'BTCTEST',
    insight_api: 'https://insight.bitpay.com/api'
});

const testAddress = '1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL';
const TIME_OUT = 50*1000;
describe('BTC Api client function test', function(){
    it('Test get Transaction status', async function(){
        this.timeout(TIME_OUT);
        const status = await client.getTransactionStatus('dc0f213166b1e9a021da8be757d06a20545bbba31592b851a424b05e0964fb8e');
        expect(status).keys(['status','blockNumber','timestamp'])
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
        const address = '1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL'
        expect(client.sameAddress(address, testAddress)).equal(true)
        expect(client.sameAddress(address.toLowerCase(), testAddress)).equal(false)
    })
    it('Test send all', async function(){
        this.timeout(TIME_OUT);
        const balance = await client.sendAll(testAddress, 10);
        expect(balance).greaterThan(0)
    })
    it('Test build Transaction', async function(){
        this.timeout(TIME_OUT);
        const tx = await client.buildTransaction(testAddress, testAddress, 0, {byte_fee:10});
        expect(tx).keys([
            'from',
            'to',
        ])
    })
    // it('Test send Transaction', async function(){
    //     this.timeout(TIME_OUT)
    //     const tx = await client.buildTransaction('n4cCJdqoxwG71nXfCJFarz8uBvR6XRoQQ7', 'msCcgT96NVK3qYn1QSQSNxFeFgujVv2rku', 0.00001, {byte_fee:10});
    //     const pendingtx = await client.sendTransaction(tx, new BtcLocalSigner('BTCTEST'), {private_key: 'b355a5d352cb05d7314a3ec6bf2b68468e8e93bb2f8825be1f0325a5882ae6e7'})
    //     expect(pendingtx).keys(['hash'])
    // })
})