# `makkii-core`

> TODO: description

## Usage

```js
import { apiClient, keystoreClient } from '@makkii/makkii-core';
import { AionApiClient, AionKeystoreClient } from '@makkii/app-aion';
import { BtcApiClient, BtcKeystoreClient } from '@makkii/app-btc';


const client1 = apiClient();
client1.addCoin('aion', new AionApiClient(isTestNet));
client1.addCoin('btc', new BtcApiClient(isTestNet, 'btc'));

const client2 = keystoreClient();
client2.addCoin('aion', new AionKeystoreClient());
client2.addCoin('btc', new BtcKeystoreClient(isTestNet, 'btc'));

const geBalance = async (coinType, balance) => {
    const balance = await client1.getBalance(coinType, balance);
    return balance;
}
```
if you want to learn more, please see [api-client guide](../../docs/api-client.md) and [keysote-client guide](../../docs/keysotre-client.md).




