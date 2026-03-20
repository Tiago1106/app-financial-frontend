module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias: {
            '@': './',
            '@src': './src',
            '@config': './src/config',
            '@i18n': './src/i18n',
            '@components': './src/components',
            '@constants': './src/constants',
            '@providers': './src/providers',
            '@services': './src/services',
            '@theme': './src/theme',
            '@ui': './src/ui',
          },
        },
      ],
    ],
  };
};
