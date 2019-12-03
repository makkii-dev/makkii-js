import { validateBalanceSufficiency, sameAddress } from './tools';
declare const _default: (config: any) => {
    validateBalanceSufficiency: typeof validateBalanceSufficiency;
    getBlockByNumber: (blockNumber: any, fullTxs?: boolean) => Promise<any>;
    getBalance: (address: any) => Promise<import("bignumber.js").default>;
    blockNumber: () => Promise<any>;
    sameAddress: typeof sameAddress;
    buildTransaction: (from: any, to: any, value: any, options: any) => Promise<{
        to: any;
        from: any;
        nonce: any;
        value: import("bignumber.js").default;
        gasPrice: any;
        gasLimit: any;
        timestamp: number;
        data: any;
        type: number;
        tknTo: any;
        tknValue: import("bignumber.js").default;
    }>;
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
    getAccountTokens: (address: any) => Promise<{}>;
    getAccountTokenBalance: (contractAddress: any, address: any) => Promise<import("bignumber.js").default>;
    getAccountTokenTransferHistory: (address: any, symbolAddress: any, page?: number, size?: number) => Promise<{}>;
    getTokenDetail: (contractAddress: any) => Promise<{
        contractAddr: any;
        symbol: any;
        name: any;
        tokenDecimal: any;
    }>;
    getTopTokens: (topN?: number) => Promise<any>;
    searchTokens: (keyword: any) => Promise<any>;
};
export default _default;
