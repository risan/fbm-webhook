/* global jest:false, test:false, expect:false */
const request = require("supertest");
const fbmWebhook = require("../src");

const sendVerificationRequest = async query => {
  const webhook = fbmWebhook({ verifyToken: "secret" });

  return request(webhook)
    .get("/")
    .query(query);
};

test("it responds with HTTP 200 and challenge code if webhook verification request is valid", async () => {
  const response = await sendVerificationRequest({
    "hub.mode": "subscribe",
    "hub.verify_token": "secret",
    "hub.challenge": "accepted"
  });

  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("accepted");
});

test("it responds with HTTP 403 if hub.verify_token does not match", async () => {
  const response = await sendVerificationRequest({
    "hub.mode": "subscribe",
    "hub.verify_token": "foo",
    "hub.challenge": "accepted"
  });

  expect(response.statusCode).toBe(403);
});

test("it emits the correct webhook event", async () => {
  const webhook = fbmWebhook();

  webhook.emit = jest.fn();

  const messageEvent = { message: true };

  const response = await request(webhook)
    .post("/")
    .send({
      object: "page",
      entry: [{ messaging: [messageEvent] }]
    });

  expect(webhook.emit).toHaveBeenCalledTimes(2);

  expect(webhook.emit).toHaveBeenNthCalledWith(1, "message", {
    ...messageEvent,
    type: "message"
  });

  expect(webhook.emit).toHaveBeenNthCalledWith(2, "data", {
    ...messageEvent,
    type: "message"
  });

  expect(response.statusCode).toBe(200);
});
