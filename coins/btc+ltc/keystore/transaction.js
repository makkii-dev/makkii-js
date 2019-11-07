import {ECPair} from "bitcoinjs-lib";
import {TransactionBuilder} from './transaction_builder';
import BigNumber from "bignumber.js";
import {networks} from './network';
import {hexutil} from "lib-common-util-js";
import {getKeyByLedger, signByLedger} from "./ledger";

/***
 *
 * @param transaction
 * {
 *    private_key?: hex String
 *    to_address: hex String
 *    change_address: hex String
 *    amount: number (satoshi)
 *    utxos: [
 *        {
 *            amount: number (satoshi)
 *            script: hex String
 *            hash: hex String
 *            index: number
 *        }
 *        ...
 *    ],
 *    extra_param: {type, sender, derivationIndex}
 * }
 * @param network: one of [BTC, BTCTEST, LTC, LTCTEST]
 * @returns {Promise<any>} {encoded: hex String}
 */
export const signTransaction = async  (transaction, network='BTC') => {
    const {private_key, compressed, utxos, amount: amount_, to_address, change_address, byte_fee, extra_param} = transaction;
    const mainnet = networks[network];
    let keyPair;
    if(extra_param&&extra_param.type === '[ledger]'){
        const {sender, derivationIndex} = extra_param;
        // account type is ledger
        try{
            const {publicKey} = await getKeyByLedger(derivationIndex, mainnet);
            keyPair = {
                publicKey: Buffer.from(publicKey, 'hex'),
                network: mainnet,
                sign: async (msg, lowR)=>{
                    return await signByLedger(derivationIndex, sender, msg, mainnet);
                }
            }
        }catch (e) {
            throw e;
        }

    }else {
        try {
            keyPair = ECPair.fromPrivateKey(Buffer.from(hexutil.removeLeadingZeroX(private_key), 'hex'), {
                network: mainnet,
                compressed: compressed
            });
        } catch (e) {
            throw e;
        }
    }

    const txb = new TransactionBuilder(mainnet);
    const amount = new BigNumber(amount_);

    const fee = network === 'BTC' || network === 'BTCTEST' ? estimateFeeBTC(utxos.length, 2, byte_fee || 10) : estimateFeeLTC;

    let balance = new BigNumber(0);
    for (let ip = 0; ip < utxos.length; ip++) {
        balance = balance.plus(new BigNumber(utxos[ip].amount));
        txb.addInput(utxos[ip].hash, utxos[ip].index, 0xffffffff, Buffer.from(utxos[ip].script, 'hex'));
    }
    if (balance.isLessThan(amount.plus(fee))) {
        throw new Error("error_insufficient_amount");
    }
    const needChange = balance.isGreaterThan(amount.plus(fee));
    txb.addOutput(to_address, amount.toNumber());
    if (needChange) {
        txb.addOutput(change_address, balance.minus(amount).minus(fee).toNumber())
    }
    for (let ip = 0; ip < utxos.length; ip++) {
        await txb.async_sign(ip, keyPair);
    }
    const tx = txb.build();
    return {encoded: tx.toHex()}

};

export const estimateFeeBTC = (m, n, byte_fee)=>BigNumber(148 * m + 34 * n + 10).times(byte_fee);
export const estimateFeeLTC = BigNumber(20000);
