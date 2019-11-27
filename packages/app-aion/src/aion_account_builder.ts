import { Token } from '@makkii/makkii-type'
import { AionAccount } from '@makkii/makkii-type/src/aion'
import BigNumber from 'bignumber.js'
import KEYSTORE from './lib_keystore';

export default class AionAccountBuilder {
    __Tokens: { [symbol: string]: Token & { balance: BigNumber } } = {}

    __Address: string = ''

    __balance: BigNumber = new BigNumber(0)

    __type: {
        type: '[ledger]' | '[local]' | 'undefined',
        private_key?: string // type is [local] sign by privateKey
        derivationIndex?: number // type is [ledger] sign by ledger (account index in ledger)
    } = { type: 'undefined' }

    setAddress = (address: string) => {
        if (KEYSTORE.validateAddress(address)) {
            this.__Address = address;
            return this;
        }
        throw new Error('Invalid Address')
    }

    setBalance = (balance: number | BigNumber) => {
        this.__balance = BigNumber.isBigNumber(balance) ? balance : new BigNumber(balance)
        return this;
    }

    setPrivateKey = (privateKey: string) => {
        if (privateKey && privateKey !== "") {
            this.__type = {
                type: '[local]',
                private_key: privateKey
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

    addToken = (symbol: string, name: string, contractAddr: string, tokenDecimal: number, balance: BigNumber = new BigNumber(0)) => {
        this.__Tokens[symbol] = {
            symbol,
            name,
            contractAddr,
            tokenDecimal,
            balance,
        }
    }

    build = ():AionAccount => {
        if (this.__Address === '') {
            throw new Error('missing Address')
        }
        if (this.__type.type === 'undefined') {
            throw new Error('missing Account Type')
        }
        return {
            symbol: 'AION',
            address: this.__Address,
            balance: this.__balance,
            tokens: this.__Tokens,
            type: this.__type.type,
            private_key: this.__type.private_key,
            derivationIndex: this.__type.derivationIndex
        }
    }

}