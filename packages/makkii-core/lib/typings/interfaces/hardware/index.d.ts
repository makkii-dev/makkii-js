import { IkeystoreSigner } from "../keystore_client";
import { LedgerKeypair } from "../../type";
export interface IHardware extends IkeystoreSigner {
    getAccount(index: number, params?: any): Promise<LedgerKeypair>;
    getHardwareStatus(): Promise<boolean>;
}
