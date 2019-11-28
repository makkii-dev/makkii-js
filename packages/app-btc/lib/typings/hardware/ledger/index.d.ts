import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { BtcUnsignedTx } from '../../type';
export default class BtcLedger implements IHardware {
    private hardware;
    getAccount: (index: number, params: {
        network: string;
    }) => Promise<{
        address: string;
        index: number;
        publicKey: any;
    }>;
    getHardwareStatus: () => Promise<boolean>;
    setLedgerTransport: (transport: any) => this;
    signTransaction: (transaction: BtcUnsignedTx, params: {
        derivationIndex: number;
        network: string;
    }) => Promise<string>;
}
