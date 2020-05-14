import { HttpClient } from "@makkii/makkii-utils";
import BigNumber from "bignumber.js";
import jsonrpcClient from "./jsonrpc";

export default config => {
    const {
        getTransactionById,
        getTransactionInfoById,
        getLatestBlock,
        broadcastTransaction
    } = jsonrpcClient(config);

    async function sendTransaction(unsignedTx, signer, signerParams) {
        const signedTx = await signer.signTransaction(unsignedTx, signerParams);
        const broadcastRes: any = await broadcastTransaction(signedTx);
        if (broadcastRes.result) {
            return {
                hash: `${signedTx.txID}`,
                timestamp: unsignedTx.timestamp,
                from: unsignedTx.owner,
                to: unsignedTx.to,
                value: unsignedTx.amount,
                status: "PENDING"
            };
        }
        throw new Error("broadcast tx failed");
    }

    async function buildTransaction(from, to, value) {
        value = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
        const block: any = await getLatestBlock();
        const latest_block = {
            hash: block.blockID,
            number: block.block_header.raw_data.number
        };
        const now = new Date().getTime();
        const expire = now + 10 * 60 * 60 * 1000;
        const tx = {
            to,
            owner: from,
            amount: value.toNumber(),
            timestamp: now,
            expiration: expire,
            latest_block
        };
        return tx;
    }

    async function getTransactionStatus(txHash) {
        try {
            const res = await getTransactionInfoById(txHash);
            const { blockNumber } = res;
            const tx = await getTransactionById(txHash);
            if (
                tx.ret !== undefined &&
                tx.ret instanceof Array &&
                tx.ret.length > 0 &&
                tx.ret[0].contractRet !== undefined
            ) {
                return {
                    blockNumber,
                    status: tx.ret[0].contractRet === "SUCCESS"
                };
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async function getTransactionsByAddress(address, page = 0, size = 25) {
        const url = `${
            config.explorer_api
        }/transfer?sort=-timestamp&limit=${size}&start=${page *
            size}&address=${address}`;
        console.log(`[TRON req] getTransactionsByAddress: ${url}`);
        const res = await HttpClient.get(url, false);
        console.log(`[TRON resp] getTransactionsByAddress:`, res.data);
        const { data } = res.data;
        const txs = {};
        data.forEach(t => {
            if (t.tokenName === "_") {
                const tx: any = {};
                tx.hash = `${t.transactionHash}`;
                tx.timestamp = t.timestamp;
                tx.from = t.transferFromAddress;
                tx.to = t.transferToAddress;
                tx.value = new BigNumber(t.amount, 10).shiftedBy(-6).toNumber();
                tx.blockNumber = t.block;
                tx.status = t.confirmed ? "CONFIRMED" : "FAILED";
                txs[tx.hash] = tx;
            }
        });
        return txs;
    }

    function getTransactionUrlInExplorer(txHash) {
        txHash = txHash.startsWith("0x") ? txHash.slice(2) : txHash;
        return `${config.explorer}/${txHash}`;
    }

    return {
        sendTransaction,
        getTransactionStatus,
        getTransactionUrlInExplorer,
        getTransactionsByAddress,
        buildTransaction
    };
};
