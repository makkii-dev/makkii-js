declare const _default: (config: any) => {
    sendTransaction: (unsignedTx: any, signer: any, signerParams: any) => Promise<{
        hash: string;
        timestamp: any;
        from: any;
        to: any;
        value: any;
        status: string;
    }>;
    getTransactionStatus: (txHash: any) => Promise<unknown>;
    getTransactionUrlInExplorer: (txHash: any) => string;
    getTransactionsByAddress: (address: any, page?: number, size?: number) => Promise<unknown>;
    buildTransaction: (from: any, to: any, value: any) => Promise<{
        to: any;
        owner: any;
        amount: any;
        timestamp: number;
        expiration: number;
        latest_block: {
            hash: any;
            number: any;
        };
    }>;
};
export default _default;
