# `@makkii/app-aion`

> TODO: description


## install

```bash
npm install @makkii/app-aion
```

## Usage

```js
import {AionApiClient, AionKeystoreClient} from '@makkii/app-aion'
const isTestNet = false;
const apiClient = new AionApiClient(isTestNet);
const keystoreClient = new AionKeystoreClient();
// API
const getBalance = aysnc (address) => {
    const balance = await apiClient.getBalance(address);
    return balance;
}
// 

```
if you want to learn more, please see [api-client guide](../../docs/api-client.md) and [keysote-client guide](../../docs/keysotre-client.md).

