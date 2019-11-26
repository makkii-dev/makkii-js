import { validateBalanceSufficiency, sameAddress } from './tools';
import jsonrpcClient from './jsonrpc';
import transactionClient from './transaction';
import tokenClient from './token';


export default (config) => {
  const { getBalance, getBlockByNumber, blockNumber } = jsonrpcClient(config);
  const { sendTransaction, getTransactionsByAddress, getTransactionUrlInExplorer, getTransactionStatus } = transactionClient(config);
  const { 
    getAccountTokens,
    getAccountTokenBalance,
    getAccountTokenTransferHistory,
    getTokenDetail,
    getTokenIconUrl,
    getTopTokens,
    searchTokens } = tokenClient(config)



  return {
    validateBalanceSufficiency,
    getBlockByNumber,
    getBalance,
    blockNumber,
    sameAddress,
    sendTransaction,
    getTransactionsByAddress,
    getTransactionUrlInExplorer,
    getTransactionStatus,
    getAccountTokens,
    getAccountTokenBalance,
    getAccountTokenTransferHistory,
    getTokenDetail,
    getTokenIconUrl,
    getTopTokens,
    searchTokens,
  }
};
