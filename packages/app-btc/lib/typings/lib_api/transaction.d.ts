declare const _default: (config: any) => {
    sendTransaction: (unsignedTx: any, signer: any, signerParams: any) => Promise<{
        from: any;
        to: any;
        value: any;
        fee: any;
        hash: any;
        status: string;
    }>;
    buildTransaction: (from: any, to: any, value: any, options: any) => Promise<{
        from: {
            addr: any;
            value: any;
        }[];
        to: {
            addr: any;
            value: any;
        }[];
        fee: number;
        to_address: any;
        change_address: any;
        value: any;
        utxos: any[];
        byte_fee: any;
    }>;
    getTransactionUrlInExplorer: (txHash: any) => string;
};
export default _default;
