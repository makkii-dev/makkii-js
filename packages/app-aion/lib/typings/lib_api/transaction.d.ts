import BigNumber from "bignumber.js";
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
    getTransactionsByAddress: (address: any, page?: number, size?: number) => Promise<{}>;
    getTransactionUrlInExplorer: (txHash: any) => string;
    getTransactionStatus: (txHash: any) => Promise<{
        status: boolean;
        blockNumber: number;
        gasUsed: number;
    }>;
    buildTransaction: (from: any, to: any, value: any, options: any) => Promise<{
        to: any;
        from: any;
        nonce: any;
        value: BigNumber;
        gasPrice: any;
        gasLimit: any;
        timestamp: number;
        data: any;
        type: number;
        tknTo: any;
        tknValue: BigNumber;
    }>;
};
export default _default;
