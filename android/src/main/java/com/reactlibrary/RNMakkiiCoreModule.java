package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.reactlibrary.utils.*;

import com.google.protobuf.ByteString;

import java.util.Arrays;

import wallet.core.jni.CoinType;
import wallet.core.jni.HDWallet;
import wallet.core.jni.PrivateKey;
import wallet.core.jni.PublicKey;
import wallet.core.jni.AionSigner;
import wallet.core.jni.BitcoinTransactionSigner;
import wallet.core.jni.EthereumSigner;
import wallet.core.jni.EOSSigner;
import wallet.core.jni.TronSigner;

import wallet.core.jni.proto.*;

public class RNMakkiiCoreModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String E_UNKNOWN_ERROR = "E_UNKNOWN_ERROR";
    private static final String E_INVALID_PARAM_ERROR = "E_INVALID_PARAM_ERROR";
    private static final String E_NOT_SUPPORT_ERROR = "E_NOT_SUPPORT_ERROR";
    private HDWallet wallet;
    public RNMakkiiCoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNMakkiiCore";
    }


    @ReactMethod
    public void generateMnemonic(Promise promise){
        try {
            wallet = new HDWallet(128, "");
            promise.resolve(wallet.mnemonic());
        }catch (Exception e){
            promise.reject(E_UNKNOWN_ERROR, e.getMessage());
        }
    }

    @ReactMethod
    public void creatByMnemonic(String mnemonic,  String passphrase){
        try{
            wallet = new HDWallet(mnemonic,passphrase);
        }catch (Exception e){
        }
    }

    @ReactMethod
    public void getKey(int coinType, int account, int change, int address, Promise promise){
        try {
            CoinType coin = CoinType.createFromValue(coinType);
            PrivateKey sk = wallet.getKeyBIP44(coin, account, change, address);
            PublicKey pk = getPublicKeyByCoin(sk,coin);
            WritableMap map = Arguments.createMap();
            String pkstr = Hex.toHexString(sk.data());
            if (coin == CoinType.AION){
                pkstr += Hex.toHexString(pk.data());
            }
            map.putString("private_key", pkstr);
            map.putString("public_key", Hex.toHexString(pk.data()));
            map.putString("address", coin.deriveAddress(sk));
            map.putInt("index", address);
            promise.resolve(map);
        }catch (Exception e){
            promise.reject(E_UNKNOWN_ERROR, e.getMessage());
        }
    }
    @ReactMethod
    public void sign(String hash, String private_key, int coinType, Promise promise){
        try{
            byte[] pkData = StringUtils.StringHexToByteArray(private_key);
            if (pkData.length>=32){
                pkData = Arrays.copyOfRange(pkData, 0, 32);
            }
            byte[] hashData = StringUtils.StringHexToByteArray(hash);
            PrivateKey sk = new PrivateKey(pkData);
            CoinType coin = CoinType.createFromValue(coinType);
            byte[] signatureData = sk.sign(hashData, coin.curve());
            String signature = Hex.toHexString(signatureData);
            promise.resolve(signature);
        }catch (Exception e){
            promise.reject(E_UNKNOWN_ERROR, e.getMessage());
        }
    }

    @ReactMethod
    public void signTransaction(ReadableMap transaction, int coinType, Promise promise){
        if (coinType == CoinType.AION.value()){
            try {
                Aion.SigningInput.Builder builder = Aion.SigningInput.newBuilder();
                String amount = transaction.getString("amount");
                String nonce = transaction.getString("nonce");
                String gasLimit = transaction.getString("gasLimit");
                String gasPrice = transaction.getString("gasPrice");
                String to = transaction.getString("to");
                String private_key = transaction.getString("private_key");
                if(private_key.startsWith("0x")){
                    private_key = private_key.substring(2);
                }
                if(private_key.length()>64){
                    private_key = private_key.substring(0,64);
                }
                builder.setAmount(ByteString.copyFrom(StringUtils.StringHexToByteArray(amount)));
                builder.setNonce(ByteString.copyFrom(StringUtils.StringHexToByteArray(nonce)));
                builder.setGasLimit(ByteString.copyFrom(StringUtils.StringHexToByteArray(gasLimit)));
                builder.setGasPrice(ByteString.copyFrom(StringUtils.StringHexToByteArray(gasPrice)));
                builder.setToAddress(to);
                builder.setPrivateKey(ByteString.copyFrom(StringUtils.StringHexToByteArray(private_key)));

                if (transaction.hasKey("data")) {
                    // set data
                    String data = transaction.getString("data");
                    builder.setPayload(ByteString.copyFrom(StringUtils.StringHexToByteArray(data)));
                }


                Aion.SigningOutput output = AionSigner.sign(builder.build());

                String signature = Hex.toHexString(output.getSignature().toByteArray());
                String encoded = Hex.toHexString(output.getEncoded().toByteArray());


                WritableMap map = Arguments.createMap();
                map.putString("signature",  signature);
                map.putString("encoded",  encoded);
                promise.resolve(map);

            }catch (Exception e){
                promise.reject(E_INVALID_PARAM_ERROR,e.getMessage());
            }
        }else if(coinType == CoinType.BITCOIN.value()){
            // TODO: not implementation
            promise.reject(E_NOT_SUPPORT_ERROR," not implementation");
        }else if(coinType == CoinType.EOS.value()){
            // TODO: not implementation
            promise.reject(E_NOT_SUPPORT_ERROR," not implementation");
        }else if(coinType == CoinType.ETHEREUM.value()){
            try {
                Ethereum.SigningInput.Builder builder = Ethereum.SigningInput.newBuilder();
                String chainID = transaction.getString("chainID");
                String amount = transaction.getString("amount");
                String nonce = transaction.getString("nonce");
                String gasLimit = transaction.getString("gasLimit");
                String gasPrice = transaction.getString("gasPrice");
                String to = transaction.getString("to");
                String private_key = transaction.getString("private_key");
                if(private_key.startsWith("0x")){
                    private_key = private_key.substring(2);
                }
                if(private_key.length()>64){
                    private_key = private_key.substring(0,64);
                }

                builder.setChainId(ByteString.copyFrom(StringUtils.StringHexToByteArray(chainID)));
                builder.setAmount(ByteString.copyFrom(StringUtils.StringHexToByteArray(amount)));
                builder.setNonce(ByteString.copyFrom(StringUtils.StringHexToByteArray(nonce)));
                builder.setGasLimit(ByteString.copyFrom(StringUtils.StringHexToByteArray(gasLimit)));
                builder.setGasPrice(ByteString.copyFrom(StringUtils.StringHexToByteArray(gasPrice)));
                builder.setToAddress(to);

                if (transaction.hasKey("data")) {
                    // set data
                    String data = transaction.getString("data");
                    builder.setPayload(ByteString.copyFrom(StringUtils.StringHexToByteArray(data)));
                }

                builder.setPrivateKey(ByteString.copyFrom(StringUtils.StringHexToByteArray(private_key)));

                Ethereum.SigningOutput output = EthereumSigner.sign(builder.build());

                String encoded = Hex.toHexString(output.getEncoded().toByteArray());
                String v = Hex.toHexString(output.getV().toByteArray());
                String r = Hex.toHexString(output.getR().toByteArray());
                String s = Hex.toHexString(output.getS().toByteArray());


                WritableMap map = Arguments.createMap();
                map.putString("encoded",  encoded);
                map.putString("v",  v);
                map.putString("r",  r);
                map.putString("s",  s);
                promise.resolve(map);
            }catch (Exception e){
                promise.reject(E_INVALID_PARAM_ERROR,e.getMessage());
            }
        }else if(coinType == CoinType.LITECOIN.value()){
            // TODO: not implementation
            promise.reject(E_NOT_SUPPORT_ERROR," not implementation");
        }else if(coinType == CoinType.TRON.value()){
            // TODO: not implementation
            promise.reject(E_NOT_SUPPORT_ERROR," not implementation");
        } else {
            promise.reject(E_NOT_SUPPORT_ERROR,"not support this coin");
        }

    }

    @ReactMethod
    public void recoveKeyPairByPrivateKey(String private_key, int coinType, Promise promise){
        try{
            byte[] pkData = StringUtils.StringHexToByteArray(private_key);
            CoinType coin = CoinType.createFromValue(coinType);
            if (pkData.length>=32){
                pkData = Arrays.copyOfRange(pkData, 0, 32);
            }
            PrivateKey sk = new PrivateKey(pkData);
            PublicKey pk = getPublicKeyByCoin(sk,coin);
            WritableMap map = Arguments.createMap();
            String pkstr = Hex.toHexString(sk.data());
            if (coin == CoinType.AION){
                pkstr += Hex.toHexString(pk.data());
            }
            map.putString("private_key", pkstr);
            map.putString("public_key", Hex.toHexString(pk.data()));
            map.putString("address", coin.deriveAddress(sk));
            promise.resolve(map);

        }catch (Exception e){
            promise.reject(E_UNKNOWN_ERROR, e.getMessage());
        }
    }



    private PublicKey getPublicKeyByCoin(PrivateKey sk, CoinType coin){
        PublicKey pk = null;
        switch (coin){
            case AION:
            case IOST:
            case KIN:
            case NIMIQ:
            case STELLAR:
            case TEZOS:
                pk = sk.getPublicKeyEd25519();
                break;
            case BINANCE:
            case BITCOIN:
            case BITCOINCASH:
            case BRAVOCOIN:
            case COSMOS:
            case DASH:
            case DECRED:
            case DOGECOIN:
            case EOS:
            case GROESTLCOIN:
            case IOCOIN:
            case LITECOIN:
            case LUX:
            case NULS:
            case QTUM:
            case STEEM:
            case VIACOIN:
            case XRP:
            case ZCASH:
            case ZCOIN:
            case ZILLIQA:
                pk = sk.getPublicKeySecp256k1(true);
                break;
            case CALLISTO:
            case ETHEREUM:
            case ETHEREUMCLASSIC:
            case ETHERSOCIAL:
            case GOCHAIN:
            case ICON:
            case IOTEX:
            case POANETWORK:
            case THETA:
            case THUNDERTOKEN:
            case TOMOCHAIN:
            case TRON:
            case VECHAIN:
            case WANCHAIN:
            case XDAI:
                pk = sk.getPublicKeySecp256k1(false);
                break;
            case NEO:
            case ONTOLOGY:
                pk = sk.getPublicKeyNist256p1();
                break;
            case NANO:
                pk = sk.getPublicKeyEd25519Blake2b();
                break;
        }
        return pk;
    }

}