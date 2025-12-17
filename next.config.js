const NextFederationPlugin = require('@module-federation/nextjs-mf');
const path = require('path');

module.exports = {
  webpack: (config, options) => {
    const { isServer } = options;
    
    // Add alias for @/ to point to src/
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    config.plugins.push(
      new NextFederationPlugin({
        name: 'training_ui',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './Training': './pages/Training',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
          },
        },
      })
    );
    return config;
  },
};

