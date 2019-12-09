const assert = require('assert');
const describe = require('mocha').describe;
const expect = require('expect.js');

const { EthApiClient, EthLocalSigner } = require('../lib/index');

const client = new EthApiClient({
    network: 'mainnet',
    jsonrpc: 'https://mainnet.infura.io/v3/64279947c29a4a8b9daf61f4c6c426b5',
    explorer_api: {
        "provider": "ethplorer",
        "url": "http://api.ethplorer.io",
        "key": "vtg9572Mmkl26"
    },
    explorer: {
        "provider": "etherchain",
        "url": "https://www.etherchain.org/tx"
    },
    remote_api: "https://www.chaion.net/makkii"
});

const testAddress = '0x4A0987a5016d1D3b11A65166353D0075b3f23b03';
const tokenAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const TIME_OUT = 20 * 1000;
describe('Eth Api Client function test', function () {
    it('Test get block by number', async function () {
        this.timeout(TIME_OUT);
        const block = await client.getBlockByNumber('0x0');
        return expect(block).keys([
            'number',
            'nonce'
        ])
    })
    it('Test get block number', async function () {
        this.timeout(TIME_OUT);
        const blkNum = await client.getBlockNumber();
        return expect(blkNum).greaterThan(0);
    })
    it('Test get Balance', async function () {
        this.timeout(TIME_OUT);
        const amount = await client.getBalance(testAddress);
        return expect(amount.toNumber()).greaterThan(0);
    })
    it('Test Transaction status', async function () {
        this.timeout(TIME_OUT);
        const status = await client.getTransactionStatus('0xc4cb0bc270bd3ab70a9d219e7593b6f595db5ac5476104ea81dbd2ef9c963e5a');
        return expect(status.status).equal(true)
    })
    it('Test get Transaction by address', async function () {
        this.timeout(TIME_OUT);
        const txs = await client.getTransactionsByAddress(testAddress, 0, 10, Date.now());
        expect(Object.keys(txs).length >= 0).ok()
    })
    it('Test same address', function () {
        const address2 = '0x4A0987a5016d1D3b11A65166353D0075b3f23b03'
        expect(client.sameAddress(testAddress, address2)).equal(true);
        expect(client.sameAddress(testAddress, address2.toLowerCase())).equal(true);
    })
    it('Test get Token detail', async function () {
        this.timeout(TIME_OUT);
        const token = await client.getTokenDetail(tokenAddress);
        expect(token).keys([
            'symbol',
            'name',
            'tokenDecimal'
        ])
    })
    it('Test get Account token balance', async function () {
        this.timeout(TIME_OUT);
        const balance = await client.getAccountTokenBalance(tokenAddress, testAddress);
        expect(balance.toNumber()).greaterThan(0)
    })
    it('Test get token transfer history', async function () {
        this.timeout(TIME_OUT);
        const history = await client.getAccountTokenTransferHistory(testAddress, tokenAddress, 0, 10, Date.now());
        expect(Object.keys(history).length >= 0).ok()
    })
    it('Test get Top tokens', async function () {
        this.timeout(TIME_OUT);
        const tokens = await client.getTopTokens(20);
        expect(Object.keys(tokens).length).above(0)
    })
    it('Test serach tokens', async function () {
        this.timeout(TIME_OUT);
        const tokens = await client.searchTokens('m');
        expect(Object.keys(tokens).length).above(0)
    })
    it('Test build Transaction', async function () {
        this.timeout(TIME_OUT);
        const tx = await client.buildTransaction(testAddress, tokenAddress, 0, { gasLimit: 21000, gasPrice: 10 ** 10, isTokenTransfer: false })
        expect(tx).keys([
            'from',
            'to',
            'nonce',
            'value',
        ])
    })
    // it('Test send token transfer', async function () { 
    //     this.timeout(TIME_OUT); 
    //     const client = new EthApiClient({
    //         network: 'ropsten',
    //         jsonrpc: 'https://ropsten.infura.io/v3/64279947c29a4a8b9daf61f4c6c426b5',
    //     });
    //     const tx = await client.buildTransaction("0x4be78b8ba92567ab0889be896578be56b816d318", "0xe3eC00F6786f8c8809B90F84A42568a14Eb785aD", 1, { 
    //         gasLimit: 50000, 
    //         gasPrice: 10 ** 10, 
    //         isTokenTransfer: true, 
    //         contractAddr: "0x722dd3f80bac40c951b51bdd28dd19d435762180", 
    //         tokenDecimal: 18 }); 
    //     const pendingtx = await client.sendTransaction(tx, new EthLocalSigner(), {private_key: 'AA686463F8673C446ADC65DAF7C2E8997EC403499AA0242479074A72186EAE63'})
    //     expect(pendingtx).keys(['hash']);
    // })
})