const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path alias resolution
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src')
};

// Ensure proper asset handling
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'db',
  'mp3',
  'ttf',
  'obj',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp'
].filter(ext => ext !== 'svg');

// Add SVG support if needed
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'svg',
  'cjs'
];

// Disable minification in development for better error messages
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_keys: true,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: true,
  },
};

module.exports = config;
