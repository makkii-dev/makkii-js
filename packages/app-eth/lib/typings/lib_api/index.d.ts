import { validateBalanceSufficiency, sameAddress } from './tools';
declare const _default: (config: any) => {
    validateBalanceSufficiency: typeof validateBalanceSufficiency;
    getBlockByNumber: (blockNumber: any, fullTxs?: boolean) => Promise<any>;
    getBalance: (address: any) => Promise<import("bignumber.js").default>;
    blockNumber: () => Promise<any>;
    sameAddress: typeof sameAddress;
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
    buildTransaction: (from: any, to: any, value: any, options: any) => Promise<{
        to: any;
        from: any;
        nonce: any;
        value: import("bignumber.js").default;
        gasPrice: any;
        gasLimit: any;
        data: any;
        tknTo: any;
        tknValue: import("bignumber.js").default;
        network: any;
    }>;
    getTransactionsByAddress: (address: any, page: any, size: any, timestamp: any) => Promise<{}>;
    getTransactionUrlInExplorer: (txHash: any) => string;
    getTransactionStatus: (txHash: any) => Promise<{
        status: boolean;
        blockNumber: number;
        gasUsed: number;
    }>;
    getAccountTokens: () => Promise<{}>;
    getAccountTokenBalance: (contractAddress: any, address: any) => Promise<unknown>;
    getAccountTokenTransferHistory: (address: any, symbolAddress: any, page: number, size: number, timestamp: any) => Promise<{}>;
    getTokenDetail: (contractAddress: any) => Promise<{
        contractAddr: any;
        symbol: any;
        name: any;
        tokenDecimal: any;
    }>;
    getTokenIconUrl: (tokenSymbol: any, contractAddress: any) => string;
    getTopTokens: (topN?: number) => Promise<any>;
    searchTokens: (keyword: any) => Promise<any>;
};
export default _default;
