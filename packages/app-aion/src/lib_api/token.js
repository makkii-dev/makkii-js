import BigNumber from 'bignumber.js';
import Contract from 'aion-web3-eth-contract';
import AbiCoder from 'aion-web3-eth-abi';
import axios from 'axios';
import { HttpClient, hexutil } from 'lib-common-util-js';
import { processRequest } from './jsonrpc';
import { CONTRACT_ABI } from './constants';

export default (config) => {

  function getAccountTokens(address) {
    return new Promise((resolve, reject) => {
      const url = `${config.explorer_api}/aion/dashboard/getAccountDetails?accountAddress=${address.toLowerCase()}`;
      HttpClient.get(url)
        .then(({ data }) => {
          const res = {};
          if (data.content.length > 0) {
            const { tokens } = data.content[0];
            tokens.forEach((token) => {
              res[token.symbol] = {
                symbol: token.symbol,
                contractAddr: token.contractAddr,
                name: token.name,
                tokenDecimal: token.tokenDecimal,
                balance: new BigNumber(0),
                tokenTxs: {},
              };
            });
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  const getAccountTokenBalance = (contractAddress, address) => new Promise((resolve, reject) => {
    const contract = new Contract(CONTRACT_ABI);
    const requestData = processRequest('eth_call', [
      { to: contractAddress, data: contract.methods.balanceOf(address).encodeABI() },
      'latest',
    ]);
    console.log('[AION get token balance req]:', config.jsonrpc);

    HttpClient.post(config.jsonrpc, requestData, true)
      .then((res) => {
        if (res.data.result) {
          resolve(new BigNumber(AbiCoder.decodeParameter('uint128', res.data.result)));
        } else {
          reject(new Error(`get account Balance failed:${res.data.error}`));
        }
      })
      .catch((e) => {
        reject(new Error(`get account Balance failed:${e}`));
      });
  });

  const getTokenDetail = (contractAddress) => new Promise((resolve, reject) => {
    const contract = new Contract(CONTRACT_ABI);
    const requestGetSymbol = processRequest('eth_call', [
      { to: contractAddress, data: contract.methods.symbol().encodeABI() },
      'latest',
    ]);
    const requestGetName = processRequest('eth_call', [
      { to: contractAddress, data: contract.methods.name().encodeABI() },
      'latest',
    ]);
    const requestGetDecimals = processRequest('eth_call', [
      { to: contractAddress, data: contract.methods.decimals().encodeABI() },
      'latest',
    ]);
    const url = config.jsonrpc;
    const promiseSymbol = HttpClient.post(url, requestGetSymbol, true);
    const promiseName = HttpClient.post(url, requestGetName, true);
    const promiseDecimals = HttpClient.post(url, requestGetDecimals, true);
    console.log('[AION get token detail req]:', config.jsonrpc);
    axios
      .all([promiseSymbol, promiseName, promiseDecimals])
      .then(
        axios.spread((symbolRet, nameRet, decimalsRet) => {
          if (symbolRet.data.result && nameRet.data.result && decimalsRet.data.result) {
            console.log('[get token symobl resp]=>', symbolRet.data);
            console.log('[get token name resp]=>', nameRet.data);
            console.log('[get token decimals resp]=>', decimalsRet.data);
            let symbol;
            let name;
            try {
              symbol = AbiCoder.decodeParameter('string', symbolRet.data.result);
            } catch (e) {
              symbol = hexutil.hexToAscii(symbolRet.data.result);
              symbol = symbol.slice(0, symbol.indexOf('\u0000'));
            }
            try {
              name = AbiCoder.decodeParameter('string', nameRet.data.result);
            } catch (e) {
              name = hexutil.hexToAscii(nameRet.data.result);
              name = name.slice(0, name.indexOf('\u0000'));
            }
            const decimals = AbiCoder.decodeParameter('uint8', decimalsRet.data.result);
            resolve({
              contractAddr: contractAddress, symbol, name, decimals,
            });
          } else {
            reject(new Error('get token detail failed'));
          }
        }),
      )
      .catch((e) => {
        reject(new Error(`get token detail failed${e}`));
      });
  });

  function getAccountTokenTransferHistory(address, symbolAddress, page = 0, size = 25) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line max-len
      const url = `${config.explorer_api}/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&tokenAddress=${symbolAddress.toLowerCase()}&page=${page}&size=${size}`;
      console.log(`get account token transactions: ${url}`);
      HttpClient.get(url)
        .then((res) => {
          const { content = [] } = res.data;
          const txs = {};
          content.forEach((t) => {
            const tx = {
              hash: `0x${t.transactionHash}`,
              timestamp: t.transferTimestamp * 1000,
              from: `0x${t.fromAddr}`,
              to: `0x${t.toAddr}`,
              value: new BigNumber(t.tknValue, 10).toNumber(),
              status: 'CONFIRMED',
              blockNumber: t.blockNumber,
            };
            txs[tx.hash] = tx;
          });
          resolve(txs);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  const getTopTokens = (topN = 20) => new Promise((resolve, reject) => {
    const url = `${config.remoteApi}/token/aion?offset=0&size=${topN}`;
    console.log(`get top aion tokens: ${url}`);
    HttpClient.get(url, false)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log('get keystore top tokens error:', err);
        reject(err);
      });
  });

  const searchTokens = (keyword) => new Promise((resolve, reject) => {
    const url = `${config.remoteApi}/token/aion/search?keyword=${keyword}`;
    console.log(`search aion token: ${url}`);
    HttpClient.get(url, false)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log('search keystore token error:', err);
        reject(err);
      });
  });

  return {
    getAccountTokens,
    getAccountTokenBalance,
    getAccountTokenTransferHistory,
    getTokenDetail,
    getTopTokens,
    searchTokens,
  };
}
