package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
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

import org.json.JSONArray;
import org.json.JSONObject;

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
    public void createByMnemonic(String mnemonic,  String passphrase){
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
                String timestamp = transaction.getString("timestamp");
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
                builder.setTimestamp(ByteString.copyFrom(StringUtils.StringHexToByteArray(timestamp)));
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
        }else if(coinType == CoinType.BITCOIN.value()||coinType == CoinType.LITECOIN.value()){
            try {
                String amount = transaction.getString("amount");
                String to_address = transaction.getString("to_address");
                String change_address = transaction.getString("change_address");
                Bitcoin.SigningInput.Builder signerBuilder = Bitcoin.SigningInput.newBuilder()
                        .setAmount(Long.parseLong(amount))
                        .setHashType(transaction.getInt("hash_type"))
                        .setToAddress(to_address)
                        .setChangeAddress(change_address)
                        .setByteFee(transaction.getInt("byte_fee"));
                ReadableArray utxos = transaction.getArray("utxos");
                for (int i = 0; i < utxos.size(); i++) {
                    ReadableMap utxo = utxos.getMap(i);
                    signerBuilder.addPrivateKey(ByteString.copyFrom(StringUtils.StringHexToByteArray(utxo.getString("private_key"))));
                    signerBuilder.addUtxo(Bitcoin.UnspentTransaction.newBuilder()
                            .setAmount(Long.parseLong(utxo.getString("amount")))
                            .setScript(ByteString.copyFrom(StringUtils.StringHexToByteArray(utxo.getString("script"))))
                            .setOutPoint(Bitcoin.OutPoint.newBuilder()
                                    .setHash(ByteString.copyFrom(StringUtils.StringHexToByteArray(utxo.getString("hash"))))
                                    .setIndex(i)
                                    .setSequence(Integer.MAX_VALUE)
                                    .build())
                            .build());
                }
                BitcoinTransactionSigner singer = new BitcoinTransactionSigner(signerBuilder.build());
                Common.Result result = singer.sign();
                if (!result.getSuccess()) {
                    promise.reject(E_INVALID_PARAM_ERROR, result.getError());
                } else {
                    Bitcoin.SigningOutput output = result.getObjects(0).unpack(Bitcoin.SigningOutput.class);
                    WritableMap map = Arguments.createMap();
                    String encoded = Hex.toHexString(output.getEncoded().toByteArray());
                    map.putString("encoded", encoded);
                    promise.resolve(map);
                }
            }catch (Exception e){
                promise.reject(E_INVALID_PARAM_ERROR,e.getMessage());
            }
        }else if(coinType == CoinType.EOS.value()){
            try {
                String chainId = transaction.getString("chaionID");
                String referenceBlockId = transaction.getString("referenceBlockId");
                String referenceBlockTime = transaction.getString("referenceBlockTime");
                String currency = transaction.getString("currency");
                String sender = transaction.getString("from");
                String recipient = transaction.getString("to");
                String memo = transaction.getString("memo");
                ReadableMap asset = transaction.getMap("asset");
                String private_key = transaction.getString("private_key");
                String private_key_type = transaction.getString("private_key_type");
                EOS.Asset.Builder assetBuilder = EOS.Asset.newBuilder()
                        .setAmount(Long.parseLong(asset.getString("amount")))
                        .setDecimals(asset.getInt("decimals"))
                        .setSymbol(asset.getString("symbol"));
                EOS.SigningInput.Builder builder = EOS.SigningInput.newBuilder()
                        .setChainId(ByteString.copyFrom(StringUtils.StringHexToByteArray(chainId)))
                        .setReferenceBlockId(ByteString.copyFrom(StringUtils.StringHexToByteArray(referenceBlockId)))
                        .setReferenceBlockTime(Integer.parseInt(referenceBlockTime))
                        .setCurrency(currency)
                        .setSender(sender)
                        .setRecipient(recipient)
                        .setMemo(memo)
                        .setAsset(assetBuilder)
                        .setPrivateKey(ByteString.copyFrom(StringUtils.StringHexToByteArray(private_key)))
                        .setPrivateKeyType(EOS.KeyType.valueOf(Integer.parseInt(private_key_type)));
                Common.Result result = EOSSigner.sign(builder.build());
                if(!result.getSuccess()){
                    promise.reject(E_INVALID_PARAM_ERROR,result.getError());
                }else{
                    EOS.SigningOutput output = result.getObjects(0).unpack(EOS.SigningOutput.class);
                    JSONObject jsonObject = new JSONObject(output.getJsonEncoded());
                    JSONArray signatures = jsonObject.getJSONArray("signatures");
                    String signature = signatures.getString(0);
                    WritableMap map = Arguments.createMap();
                    map.putString("jsonEncoded",output.getJsonEncoded());
                    map.putString("signature",signature);
                    promise.resolve(map);
                }
            } catch (Exception e){
                promise.reject(E_INVALID_PARAM_ERROR,e.getMessage());
            }
        } else if (coinType == CoinType.ETHEREUM.value()) {
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
        } else {
            promise.reject(E_NOT_SUPPORT_ERROR,"not support this coin");
        }

    }

    @ReactMethod
    public void recoverKeyPairByPrivateKey(String private_key, int coinType, Promise promise){
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
                pk = sk.getPublicKeyEd25519();
                break;
            case BITCOIN:
            case EOS:
            case LITECOIN:
                pk = sk.getPublicKeySecp256k1(true);
                break;
            case ETHEREUM:
            case TRON:
                pk = sk.getPublicKeySecp256k1(false);
                break;
                default:
                    throw new Error("unsppourt cointype");
        }
        return pk;
    }

}