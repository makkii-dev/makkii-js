import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { AionUnsignedTx } from "../../type";
export default class AionLedger implements IHardware {
    private hardware;
    getAccount: (index: number) => Promise<{
        address: any;
        index: number;
    }>;
    getHardwareStatus: () => Promise<boolean>;
    signTransaction: (tx: AionUnsignedTx, params: {
        derivationIndex: number;
    }) => Promise<string>;
    setLedgerTransport: (transport: any) => this;
}
