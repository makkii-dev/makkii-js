import {AionApiClient} from '@makkii/app-aion';
import {BtcApiClient} from '@makkii/app-btc';
import {EthApiClient} from '@makkii/app-eth';
import {TronApiClient} from '@makkii/app-tron';
import BigNumber from 'bignumber.js';
import {IApiClient, IsingleApiClient, IsingleApiFullClient} from './interfaces/apiclient';

export default class ApiClient implements IApiClient {
   

    coins: {[coin:string]: IsingleApiClient | IsingleApiFullClient} = {};

    constructor(support_coin_lists: Array<string>, isTestNet: boolean){
       support_coin_lists.forEach(c=>{
           if(c.toLowerCase() === 'aion'){
             this.coins.aion = new AionApiClient(isTestNet);
           }else if(c.toLowerCase() === 'btc'){
               this.coins.btc = new BtcApiClient(isTestNet, 'btc');
           }else if(c.toLowerCase() === 'eth'){
               this.coins.eth = new EthApiClient(isTestNet);
           }else if(c.toLowerCase() === 'ltc'){
               this.coins.ltc = new BtcApiClient(isTestNet, 'ltc');
           }else if(c.toLowerCase() === 'trx'){
               this.coins.trx = new TronApiClient(isTestNet);
           }else {
               throw new Error(`coin: [${c}] is unsupported.`)
           }
       })
    }

    coverNetWorkConfig(config: any): void {
        const {remote:{api={}}={}, coins={}} = config;
        Object.keys(this.coins).forEach(symbol=>{
            if(coins[symbol]){
                this.coins[symbol].coverNetWorkConfig(coins[symbol], api);
            }
        })
    }

    setRemoteApi(api: string): void {
       Object.values(this.coins).forEach(coin=>{
           if('setRemoteApi' in coin) {
               coin.setRemoteApi(api)
           }
       })
    }

    
    getCoin(coinType: string){
        const coin = this.coins[coinType.toLowerCase()];
        if(!coin){
            throw new Error(`coin: [${coinType}] is not init or unsupported.`)
        }
        return coin;
    }

    getBlockByNumber(coinType: string, blockNumber: Number): Promise<any> {
        const coin = this.getCoin(coinType);
        return coin.getBlockByNumber(blockNumber);
    }

    getBlockNumber(coinType: string): Promise<any> {
        const coin = this.getCoin(coinType);
        return coin.getBlockNumber();
    }

    getTransactionStatus(coinType: string, hash: string): Promise<any> {
        const coin = this.getCoin(coinType);
        return coin.getTransactionStatus(hash);
    }

    getTransactionExplorerUrl(coinType: string, hash: any): string {
        const coin = this.getCoin(coinType);
        return coin.getTransactionExplorerUrl(hash);
    }

    getBalance(coinType: string, address: string): Promise<any> {
        const coin = this.getCoin(coinType);
        return coin.getBalance(address);
    }

    getTransactionsByAddress(coinType: string, address: string, page: number, size: number): Promise<any> {
        const coin = this.getCoin(coinType);
        return coin.getTransactionsByAddress(address, page, size);
    }

    validateBalanceSufficiency(coinType: string, account: any, symbol: string, amount: number | BigNumber, extraParams?: any): Promise<any> {
        const coin = this.getCoin(coinType);
        return coin.validateBalanceSufficiency(account, symbol, amount, extraParams);
    }

    sendTransaction(coinType: string, account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean): Promise<any> {
        const coin = this.getCoin(coinType);
        return coin.sendTransaction(account, symbol, to, value, extraParams, data, shouldBroadCast);
    }

    sameAddress(coinType: string, address1: string, address2: string): boolean {
        const coin = this.getCoin(coinType);
        return coin.sameAddress(address1, address2);
    }

    formatAddress1Line(coinType: string, address: string): string {
        const coin = this.getCoin(coinType);
        return coin.formatAddress1Line(address);
    }

    getTokenIconUrl(coinType: string, tokenSymbol: string, contractAddress: string): string {
        const coin = this.getCoin(coinType);
        if('tokenSupport' in coin && !!coin.tokenSupport){
            return coin.getTokenIconUrl(tokenSymbol, contractAddress);
        }
        throw new Error(`[${coinType}] getTokenIconUrl is not implemented.`)
        
    }

    fetchTokenDetail(coinType: string, contractAddress: string, network?: string): Promise<any> {
        const coin = this.getCoin(coinType);
        if('tokenSupport' in coin && !!coin.tokenSupport){
            return coin.fetchTokenDetail(contractAddress, network);
        }
        throw new Error(`[${coinType}] fetchTokenDetail is not implemented.`)
    }

    fetchAccountTokenTransferHistory(coinType: string, address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number): Promise<any> {
        const coin = this.getCoin(coinType);
        if('tokenSupport' in coin && !!coin.tokenSupport){
            return coin.fetchAccountTokenTransferHistory(address,symbolAddress, network, page, size, timestamp);
        }
        throw new Error(`[${coinType}] fetchAccountTokenTransferHistory is not implemented.`)
    }

    fetchAccountTokens(coinType: string, address: string, network?: string): Promise<any> {
        const coin = this.getCoin(coinType);
        if('tokenSupport' in coin && !!coin.tokenSupport){
            return coin.fetchAccountTokens(address, network);
        }
        throw new Error(`[${coinType}] fetchAccountTokens is not implemented.`)
    }

    fetchAccountTokenBalance(coinType: string, contractAddress: string, address: string, network?: string): Promise<any> {
        const coin = this.getCoin(coinType);
        if('tokenSupport' in coin && !!coin.tokenSupport){
            return coin.fetchAccountTokenBalance(contractAddress, address, network);
        }
        throw new Error(`[${coinType}] fetchAccountTokenBalance is not implemented.`)
    }

    getTopTokens(coinType: string, topN?: number): Promise<any> {
        const coin = this.getCoin(coinType);
        if('tokenSupport' in coin && !!coin.tokenSupport){
            return coin.getTopTokens(topN);
        }
        throw new Error(`[${coinType}] getTopTokens is not implemented.`)
    }

    searchTokens(coinType: string, keyword: string): Promise<any> {
        const coin = this.getCoin(coinType);
        if('tokenSupport' in coin && !!coin.tokenSupport){
            return coin.searchTokens(keyword);
        }
        throw new Error(`[${coinType}] searchTokens is not implemented.`)
    }
}