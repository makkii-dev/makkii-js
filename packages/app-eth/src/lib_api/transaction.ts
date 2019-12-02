import BigNumber from "bignumber.js";
import { HttpClient } from "lib-common-util-js";
import jsonrpcClient from "./jsonrpc";
import { ERC20ABI } from "./constants";

const Contract = require('web3-eth-contract');


export default config => {
    const { sendSignedTransaction, getTransactionCount, getTransactionReceipt } = jsonrpcClient(config)


    async function sendTransaction(unsignedTx, signer, signerParams) {
        const signedTx = await signer.signTransaction(unsignedTx, signerParams);
        const hash = await sendSignedTransaction(signedTx);
        return {
          hash,
          status: 'PENDING',
          to: unsignedTx.to,
          from: unsignedTx.from,
          value: unsignedTx.value,
          tknTo: unsignedTx.tknTo,
          tknValue: unsignedTx.tknValue,
          timestamp: unsignedTx.timestamp,
          gasLimit: unsignedTx.gasLimit,
          gasPrice: unsignedTx.gasPrice
        }
      }

    async function buildTransaction(from, to, value, options) {
        const { data: data_, gasLimit, gasPrice, contractAddr, isTransfer, tokenDecimal } = options;
        const nonce = await getTransactionCount(from, 'pending');
        let data = data_;
        if (isTransfer) {
            const tokenContract = new Contract(ERC20ABI, contractAddr);
            data = tokenContract.methods
                .send(
                    to,
                    value
                        .shiftedBy(tokenDecimal - 0)
                        .toFixed(0)
                        .toString(),
                    '',
                )
                .encodeABI();
        }
        return {
            to: isTransfer ? contractAddr : to,
            from,
            nonce,
            value,
            gasPrice,
            gasLimit,
            data,
            network: config.network
        }
    }


    function getTransactionsByAddress(address, page, size, timestamp) {
        const { explorer_api } = config;
        if (explorer_api.provider === "etherscan") {
            const url = `${explorer_api.url}?module=account&action=txlist&address=${address}&page=${page}&offset=${size}&sort=asc&apikey=${config.etherscanApikey}`;
            console.log(`[eth http req] get transactions by address: ${url}`);
            return new Promise((resolve, reject) => {
                HttpClient.get(url, false).then(
                    res => {
                        console.log('[http resp]', res.data);
                        const { result } = res.data;
                        const txs = {};
                        result.forEach(t => {
                            const tx:any = {};
                            tx.hash = t.hash;
                            tx.timestamp = parseInt(t.timeStamp) * 1000;
                            tx.from = t.from;
                            tx.to = t.to;
                            tx.value = new BigNumber(t.value, 10).shiftedBy(-18).toNumber();
                            tx.status = t.isError === '0' ? 'CONFIRMED' : 'FAILED';
                            tx.blockNumber = parseInt(t.blockNumber);
                            tx.fee = t.gasPrice * t.gasUsed * 10 ** -18;
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
        }
        const url = `${explorer_api.url}/getAddressTransactions/${address}?apiKey=${config.ethplorerApiKey}&limit=${size}&timestamp=${timestamp / 1000 - 1}&showZeroValues=true`;
        console.log(`[eth http req] get transactions by address: ${url}`);
        return new Promise((resolve, reject) => {
            HttpClient.get(url, false).then(
                res => {
                    console.log('[http resp]', res.data);
                    if (res.data.error) {
                        reject(res.data.error);
                    } else {
                        const txs = {};
                        res.data.forEach(t => {
                            const tx:any = {};
                            tx.hash = t.hash;
                            tx.timestamp = t.timestamp * 1000;
                            tx.from = t.from;
                            tx.to = t.to;
                            tx.value = new BigNumber(t.value);
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

    function getTransactionUrlInExplorer(txHash) {
        const { explorer } = config;
        if (explorer.provider === "etherscan") {
            return `${explorer.url}/${txHash}`
        }
        return `${explorer.url}/${txHash}`;

    }

    function getTransactionStatus(txHash) {
        return new Promise((resolve, reject) => {
            getTransactionReceipt(txHash)
                .then((receipt:any) => {
                    if (receipt !== null) {
                        resolve({
                            status: parseInt(receipt.status, 16) === 1,
                            blockNumber: parseInt(receipt.blockNumber, 16),
                            gasUsed: parseInt(receipt.gasUsed, 16),
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

    return {
        sendTransaction,
        buildTransaction,
        getTransactionsByAddress,
        getTransactionUrlInExplorer,
        getTransactionStatus
    }
}