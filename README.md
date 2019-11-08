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
##### initialize keystore mangager
```javascript
import { keystoreClient } from 'makkii-coins';

// initialize keystore client.
let isTestNet = false;
let supportCoins = ['aion', 'eth'];
const keystore = keystoreClient(supportCoins, isTestNet);
```
##### supported functions
* setMnemonic(mnemonic, passphrase)

Set and store mnemonic phrase.
* getKey(coinType, address_index)

Based on hd wallet recovered from preset mnemonic phrases, get key pair according to the given index.

* getKeyFromMnemonic(coinType, address_index, mnemonic)

get key pair according to the given index and mnemonic.

* generateMnemonic()

Generate random mnemonic phrases.

* recoverKeyPairByPrivateKey(priKey, coinType)

Recover key pair from private key.

* validateAddress(address, coinType)

Validate address format.

* getKeyByLedger(coinType, index)

Get keypair from ledger

## Wallet Api
* getTokenIconUrl(coinType, tokenSymbol, contractAddress)
Get token icon url. Currently only support ERC-20 token icon.

* getBlockByNumber(coinType, blockNumber)

* getTransactionExplorerUrl(coinType, tx_hash)

Return explorer url of a transaction, such as https://etherscan.io/tx/0xeb522116199db6d24c79749f26520523d1cb0ee324018ae307c407335ed61b81
* getTransactionsByAddress(coinType, address, page, size, timestamp)

Get transaction list by page for the given account
* getBlockNumber(coinType)

Get latest block number
* getTransactionStatus(coinType, tx_hash)
* getBalance(coinType, address)

Get balance of the given account 
* sendTransaction(account, symbol, to, value, extraParams, data)
* sameAddress(coinType, address1, address2)
* formatAddress1Line(coinType, address)
* validateBalanceSufficiency(account, symbol, amount, extraParams)
* fetchTokenDetail(coinType, contractAddress, network)
* fetchAccountTokenTransferHistory(coinType, address, symbolAddress, network, page, size, timestamp)
* fetchAccountTokens(coinType, address, network)
* fetchAccountTokenBalance(coinType, contractAddress, address, network)
* getTopTokens(coinType, topN)
* searchTokens(coinType, keyword)
