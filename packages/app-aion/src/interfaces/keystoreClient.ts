export interface keystoreClient {
    signTransaction(tx: any): Promise<any> 

    getKey(address_index: number): Promise<any> 

    setMnemonic(mnemonic: string, passphrase?: string): void 

    generateMnemonic(): string 

    recoverKeyPairByPrivateKey(priKey: string, options?: any): Promise<any> 

    recoverKeyPairByWIF(WIF: string, options?: any): Promise<any> 

    recoverKeyPairBykeyFile(file: string, password: string): Promise<any> 

    validatePrivateKey(privateKey: string | Buffer): boolean 

    validateAddress(address: string): Promise<any> 

    getKeyFromMnemonic(address_index: number, mnemonic: string): Promise<any> 

}

export interface keystoreLedgerClient {
    readonly ledgerSupport: boolean

    getKeyByLedger(index: number): Promise<any> 

    signByLedger(index: number, sender: string, msg: Buffer): Promise<any> 

    setLedgerTransport(transport: any): void 

    getLedgerStatus(): boolean 

}