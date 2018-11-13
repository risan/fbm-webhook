const has = require("lodash/has");
const sha1 = require("./sha1");

const SIGNATURE_PATTERN = /^sha1=(.*)/i;

/**
 * Get request signature verifier.
 *
 * @param {String} secret
 * @return {Function}
 */
const verifySignature = secret => (req, res, buf) => {
  if (!has(req.headers, "x-hub-signature")) {
    throw new Error("No request signature found.");
  }

  const matches = req.headers["x-hub-signature"].match(SIGNATURE_PATTERN);

  if (!Array.isArray(matches) || matches.length < 2) {
    throw new Error("No request signature found.");
  }

  if (matches[1] !== sha1(buf, secret)) {
    throw new Error("Invalid request signature.");
  }
};

module.exports = verifySignature;
