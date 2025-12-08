const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  webpack: (config, options) => {
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'training',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './Training': './src/components/Training',
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

