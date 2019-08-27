const getEndPoint = (network)=>{
   switch (network) {
       case 'BTC':
           return 'https://insight.bitpay.com/api';
       case 'BTCTEST':
           return 'https://test-insight.bitpay.com/api';
       case 'LTC':
           return 'https://insight.litecore.io/api';
       case 'LTCTEST':
           return 'https://testnet.litecore.io/api';
   }
};
export {
    getEndPoint
}