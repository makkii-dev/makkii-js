
import { CoinType } from './coins/coinType'
import {client as keystoreClient} from './keystore';
import {client as apiClient} from "./api";
import {setCurrentServer} from "./remote_server";

export {
    keystoreClient,
    apiClient,
    CoinType,
    setCurrentServer
};
