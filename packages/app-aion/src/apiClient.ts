import BigNumber from 'bignumber.js';
import API from './api';
import { ApiClient, ApiTokenClient } from './interfaces/apiClient';
import { customNetwork, customRemote } from './network';

export default class AionApiClient implements ApiClient, ApiTokenClient {

  tokenSupport: boolean = true;

  remoteApi: string = 'prod';

  isTestNet: boolean;

  constructor(isTestNet: boolean) {
    this.isTestNet = isTestNet;
  }

  setRemoteApi(api: string) {
    this.remoteApi = api;
  }

  coverNetWorkConfig(network: any, remote: any): void {
    if(network.toString() === "[object Object]") {
      customNetwork(network);
    }
    if(remote.toString() === "[object Object]") {
      customRemote(remote);
    }
  }

  getNetwork() {
    return this.isTestNet ? 'mastery' : 'mainnet';
  }

  getBlockByNumber(blockNumber: Number): Promise<any> {
    const network = this.getNetwork();
    return API.getBlockByNumber(blockNumber, false, network);
  }

  getBlockNumber(): Promise<any> {
    const network = this.getNetwork();
    return API.blockNumber(network);
  }

  getTransactionStatus(hash: string): Promise<any> {
    const network = this.getNetwork();
    return API.getTransactionStatus(hash, network);
  }

  getTransactionExplorerUrl(hash: any): string {
    const network = this.getNetwork();
    return API.getTransactionUrlInExplorer(hash, network);
  }

  getBalance(address: string): Promise<any> {
    const network = this.getNetwork();
    return API.getBalance(address, network);
  }

  getTransactionsByAddress(address: string, page: number, size: number): Promise<any> {
    const network = this.getNetwork();
    return API.getTransactionsByAddress(address, page, size, network);
  }

  validateBalanceSufficiency(account: any, symbol: string, amount: number | BigNumber, extraParams?: any): Promise<any> {
    return API.validateBalanceSufficiency(account, symbol, amount, extraParams);
  }

  sendTransaction(account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean): Promise<any> {
    const network = this.getNetwork();
    return API.sendTransaction(account, symbol, to, value, extraParams, data, network, shouldBroadCast);
  }

  sameAddress(address1: string, address2: string): boolean {
    return API.sameAddress(address1, address2);
  }

  formatAddress1Line(address: string): string {
    return API.formatAddress1Line(address);
  }

  getTokenIconUrl(tokenSymbol: string, contractAddress: string): string {
    throw new Error('Method getTokenIconUrl not implemented.');
  }

  fetchTokenDetail(contractAddress: string, network?: string): Promise<any> {
    const network_ = this.getNetwork();
    return API.fetchTokenDetail(contractAddress, network || network_);
  }

  fetchAccountTokenTransferHistory(address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number): Promise<any> {
    const network_ = this.getNetwork();
    return API.fetchAccountTokenTransferHistory(address, symbolAddress, network || network_, page, size);
  }

  fetchAccountTokens(address: string, network?: string): Promise<any> {
    const network_ = this.getNetwork();
    return API.fetchAccountTokens(address, network || network_);
  }

  fetchAccountTokenBalance(contractAddress: string, address: string, network?: string): Promise<any> {
    const network_ = this.getNetwork();
    return API.fetchAccountTokenBalance(contractAddress, address, network || network_);
  }

  getTopTokens(topN?: number): Promise<any> {
    return API.getTopTokens(topN, this.remoteApi);
  }

  searchTokens(keyword: string): Promise<any> {
    return API.searchTokens(keyword, this.remoteApi);
  }
}
