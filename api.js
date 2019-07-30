import {toHex} from "./utils";
import ApiCaller from "./utils/Api_caller";
import {app_server_api} from "./remote_server";
import {CoinType} from "./coins/coinType";

import aionApi from './coins/aion/api';
import btcApi from './coins/btc+ltc/api';
import ethApi from './coins/eth/api';
import tronApi from './coins/tron/api';

function initApi(support_coin_lists, isTestNet) {
    let COINS = {};
    for (let coin of support_coin_lists){
       switch (coin) {
           case 'AION':
               COINS = {
                   ...COINS,
                   AION: {
                       api: aionApi,
                       network: isTestNet ? 'mastery' : 'mainnet',
                   }
               };
               break;
           case 'BTC':
               COINS = {
                   ...COINS,
                   BTC: {
                       api: btcApi,
                       network: isTestNet ? 'BTCTEST' : 'BTC',
                   }
               };
               break;
           case 'ETH':
               COINS = {
                   ...COINS,
                   ETH: {
                       api: ethApi,
                       network: isTestNet ? 'ropsten' : 'mainnet',
                   }
               };
               break;
           case 'LTC':
               COINS = {
                   ...COINS,
                   LTC: {
                       api: btcApi,
                       network: isTestNet ? 'LTCTEST' : 'LTC',
                   }
               };
               break;
           case 'TRX':
               COINS = {
                   ...COINS,
                   TRX: {
                       api: tronApi,
                       network: isTestNet ? 'shasta' : 'mainnet',
                   }
               };
               break;
           default:
               throw new Error(`Not support for coin ${coin}`);
       }
    }
    return COINS;
}

export function client (support_coin_lists, isTestNet) {
    const COINS = initApi(support_coin_lists, isTestNet);
    function getTokenIconUrl(coinType, tokenSymbol = undefined, contractAddress = undefined) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.getTokenIconUrl !== undefined) {
            return coin.api.getTokenIconUrl(tokenSymbol, contractAddress, coin.network);
        }
        throw new Error(`No getTokenIconUrl impl for coin ${coinType}`);
    }

    function getBlockByNumber(coinType, blockNumber) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.getBlockByNumber !== undefined) {
            return coin.api.getBlockByNumber(toHex(blockNumber), false, coin.network);
        }
        throw new Error(`No getBlockByNumber impl for coin ${coinType}`);
    }

    function getTransactionExplorerUrl(coinType, hash) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.getTransactionUrlInExplorer !== undefined) {
            return coin.api.getTransactionUrlInExplorer(hash, coin.network);
        }
        throw new Error(`No getTransactionExplorerUrl impl for coin ${coinType}`);
    }

    function getTransactionsByAddress(coinType, address, page = 0, size = 5) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.getTransactionsByAddress !== undefined) {
            return coin.api.getTransactionsByAddress(address, page, size, coin.network);
        }
        throw new Error(`No getTransactionsByAddress impl for coin ${coinType}`);
    }

    function getBlockNumber(coinType) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.blockNumber !== undefined) {
            return coin.api.blockNumber(coin.network);
        }
        throw new Error(`No blockNumber impl for coin ${coinType}`);
    }

    function getTransactionStatus(coinType, hash) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.getTransactionStatus !== undefined) {
            return coin.api.getTransactionStatus(hash, coin.network);
        }
        throw new Error(`No getTransactionStatus impl for coin ${coinType}`);
    }

    function getBalance(coinType, address) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.getBalance !== undefined) {
            return coin.api.getBalance(address, coin.network);
        }
        throw new Error(`No getBalance impl for coin ${coinType}`);
    }

    function sendTransaction(account, symbol, to, value, extraParams, data = undefined) {
        const coin = COINS[account.symbol.toUpperCase()];
        if (coin.api !== undefined && coin.api.sendTransaction !== undefined) {
            return coin.api.sendTransaction(
                account,
                symbol,
                to,
                value,
                extraParams,
                data,
                coin.network,
            );
        }
        throw new Error(`No sendTransaction impl for coin ${account.symbol}`);
    }

    function sameAddress(coinType, address1, address2) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.sameAddress !== undefined) {

            return coin.api.sameAddress(address1, address2);
        }
        throw new Error(`No sameAddress impl for coin ${coinType}`);
    }

    function formatAddress1Line(coinType, address) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.formatAddress1Line !== undefined) {
            return coin.api.formatAddress1Line(address);
        }
        return address;
    }

    function validateBalanceSufficiency(account, symbol, amount, extraParams) {
        const coin = COINS[account.symbol.toUpperCase()];
        if (coin.api !== undefined && coin.api.validateBalanceSufficiency !== undefined) {
            return coin.api.validateBalanceSufficiency(account, symbol, amount, extraParams);
        }
        return Promise.resolve({result: true});
    }

    function getCoinPrices(currency) {
        const cryptos = Object.keys(COINS).join(',');
        const url = `${app_server_api}/market/prices?cryptos=${cryptos}&fiat=${currency}`;
        console.log(`[http req]fetch coin prices: ${url}`);
        return new Promise((resolve, reject) => {
            ApiCaller.get(url, false).then(
                res => {
                    console.log('[http resp]', res.data);
                    resolve(res.data);
                },
                err => {
                    console.log('[http resp] err:', err);
                    reject(err);
                },
            );
        });
    }

    function fetchTokenDetail(coinType, contractAddress, network) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.fetchTokenDetail !== undefined) {
            return coin.api.fetchTokenDetail(contractAddress, network || coin.network);
        }
        throw new Error(`No fetchTokenDetail impl for coin ${coinType}`);
    }

    function fetchAccountTokenTransferHistory(coinType, address, symbolAddress, network, page = 0, size = 25) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.fetchAccountTokenTransferHistory !== undefined) {
            return coin.api.fetchAccountTokenTransferHistory(
                address,
                symbolAddress,
                network || coin.network,
                page,
                size,
            );
        }
        throw new Error(`No fetchAccountTokenTransferHistory impl for coin ${coinType}`);
    }

    function fetchAccountTokens(coinType, address, network) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.fetchAccountTokens !== undefined) {
            return coin.api.fetchAccountTokens(address, network || coin.network);
        }
        throw new Error(`No fetchAccountTokens impl for coin ${coinType}`);
    }

    function fetchAccountTokenBalance(coinType, contractAddress, address, network) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.fetchAccountTokenBalance !== undefined) {
            return coin.api.fetchAccountTokenBalance(contractAddress, address, network || coin.network);
        }
        throw new Error(`No fetchAccountTokenBalance impl for coin ${coinType}`);
    }

    function getTopTokens(coinType, topN = 20) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.getTopTokens !== undefined) {
            return coin.api.getTopTokens(topN, coin.network);
        }
        throw new Error(`No getTopTokens impl for coin ${coinType}`);
    }

    function searchTokens(coinType, keyword) {
        const coin = COINS[coinType.toUpperCase()];
        if (coin.api !== undefined && coin.api.searchTokens !== undefined) {
            return coin.api.searchTokens(keyword, coin.network);
        }
        throw new Error(`No searchTokens impl for coin ${coinType}`);
    }

    return {
        getTokenIconUrl,
        getBlockByNumber,
        getTransactionExplorerUrl,
        getTransactionsByAddress,
        getBlockNumber,
        getTransactionStatus,
        getBalance,
        sendTransaction,
        sameAddress,
        formatAddress1Line,
        validateBalanceSufficiency,
        getCoinPrices,
        fetchTokenDetail,
        fetchAccountTokenTransferHistory,
        fetchAccountTokens,
        fetchAccountTokenBalance,
        getTopTokens,
        searchTokens,
    }
}