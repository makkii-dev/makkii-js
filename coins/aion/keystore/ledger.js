const optional = require('optional');
const {AionApp} = require('lib-hw-ledger-js');
let wallet =   global.platform && global.platform === 'mobile'? optional('react-native-aion-hw-wallet'): {};

const initWallet = (transport) => wallet = new AionApp(transport);

const signByLedger = (index, sender, msg) => {
    return new Promise((resolve, reject) => {
        try {
            wallet.getAccount(index).then(
                account => {
                    if (account.address !== sender) {
                        reject(new Error('error.wrong_device'));
                    }
                    wallet.sign(index, Object.values(msg)).then(
                        res => {
                            resolve({signature: res, publicKey: account.publicKey})
                        },
                        err => {
                            console.log(`sign tx error: ${err}`);
                            reject(new Error(err.code));
                        },
                    );
                },
                error => {
                    console.log(`get account error: ${error}`);
                    reject(new Error(error.code));
                },
            );
        }catch (e) {
            reject(new Error('error.wrong_device'));
        }
    });
};

const getKeyByLedger = async (index) => {
    try {
        const {address} = await wallet.getAccount(index);
        return {address, index};
    }catch (e) {
        throw e;
    }
};

export {
    signByLedger,
    getKeyByLedger,
    initWallet
}