import {formatAddress1Line, validateBalanceSufficiency} from "./tools";
import {getBalance, getBlockByNumber, blockNumber} from "./jsonrpc";
import * as transaction from "./transaction";
import * as token from "./token";
export default {
    formatAddress1Line,
    validateBalanceSufficiency,
    getBlockByNumber,
    getBalance,
    blockNumber,
    ...transaction,
    ...token,
}