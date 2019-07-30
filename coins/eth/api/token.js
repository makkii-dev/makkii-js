import axios from 'axios';
import BigNumber from "bignumber.js";
import Contract from 'web3-eth-contract'
import AbiCoder from 'web3-eth-abi';
import ApiCaller from "../../../utils/Api_caller";
import {getEndpoint, ERC20ABI, ETHERSCAN_URL_MAP} from "./constants";
import {processRequest} from "./jsonrpc";
import {hexToAscii} from "../../../utils";
import {app_server_api} from "../../../remote_server";

const fetchAccountTokenBalance = (contractAddress, address, network) =>
    new Promise((resolve, reject) => {
        const contract = new Contract(ERC20ABI);
        const requestData = processRequest('eth_call', [
            { to: contractAddress, data: contract.methods.balanceOf(address).encodeABI() },
            'latest',
        ]);
        console.log('[ETH get token balance req]:', getEndpoint(network));
        ApiCaller.post(getEndpoint(network), requestData, true)
            .then(res => {
                if (res.data.result) {
                    resolve(BigNumber(AbiCoder.decodeParameter('uint256', res.data.result)));
                } else {
                    reject(`get account Balance failed:${res.data.error}`);
                }
            })
            .catch(e => {
                reject(`get account Balance failed:${e}`);
            });
    });

const fetchTokenDetail = (contractAddress, network) =>
    new Promise((resolve, reject) => {
        const contract = new Contract(ERC20ABI);
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
        const url = getEndpoint(network);
        const promiseSymbol = ApiCaller.post(url, requestGetSymbol, true);
        const promiseName = ApiCaller.post(url, requestGetName, true);
        const promiseDecimals = ApiCaller.post(url, requestGetDecimals, true);
        console.log('[ETH get token detail req]:', getEndpoint(network));
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
                            symbol = hexToAscii(symbolRet.data.result);
                            symbol = symbol.slice(0, symbol.indexOf('\u0000'));
                        }
                        try {
                            name = AbiCoder.decodeParameter('string', nameRet.data.result);
                        } catch (e) {
                            name = hexToAscii(nameRet.data.result);
                            name = name.slice(0, name.indexOf('\u0000'));
                        }
                        const decimals = AbiCoder.decodeParameter('uint8', decimalsRet.data.result);
                        resolve({ contractAddr: contractAddress, symbol, name, decimals });
                    } else {
                        reject('get token detail failed');
                    }
                }),
            )
            .catch(e => {
                reject(`get token detail failed:${e}`);
            });
    });

const fetchAccountTokenTransferHistory = (address, symbolAddress, network, page = 0, size = 25) =>
    new Promise((resolve, reject) => {
        const url = `${ETHERSCAN_URL_MAP[network]}/api?module=account&action=tokentx&contractaddress=${symbolAddress}&address=${address}&page=${page}&offset=${size}&sort=asc&apikey=${etherscanApikey}`;
        console.log(`[eth http req] get token history by address: ${url}`);
        ApiCaller.get(url)
            .then(res => {
                const { data } = res;
                if (data.status === '1') {
                    const transfers = {};
                    const { result: txs } = data;
                    txs.forEach(t => {
                        const tx = {};
                        tx.hash = t.hash;
                        tx.timestamp = parseInt(t.timeStamp) * 1000;
                        tx.from = t.from;
                        tx.to = t.to;
                        tx.value = BigNumber(t.value).shiftedBy(-t.tokenDecimal).toNumber();
                        tx.status = 'CONFIRMED';
                        tx.blockNumber = t.blockNumber;
                        transfers[tx.hash] = tx;
                    });
                    resolve(transfers);
                } else {
                    resolve({});
                }
            })
            .catch(err => {
                console.log('[http resp] err: ', err);
                reject(err);
            });
    });

const fetchAccountTokens = () => Promise.resolve({});

function getTopTokens(topN = 20) {
    return new Promise((resolve, reject) => {
        const url = `${app_server_api}/token/eth/search?offset=0&limit=${topN}`;
        console.log(`get top eth tokens: ${url}`);
        ApiCaller.get(url, false)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log('get keystore top tokens error:', err);
                reject(err);
            });
    });
}

function searchTokens(keyword) {
    return new Promise((resolve, reject) => {
        const url = `${app_server_api}/token/eth/search?offset=0&limit=20&keyword=${keyword}`;
        console.log(`search eth token: ${url}`);
        ApiCaller.get(url, false)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log('search keystore token error:', err);
                reject(err);
            });
    });
}

function getTokenIconUrl(tokenSymbol, contractAddress) {
    return `${app_server_api}/token/eth/img?contractAddress=${contractAddress}`;
}

export {
    fetchTokenDetail,
    fetchAccountTokenBalance,
    fetchAccountTokens,
    fetchAccountTokenTransferHistory,
    getTopTokens,
    getTokenIconUrl,
    searchTokens
}