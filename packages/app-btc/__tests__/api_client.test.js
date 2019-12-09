const assert = require('assert');
const describe = require('mocha').describe;
const expect = require('expect.js');

const { BtcApiClient, BtcLocalSigner } = require('../lib/index');

const client = new BtcApiClient({
    network: 'BTCTEST',
    insight_api: 'http://172.104.190.127:3001/api'
});

const testAddress = 'mn7bpjgaPdAs2i9GuT8i3bcyreiFZ2ZXmN';
const TIME_OUT = 50*1000;
describe('BTC Api client function test', function(){
    it('Test get Transaction status', async function(){
        this.timeout(TIME_OUT);
        const status = await client.getTransactionStatus('5500f541726202b8a0f802e74a2f4d97437603fdf08a5c959139dec0d3b0dd6c');
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
        const address = 'mn7bpjgaPdAs2i9GuT8i3bcyreiFZ2ZXmN'
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