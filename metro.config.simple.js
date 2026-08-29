const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Completely disable asset processing to fix MIME error
config.resolver.assetExts = [];
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Disable all transformers
config.transformer = {
  assetPlugins: [],
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

// Disable custom serializer
config.serializer.customSerializer = null;

module.exports = config;
