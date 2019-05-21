Pod::Spec.new do |s|
  s.name         = 'TrustWalletCore'
  s.version      = '0.10.0'
  s.summary      = 'Trust Wallet core data structures and algorithms.'
  s.homepage     = 'https://github.com/TrustWallet/wallet-core'
  s.license      = 'MIT'
  s.authors      = { 'Alejandro Isaza' => 'al@isaza.ca' }

  s.ios.deployment_target = '10.0'
  s.osx.deployment_target = '10.12'
  s.swift_version = '5.0'

  s.source = {
    :git=>"https://github.com/chaion/lib-ios-makkii-core.git",
  }
  s.preserve_paths = 'build/ios/*.a'
  s.vendored_libraries =
    'build/ios/libprotobuf.a',
    'build/ios/libTrezorCrypto.a',
    'build/ios/libTrustWalletCore.a'
  s.source_files =
    'include/**/*.h',
    'swift/Sources/**/*.{swift,h,m,cpp}'
  s.public_header_files =
    'include/**/*.h',
    'swift/Sources/*.h'
  s.libraries = 'c++'
  s.xcconfig = {
    'SYSTEM_HEADER_SEARCH_PATHS' => '$(inherited) ${PODS_ROOT}/TrustWalletCore/include',
    'OTHER_LDFLAGS' => '$(inherited) -fprofile-instr-generate'
  }
  s.pod_target_xcconfig = {
    'ARCHS[sdk=iphonesimulator*]' => '$(ARCHS_STANDARD_64_BIT)'
  }
  s.dependency 'SwiftProtobuf', '~> 1.3.0'
end
