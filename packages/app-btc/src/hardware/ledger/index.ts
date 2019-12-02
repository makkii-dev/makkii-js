import Btc from '@ledgerhq/hw-app-btc';
import { payments } from 'bitcoinjs-lib';
import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { networks } from '../../lib_keystore/network';
import { BtcUnsignedTx } from '../../type';
import { process_unsignedTx } from '../../lib_keystore/transaction';

export default class BtcLedger implements IHardware {

    private hardware: any = {};

    getAccount = async (index: number, params: { network: string }) => {
        const { network } = params;
        const coinType = network.startsWith('BTC') ? 0 : 2;
        const network_ = networks[network];
        const path = `m/49'/${coinType}'/0'/0/${index}`;
        let { publicKey } = await this.hardware.getWalletPublicKey(path);
        publicKey = getCompressPublicKey(publicKey);
        const { address } = payments.p2pkh({ pubkey: Buffer.from(publicKey, 'hex'), network: network_ });
        return { address, index, publicKey };
    }

    getHardwareStatus = async () => {
        try {
            await this.getAccount(0, { network: 'BTC' });
            return true;
        } catch (e) {
            return false;
        }
    };

    setLedgerTransport = (transport: any) => {
        this.hardware = new Btc(transport);
        return this;
    }

    signTransaction = async (transaction: BtcUnsignedTx, params: { derivationIndex: number }): Promise<string> => {
        const { utxos, network } = transaction;
        const txb = process_unsignedTx(transaction, params);
        const { derivationIndex } = params;
        const tx = txb.buildIncomplete();
        const coinType = network.startsWith('BTC') ? 0 : 2;
        const inputs = [];
        const paths = [];
        for (let ip = 0; ip < utxos.length; ip += 1) {
            const preTx = this.hardware.splitTransaction(utxos[ip].raw);
            inputs.push(
                [
                    preTx,
                    utxos[ip].index,
                ],
            );
            paths.push(`m/49'/${coinType}'/0'/0/${derivationIndex}`);
        }
        const tx2 = this.hardware.splitTransaction(tx.toHex());
        const outputScriptHex = this.hardware.serializeTransactionOutputs(tx2).toString('hex');
        const encoded = await this.hardware.createPaymentTransactionNew(inputs, paths, undefined, outputScriptHex, 0, 1, false);
        return encoded
    }

}



function getCompressPublicKey(publicKey: string) {
    let compressedKeyIndex: string;
    if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
        compressedKeyIndex = '03';
    } else {
        compressedKeyIndex = '02';
    }
    return compressedKeyIndex + publicKey.substring(2, 66);
}