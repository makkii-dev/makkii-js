import { NativeModules } from 'react-native';
import {CoinType} from './coinType';
import * as CryptoUtils from '@tronscan/client/src/utils/crypto';
import * as TransactionUtils from '@tronscan/client/src/utils/transactionBuilder'
const { RNMakkiiCore } = NativeModules;
const signTransaction = (transaction, coinType)=>{
    if( coinType === CoinType.TRON){
        return new Promise((resolve, reject) => {
           try {
               const {private_key, from, to, amount} = transaction;
               let transaction = TransactionUtils.buildTransferTransaction("_", from, to, amount);
               let signedTransaction = CryptoUtils.signTransaction(private_key, transaction);
               resolve(signedTransaction);
           }catch (e) {
               reject(e)
           }
        })
    }else{
        return RNMakkiiCore.signTransaction(transaction,coinType)
    }
};
export default {
    ...RNMakkiiCore,
    signTransaction,
    CoinType
};
