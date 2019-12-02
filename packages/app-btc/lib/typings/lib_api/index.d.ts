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
        network: any;
    }>;
    getTransactionUrlInExplorer: (txHash: any) => string;
    getTransactionStatus: (txId: any) => Promise<{
        status: boolean;
        blockNumber: any;
        timestamp: any;
    }>;
    getBalance: (address: any) => Promise<import("bignumber.js").default>;
    getTransactionsByAddress: (address: any, page: any, size: any) => Promise<{}>;
    sameAddress: (address1: any, address2: any) => boolean;
    sendAll: (address: any, byte_fee?: number) => Promise<number>;
};
export default _default;
