module.exports = {
    readme: 'README.md',
    includes: 'packages',
    exclude: [
        'html/**',
        "packages/**/__tests__/*",
        'packages/**/lib/**',
        'packages/**/src/lib_api/*.js',
        'packages/**/src/lib_keystore/*.js',
        '**/babel.config.js'
    ],
    ignoreCompilerErrors: true,
    out:'./html',
    mode: 'file',
    excludeNotExported: true,
    excludePrivate: true,
    hideGenerator: true
};