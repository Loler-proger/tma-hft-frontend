const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devServer: (devServerConfig) => {
    // Удаляем устаревшие опции
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;

    // Добавляем новую опцию setupMiddlewares
    devServerConfig.setupMiddlewares = (middlewares) => {
      return middlewares;
    };

    return devServerConfig;
  },
};