import {SignedTx} from '../type'
import { IHardware } from './hardware';

export interface IsingleKeystoreClient {
    signTransaction: (tx: any, signer: IkeystoreSigner, signerParams: any) => Promise<any> 

    generateMnemonic: () => string 

    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<any> 

    getAccountFromHardware: (index:number, hardware: IHardware) => Promise<any>

    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<any> 

    validatePrivateKey: (privateKey: string | Buffer) => boolean 

    validateAddress: (address: string) => boolean

}


export interface IkeystoreSigner {
    signTransaction: (tx: any, params: any)=> Promise<SignedTx>
}


export interface IsingleKeystoreFullClient extends IsingleKeystoreClient{}

export interface IkeystoreClient {
    
    addCoin: (coinType: string, client: IsingleKeystoreClient | IsingleKeystoreFullClient) => void;

    removeCoin: (coinType: string) =>boolean

    signTransaction: (coinType: string, tx: any, signer: IkeystoreSigner, signerParams: any) => Promise<any> 

    generateMnemonic: (coinType: string) => string 

    recoverKeyPairByPrivateKey: (coinType: string, priKey: string, options?: any) => Promise<any> 

    validatePrivateKey: (coinType: string, privateKey: string | Buffer) => boolean 

    validateAddress: (coinType: string, address: string) => boolean

    getAccountFromMnemonic: (coinType: string, ddress_index: number, mnemonic: string) => Promise<any> 

    getAccountFromHardware: (coinType: string, index:number, hardware: IHardware)=> Promise<any>

}