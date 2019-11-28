import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';
import { AionApp } from 'lib-hw-ledger-js';
import { hexutil } from 'lib-common-util-js';
import { AionUnsignedTx } from '../../type'
import { process_unsignedTx } from '../../lib_keystore/transaction';

const rlp = require('aion-rlp')

export default class AionLedger implements IHardware {

    private hardware: any = {}

    getAccount = async (index: number) => {
        const { address } = await this.hardware.getAccount(index);
        return { address, index };
    };

    getHardwareStatus = async () => {
        try {
            const res = await this.getAccount(0);
            return !!res;
        } catch (e) {
            return false;
        }
    };

    signTransaction = async (tx: AionUnsignedTx, params: { index: number }): Promise<string> => {
        const { index } = params;
        const rlpEncoded = process_unsignedTx(tx);
        const account = await this.hardware.getAccount(index);
        const signature = await this.hardware.sign(0 + index, rlpEncoded);
        const fullSignature = Buffer.concat([Buffer.from(hexutil.stripZeroXHexString(account.pubKey), 'hex'),
        Buffer.from(hexutil.stripZeroXHexString(signature), 'hex')]);
        const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);

        // re-encode with signature included
        const rawTransaction = rlp.encode(rawTx);
        return `0x${rawTransaction.toString('hex')}`
    }

    setLedgerTransport = (transport: any) => {
        this.hardware = new AionApp(transport);
        return this;
    }


}