import transactionClient from "./transaction";
import jsonrpcClient from "./jsonrpc";
import { sameAddress } from "./tools";

export default config => {
    const { getBalance } = jsonrpcClient(config);
    const {
        sendTransaction,
        getTransactionStatus,
        getTransactionUrlInExplorer,
        getTransactionsByAddress,
        buildTransaction
    } = transactionClient(config);
    return {
        getBalance,
        buildTransaction,
        sameAddress,
        sendTransaction,
        getTransactionStatus,
        getTransactionUrlInExplorer,
        getTransactionsByAddress
    };
};
