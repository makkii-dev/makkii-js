import { LedgerKeypair } from "../../type";
import { IkeystoreSigner } from "../keystore_client";

/**
 * Hardware wallet interface
 * @category Hardware
 */
export interface IHardware extends IkeystoreSigner {
    /**
     * Get account from hardware wallet.
     *
     * @param index index path in hd wallet
     * @returns key pair
     */
    getAccount(index: number): Promise<LedgerKeypair>;

    /**
     * Get hardware wallet status.
     *
     * @param params additional parameters that may affect hardware status
     * @returns boolean status of connect/app status.
     */
    getHardwareStatus(): Promise<boolean>;
}
