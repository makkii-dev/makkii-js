import { hexutil } from "@makkii/makkii-utils";
import BigNumber from "bignumber.js";

const EthereumTx = require("ethereumjs-tx");

const KEY_MAP = ["value", "nonce", "gasLimit", "gasPrice", "to"];

/**
 * @hidden
 * @private
 */
export const process_unsignedTx = transaction => {
    const {
        network,
        value: amount,
        nonce,
        gasLimit,
        gasPrice,
        to,
        data
    } = transaction;
    // check key;
    KEY_MAP.forEach(k => {
        // eslint-disable-next-line no-prototype-builtins
        if (!transaction.hasOwnProperty(k)) {
            throw new Error(`${k} not found`);
        }
    });

    let txParams: any = {
        nonce: hexutil.toHex(nonce),
        gasPrice: hexutil.toHex(new BigNumber(gasPrice)),
        gasLimit: hexutil.toHex(new BigNumber(gasLimit)),
        to: hexutil.toHex(to),
        value: hexutil.toHex(new BigNumber(amount).shiftedBy(18)),
        chainId: getChainId(network),
        v: getChainId(network),
        r: "0x00",
        s: "0x00"
    };
    if (data) {
        txParams = { ...txParams, data };
    }
    const tx = new EthereumTx(txParams);
    return tx;
};

const getChainId = network => {
    if (network.toLowerCase() === "morden") {
        return 2;
    }
    if (network.toLowerCase() === "ropsten") {
        return 3;
    }
    if (network.toLowerCase() === "rinkeby") {
        return 4;
    }
    if (network.toLowerCase() === "goerli") {
        return 5;
    }
    if (network.toLowerCase() === "kovan") {
        return 42;
    }
    return 1;
};
