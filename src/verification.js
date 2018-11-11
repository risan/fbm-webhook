const express = require("express");
const getChallenge = require("./get-verification-challenge");

/**
 * Get webhook verification middleware.
 *
 * @param {String} token
 * @return {Router}
 */
const verification = (token = process.env.FB_VERIFY_TOKEN) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    try {
      const challenge = getChallenge(req, token);
      res.status(200).send(challenge);
    } catch (error) {
      res.status(403).send("Forbidden");
    }
  });

  return router;
};

module.exports = verification;
