/* global jest:false, test:false, expect:false */
const request = require("supertest");
const fbmWebhook = require("../src");
const sha1 = require("../src/sha1");

jest.mock("../src/sha1");

const webhook = fbmWebhook({ appSecret: "secret", verifyToken: "mytoken" });
webhook.emit = jest.fn();

const sendVerificationRequest = async query =>
  request(webhook)
    .get("/")
    .query({
      "hub.mode": "subscribe",
      "hub.verify_token": "mytoken",
      "hub.challenge": "accepted",
      ...query
    });

const sendWebhookEvents = async (events, signature = "valid-signature") => {
  sha1.mockReturnValue("valid-signature");

  const entry = events.map(event => ({ messaging: [event] }));

  return request(webhook)
    .post("/")
    .set("x-hub-signature", `sha1=${signature}`)
    .send({ object: "page", entry });
};

const sendWebhookEvent = async (event, signature) =>
  sendWebhookEvents([event], signature);

test("it responds with HTTP 422 if hub.mode is invalid", async () => {
  const response = await sendVerificationRequest({
    "hub.mode": "foo"
  });

  expect(response.statusCode).toBe(422);
});

test("it responds with HTTP 403 if hub.verify_token does not match", async () => {
  const response = await sendVerificationRequest({
    "hub.verify_token": "foo"
  });

  expect(response.statusCode).toBe(403);
});

test("it responds with HTTP 200 and challenge code if webhook verification request is valid", async () => {
  const response = await sendVerificationRequest();

  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("accepted");
});

test("it responds with HTTP 403 if signature is invalid", async () => {
  const response = await sendWebhookEvent({}, "invalid");

  expect(response.statusCode).toBe(403);
});

test("it can emit the message event", async () => {
  const event = { message: true };

  const receivedEvent = { ...event, type: "message" };

  const response = await sendWebhookEvent(event);

  expect(webhook.emit).toHaveBeenNthCalledWith(1, "message", receivedEvent);
  expect(webhook.emit).toHaveBeenNthCalledWith(2, "data", receivedEvent);

  expect(response.statusCode).toBe(200);
});

test("it can receive multiple events", async () => {
  const messageEvent = { message: true };
  const readEvent = { read: true };
  const events = [messageEvent, readEvent];

  const response = await sendWebhookEvents(events);

  expect(webhook.emit).toHaveBeenNthCalledWith(1, "message", {
    ...messageEvent,
    type: "message"
  });

  expect(webhook.emit).toHaveBeenNthCalledWith(3, "read", {
    ...readEvent,
    type: "read"
  });

  expect(response.statusCode).toBe(200);
});
