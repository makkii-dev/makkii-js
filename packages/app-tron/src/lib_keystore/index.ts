import { keyPair } from "./keypair";
import { validateAddress } from "./address";
import { signTransaction } from "./transaction";
import { getAccountFromMnemonic } from "./hdkey";

export default {
    getAccountFromMnemonic,
    keyPair,
    validateAddress,
    signTransaction
};
