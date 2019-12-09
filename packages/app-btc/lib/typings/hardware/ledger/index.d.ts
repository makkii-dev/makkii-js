import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { BtcUnsignedTx } from "../../type";
export default class BtcLedger implements IHardware {
    private hardware;
    private network;
    constructor(network: any);
    getAccount: (index: number) => Promise<{
        address: string;
        index: number;
        publicKey: any;
    }>;
    getHardwareStatus: () => Promise<boolean>;
    setLedgerTransport: (transport: any) => this;
    signTransaction: (transaction: BtcUnsignedTx, params: {
        derivationIndex: number;
    }) => Promise<string>;
}
