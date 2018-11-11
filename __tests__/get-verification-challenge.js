/* global test:false, expect:false */
const getChallenge = require("../src/get-verification-challenge");

test("it can get webhook verification challenge", () => {
  expect(
    getChallenge(
      {
        query: {
          "hub.mode": "subscribe",
          "hub.verify_token": "secret",
          "hub.challenge": "accepted"
        }
      },
      "secret"
    )
  ).toBe("accepted");
});

test("it throws error if hub.mode is not subscribe", () => {
  expect(() =>
    getChallenge({
      query: {
        "hub.mode": "foo"
      }
    })
  ).toThrow(/mode/i);
});

test("it throws error if hub.verify_token does not match", () => {
  expect(() =>
    getChallenge(
      {
        query: {
          "hub.mode": "subscribe",
          "hub.verify_token": "secret"
        }
      },
      "foo"
    )
  ).toThrow(/token/i);
});

test("it throws error if hub.challenge is missing", () => {
  expect(() =>
    getChallenge(
      {
        query: {
          "hub.mode": "subscribe",
          "hub.verify_token": "secret"
        }
      },
      "secret"
    )
  ).toThrow(/challenge/i);
});
