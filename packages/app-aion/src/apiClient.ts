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

  setRemoteApi = (api: string) => {
    this.remoteApi = api;
  }

  coverNetWorkConfig = (network: any, remoteApi: any) => {
    if (network.toString() === "[object Object]") {
      customNetwork(network);
    }
    if (remoteApi.toString() === "[object Object]") {
      customRemote(remoteApi);
    }
  }

  getNetwork = () => {
    return this.isTestNet ? 'mastery' : 'mainnet';
  }

  getBlockByNumber = (blockNumber: Number) => {
    const network = this.getNetwork();
    return API.getBlockByNumber(blockNumber, false, network);
  }

  getBlockNumber = () => {
    const network = this.getNetwork();
    return API.blockNumber(network);
  }

  getTransactionStatus = (hash: string) => {
    const network = this.getNetwork();
    return API.getTransactionStatus(hash, network);
  }

  getTransactionExplorerUrl = (hash: any) => {
    const network = this.getNetwork();
    return API.getTransactionUrlInExplorer(hash, network);
  }

  getBalance = (address: string) => {
    const network = this.getNetwork();
    return API.getBalance(address, network);
  }

  getTransactionsByAddress = (address: string, page: number, size: number) => {
    const network = this.getNetwork();
    return API.getTransactionsByAddress(address, page, size, network);
  }

  validateBalanceSufficiency = (account: any, symbol: string, amount: number | BigNumber, extraParams?: any) => {
    return API.validateBalanceSufficiency(account, symbol, amount, extraParams);
  }

  sendTransaction = (account: any, symbol: string, to: string, value: number | BigNumber, extraParams: any, data: any, shouldBroadCast: boolean) => {
    const network = this.getNetwork();
    return API.sendTransaction(account, symbol, to, value, extraParams, data, network, shouldBroadCast);
  }

  sameAddress = (address1: string, address2: string) => {
    return API.sameAddress(address1, address2);
  }

  formatAddress1Line = (address: string) => {
    return API.formatAddress1Line(address);
  }

  getTokenIconUrl = (tokenSymbol: string, contractAddress: string) => {
    throw new Error('Method getTokenIconUrl not implemented.');
  }

  fetchTokenDetail = (contractAddress: string, network?: string) => {
    const network_ = this.getNetwork();
    return API.fetchTokenDetail(contractAddress, network || network_);
  }

  fetchAccountTokenTransferHistory = (address: string, symbolAddress: string, network?: string, page?: number, size?: number, timestamp?: number) => {
    const network_ = this.getNetwork();
    return API.fetchAccountTokenTransferHistory(address, symbolAddress, network || network_, page, size);
  }

  fetchAccountTokens = (address: string, network?: string) => {
    const network_ = this.getNetwork();
    return API.fetchAccountTokens(address, network || network_);
  }

  fetchAccountTokenBalance = (contractAddress: string, address: string, network?: string) => {
    const network_ = this.getNetwork();
    return API.fetchAccountTokenBalance(contractAddress, address, network || network_);
  }

  getTopTokens = (topN?: number) => {
    return API.getTopTokens(topN, this.remoteApi);
  }

  searchTokens = (keyword: string) => {
    return API.searchTokens(keyword, this.remoteApi);
  }
}
