/* eslint-disable import/no-mutable-exports */
// eslint-disable-next-line import/prefer-default-export
export let config = {
    network: {
        "mainnet": {
            "jsonrpc": "https://api.trongrid.io",
            "explorer_api": "https://apilist.tronscan.org/api",
            "explorer": "https://tronscan.org/#/transaction"
        },
        "shasta": {
            "jsonrpc": "https://api.shasta.trongrid.io",
            "explorer_api": "https://api.shasta.tronscan.org/api",
            "explorer": "https://shasta.tronscan.org/#/transaction"
        }
    }
}

function deepMergeObject(obj1, obj2) {
    Object.keys(obj2).forEach(key => {
        obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
            deepMergeObject(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    });
    return obj1;
}

export function customNetwork(object) {
    config = deepMergeObject(config, object);
}


