/* global jest:false, test:false, expect:false */
const express = require("express");
const request = require("supertest");
const getChallenge = require("../src/get-verification-challenge");
const verification = require("../src/verification");

jest.mock("../src/get-verification-challenge");

const app = express();

app.use("/webhook", verification());

test("it responds HTTP 200 with the challenge code if webhook request is valid", async () => {
  getChallenge.mockReturnValue("accepted");

  const response = await request(app).get("/webhook");

  expect(getChallenge).toHaveBeenCalledTimes(1);
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("accepted");
});

test("it responds HTTP 403 if webhook request is invalid", async () => {
  getChallenge.mockImplementation(() => {
    throw new Error("invalid");
  });

  const response = await request(app).get("/webhook");

  expect(getChallenge).toHaveBeenCalledTimes(1);
  expect(response.statusCode).toBe(403);
});
