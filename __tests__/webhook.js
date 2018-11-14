/* global jest:false, test:false, expect:false */
const express = require("express");
const request = require("supertest");
const webhook = require("../src/webhook");
const sha1 = require("../src/sha1");

jest.mock("../src/sha1");

const app = express();

const emitter = {
  emit: jest.fn()
};

app.use("/", webhook({ appSecret: "secret", emitter }));

const sendRequest = async (body, signature = "secret") => {
  sha1.mockReturnValue("secret");

  return request(app)
    .post("/")
    .set("x-hub-signature", `sha1=${signature}`)
    .send(body);
};

test("it responds with HTTP 403 if signature is invalid", async () => {
  const response = await sendRequest({ object: "page" }, "invalid");

  expect(response.statusCode).toBe(403);
});

test("it responds with HTTP 422 if object is not page", async () => {
  const response = await sendRequest({ object: "foo" });

  expect(response.statusCode).toBe(422);
  expect(response.text).toMatch(/invalid/i);
});

test("it responds with HTTP 200 if object is page", async () => {
  const response = await sendRequest({ object: "page" });

  expect(response.statusCode).toBe(200);
});

test("it emits the correct webhook event", async () => {
  const messageEvent = { message: true };

  const response = await sendRequest({
    object: "page",
    entry: [{ messaging: [messageEvent] }]
  });

  expect(emitter.emit).toHaveBeenCalledTimes(2);

  expect(emitter.emit).toHaveBeenNthCalledWith(1, "message", {
    ...messageEvent,
    type: "message"
  });

  expect(emitter.emit).toHaveBeenNthCalledWith(2, "data", {
    ...messageEvent,
    type: "message"
  });

  expect(response.statusCode).toBe(200);
});

test("it can emit multiple webhook events", async () => {
  const messageEvent = { message: true };
  const readEvent = { read: true };

  const response = await sendRequest({
    object: "page",
    entry: [{ messaging: [messageEvent] }, { messaging: [readEvent] }]
  });

  expect(emitter.emit).toHaveBeenCalledTimes(4);

  expect(emitter.emit).toHaveBeenNthCalledWith(1, "message", {
    ...messageEvent,
    type: "message"
  });

  expect(emitter.emit).toHaveBeenNthCalledWith(2, "data", {
    ...messageEvent,
    type: "message"
  });

  expect(emitter.emit).toHaveBeenNthCalledWith(3, "read", {
    ...readEvent,
    type: "read"
  });

  expect(emitter.emit).toHaveBeenNthCalledWith(4, "data", {
    ...readEvent,
    type: "read"
  });

  expect(response.statusCode).toBe(200);
});
