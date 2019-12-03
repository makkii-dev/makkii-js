import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { hexutil } from "lib-common-util-js";
import { EthUnsignedTx } from "../type";
import { process_unsignedTx } from "./transaction";

/**
 * Ethereum's signer using private key, implements IkeystoreSigner.
 */
export default class EthLocalSinger implements IkeystoreSigner {

    /**
     * Sign transaction
     * 
     * @param tx EthUnsignedTx transaction object to sign.
     * @param params parameters object, example: { private_key: '' }}
     * @returns transaction hash string
     */
    signTransaction = async (transaction: EthUnsignedTx, params: { private_key: string }): Promise<string> => {
        const unsigned = process_unsignedTx(transaction);
        const { private_key } = params;
        const privateKey = Buffer.from(hexutil.removeLeadingZeroX(private_key), 'hex');
        unsigned.sign(privateKey);
        return `0x${unsigned.serialize().toString('hex')}`
    }
}