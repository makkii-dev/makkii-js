import EthLedger from './ledger';

export default (hardware: string)=>{
    if(hardware === 'ledger') {
        return new EthLedger();        
    }
    throw new Error(`unsupport hardware: ${hardware}`)
}