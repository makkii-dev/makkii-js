/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
import BigNumber from "bignumber.js";
import { HttpClient } from "lib-common-util-js";
import { CONTRACT_ABI } from "./constants";
import jsonrpcClient from "./jsonrpc";

const Contract = require("aion-web3-eth-contract");

export default config => {
    const {
        getTransactionReceipt,
        getTransactionCount,
        sendSignedTransaction
    } = jsonrpcClient(config);

    async function sendTransaction(unsignedTx, signer, signerParams) {
        const signedTx = await signer.signTransaction(unsignedTx, signerParams);
        const hash = await sendSignedTransaction(signedTx);
        return {
            hash,
            status: "PENDING",
            to: unsignedTx.to,
            from: unsignedTx.from,
            value: unsignedTx.value,
            tknTo: unsignedTx.tknTo,
            tknValue: unsignedTx.tknValue,
            timestamp: unsignedTx.timestamp,
            gasLimit: unsignedTx.gasLimit,
            gasPrice: unsignedTx.gasPrice
        };
    }

    async function buildTransaction(from, to, value, options) {
        const {
            data: data_,
            gasLimit,
            gasPrice,
            contractAddr,
            isTokenTransfer,
            tokenDecimal
        } = options;
        const nonce = await getTransactionCount(from, "pending");
        let data = data_;
        if (isTokenTransfer) {
            const tokenContract = new Contract(CONTRACT_ABI, contractAddr);
            data = tokenContract.methods
                .send(
                    to,
                    value
                        .shiftedBy(tokenDecimal - 0)
                        .toFixed(0)
                        .toString(),
                    ""
                )
                .encodeABI();
        }
        return {
            to: isTokenTransfer ? contractAddr : to,
            from,
            nonce,
            value: isTokenTransfer ? new BigNumber(0) : new BigNumber(value),
            gasPrice,
            gasLimit,
            timestamp: Date.now(),
            data,
            type: 1,
            tknTo: isTokenTransfer ? to : "",
            tknValue: isTokenTransfer ? new BigNumber(value) : new BigNumber(0)
        };
    }

    async function getTransactionsByAddress(address, page = 0, size = 25) {
        const url = `${
            config.explorer_api
        }/aion/dashboard/getTransactionsByAddress?accountAddress=${address.toLowerCase()}&page=${page}&size=${size}`;
        console.log(`[aion req] get aion transactions by address: ${url}`);
        const res = await HttpClient.get(url, false);
        console.log("[keystore resp] res:", res.data);
        const { content } = res.data;
        const txs = {};
        content.forEach(t => {
            const tx: any = {};
            const timestamp_ = `${t.transactionTimestamp}`;
            tx.hash = `0x${t.transactionHash}`;
            tx.timestamp =
                timestamp_.length === 16
                    ? parseInt(timestamp_) / 1000
                    : timestamp_.length === 13
                    ? parseInt(timestamp_) * 1
                    : timestamp_.length === 10
                    ? parseInt(timestamp_) * 1000
                    : null;
            tx.from = `0x${t.fromAddr}`;
            tx.to = `0x${t.toAddr}`;
            tx.value = new BigNumber(t.value, 10).toNumber();
            tx.status = t.txError === "" ? "CONFIRMED" : "FAILED";
            tx.blockNumber = t.blockNumber;
            tx.fee = t.nrgConsumed * t.nrgPrice * 10 ** -18;
            txs[tx.hash] = tx;
        });
        return txs;
    }

    function getTransactionUrlInExplorer(txHash) {
        return `${config.explorer}/${txHash}`;
    }

    async function getTransactionStatus(txHash) {
        try {
            const receipt = await getTransactionReceipt(txHash);
            return {
                status: parseInt(receipt.status, 16) === 1,
                blockNumber: parseInt(receipt.blockNumber, 16),
                gasUsed: parseInt(receipt.gasUsed, 16)
            };
        } catch (e) {
            return null;
        }
    }

    return {
        sendTransaction,
        getTransactionsByAddress,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        buildTransaction
    };
};
