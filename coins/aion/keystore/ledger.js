const {AionApp} = require('lib-hw-ledger-js');
let wallet =  {};
if(global.platform && global.platform === 'mobile'){
    try{
        wallet = require('react-native-aion-hw-wallet').default;
    }catch (e) {
        wallet = {}
    }
}
const initWallet = (transport) => {
    if(global.platform && global.platform === 'mobile'){
        throw Error('current platform not support')
    }else{
        wallet = new AionApp(transport);
    }
};

const signByLedger = (index, sender, msg) => {
    return new Promise((resolve, reject) => {
        try {
            wallet.getAccount(parseInt(index)).then(
                account => {
                    if (account.address !== sender) {
                        reject(new Error('error.wrong_device'));
                    }
                    wallet.sign(parseInt(index), msg).then(
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