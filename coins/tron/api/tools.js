import BigNumber from "bignumber.js";
import {validateAmount} from "../../../utils/validate";

const formatAddress1Line = address => `${address.slice(0, 12)}...${address.slice(-10)}`;

function validateBalanceSufficiency(account, symbol, amount) {
    return new Promise(resolve => {
        if (!validateAmount(amount)) resolve({ result: false, err: 'error_format_amount' });
        const balance = BigNumber(account.balance);
        const transferAmount = BigNumber(amount);
        if (transferAmount.isGreaterThan(balance)) {
            resolve({ result: false, err: 'error_insufficient_amount' });
        }
        resolve({ result: true });
    });
}

export {
    formatAddress1Line,
    validateBalanceSufficiency
}