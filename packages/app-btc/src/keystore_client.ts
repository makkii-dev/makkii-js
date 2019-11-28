import * as bip39 from 'bip39';
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';
import KYSTORE from './lib_keystore';

export default class BtcKeystoreClient implements IsingleKeystoreClient {
    ledgerSupport: boolean = false;

    network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST';

    constructor(network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST') {
        if (!(['BTC', 'BTCTEST', 'LTC', 'LTCTEST'].includes(network))) {
            throw new Error(`BtcKeystoreClient Unsupport network: ${network}`)
        }
        this.network = network;
        if (network.match('BTC')) {
            this.ledgerSupport = true
        }
    }

    getCurrentNetwork = () => {
        return this.network;
    }

    checkLedgerSupport = () => {
        return this.ledgerSupport;
    }

    signTransaction = (tx: any, signer: IkeystoreSigner, signerParam: any) => {
        const network = this.getCurrentNetwork();
        return signer.signTransaction(tx, { ...signerParam, network });
    }

    generateMnemonic = () => {
        const mnemonic = bip39.generateMnemonic();
        return mnemonic;
    }

    recoverKeyPairByPrivateKey = (priKey: string, options?: any) => {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPair(priKey, { network, ...options });
            if (keyPair) {
                const { privateKey, publicKey, address, ...reset } = keyPair;
                return Promise.resolve({ private_key: privateKey, public_key: publicKey, address, ...reset })
            }
            return Promise.reject(new Error(`${this.network} recover privKey failed`));
        } catch (e) {
            return Promise.reject(new Error(`${this.network} recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairByWIF = (WIF: string, options?: any) => {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPairFromWIF(WIF, { network, ...options });
            if (keyPair) {
                const { privateKey, publicKey, address, ...reset } = keyPair;
                return Promise.resolve({ private_key: privateKey, public_key: publicKey, address, ...reset })
            }
            return Promise.reject(new Error(`${this.network} recover privKey failed`));
        } catch (e) {
            return Promise.reject(new Error(`${this.network} recover privKey failed: ${e}`));
        }
    }

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error(`${this.network} validatePrivateKey not implemented.`);
    }

    validateAddress = (address: string) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.validateAddress(address, network);
    }

    getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.getAccountFromMnemonic(mnemonic, address_index, { network });
    }

    getAccountFromHardware = (index: number, hardware: IHardware) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(`${this.network} getAccountFromHardware not implemented.`);
        }
        const network = this.getCurrentNetwork();
        return hardware.getAccount(index, { network });
    }
} 