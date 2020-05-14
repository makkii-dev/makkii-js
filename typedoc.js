const packageJson = require("./package");

module.exports = {
    readme: "README.md",
    name: `${packageJson.name} v${packageJson.version}`,
    includes: "packages",
    exclude: [
        "html/**",
        "packages/**/__tests__/*",
        "packages/**/lib/**",
        "packages/**/src/lib_api/*.js",
        "packages/**/src/lib_keystore/*.js",
        "packages/makkii-utils",
        "**/babel.config.js"
    ],
    toc: [
        "IApiClient",
        "IkeystoreClient",
        "IHardware",
        "IkeystoreSigner",
        "ApiClient",
        "KeystoreClient",
        "AionApiClient",
        "AionKeystoreClient",
        "AionLedger",
        "AionLocalSigner",
        "BtcApiClient",
        "BtcKeystoreClient",
        "BtcLedger",
        "BtcLocalSigner",
        "EthApiClient",
        "EthKeystoreClient",
        "EthLedger",
        "EthLocalSinger",
        "TronApiClient",
        "TronKeystoreClient",
        "TronLocalSigner"
    ],
    categorizeByGroup: true,
    categoryOrder: [
        "Api Client",
        "Keystore Client",
        "Api",
        "Keystore",
        "Hardware",
        "*"
    ],
    ignoreCompilerErrors: true,
    out: "./html",
    mode: "file",
    excludeNotExported: true,
    excludePrivate: true,
    excludeExternals: true,
    hideGenerator: true
};
