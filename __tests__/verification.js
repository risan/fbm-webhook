/* global test:false, expect:false */
const express = require("express");
const request = require("supertest");
const verification = require("../src/verification");

const app = express();

app.use("/", verification("secret"));

const sendRequestWithQuery = async query =>
  request(app)
    .get("/")
    .query(query);

test("it responds with HTTP 422 if hub.mode is not subscribe", async () => {
  const response = await sendRequestWithQuery({
    "hub.mode": "foo",
    "hub.verify_token": "secret",
    "hub.challenge": "accepted"
  });

  expect(response.statusCode).toBe(422);
  expect(response.text).toMatch(/invalid/i);
});

test("it responds with HTTP 403 if hub.verify_token does not match", async () => {
  const response = await sendRequestWithQuery({
    "hub.mode": "subscribe",
    "hub.verify_token": "foo",
    "hub.challenge": "accepted"
  });

  expect(response.statusCode).toBe(403);
  expect(response.text).toMatch(/invalid/i);
});

test("it responds with HTTP 200 and challenge code if webhook verification request is valid", async () => {
  const response = await sendRequestWithQuery({
    "hub.mode": "subscribe",
    "hub.verify_token": "secret",
    "hub.challenge": "accepted"
  });

  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("accepted");
});
