const get = require("lodash/get");
const has = require("lodash/has");

const propertyToEventType = {
  message: "message",
  account_linking: "account-linking",
  checkout_update: "checkout-update",
  delivery: "delivered",
  game_play: "game-play",
  optin: "optin",
  payment: "payment",
  "policy-enforcement": "policy-enforcement",
  postback: "postback",
  pre_checkout: "pre-checkout",
  read: "read",
  referral: "referral",
  standby: "standby",
  app_roles: "handover.app-roles",
  pass_thread_control: "handover.pass-thread-control",
  take_thread_control: "handover.take-thread-control",
  request_thread_control: "handover.request-thread-control"
};

/**
 * Get match event type.
 *
 * @param {Object} event
 * @return {String}
 */
const getMatchEventType = event => {
  const props = Object.keys(propertyToEventType);

  for (let i = 0; i < props.length; i += 1) {
    if (has(event, props[i])) {
      return propertyToEventType[props[i]];
    }
  }

  return "unknown";
};

/**
 * Get event type.
 *
 * @param {Object} event
 * @return {String}
 */
const getEventType = event => {
  let type = getMatchEventType(event);

  if (get(event, "message.is_echo")) {
    type = "echo";
  }

  return type;
};

module.exports = getEventType;
