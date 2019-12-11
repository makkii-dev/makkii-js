[![Makkii Telegram](https://img.shields.io/badge/Telegram-Makkii-yellow.svg?style=flat)](https://web.telegram.org/#/im?p=@AionChina)
[![CircleCI](https://circleci.com/gh/chaion/makkii-js.svg?style=svg)](https://circleci.com/gh/chaion/makkii-js)

Welcome to Makkii's Javascript Libraries.

Makkiijs is a javascript library which provides:

* [![npm](https://img.shields.io/npm/v/@makkii/makkii-core.svg)](https://www.npmjs.com/package/@makkii/makkii-core) [@makkii/makkii-core](https://github.com/chaion/makkiijs/tree/master/packages/makkii-core) generic interfaces
* [![npm](https://img.shields.io/npm/v/@makkii/app-aion.svg)](https://www.npmjs.com/package/@makkii/app-aion) [@makkii/app-aion](https://github.com/chaion/makkiijs/tree/master/packages/app-aion) aion application client
* [![npm](https://img.shields.io/npm/v/@makkii/app-btc.svg)](https://www.npmjs.com/package/@makkii/app-btc) [@makkii/app-btc](https://github.com/chaion/makkiijs/tree/master/packages/app-btc) bitcoin application client
* [![npm](https://img.shields.io/npm/v/@makkii/app-eth.svg)](https://www.npmjs.com/package/@makkii/app-eth) [@makkii/app-eth](https://github.com/chaion/makkiijs/tree/master/packages/app-eth) ethereum application client
* [![npm](https://img.shields.io/npm/v/@makkii/app-tron.svg)](https://www.npmjs.com/package/@makkii/app-tron) [@makkii/app-tron](https://github.com/chaion/makkiijs/tree/master/packages/app-tron) tron application client

# Support APIs
For detailed Api documentation, please refer to [Makkiijs API References](http://makkii.dev/makkii-js/docs/).
### IApiClient
| Method | Aion | BTC | ETH | LTC | TRON |
|:---:|:---:|:---:|:---:|:---:|:---:|
|getBlockByNumber|√|√|√|√|√|
|getBlockNumber|√|√|√|√|√|
|getCoinPrices|√|√|√|√|√|
|getBalance|√|√|√|√|√|
|getTransactionsByAddress|√|√|√|√|√|
|getTransactionStatus|√|√|√|√|√|
|getTransactionExplorerUrl|√|√|√|√|√|
|buildTransaction|√|√|√|√|√|
|sendTransaction|√|√|√|(only support LocalSigner)|(only support LocalSigner)|
|getTokenIconUrl|| |√|||
|getTokenDetail|√| |√||||
|getAccountTokenTransferHistory|√| |√|||
|getAccountTokens|√| |√|||
|getAccountTokenBalance|√| |√|||
|getTopTokens|√| |√|||
|searchTokens|√| |√|||
|sameAddress|√|√|√|√|√|

### IKeystoreClient
| method | Aion | BTC | ETH | LTC | TRON |
|:---:|:---:|:---:|:---:|:---:|:---:|
|generateMnemonic|√|√|√|√|√|
|getAccountFromMnemonic|√|√|√|√|√|
|getAccountFromHardware|√|√|√|||
|recoverKeyPairByPrivateKey|√|√|√|√|√|
|signTransaction|√|√|√|(only support LocalSigner)|(only support LocalSigner)|
|validateAddress|√|√|√|√|√|
|validatePrivateKey|√|√|√|√|√|

# Installation
### From Github
```bash
$ yarn add https://github.com/chaion/makkiijs
```
### From NPM
```
$ npm install @makkii/makkii-core
$ npm install @makkii/app-<coin symbol>
```
# Basic Usage
## Single coin support
```typescript
import { AionApiClient, AionKeystoreClient, AionLocalSigner } from '@makkii/app-aion';

const api_client = new AionApiClient({
    network: 'mainnet',
    jsonrpc: '***'
});
api_client.getBalance('0x...')
    .then(console.log)
    .catch(error=>console.log(error));
const keystore_client = new AionKeystoreClient();
api_client.buildTransaction(
    '0x...', // from address
    '0x...', // to address
    0, // amount
    {
        gasPrice: 10,
        gasLimit: 21000,
        isTokenTransfer: false
    }
).then(function(unsignedTx) {
    keystore_client.signTransaction(unsignedTx, new AionLocalSigner(), {
        private_key: '***'
    }).then(function(signedTx) {
        console.log(signedTx);
    });
});

```
## Multiple coin support
```typescript
import { ApiClient, KeystoreClient } from '@makkii/makkii-core';
import { AionApiClient, AionKeystoreClient, AionLocalSigner } from '@makkii/app-aion';
import { BtcApiClient, BtcKeystoreClient } from '@makkii/app-btc';

// api client usage
const api_client = new ApiClient();
api_client.addCoin('aion', new AionApiClient({
    network: 'mainnet',
    jsonrpc: '***'
}));
api_client.addCoin('btc', new BtcApiClient({
    network: 'BTC',
    insight_api: '***'
}));
api_client.getBalance('aion', '0x...')
    .then(console.log)
    .catch(error=>console.log(error));

// keystore client usage
const keystore_client = new KeystoreClient();
keystore_client.addCoin('aion', new AionKeystoreClient());
keystore_client.addCoin('btc', new BtcKeystoreClient('BTC'));

api_client.buildTransaction(
    'aion', 
    '0x...', // from address
    '0x...', // to address
    0, // amount
    {
        gasPrice: 10,
        gasLimit: 21000,
        isTokenTransfer: false
    }
).then(function(unsignedTx) {
    keystore_client.signTransaction('aion', unsignedTx, new AionLocalSigner(), {
        private_key: '***'
    }).then(function(signedTx) {
        console.log(signedTx);
    });
});
```
## Hardware Wallet Support
Aion ledger implementation replies on ledger [hw-transport](https://github.com/LedgerHQ/ledgerjs/tree/master/packages/hw-transport) interface
```typescript
import Transport from '@ledgerhq/hw-transport-u2f';
import { AionLedger } from '@makkii/app-aion';

const aion_ledger = new AionLedger();
Transport.create().then(function(transport) {
    aion_ledger.setLedgerTransport(transport);
    aion_ledger.getHardwareStatus().then(status=> {
        if (status) {
            aion_ledger.getAccount(0).then(account => {
                console.log(account.address);
                console.log(account.index);
            });
        }
    });
})

```

# Contributing
**You need to have a recent [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed.**  
**You also need to install [lerna](https://github.com/lerna/lerna) globally.**
## Install dependencies
```bash
$ lerna bootstrap
```
## Build
```bash
yarn compile
```
## Lint
```bash
yarn lint
```
## Run Tests
```bash
yarn test
```
## Build Document
```bash
yarn doc
```
 **It will generate all API references documentation in folder './html'**  
 **This will automatically generate Api section in README.md under all packages.**

## Deploy
* Make sure you have right in Chaion org on NPM
* Login NPM
```bash
$ npm login
$ npm whoami
```
* Publish to npm repository
```bash
$ yarn publish
```
* Tag and release with change logs

If you want to contribute new coins, please refer to [Add Coin Guideline](./docs/ADD_COIN_GUIDE.md)
