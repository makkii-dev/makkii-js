import { Token } from '@makkii/makkii-type'
import { TronAccount } from '@makkii/makkii-type/src/tron'
import BigNumber from 'bignumber.js'
import KEYSTORE  from './lib_keystore'

export default class TronAccountBuilder {
    __Tokens: { [symbol: string]: Token & { balance: BigNumber } } = {}

    __Address: string = ''

    __balance: BigNumber = new BigNumber(0)

    __private_key: string ='' 

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
            this.__private_key = privateKey
            return this;
        }
        throw new Error('Invalid PrivateKey')
    }


    build = ():TronAccount => {
        if (this.__Address === '') {
            throw new Error('missing Address')
        }
        if (this.__private_key === '') {
            throw new Error('missing private key')
        }
        return {
            address: this.__Address,
            balance: this.__balance,
            private_key: this.__private_key,
        }
    }

}