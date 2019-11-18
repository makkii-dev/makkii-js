import {keyPair} from "./keypair";
import {validateAddress} from "./address";
import {signTransaction} from "./transaction";
import {getKeyFromMnemonic} from "./hdkey";

export default {
    getKeyFromMnemonic,
    keyPair,
    validateAddress,
    signTransaction
};