import { sameAddress } from "./tools";
import jsonrpcClient from "./jsonrpc";
import transactionClient from "./transaction";
import tokenClient from "./token";

export default config => {
    const { getBalance, getBlockByNumber, blockNumber } = jsonrpcClient(config);
    const {
        sendTransaction,
        getTransactionsByAddress,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        buildTransaction
    } = transactionClient(config);
    const {
        getAccountTokens,
        getAccountTokenBalance,
        getAccountTokenTransferHistory,
        getTokenDetail,
        getTokenIconUrl,
        getTopTokens,
        searchTokens
    } = tokenClient(config);

    return {
        getBlockByNumber,
        getBalance,
        blockNumber,
        sameAddress,
        sendTransaction,
        buildTransaction,
        getTransactionsByAddress,
        getTransactionUrlInExplorer,
        getTransactionStatus,
        getAccountTokens,
        getAccountTokenBalance,
        getAccountTokenTransferHistory,
        getTokenDetail,
        getTokenIconUrl,
        getTopTokens,
        searchTokens
    };
};
