module.exports = function (api) {
  api.cache(true);

  const presets = ["@babel/preset-env"];
  const plugins = ["@babel/transform-runtime"];

  return {
    presets,
    plugins
  };
};