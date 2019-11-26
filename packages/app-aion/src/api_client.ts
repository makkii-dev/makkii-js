import BigNumber from 'bignumber.js';
import { IsingleApiFullClient } from '@makkii/makkii-core/src/interfaces/api_client';
import API from './lib_api';
import network from './network';

export interface IConfig {
  network: 'mainnet' | 'amity';
  jsonrpc: string;
  explorer_api?: string;
  explorer?: string;
  remoteApi?: string;
}

export default class AionApiClient implements IsingleApiFullClient {

  tokenSupport: boolean = true;

  config: IConfig;

  api: any;

  constructor(config: IConfig) {
    let restSet: {
      explorer_api?: string,
      explorer?: string,
      remoteApi?: string
    };
    // check
    ['network', 'jsonrpc'].forEach(f => {
      if (!(f in config)) {
        throw new Error(`config miss field ${f}`)
      }
    })

    if (config.network === 'mainnet') {
      restSet = network.mainnet
    } else {
      restSet = network.amity
    }
    this.config = {
      ...restSet,
      ...config,
    }
    this.api = API(this.config);
  }

  getNetwork = () => this.config.network;

  setNetwork = (config: IConfig) => {
    this.config = { ...this.config, ...config };
    this.api = API(this.config);
  }


  getBlockByNumber = (blockNumber: Number) => {
    return this.api.getBlockByNumber(blockNumber, false);
  }

  getBlockNumber = () => {
    return this.api.blockNumber();
  }

  getTransactionStatus = (hash: string) => {
    return this.api.getTransactionStatus(hash);
  }

  getTransactionExplorerUrl = (hash: any) => {
    return this.api.getTransactionUrlInExplorer(hash);
  }

  getBalance = (address: string) => {
    return this.api.getBalance(address);
  }

  getTransactionsByAddress = (address: string, page: number, size: number) => {
    return this.api.getTransactionsByAddress(address, page, size);
  }

  validateBalanceSufficiency = (account: any, amount: number | BigNumber, extraParams?: any) => {
    return this.api.validateBalanceSufficiency(account, amount, extraParams);
  }

  sendTransaction = (account: any, to: string, value: number | BigNumber, data: any, extraParams: any, shouldBroadCast: boolean) => {
    return this.api.sendTransaction(account, to, value, data, extraParams, shouldBroadCast);
  }

  sameAddress = (address1: string, address2: string) => {
    return this.api.sameAddress(address1, address2);
  }

  getTokenIconUrl = (tokenSymbol: string, contractAddress: string) => {
    throw new Error('Method getTokenIconUrl not implemented.');
  }

  getTokenDetail = (contractAddress: string) => {
    return this.api.getTokenDetail(contractAddress);
  }

  getAccountTokenTransferHistory = (address: string, symbolAddress: string, page?: number, size?: number, timestamp?: number) => {
    return this.api.getAccountTokenTransferHistory(address, symbolAddress, page, size);
  }

  getAccountTokens = (address: string) => {
    return this.api.getAccountTokens(address);
  }

  getAccountTokenBalance = (contractAddress: string, address: string) => {
    return this.api.getAccountTokenBalance(contractAddress, address);
  }

  getTopTokens = (topN?: number) => {
    return this.api.getTopTokens(topN);
  }

  searchTokens = (keyword: string) => {
    return this.api.searchTokens(keyword);
  }
}
