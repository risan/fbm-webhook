const express = require("express");
const bodyParser = require("body-parser");
const get = require("lodash/get");

const getEventType = require("./get-event-type");
const verifySignature = require("./verify-signature");

/**
 * Get webhook middleware.
 *
 * @param {String} options.appSecret
 * @param {EventEmitter} options.emitter }
 * @return {Router}
 */
const webhook = ({ appSecret = process.env.FB_APP_SECRET, emitter } = {}) => {
  const router = express.Router();

  if (appSecret) {
    router.use(bodyParser.json({ verify: verifySignature(appSecret) }));
  } else {
    router.use(bodyParser.json());
  }

  const emit = (event, ...args) =>
    emitter ? emitter.emit(event, ...args) : null;

  router.post("/", (req, res) => {
    const { body } = req;

    if (body.object !== "page") {
      return res.status(422).send("Invalid webhook payload.");
    }

    const entries = Array.isArray(body.entry) ? body.entry : [];

    entries.forEach(entry => {
      const event = get(entry, "messaging[0]");

      if (typeof event !== "object") {
        return;
      }

      event.type = getEventType(event);

      emit(event.type, event);
      emit("data", event);
    });

    return res.status(200).send("Webhook received.");
  });

  return router;
};

module.exports = webhook;
