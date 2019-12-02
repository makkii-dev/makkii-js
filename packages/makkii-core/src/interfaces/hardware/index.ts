import { Keypair } from "../../type";
import { IkeystoreSigner } from "../keystore_client";

/**
 * Hardware wallet interface
 */
export interface IHardware extends IkeystoreSigner{

    /**
     * Get account from hardware wallet.
     * 
     * @param index index path in hd wallet
     * @param params additional parameters that may affect key pair generation algorithm
     * @returns key pair
     */
    getAccount(index:number, params?:any): Keypair

    /**
     * Get hardware wallet status.
     * 
     * @returns boolean status of connect/app status.
     */
    getHardwareStatus(): Promise<boolean>
}