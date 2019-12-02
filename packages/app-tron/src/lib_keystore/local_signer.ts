import { IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { sha256 } from "ethereumjs-util";
import { hexutil } from "lib-common-util-js";
import { TronUnsignedTx } from "../type";
import { longToByteArray, base58check2HexString } from '../utils';

const { buildTransferTransaction } = require('@tronscan/client/src/utils/transactionBuilder');
const TronSignTransaction = require("@tronscan/client/src/utils/crypto").signTransaction;

export default class TronLocalSigner implements IkeystoreSigner {
    /**
     * Sign transaction of tron local signer
     * @param transaction
     * @param params {private_key: string}
     * @returns {any} signed tron tx
     */
    signTransaction = async (transaction: TronUnsignedTx, params: { private_key }) => {
        const { expiration, timestamp, to, owner, amount, latest_block } = transaction;
        const { private_key } = params;
        const tx = buildTransferTransaction('_', owner, to, amount);
        const latestBlockHash = latest_block.hash;
        const latestBlockNum = latest_block.number;
        const numBytes = longToByteArray(latestBlockNum);
        numBytes.reverse();
        const hashBytes = hexutil.hexString2Array(latestBlockHash);
        const generateBlockId = [...numBytes.slice(0, 8), ...hashBytes.slice(8, hashBytes.length - 1)];
        const rawData = tx.getRawData();
        rawData.setRefBlockHash(Uint8Array.from(generateBlockId.slice(8, 16)));
        rawData.setRefBlockBytes(Uint8Array.from(numBytes.slice(6, 8)));
        rawData.setExpiration(expiration);
        rawData.setTimestamp(timestamp);
        tx.setRawData(rawData);
        const signed = TronSignTransaction(hexutil.removeLeadingZeroX(private_key), tx);
        const txID = sha256(Buffer.from(rawData.serializeBinary())).toString('hex');
        const signature = signed.transaction.getSignatureList().map(e => Buffer.from(e).toString('hex'));
        const ref_block_bytes = Buffer.from(Uint8Array.from(numBytes.slice(6, 8))).toString('hex');
        const ref_block_hash = Buffer.from(Uint8Array.from(generateBlockId.slice(8, 16))).toString('hex');
        const signedTx = {
            signature,
            txID,
            raw_data: {
                contract: [
                    {
                        parameter: {
                            value: {
                                amount: tx.amount,
                                owner_address: base58check2HexString(
                                    tx.owner_address,
                                ),
                                to_address: base58check2HexString(tx.to_address),
                            },
                            type_url:
                                'type.googleapis.com/protocol.TransferContract',
                        },
                        type: 'TransferContract',
                    },
                ],
                ref_block_bytes,
                ref_block_hash,
                expiration: transaction.expiration,
                timestamp: transaction.timestamp,
            },
        };
        return signedTx
    }
}