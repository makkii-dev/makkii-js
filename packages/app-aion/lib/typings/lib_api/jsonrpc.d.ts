import BigNumber from 'bignumber.js';
export declare const processRequest: (methodName: any, params: any) => string;
declare const _default: (config: any) => {
    blockNumber: () => Promise<any>;
    getBalance: (address: any) => Promise<BigNumber>;
    getBlockByNumber: (blockNumber: any, fullTxs?: boolean) => Promise<any>;
    getTransactionCount: (address: any, blockTag: any) => Promise<any>;
    getTransactionReceipt: (hash: any) => Promise<any>;
    sendSignedTransaction: (signedTx: any) => Promise<any>;
    processRequest: (methodName: any, params: any) => string;
};
export default _default;
