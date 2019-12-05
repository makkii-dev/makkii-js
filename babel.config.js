module.exports = api => {
    api.cache(true);

    const presets = ["@babel/preset-env"];
    const plugins = ["@babel/transform-runtime", "transform-remove-console"];

    return {
        presets,
        plugins
    };
};
