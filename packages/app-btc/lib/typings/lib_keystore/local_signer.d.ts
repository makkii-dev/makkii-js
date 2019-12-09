import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { BtcUnsignedTx } from "../type";
export default class BtcLocalSigner implements IkeystoreSigner {
    private network;
    constructor(network: any);
    signTransaction: (transaction: BtcUnsignedTx, params: {
        private_key: string;
        compressed: boolean;
    }) => Promise<string>;
}
