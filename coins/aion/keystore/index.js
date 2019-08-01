import {getKeyFromMnemonic} from './hdkey';
import {keyPair} from "./keyPair";
import {validateAddress} from "./address";
import {signTransaction} from './transaction';
import {getKeyByLedger} from "./ledger";

export default {
    getKeyFromMnemonic,
    keyPair,
    validateAddress,
    signTransaction,
    getKeyByLedger
}