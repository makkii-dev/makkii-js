//
//  RNMakkiCore.swift
//  RNMakkiiCore
//
//  Created by chaion on 2019/5/21.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import TrustWalletCore
@objc class RNMakkiiCore:NSObject{
    private var myWallet:HDWallet? = nil
    enum BaseError:Error {
        case InvalidCoinType
        case InvalidDerivePath
        case UnknowReason
    }
    @objc func generateMnemonic(_ resolve:RCTPromiseResolveBlock,rejecter reject:RCTPromiseRejectBlock){
        myWallet = HDWallet.init(strength: 128, passphrase: "")
        resolve(myWallet?.mnemonic)
    }
    
    @objc func createByMnemonic(_ mnemonic: String, passphrase pass:String){
        myWallet = HDWallet.init(mnemonic: mnemonic, passphrase: pass)
    }
    
    @objc func getKey(_ coinType: UInt32, account path1:UInt32, change path2:UInt32, address path3:UInt32, resolver resolve:RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock){
        do {
            guard let coin = getCoinType(coinType) else {
                throw BaseError.InvalidCoinType
            };
            guard let sk = myWallet?.getKeyBIP44(coin: coin, account: path1, change: path2, address: path3) else {
                throw BaseError.InvalidDerivePath
            }
            guard let pk = getPublicKeyByCoin(private_key: sk, coinType: coin) else {
                throw BaseError.UnknowReason
            }
            var skstr = sk.data.hexString
            if coin == CoinType.aion {
                skstr = skstr + pk.data.hexString
            }
            resolve(["private_key":skstr, "public":pk.data.hexString, "address": coin.deriveAddress(privateKey: sk),"index": path3])
        }catch  BaseError.InvalidCoinType{
            reject("E_INVALID_COINTYPE" ,"invalid coinType", nil)
        }catch BaseError.InvalidDerivePath{
            reject("E_INVALID_DERIVEPATH", "invalid derivePath", nil)
        }catch {
            reject("E_UNKNOWN_REASON", "unknown reason", nil)
        }
    }
    
    func getCoinType(_ coin:UInt32) ->CoinType?{
        switch coin {
        case CoinType.aion.rawValue:
            return CoinType.aion
        case CoinType.bitcoin.rawValue:
            return CoinType.bitcoin
        case CoinType.eos.rawValue:
            return CoinType.eos
        case CoinType.ethereum.rawValue:
            return CoinType.ethereum
        case CoinType.litecoin.rawValue:
            return CoinType.litecoin
        case CoinType.tron.rawValue:
            return CoinType.tron
        default:
            return nil
        }
    }
    
    func getPublicKeyByCoin(private_key sk:PrivateKey, coinType coin: CoinType) -> PublicKey?{
        switch coin {
        case .aion:
            return sk.getPublicKeyEd25519()
        case .bitcoin, .eos, .litecoin:
            return sk.getPublicKeySecp256k1(compressed: true)
        case .ethereum,.tron:
            return sk.getPublicKeySecp256k1(compressed: false)
        default:
            return nil
        }
    }
}
