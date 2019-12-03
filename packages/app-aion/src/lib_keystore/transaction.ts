/* eslint-disable import/prefer-default-export */
import BigNumber from "bignumber.js";
import { hexutil } from "lib-common-util-js";
import { inputAddressFormatter } from "./address";

const rlp = require("aion-rlp");
const BN = require("bn.js");

/** *
 * @hidden
 */
export const process_unsignedTx = transaction => {
    const tx = txInputFormatter(transaction);

    const unsignedTransaction = {
        nonce: tx.nonce,
        to: tx.to || "0x",
        data: tx.data,
        amount: numberToHex(new BigNumber(tx.value).shiftedBy(18)) || "0x",
        timestamp: tx.timestamp || Math.floor(new Date().getTime() * 1000),
        type: tx.type || 1,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice
    };

    const rlpEncoded = rlp.encode([
        unsignedTransaction.nonce,
        unsignedTransaction.to.toLowerCase(),
        unsignedTransaction.amount,
        unsignedTransaction.data,
        unsignedTransaction.timestamp,
        toAionLong(unsignedTransaction.gasLimit),
        toAionLong(unsignedTransaction.gasPrice),
        toAionLong(unsignedTransaction.type)
    ]);
    return rlpEncoded;
};

const txInputFormatter = options => {
    if (options.to) {
        // it might be contract creation
        options.to = inputAddressFormatter(options.to);
    }

    if (options.data && options.input) {
        throw new Error(
            'You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.'
        );
    }

    if (!options.data && options.input) {
        options.data = options.input;
        delete options.input;
    }

    if (options.data && !hexutil.isHex(options.data)) {
        throw new Error("The data field must be HEX encoded data.");
    }

    // allow both
    if (options.gas || options.gasLimit) {
        options.gasLimit = options.gas || options.gasLimit;
    }

    ["gasPrice", "gasLimit", "nonce"]
        .filter(key => options[key] !== undefined)
        .forEach(key => {
            options[key] = numberToHex(options[key]);
        });

    return options;
};

const toAionLong = val => {
    let num;
    if (val === undefined || val === null || val === "" || val === "0x") {
        return null;
    }

    if (typeof val === "string") {
        if (hexutil.isHex(val.toLowerCase())) {
            num = new BN(hexutil.removeLeadingZeroX(val.toLowerCase()), 16);
        } else {
            num = new BN(val, 10);
        }
    }

    if (typeof val === "number") {
        num = new BN(val);
    }

    return new rlp.AionLong(num);
};

const numberToHex = value => {
    value = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
    return `0x${value.toString(16)}`;
};
