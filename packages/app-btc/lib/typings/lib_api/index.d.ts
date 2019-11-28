declare const _default: (config: any) => {
    sendTransaction: (unsignedTx: any, signer: any, signerParams: any) => Promise<{
        hash: any;
        status: string;
        from: {
            addr: any;
            value: any;
        }[];
        to: {
            addr: any;
            value: number;
        }[];
        fee: number;
    }>;
    buildTransaction: (from: any, to: any, value: any, options: any) => Promise<{
        to: any;
        from: any;
        value: any;
        utxos: any[];
        byte_fee: any;
    }>;
    getTransactionUrlInExplorer: (txHash: any, network?: string) => string;
    getTransactionStatus: (txId: any) => Promise<{
        status: boolean;
        blockNumber: any;
        timestamp: any;
    }>;
    getBalance: (address: any) => Promise<import("bignumber.js").default>;
    getTransactionsByAddress: (address: any, page: any, size: any) => Promise<{}>;
    validateBalanceSufficiency: (account: any, amount: any, extraParams: any) => Promise<unknown>;
    sameAddress: (address1: any, address2: any) => boolean;
    sendAll: (address: any, byte_fee?: number) => Promise<number>;
};
export default _default;
