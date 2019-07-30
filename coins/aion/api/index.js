import {formatAddress1Line, validateBalanceSufficiency, sameAddress} from "./tools";
import {getBalance, getBlockByNumber, blockNumber} from "./jsonrpc";
import * as transaction from "./transaction";
import * as token from "./token";
export default {
    formatAddress1Line,
    validateBalanceSufficiency,
    getBlockByNumber,
    getBalance,
    blockNumber,
    sameAddress,
    ...transaction,
    ...token,
}