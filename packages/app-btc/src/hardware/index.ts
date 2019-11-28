import BtcLedger from './ledger';

export default (hardware: string)=>{
    if(hardware === 'ledger') {
        return new BtcLedger();        
    }
    throw new Error(`unsupport hardware: ${hardware}`)
}