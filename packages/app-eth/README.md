# `@makkii/app-eth`

> TODO: description


## install

```bash
npm install @makkii/app-eth
```

## Usage

```js
import {EthApiClient, EthKeystoreClient} from '@makkii/app-eth'
const isTestNet = false;
const apiClient = new EthApiClient(isTestNet);
const keystoreClient = new EthKeystoreClient();
// API
const getBalance = aysnc (address) => {
    const balance = await apiClient.getBalance(address);
    return balance;
}
// 

```
if you want to learn more, please see [api-client guide](../../docs/api-client.md) and [keysote-client guide](../../docs/keysotre-client.md).

