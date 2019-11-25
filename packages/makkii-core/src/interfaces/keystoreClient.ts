export interface IsingleKeystoreClient {
    signTransaction: (tx: any) => Promise<any> 

    getAccount: (address_index: number) => Promise<any> 

    setMnemonic: (mnemonic: string) => void 

    generateMnemonic: () => string 

    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<any> 

    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<any> 

    recoverKeyPairByWIF: (WIF: string, options?: any) => Promise<any> 

    recoverKeyPairByKeyFile: (file: string, password: string) => Promise<any> 

    validatePrivateKey: (privateKey: string | Buffer) => boolean 

    validateAddress: (address: string) => Promise<any> 
}

export interface IsingleKeystoreLedgerClient {
    readonly ledgerSupport: boolean
    
    getAccountByLedger: (index: number) => Promise<any> 

    signByLedger: (index: number, sender: string, msg: Buffer) => Promise<any> 

    setLedgerTransport: (transport: any) => void 

    getLedgerStatus: () => Promise<boolean> 
}

export interface IsingleKeystoreFullClient extends IsingleKeystoreClient, IsingleKeystoreLedgerClient{}

export interface IkeystoreClient {
    
    addCoin: (coinType: string, client: IsingleKeystoreClient | IsingleKeystoreFullClient) => void;

    removeCoin: (coinType: string) =>boolean

    signTransaction: (coinType: string, tx: any) => Promise<any> 

    getAccount: (coinType: string, address_index: number) => Promise<any> 

    setMnemonic: (coinType: string, mnemonic: string) => void 

    generateMnemonic: (coinType: string) => string 

    recoverKeyPairByPrivateKey: (coinType: string, priKey: string, options?: any) => Promise<any> 

    recoverKeyPairByWIF: (coinType: string, WIF: string, options?: any) => Promise<any> 

    recoverKeyPairByKeyFile: (coinType: string, file: string, password: string) => Promise<any> 

    validatePrivateKey: (coinType: string, privateKey: string | Buffer) => boolean 

    validateAddress: (coinType: string, address: string) => Promise<any> 

    getAccountFromMnemonic: (coinType: string, ddress_index: number, mnemonic: string) => Promise<any> 

    getAccountByLedger: (coinType: string, index: number) => Promise<any> 

    signByLedger: (coinType: string, index: number, sender: string, msg: Buffer) => Promise<any> 

    setLedgerTransport: (coinType: string, transport: any) => void 

    getLedgerStatus: (coinType: string) => Promise<boolean> 
}