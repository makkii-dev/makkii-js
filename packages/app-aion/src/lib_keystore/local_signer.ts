import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { hexutil } from "lib-common-util-js";
import { AionUnsignedTx } from "../type";
import { process_unsignedTx } from "./transaction";
import { keyPair } from "./keyPair";

const blake2b = require("blake2b");
const nacl = require("tweetnacl");
const rlp = require("aion-rlp");

/**
 * Aion's signer using private key, implements IkeystoreSigner.
 * @category Local signer
 */
export default class AionLocalSigner implements IkeystoreSigner {
    /**
     * Sign transaction
     *
     * @param tx AionUnsginedTx transaction object to sign.
     * @param params parameters object, example: { private_key: '' }}
     * @returns transaction hash string
     */
    signTransaction = async (
        tx: AionUnsignedTx,
        params: { private_key: string }
    ): Promise<string> => {
        const { private_key } = params;
        const rlpEncoded = process_unsignedTx(tx);

        // recover keypair
        const ecKey = keyPair(private_key);
        // hash encoded message
        const rawHash = blake2b(32)
            .update(rlpEncoded)
            .digest();
        // sign
        const signature = ecKey.sign(rawHash);
        // verify signature
        if (
            nacl.sign.detached.verify(
                rawHash,
                signature,
                Buffer.from(hexutil.hexString2Array(ecKey.publicKey))
            ) === false
        ) {
            throw new Error("Could not verify signature.");
        }

        const fullSignature = Buffer.concat([
            Buffer.from(hexutil.stripZeroXHexString(ecKey.publicKey), "hex"),
            signature
        ]);

        const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);

        // re-encode with signature included
        const rawTransaction = rlp.encode(rawTx);
        return `0x${rawTransaction.toString("hex")}`;
    };
}
