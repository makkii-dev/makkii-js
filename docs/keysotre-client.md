# Keystore client
**keystore client** is a client that provides methods for generating addresses, recovering private keys, and signing.

## Getting start
```js
import {keystoreClient} from "makkii-coins";
let supportCoins = ['aion', 'eth'];
const client = keystoreClient(supportCoins);
const getAddress = async (symbol, mnemonic, index) => { 
    const {address} = await client.getAccountFromMnemonic(symbol, index, mnemonic);
    return address;
}
```
## support coins
| method | Aion | BTC | ETH | LTC | TRON |
|:---:|:---:|:---:|:---:|:---:|:---:|
|[recoverKeyPairByPrivateKey](#recoverkeypairbyprivatekey)|√|√|√|√|√|
|[recoverKeyPairByWIF](#recoverkeypairbywif)||√||√||
|[recoverFromKeystore](#recoverfromkeystore)|√|||||
|[validateAddress](#validateaddress)|√|√|√|√|√|
|[validatePrivateKey](#validateprivatekey)|√|√|√|√|√|
|[getAccount](#getkey)|√|√|√|√|√|
|[getAccountFromMnemonic](#getkeyfrommnemonic)|√|√|√|√|√|
|[getAccountByLedger](#getkeybyledger)|√|√|√|||
|[signByLedger](#signbyledger)|√|√|√|||
|[setLedgerTransport](#setledgertransport)|√|√|√|||
|[getLedgerStatus](#getledgerstatus)|√|√|√|||
|[signTransaction](#signtransaction)|√|√|√|(only support privateKey)|(only support privateKey)|
## methods
#### keystoreClient
> init a keystore client
- parameter
  - support_coin_list: **Array&lt;String>** client support [coins](#support-coins) 
  - isTestNet: boolean
- example
```js
const supportCoins = ['eth', 'aion'];
const client = keystoreClient(supportCoins, false);
```
#### setMnemonic

> set client mnemonic use to generate address from bip39

- parameters
  - mnemonic: **String** mnemonic string
- example

```js 
...
const mnemonic = "transfer exhibit feel document display chalk response whisper strong walk shock ivory";
client.setMnemonic(mnemonic);
```

#### generateMnemonic
> generate a mnemonic string 
- example
```js
   const mnemonic = client.generateMnemonic();
```
#### recoverKeyPairByPrivateKey
> recover keypair by  privateKey
- parameters
  - coinType **String** coin symbol, ignore case
  - prikey: string 
  - options?: eg: {network: 'BTC'} network for bitcoin and litecoin. since addresses are different
- return 
  - Promise&lts;{address, privateKey, publicKey}>
#### recoverKeyPairByWIF
> same as recoverKeyPairByPrivateKey, recover keypair by WIF; but only support btc and ltc
- parameters
  - coinType
  - WIF: string 
  - options?: eg: {network: 'BTC'} network for bitcoin and litecoin. since addresses are different
- return 
  - Promise&lt;{address, privateKey, publicKey}>
#### recoverFromKeystore
> recover keypair from keystore file; only support aion for now
- parameters
  - coinType
  - input: **String** keystore file content
  - password: **String** keystore password
- return
  - Promise&lt;{address, privateKey, publicKey}>
  
#### validateAddress
> validate an address 
- parameters
  - coinType
  - address
- return
  - result: boolean
#### validatePrivateKey
> validate an privateKey
- parameters
  - coinType
  - privateKey: **String**
- return
  - result: boolean
#### getAccount
> first you need setMnemonic or generateMnemonic

- parameters
  - coinType: **String** one of support coins
  - index: **number** bip39 address index
- return
  - Promise&lt;{address, index, publickey?}>
#### getAccountFromMnemonic
> same as getAccount, but can custom mnemonic string
- parameters
  - coinType
  - index
  - mnemonic: string
- return
  - result: boolean
### ledger
> Supported by [ledgerjs](https://github.com/LedgerHQ/ledgerjs)
- example
```js
// web
import Transport from '@ledgerhq/hw-transport-u2f';
// or react-native
// import Transport from '@ledgerhq/react-native-hid';
// or node
// import Transport from '@ledgerhq/hw-transport-node-hid';
const run = async () => {
   const coin = 'AION';
   if(!client.getLedgerStatus()){
      const transport = await Transport.create();
      client.setLedgerTransport(coin, transport);
   }
   const {address} = await getAccountByLedger(coin, 0);
   console.log('address=>', address);   
};
run();
```
#### getAccountByLedger
> get key by ledger, you need set ledger transport first. [example](#ledger)
- parameters
  - coinType
  - index
- returns
  - Promise&lt;{address, index, publicKey}>
#### setLedgerTransport
> set specific coin's ledger Transport 
- parameters
  - coinType
  - transport **Transport** eg:  [example](#ledger)
#### signByLedger
> sign message by ledger
- parameters
  - coinType
  - index **number** address index
  - sender **String** if sender !== address, it means wrong ledger device
  - msg **Buffer**
- return 
  - signature 
#### getLedgerStatus
> get specific coin's ledger transport whether connect
- return 
  - true when is connect
#### signTransaction
> use privateKey or ledger to sign a transaction
- parameters
  - coinType
  - tx: BtcTransaction|EthTransaction|TronTransaction 
```js
   interface BtcTransaction {
        private_key:string,
        compressed?:boolean,
        to_address: string,
        change_address: string,
        amount: BigNumber|number,
        utxos: any,
        extra_param?: AionTxParam,
    }

    interface EthTransaction {
        amount: BigNumber|number,
        nonce: string| number
        gasLimit: string| number,
        gasPrice: string | number,
        to: string,
        private_key: string,
        timestamp?: number,
        data?: string,
        network?:EthNetwork
        extra_param?: AionTxParam,
    }


    interface TronTransaction {
        timestamp: number,
        expiration: number,
        to_address: string,
        owner_address: string,
        private_key: string,
        amount: BigNumber| number,
        latest_block: TronBlock
    }

    enum EthNetwork {
        'morden',
        'ropsten',
        'rinkeby',
        'goerli',
        'kovan'
    }

 interface AionTxParam {
        type: AccountType,
        sender: string,
        derivationIndex: string,
    }

    enum AccountType {
        '[local]',
        '[ledger]',
    }

```
- return
  - Promise&lt;{encoded}>
