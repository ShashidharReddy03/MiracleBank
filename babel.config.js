module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    '@babel/plugin-transform-export-namespace-from',

    [
      'module-resolver',
      {
        root: ['./src'],

        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.native.js',
        ],

        alias: {
          '@core': './src/core',
          '@security': './src/security',
          '@ui': './src/ui-kit',
          '@networking': './src/networking',
          '@notifications': './src/notifications',
          '@store': './src/store',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@config': './src/config',
          '@theme': './src/theme',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@app-types': './src/types',
        },
      },
    ],

    'react-native-reanimated/plugin',
  ]
};