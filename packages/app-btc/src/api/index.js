import {
    sendTransaction,
    getTransactionUrlInExplorer,
} from './transaction';
import { getBalance, getTransactionStatus, getTransactionsByAddress } from './jsonrpc';
import {
    sendAll, validateBalanceSufficiency, formatAddress1Line, sameAddress,
} from './tools';

export default {
    sendTransaction,
    getTransactionUrlInExplorer,
    getTransactionStatus,
    getBalance,
    getTransactionsByAddress,
    validateBalanceSufficiency,
    formatAddress1Line,
    sameAddress,
};
