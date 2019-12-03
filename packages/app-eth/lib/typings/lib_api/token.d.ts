declare const _default: (config: any) => {
    getTokenDetail: (contractAddress: any) => Promise<{
        contractAddr: any;
        symbol: any;
        name: any;
        tokenDecimal: any;
    }>;
    getAccountTokenBalance: (contractAddress: any, address: any) => Promise<unknown>;
    getAccountTokens: () => Promise<{}>;
    getAccountTokenTransferHistory: (address: any, symbolAddress: any, page: number, size: number, timestamp: any) => Promise<{}>;
    getTopTokens: (topN?: number) => Promise<any>;
    getTokenIconUrl: (tokenSymbol: any, contractAddress: any) => string;
    searchTokens: (keyword: any) => Promise<any>;
};
export default _default;
