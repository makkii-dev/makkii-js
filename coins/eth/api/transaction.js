import BigNumber from "bignumber.js";
import Contract from 'web3-eth-contract';
import keystore from "../keystore";
import {sendSignedTransaction, getTransactionCount,getTransactionReceipt} from "./jsonrpc";
import {ERC20ABI} from "./constants";
import {HttpClient} from "lib-common-util-js";
import { config } from '../../serverConfig';

const {eth: {networks,etherscanApikey, ethplorerApiKey}} = config.coins;

function sendNativeTx(account, to, value, gasPrice, gasLimit, data, network = 'mainnet', shouldBroadCast) {
    return new Promise((resolve, reject) => {
        value = BigNumber.isBigNumber(value)? value: BigNumber(value);
        getTransactionCount(account.address, 'latest', network)
            .then(count => {
                let tx = {
                    network,
                    amount: value.shiftedBy(18).toNumber(),
                    nonce: count,
                    gasLimit: gasLimit,
                    gasPrice: gasPrice,
                    to: to,
                    private_key: account.private_key,
                };
                if (data !== undefined) {
                    tx = { ...tx, data };
                }
                keystore.signTransaction(tx)
                    .then(res => {
                        const { v, r, s, encoded } = res;
                        console.log('sign result:');
                        console.log(`v:${v},r=${r},s=${s}`);
                        const encodedTx = encoded;
                        console.log('encoded keystore tx => ', encodedTx);
                        if(shouldBroadCast) {
                            sendSignedTransaction(encodedTx, network)
                                .then(hash => {
                                    const pendingTx = {
                                        hash,
                                        from: account.address,
                                        to,
                                        value,
                                        status: 'PENDING',
                                        gasPrice
                                    };
                                    resolve({pendingTx});
                                })
                                .catch(e => {
                                    console.log('send signed tx:', e);
                                    reject(e);
                                });
                        }else {
                            const txObj  = {
                                from: account.address,
                                to,
                                value,
                                gasPrice
                            };
                            resolve({encoded, txObj})
                        }
                    })
                    .catch(e => {
                        console.log('sign error:', e);
                        reject(e);
                    });
            })
            .catch(err => {
                console.log('get tx count error:', err);
                reject(err);
            });
    });
}

function sendTokenTx(account, symbol, to, value, gasPrice, gasLimit, network = 'mainnet', shouldBroadCast) {
    const { tokens } = account;
    const { contractAddr, tokenDecimal } = tokens[symbol];

    const tokenContract = new Contract(ERC20ABI, contractAddr);
    const methodsData = tokenContract.methods
        .transfer(
            to,
            value
                .shiftedBy(tokenDecimal - 0)
                .toFixed(0)
                .toString(),
        )
        .encodeABI();
    return new Promise((resolve, reject) => {
        sendNativeTx(
            account,
            contractAddr,
            BigNumber(0),
            gasPrice,
            gasLimit,
            methodsData,
            network,
            shouldBroadCast
        )
            .then(res => {
                if(shouldBroadCast) {
                    const {pendingTx} = res;
                    pendingTx.tknTo = to;
                    pendingTx.tknValue = value;
                    resolve({pendingTx});
                }else{
                    resolve(res)
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

function sendTransaction(account, symbol, to, value, extraParams, data, network = 'mainnet', shouldBroadCast=true) {
    const { gasPrice } = extraParams;
    const { gasLimit } = extraParams;
    if (account.symbol === symbol) {
        return sendNativeTx(account, to, value, gasPrice, gasLimit, data, network, shouldBroadCast);
    }
    return sendTokenTx(account, symbol, to, value, gasPrice, gasLimit, network, shouldBroadCast);
}

function getTransactionsByAddress(address, page, size, timestamp, network = 'mainnet') {
    let explorer_api = networks[network].explorer_api;
    if (explorer_api["provider"] === "etherscan") {
        const url = `${explorer_api["url"]}?module=account&action=txlist&address=${address}&page=${page}&offset=${size}&sort=asc&apikey=${etherscanApikey}`;
        console.log(`[eth http req] get transactions by address: ${url}`);
        return new Promise((resolve, reject) => {
            HttpClient.get(url, false).then(
                res => {
                    console.log('[http resp]', res.data);
                    const { result } = res.data;
                    const txs = {};
                    result.forEach(t => {
                        const tx = {};
                        tx.hash = t.hash;
                        tx.timestamp = parseInt(t.timeStamp) * 1000;
                        tx.from = t.from;
                        tx.to = t.to;
                        tx.value = BigNumber(t.value, 10).shiftedBy(-18).toNumber();
                        tx.status = t.isError === '0' ? 'CONFIRMED' : 'FAILED';
                        tx.blockNumber = parseInt(t.blockNumber);
                        tx.fee = t.gasPrice * t.gasUsed * 10**-18;
                        txs[tx.hash] = tx;
                    });
                    resolve(txs);
                },
                err => {
                    console.log('[http resp] err: ', err);
                    reject(err);
                },
            );
        });
    } else {
        const url = `${explorer_api["url"]}/getAddressTransactions/${address}?apiKey=${ethplorerApiKey}&limit=${size}&timestamp=${timestamp / 1000 - 1}&showZeroValues=true`;
        console.log(`[eth http req] get transactions by address: ${url}`);
        return new Promise((resolve, reject) => {
            HttpClient.get(url, false).then(
                res => {
                    console.log('[http resp]', res.data);
                    if (res.data.error) {
                        console.log('[http resp] err: ', res.data.error);
                        reject(res.data.error);
                    } else {
                        const txs = {};
                        res.data.forEach(t => {
                            const tx = {};
                            tx.hash = t.hash;
                            tx.timestamp = t.timestamp * 1000;
                            tx.from = t.from;
                            tx.to = t.to;
                            tx.value = BigNumber(t.value);
                            tx.status = t.success ? "CONFIRMED" : 'FAILED';
                            txs[tx.hash] = tx;
                        });
                        resolve(txs);
                    }
                },
                err => {
                    console.log('[http resp] err: ', err);
                    reject(err);
                },
            );
        });
    }
}

function getTransactionUrlInExplorer(txHash, network = 'mainnet') {
    let explorer = networks[network].explorer;
    if (explorer["provider"] === "etherscan") {
        return `${explorer["url"]}/${txHash}`
    } else {
        return `${explorer["url"]}/${txHash}`;
    }
}

function getTransactionStatus(txHash, network = 'mainnet') {
    return new Promise((resolve, reject) => {
        getTransactionReceipt(txHash, network)
            .then(receipt => {
                if (receipt !== null) {
                    resolve({
                        status: parseInt(receipt.status, 16) === 1,
                        blockNumber: parseInt(receipt.blockNumber, 16),
                        gasUsed: parseInt(receipt.gasUsed,16),
                    });
                } else {
                    resolve(null);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

export {
    sendTransaction,
    getTransactionsByAddress,
    getTransactionUrlInExplorer,
    getTransactionStatus
}
