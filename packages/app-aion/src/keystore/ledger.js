import { AionApp } from 'lib-hw-ledger-js';

let wallet = {};

const initWallet = (transport) => {
  wallet = new AionApp(transport);
};

const getWalletStatus = async () => {
  try {
    const res = await getKeyByLedger(0);
    return !!res;
  } catch (e) {
    return false;
  }
};

const signByLedger = (index, sender, msg) => {
  msg = Buffer.isBuffer(msg) ? msg : Buffer.from(msg);
  return new Promise((resolve, reject) => {
    try {
      wallet.getAccount(parseInt(index)).then(
        (account) => {
          if (account.address !== sender) {
            reject(new Error('error.wrong_device'));
          }
          wallet.sign(parseInt(index), msg).then(
            (res) => {
              resolve({ signature: res, publicKey: account.pubKey });
            },
            (err) => {
              console.log(`sign tx error: ${err}`);
              reject(new Error(err.code));
            },
          );
        },
        (error) => {
          console.log(`get account error: ${error}`);
          reject(new Error(error.code));
        },
      );
    } catch (e) {
      reject(new Error('error.wrong_device'));
    }
  });
};

const getKeyByLedger = async (index) => {
  const { address } = await wallet.getAccount(index);
  return { address, index };
};

export {
  signByLedger,
  getKeyByLedger,
  initWallet,
  getWalletStatus,
};
