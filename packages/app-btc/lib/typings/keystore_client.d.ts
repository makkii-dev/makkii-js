/// <reference types="node" />
import { IsingleKeystoreClient, IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { BtcUnsignedTx, BtcKeypair } from "./type";
export default class BtcKeystoreClient implements IsingleKeystoreClient {
    ledgerSupport: boolean;
    network: "BTC" | "BTCTEST" | "LTC" | "LTCTEST";
    constructor(network: "BTC" | "BTCTEST" | "LTC" | "LTCTEST");
    getCurrentNetwork: () => "BTC" | "BTCTEST" | "LTC" | "LTCTEST";
    checkLedgerSupport: () => boolean;
    signTransaction: <T extends IkeystoreSigner>(tx: BtcUnsignedTx, signer: T, signerParam: any) => Promise<string>;
    generateMnemonic: () => string;
    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<BtcKeypair>;
    recoverKeyPairByWIF: (WIF: string) => Promise<BtcKeypair>;
    validatePrivateKey: (privateKey: string | Buffer) => never;
    validateAddress: (address: string) => boolean;
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<BtcKeypair>;
    getAccountFromHardware: (index: number, hardware: IHardware) => Promise<import("@makkii/makkii-core/src/type").LedgerKeypair>;
}
