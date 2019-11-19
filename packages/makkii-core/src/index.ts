import ApiClient from './apiClient';
import KeystoreClient from './keystoreClient';


const apiClient = () => {
    return new ApiClient();
}

const keystoreClient = () => {
    return new KeystoreClient();
}


export {
    apiClient,
    keystoreClient,
}