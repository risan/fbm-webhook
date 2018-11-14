/* global jest: false, test:false, expect:false */
const express = require("express");

const fbmWebhook = require("../src");
const verification = require("../src/verification");
const webhook = require("../src/webhook");

jest.mock("express");
jest.mock("../src/verification");
jest.mock("../src/webhook");

test("it add verification and webhook middlewares", () => {
  const app = { use: jest.fn() };

  express.mockReturnValue(app);
  verification.mockReturnValue("verification");
  webhook.mockReturnValue("webhook");

  fbmWebhook({ path: "/webhook", appSecret: "secret", verifyToken: "mytoken" });

  expect(express).toHaveBeenCalledTimes(1);
  expect(verification).toHaveBeenCalledWith("mytoken");
  expect(webhook).toHaveBeenCalledWith({ appSecret: "secret", emitter: app });

  expect(app.use).toHaveBeenCalledTimes(2);
  expect(app.use).toHaveBeenNthCalledWith(1, "/webhook", "verification");
  expect(app.use).toHaveBeenNthCalledWith(2, "/webhook", "webhook");
});
