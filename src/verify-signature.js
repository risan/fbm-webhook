const get = require("lodash/get");
const sha1 = require("./sha1");

const SIGNATURE_PATTERN = /^sha1=(.*)/i;

/**
 * Get signature from request.
 *
 * @param {Object} req
 * @return {String|Null}
 */
const getSignature = req => {
  const value = get(req.headers, "x-hub-signature");

  if (!value) {
    return null;
  }

  const matches = value.match(SIGNATURE_PATTERN);

  if (!Array.isArray(matches) || matches.length < 2) {
    return null;
  }

  return matches[1];
};

/**
 * Get request signature verifier.
 *
 * @param {String} secret
 * @return {Function}
 */
const verifySignature = secret => (req, res, buf) => {
  const signature = getSignature(req);

  if (signature === null) {
    throw new Error("No request signature found.");
  }

  if (signature !== sha1(buf, secret)) {
    throw new Error("Invalid request signature.");
  }
};

module.exports = verifySignature;
