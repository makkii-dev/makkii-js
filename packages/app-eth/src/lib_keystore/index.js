import {keyPair} from "./keypair";
import {validateAddress} from "./address";
import {signTransaction} from "./transaction";
import {getAccountFromMnemonic} from "./hdkey";
import {getAccountByLedger, initWallet, getWalletStatus} from "./ledger";

export default {
    getAccountFromMnemonic,
    keyPair,
    validateAddress,
    signTransaction,
    getAccountByLedger,
    initWallet,
    getWalletStatus
};
