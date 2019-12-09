const Contract = require('web3-eth-contract');
const BigNumber  = require('bignumber.js');
const {EthApiClient, EthLocalSigner, EthKeystoreClient} = require('../packages/app-eth/lib/index');

const interface = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"showMeTheMoney","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];


const contract = new Contract(interface);

const ROPSTEN_CONTRACT_ADDRESS = '0x722dd3f80bac40c951b51bdd28dd19d435762180';

const client = new EthApiClient({
    network: 'ropsten',
    jsonrpc: 'https://ropsten.infura.io/v3/64279947c29a4a8b9daf61f4c6c426b5'
})

const PRIVATE_KEY = 'AA686463F8673C446ADC65DAF7C2E8997EC403499AA0242479074A72186EAE63';

const kClient = new EthKeystoreClient();

const signer = new EthLocalSigner();


const try_request_token = async (private_key, value) => {
    const {address} = await kClient.recoverKeyPairByPrivateKey(private_key);
    console.log(`try request ${value} TST to ${address}`)
    const data = contract.methods.showMeTheMoney(address, new BigNumber(value).shiftedBy(18).toFixed()).encodeABI();
    const unsignedTx = await client.buildTransaction(address, ROPSTEN_CONTRACT_ADDRESS, 0, {
        gasLimit: 200000,
        gasPrice: 10*10**9,
        isTokenTransfer: false,
        data,
    })

    const {hash} = await client.sendTransaction(unsignedTx, signer, {
        private_key,
    })
    console.log('tx send=> hash:', hash);

}

try_request_token(PRIVATE_KEY, 1000);