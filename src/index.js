const express = require("express");
const verification = require("./verification");
const webhook = require("./webhook");

const fbmWebhook = ({
  path = "/",
  verifyToken = process.env.FB_VERIFY_TOKEN
} = {}) => {
  const app = express();

  app.use(path, verification(verifyToken));
  app.use(path, webhook(app));

  return app;
};

module.exports = fbmWebhook;
