declare const _default: (config: any) => {
    getAccountTokens: (address: any) => Promise<unknown>;
    getAccountTokenBalance: (contractAddress: any, address: any) => Promise<unknown>;
    getAccountTokenTransferHistory: (address: any, symbolAddress: any, page?: number, size?: number) => Promise<unknown>;
    getTokenDetail: (contractAddress: any) => Promise<unknown>;
    getTopTokens: (topN?: number) => Promise<unknown>;
    searchTokens: (keyword: any) => Promise<unknown>;
};
export default _default;
