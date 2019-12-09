import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { ECPair } from "bitcoinjs-lib";
import { hexutil } from "lib-common-util-js";
import { BtcUnsignedTx } from "../type";
import { process_unsignedTx } from "./transaction";
import { networks } from "./network";
/**
 * @category Local signer
 */
export default class BtcLocalSigner implements IkeystoreSigner {
    private network: string;

    /**
     * constructor.
     *
     * @param network
     */
    constructor(network) {
        this.network = network;
    }

    /**
     * Sign transaction of btc local signer
     * @param transaction
     * @param params {private_key: string, compressed: boolean}
     * @returns {string} btc signed tx
     */
    signTransaction = async (
        transaction: BtcUnsignedTx,
        params: { private_key: string; compressed: boolean }
    ) => {
        const txb = process_unsignedTx(transaction);
        const { utxos } = transaction;
        const { compressed, private_key } = params;
        const network_ = networks[this.network];

        const keyPair = ECPair.fromPrivateKey(
            Buffer.from(hexutil.removeLeadingZeroX(private_key), "hex"),
            {
                network: network_,
                compressed
            }
        );

        for (let ip = 0; ip < utxos.length; ip += 1) {
            txb.sign(ip, keyPair);
        }
        const tx = txb.build();
        return tx.toHex();
    };
}
