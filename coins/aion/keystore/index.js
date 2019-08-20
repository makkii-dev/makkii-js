import {getKeyFromMnemonic} from './hdkey';
import {keyPair} from "./keyPair";
import {validateAddress} from "./address";
import {signTransaction} from './transaction';
import {getKeyByLedger, initWallet, signByLedger} from "./ledger";
import {fromV3, toV3} from "./keyfile";

export default {
    getKeyFromMnemonic,
    keyPair,
    validateAddress,
    signTransaction,
    getKeyByLedger,
    fromV3,
    signByLedger,
    toV3,
    initWallet
}