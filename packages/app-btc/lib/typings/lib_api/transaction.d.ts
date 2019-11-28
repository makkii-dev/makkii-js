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
};
export default _default;
