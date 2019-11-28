import BigNumber from "bignumber.js";
declare const _default: (config: any) => {
    broadcastTransaction: (tx: any) => Promise<any>;
    getBalance: (address: any) => Promise<BigNumber>;
    getLatestBlock: () => Promise<any>;
    getTransactionById: (hash: any) => Promise<any>;
    getTransactionInfoById: (hash: any) => Promise<any>;
};
export default _default;
