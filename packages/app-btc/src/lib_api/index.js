import transactionClient from './transaction';
import jsonrpcClient from './jsonrpc';
import toolsClient from './tools';

export default config => {
    const { sendTransaction, getTransactionUrlInExplorer } = transactionClient(config);
    const { getBalance, getTransactionStatus, getTransactionsByAddress } = jsonrpcClient(config)
    const { sendAll, validateBalanceSufficiency, formatAddress1Line, sameAddress } = toolsClient(config)
    return {
        sendTransaction,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        getBalance,
        getTransactionsByAddress,
        validateBalanceSufficiency,
        formatAddress1Line,
        sameAddress,
        sendAll,
    };
}
