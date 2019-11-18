import { formatAddress1Line, validateBalanceSufficiency, sameAddress } from './tools';
import { getBalance, getBlockByNumber, blockNumber } from './jsonrpc';
import {
  sendTransaction, getTransactionsByAddress, getTransactionUrlInExplorer, getTransactionStatus,
} from './transaction';
import {
  fetchAccountTokens,
  fetchAccountTokenBalance,
  fetchAccountTokenTransferHistory,
  fetchTokenDetail,
  getTopTokens,
  searchTokens,
} from './token';

export default {
  formatAddress1Line,
  validateBalanceSufficiency,
  getBlockByNumber,
  getBalance,
  blockNumber,
  sameAddress,
  sendTransaction,
  getTransactionsByAddress,
  getTransactionUrlInExplorer,
  getTransactionStatus,
  fetchAccountTokens,
  fetchAccountTokenBalance,
  fetchAccountTokenTransferHistory,
  fetchTokenDetail,
  getTopTokens,
  searchTokens,
};
