/* eslint-disable import/no-mutable-exports */
// eslint-disable-next-line import/prefer-default-export

export let config = {
  networks: {
    mainnet: {
      jsonrpc: 'https://aion.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=c8b8ebb4f10f40358b635afae72c2780',
      explorer_api: 'https://mainnet-api.theoan.com',
      explorer: 'https://mainnet.theoan.com/#/transaction',
    },
    mastery: {
      jsonrpc: 'https://aion.api.nodesmith.io/v1/mastery/jsonrpc?apiKey=c8b8ebb4f10f40358b635afae72c2780',
      explorer_api: 'https://mastery-api.theoan.com',
      explorer: 'https://mastery.theoan.com/#/transaction',
    },
  }
};

export let remote = {
  qa: 'http://45.118.132.89:8080',
  prod: 'https://www.chaion.net/makkii',
};


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

export function customRemote(object) {
  remote = deepMergeObject(remote, object);
}

