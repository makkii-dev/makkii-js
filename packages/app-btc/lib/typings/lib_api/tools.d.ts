declare const _default: (config: any) => {
    validateBalanceSufficiency: (account: any, amount: any, extraParams: any) => Promise<unknown>;
    sendAll: (address: any, byte_fee?: number) => Promise<number>;
    sameAddress: (address1: any, address2: any) => boolean;
};
export default _default;
