import BigNumber from "bignumber.js";
export declare const processRequest: (methodName: any, params: any) => string;
declare const _default: (config: any) => {
    blockNumber: () => Promise<any>;
    getBalance: (address: any) => Promise<BigNumber>;
    getBlockByNumber: (blockNumber: any, fullTxs?: boolean) => Promise<any>;
    getTransactionReceipt: (hash: any) => Promise<any>;
    getTransactionCount: (address: any, blockTag: any) => Promise<any>;
    sendSignedTransaction: (signedTx: any) => Promise<any>;
};
export default _default;
