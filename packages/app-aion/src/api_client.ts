import BigNumber from 'bignumber.js';
import { IsingleApiFullClient } from '@makkii/makkii-core/src/interfaces/api_client';
import { AionTxObj, AionTx, AionTxStatus, AionAccount } from '@makkii/makkii-type/src/aion';
import { Token, validateBalanceRet } from '@makkii/makkii-type';
import { IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import API from './lib_api';
import network from './network';
import { AionUnsignedTx, AionPendingTx } from './type';

export interface IConfig {
  network: 'mainnet' | 'amity';
  jsonrpc: string;
  explorer_api?: string;
  explorer?: string;
  remoteApi?: string;
}

type txHash = string;
export default class AionApiClient implements IsingleApiFullClient {

  tokenSupport: boolean = true;

  config: IConfig;

  private api: any;

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


  getBlockByNumber = (blockNumber: string) => {
    return this.api.getBlockByNumber(blockNumber, false);
  }

  getBlockNumber = () => {
    return this.api.blockNumber();
  }

  getTransactionStatus = (hash: string): Promise<AionTxStatus> => {
    return this.api.getTransactionStatus(hash);
  }

  getTransactionExplorerUrl = (hash: any): string => {
    return this.api.getTransactionUrlInExplorer(hash);
  }

  getBalance = (address: string): Promise<BigNumber> => {
    return this.api.getBalance(address);
  }

  getTransactionsByAddress = (address: string, page: number, size: number): Promise<Map<txHash, AionTx>> => {
    return this.api.getTransactionsByAddress(address, page, size);
  }

  sendTransaction = (unsignedTx: AionUnsignedTx, signer: IkeystoreSigner, signerParams:any):Promise<AionPendingTx> => {
    return this.api.sendTransaction(unsignedTx, signer, signerParams)
  }

  sameAddress = (address1: string, address2: string): boolean => {
    return this.api.sameAddress(address1, address2);
  }

  // not implemented
  getTokenIconUrl = (tokenSymbol: string, contractAddress: string) => {
    throw new Error('Method getTokenIconUrl not implemented.');
  }

  getTokenDetail = (contractAddress: string): Promise<Token> => {
    return this.api.getTokenDetail(contractAddress);
  }

  getAccountTokenTransferHistory = (address: string, symbolAddress: string, page?: number, size?: number): Promise<{ [hash: string]: AionTx }> => {
    return this.api.getAccountTokenTransferHistory(address, symbolAddress, page, size);
  }

  getAccountTokens = (address: string): Promise<{ [symbol: string]: Token }> => {
    return this.api.getAccountTokens(address);
  }

  /**
   * Get account token balance of aion api client
   * @param {string} contractAddress contract address
   * @param {string} address account address
   * @returns promise account token balance
   */
  getAccountTokenBalance = (contractAddress: string, address: string): Promise<BigNumber> => {
    return this.api.getAccountTokenBalance(contractAddress, address);
  }

  getTopTokens = (topN?: number): Promise<Array<Token>> => {
    return this.api.getTopTokens(topN);
  }

  searchTokens = (keyword: string): Promise<Array<Token>> => {
    return this.api.searchTokens(keyword);
  }

  buildTransaction = (from: string, to: string, value: BigNumber, options: {
    gasLimit: number,
    gasPrice: number,
    isTransfer: boolean, // is token transfer
    data?: any,
    contractAddr?: string,
    tokenDecimal?: number
  }): Promise<AionUnsignedTx> => {
    return this.api.buildTransaction(from, to, value, options);
  }

}
