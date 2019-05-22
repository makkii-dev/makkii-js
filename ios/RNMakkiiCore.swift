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
        case InvalidPrivateKey
        case InvalidDigestData
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
    
    @objc func recoverKeyPairByPrivateKey(_ privateKey: String, cointType coin: UInt32 , resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do{
            guard let cointype = getCoinType(coin) else {
                throw BaseError.InvalidCoinType
            }
            guard let sk = getPrivateKeyByString(privateKey) else {
                throw BaseError.InvalidPrivateKey
            }
            guard let pk = getPublicKeyByCoin(private_key: sk, coinType: cointype) else {
                throw BaseError.UnknowReason
            }
            var skstr = sk.data.hexString
            if cointype == CoinType.aion {
                skstr = skstr + pk.data.hexString
            }
            resolve(["private_key":skstr, "public":pk.data.hexString, "address": cointype.deriveAddress(privateKey: sk)])
            
        }catch BaseError.InvalidCoinType {
            reject("E_INVALID_COINTYPE" ,"invalid coinType", nil)
        }catch BaseError.InvalidPrivateKey {
            reject("E_INVALID_PrivateKey" ,"invalid privateKey", nil)
        }catch {
            reject("E_UNKNOWN_REASON", "unknown reason", nil)
        }
    }
    
    @objc func sign(_ hash:String, privateKey private_key:String, coinType coin:UInt32, resolver resolve:RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do{
            guard let cointype = getCoinType(coin) else {
                throw BaseError.InvalidCoinType
            }
            guard let sk = getPrivateKeyByString(private_key) else {
                throw BaseError.InvalidPrivateKey
            }
            guard let hashdata = Data(hexString: hash) else {
                throw BaseError.InvalidDigestData
            }
            let signature = sk.sign(digest: hashdata, curve: cointype.curve)!
            resolve(signature.hexString)
        }catch BaseError.InvalidCoinType {
            reject("E_INVALID_COINTYPE" ,"invalid coinType", nil)
        }catch BaseError.InvalidPrivateKey {
            reject("E_INVALID_PrivateKey" ,"invalid privateKey", nil)
        }catch BaseError.InvalidDigestData {
            reject("E_INVALID_Digest" ,"invalid digest data", nil)
        }catch {
            reject("E_UNKNOWN_REASON", "unknown reason", nil)
        }
    }
    
    @objc func signTransaction(_ transaction:[String:Any], coinType coin:UInt32, resolver resolve:RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock){
        if coin == CoinType.aion.rawValue {
            var pkstr: String = transaction["private_key"] as! String;
            if pkstr.starts(with: "0x") {
                pkstr = String(pkstr[pkstr.index(pkstr.startIndex, offsetBy: 2)..<pkstr.endIndex])
            }
            if pkstr.count>64 {
                pkstr = String(pkstr[..<pkstr.index(pkstr.startIndex, offsetBy: 64)])
            }
            let input = AionSigningInput.with{
                $0.nonce = Data(hexString: transaction["nonce"] as! String)!
                $0.gasPrice = Data(hexString: transaction["gasPrice"] as! String)!
                $0.gasLimit = Data(hexString: transaction["gasLimit"] as! String)!
                $0.toAddress = transaction["to"] as! String
                $0.amount = Data(hexString: transaction["amount"] as! String)!
                $0.timestamp = Data(hexString: transaction["timestamp"] as! String)!
                $0.privateKey = Data(hexString: pkstr)!
            }
            let output = AionSigner.sign(input: input)
            resolve(["signature":output.signature.hexString, "encoded":output.encoded.hexString])
        }else if coin == CoinType.bitcoin.rawValue || coin == CoinType.litecoin.rawValue {
            
        }else if coin == CoinType.eos.rawValue {
            
        }else if coin == CoinType.ethereum.rawValue {
            let input = TW_Ethereum_Proto_SigningInput.with{
                $0.chainID = Data(hexString: transaction["chainID"] as! String)!
                $0.nonce = Data(hexString: transaction["nonce"] as! String)!
                $0.gasPrice = Data(hexString: transaction["gasPrice"] as! String)!
                $0.gasLimit = Data(hexString: transaction["gasLimit"] as! String)!
                $0.toAddress = transaction["to"] as! String
                $0.amount = Data(hexString: transaction["amount"] as! String)!
                $0.privateKey = Data(hexString: transaction["private_key"] as! String)!
            }
            let output = EthereumSigner.sign(input: input)
            resolve(["encoded":output.encoded.hexString, "v":output.v.hexString, "r":output.r.hexString,"s":output.s.hexString])
        }else if coin == CoinType.tron.rawValue {
            
        }else {
            reject("E_INVALID_COINTYPE" ,"invalid coinType", nil)
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
    
    func getPrivateKeyByString(_ str:String)->PrivateKey?{
        var pkstr: String = str;
        if pkstr.starts(with: "0x") {
            pkstr = String(pkstr[pkstr.index(pkstr.startIndex, offsetBy: 2)..<pkstr.endIndex])
        }
        if pkstr.count>64 {
            pkstr = String(pkstr[..<pkstr.index(pkstr.startIndex, offsetBy: 64)])
        }
        guard let sk = PrivateKey(data: Data(hexString: pkstr)!) else {
            return nil
        }
        return sk
    }
}
