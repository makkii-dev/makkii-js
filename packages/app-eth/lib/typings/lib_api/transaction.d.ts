declare const _default: (config: any) => {
    sendTransaction: (unsignedTx: any, signer: any, signerParams: any) => Promise<{
        hash: unknown;
        status: string;
        to: any;
        from: any;
        value: any;
        tknTo: any;
        tknValue: any;
        timestamp: any;
        gasLimit: any;
        gasPrice: any;
    }>;
    buildTransaction: (from: any, to: any, value: any, options: any) => Promise<{
        to: any;
        from: any;
        nonce: unknown;
        value: any;
        gasPrice: any;
        gasLimit: any;
        data: any;
        network: any;
    }>;
    getTransactionsByAddress: (address: any, page: any, size: any, timestamp: any) => Promise<unknown>;
    getTransactionUrlInExplorer: (txHash: any) => string;
    getTransactionStatus: (txHash: any) => Promise<unknown>;
};
export default _default;
