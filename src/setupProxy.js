const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api-hackathon.hysterchat.com',
      changeOrigin: true,
    })
  );
};
