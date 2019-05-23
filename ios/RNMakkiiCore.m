#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNMakkiiCore, NSObject)
RCT_EXTERN_METHOD(createByMnemonic:(NSString *)mnemonic passphrase:(NSString *)passphrase)
RCT_EXTERN_METHOD(generateMnemonic:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getKey:(nonnull NSNumber *)coinType account:(nonnull NSNumber *)path1 change:(nonnull NSNumber *)path2 address:(nonnull NSNumber *)path3 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(recoverKeyPairByPrivateKey:(NSString*)privatekey coinType:(nonnull NSNumber *)coin reslover:(RCTPromiseResolveBlock)reslove rejecter:(RCTPromiseReject)reject)
RCT_EXTERN_METHOD(sign:(NSString *)hash privatekey:(NSString *)privateKey coinType:(nonnull NSNumber *)coin reslover:(RCTPromiseResolveBlock)reslove rejecter:(RCTPromiseReject)reject)
RCT_EXTERN_METHOD(signTransaction:(NSDictionary *)transaction privatekey:(NSString *)privateKey coinType:(nonnull NSNumber *)coin reslover:(RCTPromiseResolveBlock)reslove rejecter:(RCTPromiseReject)reject)

@end
