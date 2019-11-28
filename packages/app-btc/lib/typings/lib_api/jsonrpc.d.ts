import BigNumber from 'bignumber.js';
declare const _default: (config: any) => {
    broadcastTransaction: (encoded: any) => Promise<any>;
    getBalance: (address: any) => Promise<BigNumber>;
    getTransactionStatus: (txId: any) => Promise<{
        status: boolean;
        blockNumber: any;
        timestamp: any;
    }>;
    getTransactionsByAddress: (address: any, page: any, size: any) => Promise<{}>;
    getUnspentTx: (address: any) => Promise<any[]>;
    getRawTx: (txhash: any) => Promise<any>;
};
export default _default;
