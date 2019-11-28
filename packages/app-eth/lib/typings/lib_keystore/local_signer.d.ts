import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { EthUnsignedTx } from "../type";
export default class EthLocalSinger implements IkeystoreSigner {
    signTransaction: (transaction: EthUnsignedTx, params: {
        private_key: string;
    }) => Promise<string>;
}
