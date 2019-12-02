import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { TronUnsignedTx } from "../type";
export default class TronLocalSigner implements IkeystoreSigner {
    signTransaction: (transaction: TronUnsignedTx, params: {
        private_key: any;
    }) => Promise<{
        signature: any;
        txID: string;
        raw_data: {
            contract: {
                parameter: {
                    value: {
                        amount: any;
                        owner_address: any;
                        to_address: any;
                    };
                    type_url: string;
                };
                type: string;
            }[];
            ref_block_bytes: string;
            ref_block_hash: string;
            expiration: number;
            timestamp: number;
        };
    }>;
}
