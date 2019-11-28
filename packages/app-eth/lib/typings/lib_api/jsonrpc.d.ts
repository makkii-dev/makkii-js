export declare const processRequest: (methodName: any, params: any) => string;
declare const _default: (config: any) => {
    blockNumber: () => Promise<unknown>;
    getBalance: (address: any) => Promise<unknown>;
    getBlockByNumber: (blockNumber: any, fullTxs?: boolean) => Promise<unknown>;
    getTransactionReceipt: (hash: any) => Promise<unknown>;
    getTransactionCount: (address: any, blockTag: any) => Promise<unknown>;
    sendSignedTransaction: (signedTx: any) => Promise<unknown>;
};
export default _default;
