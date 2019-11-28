import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { AionUnsignedTx } from "../type";
export default class AionLocalSigner implements IkeystoreSigner {
    signTransaction: (tx: AionUnsignedTx, params: {
        private_key: string;
    }) => Promise<string>;
}
