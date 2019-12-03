import BigNumber from 'bignumber.js';
declare const _default: (config: any) => {
    getAccountTokens: (address: any) => Promise<{}>;
    getAccountTokenBalance: (contractAddress: any, address: any) => Promise<BigNumber>;
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
