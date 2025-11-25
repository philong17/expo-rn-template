const path = require('path');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/** @type {import('metro-config').ConfigT} */
const config = getSentryExpoConfig(__dirname);

// Path aliases to mirror tsconfig.json paths
config.resolver = config.resolver || {};
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  '@': path.join(__dirname, 'src'),
  '@features': path.join(__dirname, 'src', 'features'),
  '@shared': path.join(__dirname, 'src', 'shared'),
  '@assets': path.join(__dirname, 'src', 'shared', 'assets'),
};

module.exports = config;
