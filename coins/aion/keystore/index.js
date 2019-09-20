import {getKeyFromMnemonic} from './hdkey';
import {keyPair, validatePrivateKey} from "./keyPair";
import {validateAddress} from "./address";
import {signTransaction} from './transaction';
import {getKeyByLedger, initWallet} from "./ledger";
import {fromV3, toV3} from "./keyfile";

export default {
    getKeyFromMnemonic,
    keyPair,
    validateAddress,
    signTransaction,
    getKeyByLedger,
    fromV3,
    toV3,
    initWallet,
    validatePrivateKey
}
