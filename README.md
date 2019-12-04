Makkii Coins is a javascript library that implements crypto currency wallet functionality for several blockchains.
Developers can build different application on different platform based on this library.

### Supported Blockchains
We support Aion, Bitcoin, Litecoin, Ethereum and Tron.

# Installation
```bash
yarn add https://github.com/chaion/makkii-coins
```

# Usage
## Keystore Api
##### initialize keystore client
```javascript
import { keystoreClient } from 'makkii-coins';

// initialize keystore client.
let isTestNet = false;
let supportCoins = ['aion', 'eth'];
const keystore = keystoreClient(supportCoins, isTestNet);
```
see [API Reference](/docs/keysotre-client.md)

## Wallet Api
##### initialize api client
```javascript
import { apiClient } from 'makkii-coins';

// initialize api client.
let isTestNet = false;
let supportCoins = ['aion', 'eth'];
const api = apiClient(supportCoins, isTestNet);
```
see [API Reference](/docs/api-client.md)

# Basic gist
```js
import {}

```

# Contributing
Please read our contribution guidelines before getting started.  
**You need to have a recent [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed.**  
**You also need to install [lerna](https://github.com/lerna/lerna) globally**
## Install dependencies
```bash
yarn
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
lerna run test
```
## Build document
```bash
yarn doc
```
 **It will generate html files in folder './html'**