import BigNumber from "bignumber.js";
import jsonrpcClient from "./jsonrpc";
import { estimateFeeBTC, estimateFeeLTC } from "../lib_keystore/transaction";

export default config => {
    const { getUnspentTx } = jsonrpcClient(config);

    const sendAll = async (address, byte_fee = 10) => {
        try {
            const utxos = await getUnspentTx(address);
            let balance = new BigNumber(0);
            utxos.forEach(utxo => {
                balance = balance.plus(new BigNumber(utxo.amount));
            });
            return Math.max(
                balance
                    .minus(
                        config.network.match("LTC")
                            ? estimateFeeLTC
                            : estimateFeeBTC(utxos.length, 2, byte_fee || 10)
                    )
                    .shiftedBy(-8)
                    .toNumber(),
                0
            );
        } catch (e) {
            return 0;
        }
    };

    const sameAddress = (address1, address2) => address1 === address2;
    return {
        sendAll,
        sameAddress
    };
};
