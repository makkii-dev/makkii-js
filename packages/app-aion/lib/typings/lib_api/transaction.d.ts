declare const _default: (config: any) => {
    sendTransaction: (unsignedTx: any, signer: any, signerParams: any) => Promise<{
        hash: any;
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
    getTransactionsByAddress: (address: any, page?: number, size?: number) => Promise<unknown>;
    getTransactionUrlInExplorer: (txHash: any) => string;
    getTransactionStatus: (txHash: any) => Promise<unknown>;
    buildTransaction: (from: any, to: any, value: any, options: any) => Promise<{
        to: any;
        from: any;
        nonce: any;
        value: any;
        gasPrice: any;
        gasLimit: any;
        timestamp: number;
        data: any;
        type: number;
        tknTo: any;
        tknValue: any;
    }>;
};
export default _default;
