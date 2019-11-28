import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { EthUnsignedTx } from "../../type";
export default class EthLedger implements IHardware {
    private hardware;
    getAccount: (index: number) => Promise<{
        address: any;
        index: number;
        publicKey: any;
    }>;
    getHardwareStatus: () => Promise<boolean>;
    signTransaction: (transaction: EthUnsignedTx, params: {
        derivationIndex: number;
    }) => Promise<string>;
}
