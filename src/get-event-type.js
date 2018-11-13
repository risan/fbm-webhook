const get = require("lodash/get");
const has = require("lodash/has");

/**
 * Get event type.
 *
 * @param {Object} event
 * @return {String}
 */
const getEventType = event => {
  let type = "unknown";

  if (has(event, "message")) {
    type = get(event, "message.is_echo") ? "echo" : "message";
  } else if (has(event, "account_linking")) {
    type = "account-linking";
  } else if (has(event, "checkout_update")) {
    type = "checkout-update";
  } else if (has(event, "delivery")) {
    type = "delivered";
  } else if (has(event, "game_play")) {
    type = "game-play";
  } else if (has(event, "optin")) {
    type = "optin";
  } else if (has(event, "payment")) {
    type = "payment";
  } else if (has(event, "policy-enforcement")) {
    type = "policy-enforcement";
  } else if (has(event, "postback")) {
    type = "postback";
  } else if (has(event, "pre_checkout")) {
    type = "pre-checkout";
  } else if (has(event, "read")) {
    type = "read";
  } else if (has(event, "referral")) {
    type = "referral";
  } else if (has(event, "standby")) {
    type = "standby";
  } else if (has(event, "app_roles")) {
    type = "handover.app-roles";
  } else if (has(event, "pass_thread_control")) {
    type = "handover.pass-thread-control";
  } else if (has(event, "take_thread_control")) {
    type = "handover.take-thread-control";
  } else if (has(event, "request_thread_control")) {
    type = "handover.request-thread-control";
  }

  return type;
};

module.exports = getEventType;
