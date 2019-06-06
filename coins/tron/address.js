import bs58check from 'bs58check';

export const validateAddress = (address)=> new Promise((resolve, reject) => {
   try {
       bs58check.decode(address)
       resolve(true)
   } catch (e) {
       resolve(false)
   }
});