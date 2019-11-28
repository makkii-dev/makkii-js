import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { hexutil } from "lib-common-util-js";
import { EthUnsignedTx } from "../type";
import { process_unsignedTx } from "./transaction";

export default class EthLocalSinger implements IkeystoreSigner {
    signTransaction = async (transaction: EthUnsignedTx, params: { private_key: string }): Promise<string> => {
        const unsigned = process_unsignedTx(transaction);
        const { private_key } = params;
        const privateKey = Buffer.from(hexutil.removeLeadingZeroX(private_key), 'hex');
        unsigned.sign(privateKey);
        return `0x${unsigned.serialize().toString('hex')}`
    }
}