import { LedgerKeypair } from "../../type";
import { IkeystoreSigner } from "../keystore_client";
export interface IHardware extends IkeystoreSigner {
    getAccount(index: number): Promise<LedgerKeypair>;
    getHardwareStatus(): Promise<boolean>;
}
