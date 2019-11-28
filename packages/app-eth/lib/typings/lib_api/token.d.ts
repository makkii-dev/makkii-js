declare const _default: (config: any) => {
    getTokenDetail: (contractAddress: any) => Promise<unknown>;
    getAccountTokenBalance: (contractAddress: any, address: any) => Promise<unknown>;
    getAccountTokens: () => Promise<{}>;
    getAccountTokenTransferHistory: (address: any, symbolAddress: any, page: number, size: number, timestamp: any) => Promise<unknown>;
    getTopTokens: (topN?: number) => Promise<unknown>;
    getTokenIconUrl: (tokenSymbol: any, contractAddress: any) => string;
    searchTokens: (keyword: any) => Promise<unknown>;
};
export default _default;
