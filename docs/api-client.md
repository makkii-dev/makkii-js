# Api client 
**Api client** is a client that provides methods for signing and broadcasting transaction, fetching transactions history and getting blockchain、transaction or account basic information; we also provide some toolings, such as format address, validate balance


## Getting start
```js
import {apiClient} from "makkii-coins";
const support_coin_lists = ['aion'];
const client = apiClient(support_coin_lists);
```
## Support coins [reference](../packages/makkii-core/index.d.ts)
| method | Aion | BTC | ETH | LTC | TRON |
|:---:|:---:|:---:|:---:|:---:|:---:|
|getBlockByNumber|√|√|√|√|√|
|getBlockNumber|√|√|√|√|√|
|getCoinPrices|√|√|√|√|√|
|getBalance|√|√|√|√|√|
|getTransactionsByAddress|√|√|√|√|√|
|getTransactionStatus|√|√|√|√|√|
|getTransactionExplorerUrl|√|√|√|√|√|
|sendTransaction|√|√|√|(only support privateKey)|(only support privateKey)|
|validateBalanceSufficiency|√|√|√|√|√|
|sameAddress|√|√|√|√|√|
|formatAddress1Line|√|√|√|√|√|
|getTokenIconUrl|√| |√|||
|getTokenDetail|√| |√||||
|getAccountTokenTransferHistory|√| |√|||
|getAccountTokens|√| |√|||
|getAccountTokenBalance|√| |√|||
|getTopTokens|√| |√|||
|searchTokens|√| |√|||

## APIS
We define the api used to get blockchain information as jsonrpc, the api used to obtain the transaction history is defined as explorer_api, the api to display transaction detail as explorer; We use apis as follow:

|coins|jsonrpc|explorer_api|explorer|
|:---:|:---:|:---:|:---:|
| aion| [aion-web3](https://github.com/aionnetwork/aion_web3/wiki/API:-web3)| [aion explorer-api](https://github.com/aionnetwork/explorer_API)| [aion explorer](https://mainnet.theoan.com/#/dashboard)|
| eth| [web3](https://web3js.readthedocs.io/en/v1.2.2/)| [etherscan](https://etherscan.io/apis)| [etherscan](https://etherscan.io/)|
| btc | [insight-api](https://github.com/bitpay/insight-api/tree/v0.4.3)| [insight-api](https://github.com/bitpay/insight-api/tree/v0.4.3)| [insight-ui](https://github.com/bitpay/insight/tree/v0.4.0)|
| ltc | [insight-api](https://github.com/litecoin-project/insight-lite-api)| [insight-api](https://github.com/litecoin-project/insight-lite-api)| [insight-ui](https://github.com/litecoin-project/insight-lite-ui)|
| tron| [trongrid](https://developers.tron.network/reference)| [tronscan](https://tronscan.org/#/)| [tronscan](https://tronscan.org/#/)|

you also can custom define api by use **client.coverRemoteApi**, eg: [serverConfig.js](../coins/server.json) 




