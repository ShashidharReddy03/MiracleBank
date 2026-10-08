const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');

if (!assetExts.includes('gif')) {
  assetExts.push('gif');
}

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts,
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
