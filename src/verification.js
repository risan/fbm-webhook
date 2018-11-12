const express = require("express");
const get = require("lodash/get");
const has = require("lodash/has");

/**
 * Get webhook verification middleware.
 *
 * @param {String} token
 * @return {Router}
 */
const verification = (token = process.env.FB_VERIFY_TOKEN) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    const { query } = req;

    if (get(query, ["hub.mode"]) !== "subscribe") {
      return res.status(422).send("Invalid hub.mode.");
    }

    if (get(query, ["hub.verify_token"]) !== token) {
      return res.status(403).send("Invalid hub.verify_token.");
    }

    res.status(200).send(get(query, ["hub.challenge"]));
  });

  return router;
};

module.exports = verification;
