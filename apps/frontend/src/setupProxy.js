const { createProxyMiddleware } = require('http-proxy-middleware');

// default gateway port
const DEFAULT_GATEWAY = 'http://localhost:4100';

module.exports = function (app) {
  app.use(
    '/gateway',
    createProxyMiddleware({
      target: process.env.REACT_GATEWAY_PROXY || DEFAULT_GATEWAY,
      changeOrigin: true,
    })
  );
};
