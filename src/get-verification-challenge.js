const get = require("lodash/get");
const has = require("lodash/has");

/**
 * Get webhook verification challenge.
 *
 * @param {Object} req
 * @param {String} token
 * @return {String}
 */
const getVerificationChallenge = (req, token) => {
  if (get(req, ["query", "hub.mode"]) !== "subscribe") {
    throw new Error("Invalid hub.mode.");
  }

  if (get(req, ["query", "hub.verify_token"]) !== token) {
    throw new Error("Invalid hub.verify_token.");
  }

  if (!has(req, ["query", "hub.challenge"])) {
    throw new Error("hub.challenge is missing");
  }

  return get(req, ["query", "hub.challenge"]);
};

module.exports = getVerificationChallenge;
