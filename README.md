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
