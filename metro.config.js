const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const assetExts = defaultConfig.resolver.assetExts.includes('gif')
  ? defaultConfig.resolver.assetExts
  : [...defaultConfig.resolver.assetExts, 'gif'];

const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    assetExts,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);