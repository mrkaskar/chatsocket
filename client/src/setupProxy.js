const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api", "/auth/google", "/auth/facebook"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};
