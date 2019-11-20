# `@makkii/app-btc`

> TODO: description


## install

```bash
npm install @makkii/app-btc
```

## Usage

```js
import {BtcApiClient, BtcKeystoreClient} from '@makkii/app-btc'
const isTestNet = false;
// btc
const apiClient = new BtcApiClient(isTestNet, 'btc');
const keystoreClient = new BtcKeystoreClient(isTestNet, 'btc');
/*
    // or ltc
    const apiClient = new BtcApiClient(isTestNet, 'ltc');
    const keystoreClient = new BtcKeystoreClient(isTestNet, 'ltc');
*/
// API
const getBalance = aysnc (address) => {
    const balance = await apiClient.getBalance(address);
    return balance;
}
// 

```
if you want to learn more, please see [api-client guide](../../docs/api-client.md) and [keysote-client guide](../../docs/keysotre-client.md).

