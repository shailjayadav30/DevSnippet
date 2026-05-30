// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Resolve the Node built-in `punycode` (used by markdown-it → react-native-markdown-display)
// to the standalone npm package which works in React Native.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  punycode: path.resolve(__dirname, "node_modules/punycode"),
};

module.exports = config;
