import AionLedger from './ledger';

export default (hardware: string)=>{
    if(hardware === 'ledger') {
        return new AionLedger();        
    }
    throw new Error(`unsupport hardware: ${hardware}`)
}