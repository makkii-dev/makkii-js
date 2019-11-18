import ApiClient from './apiClient';
import KeystoreClient from './keystoreClient';


const apiClient = (support_coin_lists, isTestNet) => {
    return new ApiClient(support_coin_lists, isTestNet);
}

const keystoreClient = (support_coin_lists, isTestNet) => {
    return new KeystoreClient(support_coin_lists, isTestNet);
}


export {
    apiClient,
    keystoreClient,
}