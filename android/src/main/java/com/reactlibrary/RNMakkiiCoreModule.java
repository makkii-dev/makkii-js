package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
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
import wallet.core.jni.P2PKHPrefix;
import wallet.core.jni.AionAddress;
import wallet.core.jni.BitcoinAddress;
import wallet.core.jni.EthereumAddress;
import wallet.core.jni.EOSAddress;
import wallet.core.jni.TronAddress;


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
    public void getKey(int coinType, int account, int change, int address, boolean testnet, Promise promise){
        try {
            CoinType coin = CoinType.createFromValue(coinType);
            PrivateKey sk = wallet.getKeyBIP44(coin, account, change, address);
            PublicKey pk = getPublicKeyByCoin(sk,coin);
            WritableMap map = Arguments.createMap();
            String pkstr = Hex.toHexString(sk.data());
            if (coin == CoinType.AION){
                pkstr += Hex.toHexString(pk.data());
            }
            String addr = coin.deriveAddress(sk);
            if(coinType == CoinType.BITCOIN.value()){
                if(!testnet){
                    addr = new BitcoinAddress(pk,P2PKHPrefix.BITCOIN.value()).description();
                }else {
                    addr = new BitcoinAddress(pk,(byte)111).description();
                }
            }else if(coinType == CoinType.LITECOIN.value()){
                if(!testnet){
                    addr = new BitcoinAddress(pk,P2PKHPrefix.LITECOIN.value()).description();
                }else {
                    addr = new BitcoinAddress(pk,(byte)111).description();
                }
            }
            map.putString("private_key", pkstr);
            map.putString("public_key", Hex.toHexString(pk.data()));
            map.putString("address", addr);
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
        } else if (coinType == CoinType.TRON.value()) {
            /**
             *  transaction param
             *  {
             *      "timestamp" : 1558600764000,
             *      "expiration" : 155860090000,
             *      "to_address": "THTR75o8xXAgCTQqpiot2AFRAjvW1tSbVV",
             *      "owner_address": "TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC",
             *      "private_key" : "2d8f68944bdbfbc0769542fba8fc2d2a3de67393334471624364c7006da2aa54",
             *      "block_header": {
             * 	        "raw_data": {
             * 		        "number": 4250147,
             * 		        "txTrieRoot": "2d87f97cdd3bb7fd3211a2802e6b3642daaa945616a6eba86869a09c9b1747d8",
             * 		        "witness_address": "41928c9af0651632157ef27a2cf17ca72c575a4d21",
             * 		        "parentHash": "000000000040da221fdfca1d52f8bc935161f7a4525d3bc2bffdc6cc8aa4824b",
             * 		        "version": 7,
             * 		        "timestamp": 1558600764000
             *          },
             * 	        "witness_signature": "15dcd1da5576affbc282898321aa291340472c8c662c5cc4a6278afef8ab135659a32f5a59f5c08b488f8aa8a8262cf42f05d8aa95e0cc42dcdda13de24bd31700"
             *      }
             *  }
             *
             *  return
             *  {
             *      "signature" : ["97c825b41c77de2a8bd65b3df55cd4c0df59c307c0187e42321dcc1cc455ddba583dd9502e17cfec5945b34cad0511985a6165999092a6dec84c2bdd97e649fc01"]
             *      "txID": "454f156bf1256587ff6ccdbc56e64ad0c51e4f8efea5490dcbc720ee606bc7b8"
             *      "ref_block_bytes": "267e"
             *      "ref_block_hash": "9a447d222e8de9f2"
             *
             *  }
             */
            try {
                ReadableMap block_header = transaction.getMap("block_header");
                ReadableMap raw_data = block_header.getMap("raw_data");

                Tron.BlockHeader.Builder header = Tron.BlockHeader.newBuilder()
                        .setNumber(Long.parseLong(raw_data.getString("number")))
                        .setParentHash(ByteString.copyFrom(StringUtils.StringHexToByteArray(raw_data.getString("parentHash"))))
                        .setTimestamp(Long.parseLong(raw_data.getString("timestamp")))
                        .setVersion(raw_data.getInt("version"))
                        .setTxTrieRoot(ByteString.copyFrom(StringUtils.StringHexToByteArray(raw_data.getString("txTrieRoot"))))
                        .setWitnessAddress(ByteString.copyFrom(StringUtils.StringHexToByteArray(raw_data.getString("witness_address"))));


                Tron.TransferContract.Builder contract = Tron.TransferContract.newBuilder()
                        .setAmount(Long.parseLong(transaction.getString("amount")))
                        .setOwnerAddress(transaction.getString("owner_address"))
                        .setToAddress(transaction.getString("to_address"));

                Tron.Transaction.Builder tx = Tron.Transaction.newBuilder()
                        .setBlockHeader(header.build())
                        .setTimestamp(Long.parseLong(transaction.getString("timestamp")))
                        .setExpiration(Long.parseLong(transaction.getString("expiration")))
                        .setTransfer(contract.build());

                Tron.SigningInput.Builder builder = Tron.SigningInput.newBuilder()
                        .setTransaction(tx.build())
                        .setPrivateKey(ByteString.copyFrom(StringUtils.StringHexToByteArray(transaction.getString("private_key"))));
                Tron.SigningOutput output = TronSigner.sign(builder.build());
                WritableArray signature = Arguments.createArray();
                signature.pushString(Hex.toHexString(output.getSignature().toByteArray()));
                WritableMap map = Arguments.createMap();
                map.putArray("signature", signature);
                map.putString("txID", Hex.toHexString(output.getId().toByteArray()));
                map.putString("ref_block_bytes", Hex.toHexString(output.getRefBlockBytes().toByteArray()));
                map.putString("ref_block_hash", Hex.toHexString(output.getRefBlockHash().toByteArray()));
                promise.resolve(map);
            }catch (Exception e){
                promise.reject(E_INVALID_PARAM_ERROR,e.getMessage());
            }

        } else {
            promise.reject(E_NOT_SUPPORT_ERROR,"not support this coin");
        }

    }

    @ReactMethod
    public void recoverKeyPairByPrivateKey(String private_key, int coinType, boolean testnet, Promise promise){
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
            String address = coin.deriveAddress(sk);
            if(coinType == CoinType.BITCOIN.value()){
                if(!testnet){
                    address = new BitcoinAddress(pk,P2PKHPrefix.BITCOIN.value()).description();
                }else {
                    address = new BitcoinAddress(pk,(byte)111).description();
                }
            }else if(coinType == CoinType.LITECOIN.value()){
                if(!testnet){
                    address = new BitcoinAddress(pk,P2PKHPrefix.LITECOIN.value()).description();
                }else {
                    address = new BitcoinAddress(pk,(byte)111).description();
                }
            }
            map.putString("private_key", pkstr);
            map.putString("public_key", Hex.toHexString(pk.data()));
            map.putString("address", address);
            promise.resolve(map);

        }catch (Exception e){
            promise.reject(E_UNKNOWN_ERROR, e.getMessage());
        }
    }

    @ReactMethod
    public void validateAddress(String address, int coinType, Promise promise){
        if(coinType == CoinType.AION.value()){
            promise.resolve(AionAddress.isValidString(address));
        }else if(coinType == CoinType.BITCOIN.value() || coinType == CoinType.LITECOIN.value()) {
            promise.resolve(BitcoinAddress.isValidString(address));
        }else if(coinType == CoinType.EOS.value()){
            promise.resolve(EOSAddress.isValidString(address));
        }else if(coinType == CoinType.ETHEREUM.value()){
            promise.resolve(EthereumAddress.isValidString(address));
        }else if(coinType == CoinType.TRON.value()){
            promise.resolve(TronAddress.isValidString(address));
        }else {
            promise.reject(E_NOT_SUPPORT_ERROR, "not support this cointype");
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