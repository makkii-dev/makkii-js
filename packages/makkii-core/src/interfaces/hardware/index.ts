import { Keypair } from "../../type";
import { IkeystoreSigner } from "../keystore_client";


export interface IHardware extends IkeystoreSigner{
    getAccount: (index:number, params?:any)=> Keypair
    getHardwareStatus: ()=> Promise<boolean>
}