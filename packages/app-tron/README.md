# `@makkii/app-tron`

> TODO: description


## install

```bash
npm install @makkii/app-tron
```

## Usage

```js
import {TronApiClient, TronKeystoreClient} from '@makkii/app-tron'
const isTestNet = false;
const apiClient = new TronApiClient(isTestNet);
const keystoreClient = new TronKeystoreClient();
// API
const getBalance = aysnc (address) => {
    const balance = await apiClient.getBalance(address);
    return balance;
}
// 

```
if you want to learn more, please see [api-client guide](../../docs/api-client.md) and [keysote-client guide](../../docs/keysotre-client.md).

