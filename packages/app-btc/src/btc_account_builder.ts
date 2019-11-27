import {BtcAccount} from '@makkii/makkii-type/src/btc';
import KEYSTORE from './lib_keystore';

export default class BtcAccountBuilder {
    __Address: string = ''

    __type: {
        type: '[ledger]' | '[local]' | 'undefined'
        private_key?: string
        compressed?: boolean
        derivationIndex?: number
    } = { type: 'undefined'}

    network: string

    constructor(network='BTC'){
        this.network = network
    }

    setAddress = (address: string) => {
        if(KEYSTORE.validateAddress(address, this.network)){
            this.__Address = address;
            return this;
        }
        throw new Error('Invalid Address')
    }

    setPrivateKey = (privateKey: string, _compressed: boolean = true)=> {
        if (privateKey && privateKey !== "") {
            this.__type = {
                type: '[local]',
                private_key: privateKey,
                compressed: _compressed
            }
            return this;
        }
        throw new Error('Invalid PrivateKey')
    }

    setLedgerIndex = (index: number) => {
        this.__type = {
            type: "[ledger]",
            derivationIndex: index
        }
        return this;
    }

    build = ():BtcAccount => {
        if (this.__Address === '') {
            throw new Error('missing Address')
        }
        if (this.__type.type === 'undefined') {
            throw new Error('missing Account Type')
        }
        return {
            address: this.__Address,
            type: this.__type.type,
            compressed: this.__type.compressed,
            private_key: this.__type.private_key,
            derivationIndex: this.__type.derivationIndex
        }
    }
}