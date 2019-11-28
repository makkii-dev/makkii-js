import transactionClient from './transaction';
import jsonrpcClient from './jsonrpc';
import toolsClient from './tools';

export default config => {
    const { sendTransaction, getTransactionUrlInExplorer, buildTransaction } = transactionClient(config);
    const { getBalance, getTransactionStatus, getTransactionsByAddress, broadcastTransaction } = jsonrpcClient(config)
    const { sendAll, validateBalanceSufficiency, sameAddress } = toolsClient(config)
    return {
        sendTransaction,
        buildTransaction,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        getBalance,
        getTransactionsByAddress,
        validateBalanceSufficiency,
        sameAddress,
        sendAll,
    };
}
