/* global test:false, expect:false */
const getEventType = require("../src/get-event-type");

test("it can detect message event", () => {
  expect(getEventType({
    message: true
  })).toBe("message");
});

test("it can detect echo event", () => {
  expect(getEventType({
    message: { is_echo: true }
  })).toBe("echo");
});

test("it can detect checkout-update event", () => {
  expect(getEventType({
    checkout_update: true
  })).toBe("checkout-update");
});

test("it can detect delivered event", () => {
  expect(getEventType({
    delivery: true
  })).toBe("delivered");
});

test("it can detect game-play event", () => {
  expect(getEventType({
    game_play: true
  })).toBe("game-play");
});

test("it can detect optin event", () => {
  expect(getEventType({
    optin: true
  })).toBe("optin");
});

test("it can detect payment event", () => {
  expect(getEventType({
    payment: true
  })).toBe("payment");
});

test("it can detect policy-enforcement event", () => {
  expect(getEventType({
    "policy-enforcement": true
  })).toBe("policy-enforcement");
});

test("it can detect postback event", () => {
  expect(getEventType({
    postback: true
  })).toBe("postback");
});

test("it can detect pre-checkout event", () => {
  expect(getEventType({
    pre_checkout: true
  })).toBe("pre-checkout");
});

test("it can detect read event", () => {
  expect(getEventType({
    read: true
  })).toBe("read");
});

test("it can detect referral event", () => {
  expect(getEventType({
    referral: true
  })).toBe("referral");
});

test("it can detect standby event", () => {
  expect(getEventType({
    standby: true
  })).toBe("standby");
});

test("it can detect handover.app-roles event", () => {
  expect(getEventType({
    app_roles: true
  })).toBe("handover.app-roles");
});

test("it can detect handover.pass-thread-control event", () => {
  expect(getEventType({
    pass_thread_control: true
  })).toBe("handover.pass-thread-control");
});

test("it can detect handover.take-thread-control event", () => {
  expect(getEventType({
    take_thread_control: true
  })).toBe("handover.take-thread-control");
});

test("it can detect handover.request-thread-control event", () => {
  expect(getEventType({
    request_thread_control: true
  })).toBe("handover.request-thread-control");
});

test("it can detect unknown event", () => {
  expect(getEventType({
    foo: true
  })).toBe("unknown");
});
