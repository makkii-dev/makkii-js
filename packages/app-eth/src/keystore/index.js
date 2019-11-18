import {keyPair} from "./keypair";
import {validateAddress} from "./address";
import {signTransaction} from "./transaction";
import {getKeyFromMnemonic} from "./hdkey";
import {getKeyByLedger, initWallet, getWalletStatus} from "./ledger";

export default {
    getKeyFromMnemonic,
    keyPair,
    validateAddress,
    signTransaction,
    getKeyByLedger,
    initWallet,
    getWalletStatus
};
