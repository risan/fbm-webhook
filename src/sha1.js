const crypto = require("crypto");

/**
 * Create sha-1 hash.
 *
 * @param {String|Buffer} data
 * @param {String} secret
 * @return {String}
 */
const sha1 = (data, secret) =>
  crypto
    .createHmac("sha1", secret)
    .update(data)
    .digest("hex");

module.exports = sha1;
