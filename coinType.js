export const CoinType = {
    AION:425,
    BITCOIN: 0,
    EOS: 194,
    ETHEREUM: 60,
    LITECOIN: 2,
    TRON: 195,
    fromCoinSymbol: (symbol) => {
        switch (symbol) {
        case 'AION':
            return 425;
        case 'BTC':
        case 'BITCOIN': 
            return 0;
        case 'EOS': 
            return 194;
		case 'ETH':
        case 'ETHEREUM':
            return 60;
        case 'LITECOIN':
        case 'LTC':
        case 'LITECOIN':
            return 2;
        case 'TRON': 
        case 'TRX': 
            return 195;
        }
    }
};
