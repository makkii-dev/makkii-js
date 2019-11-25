import transactionClient from './transaction';
import jsonrpcClient from './jsonrpc';
import { validateBalanceSufficiency, formatAddress1Line, sameAddress } from './tools'

export default config => {
    const { getBalance } = jsonrpcClient(config)
    const { 
        sendTransaction,
        getTransactionStatus,
        getTransactionUrlInExplorer,
        getTransactionsByAddress } = transactionClient(config);
    return {
        getBalance,
        validateBalanceSufficiency,
        formatAddress1Line,
        sameAddress,
        sendTransaction,
        getTransactionStatus,
        getTransactionUrlInExplorer,
        getTransactionsByAddress
    };
}