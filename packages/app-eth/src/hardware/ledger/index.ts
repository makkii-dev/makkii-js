import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { EthUnsignedTx } from "../../type";
import { process_unsignedTx } from "../../lib_keystore/transaction";
import Eth from '@ledgerhq/hw-app-eth';

/**
 * Ethereum ledger client that implements IHardware interface
 * 
 * User should call getHardwareStatus() first to check ledger and app status,
 * then decide whether to call other functions.
 */
export default class EthLedger implements IHardware {
   
    private hardware: any = {}

    /**
     * Get ethereum account from eth ledger app
     * 
     * @param index index path in hd wallet
     * @returns account { address: '', index: 1, publicKey: '' }
     */
    getAccount = async (index: number) => {
        const path = `44'/60'/0'/0/${index}`;
        const { address, publicKey } = await this.hardware.getAddress(path, false);
        return { address, index, publicKey }
    }

    getHardwareStatus =  async () => {
        try{
            await this.getAccount(0);
            return true;
        }catch(e){
            return false;
        }
    }

    /**
     * Sign transaction
     * 
     * @param tx transaction object to sign
     * @param params parameters object, example: { derivationIndex: 1 }
     * @return Promise of transaction hash string
     */
    signTransaction = async (transaction: EthUnsignedTx, params: {derivationIndex:number}): Promise<string> => {
        const unsigned = process_unsignedTx(transaction);
        const {derivationIndex} = params;
        const path = `44'/60'/0'/0/${derivationIndex}`;
        const res = await this.hardware.signTransaction(path, unsigned.serialize().toString('hex'));
        const sig: any = {};
        sig.r = Buffer.from(res.r, 'hex');
        sig.s = Buffer.from(res.s, 'hex');
        sig.v = parseInt(res.v, 16);
        Object.assign(unsigned, sig);
        const validSig = unsigned.verifySignature();
        if(!validSig){
            throw new Error('sign error: invalid signature')
        }
        return `0x${unsigned.serialize().toString('hex')}`
    }
   
    /**
     * Set ledger transport.
     * 
     * @param transport. valid ledger transport implementation, 
     * refer to https://github.com/LedgerHQ/ledgerjs/tree/master/packages/hw-transport
     */
    setLedgerTransport = (transport: any) => {
        this.hardware = new Eth(transport);
        return this;
    }

}