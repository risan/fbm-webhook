const get = require("lodash/get");
const has = require("lodash/has");

/**
 * Get event type.
 *
 * @param {Object} event
 * @return {String}
 */
const getEventType = event => {
  if (has(event, "message")) {
    return get(event, "message.is_echo") ? "echo" : "message";
  }

  if (has(event, "account_linking")) {
    return "account-linking";
  }

  if (has(event, "checkout_update")) {
    return "checkout-update";
  }

  if (has(event, "delivery")) {
    return "delivered";
  }

  if (has(event, "game_play")) {
    return "game-play";
  }

  if (has(event, "optin")) {
    return "optin";
  }

  if (has(event, "payment")) {
    return "payment";
  }

  if (has(event, "policy-enforcement")) {
    return "policy-enforcement";
  }

  if (has(event, "postback")) {
    return "postback";
  }

  if (has(event, "pre_checkout")) {
    return "pre-checkout";
  }

  if (has(event, "read")) {
    return "read";
  }

  if (has(event, "referral")) {
    return "referral";
  }

  if (has(event, "standby")) {
    return "standby";
  }

  // Handover events.
  if (has(event, "app_roles")) {
    return "handover.app-roles";
  }

  if (has(event, "pass_thread_control")) {
    return "handover.pass-thread-control";
  }

  if (has(event, "take_thread_control")) {
    return "handover.take-thread-control";
  }

  if (has(event, "request_thread_control")) {
    return "handover.request-thread-control";
  }

  return "unknown";
};

module.exports = getEventType;
