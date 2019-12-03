import { sameAddress } from './tools';
declare const _default: (config: any) => {
    getBalance: (address: any) => Promise<import("bignumber.js").default>;
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
    sameAddress: typeof sameAddress;
    sendTransaction: (unsignedTx: any, signer: any, signerParams: any) => Promise<{
        hash: string;
        timestamp: any;
        from: any;
        to: any;
        value: any;
        status: string;
    }>;
    getTransactionStatus: (txHash: any) => Promise<{
        blockNumber: any;
        status: boolean;
    }>;
    getTransactionUrlInExplorer: (txHash: any) => string;
    getTransactionsByAddress: (address: any, page?: number, size?: number) => Promise<{}>;
};
export default _default;
