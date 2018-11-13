/* global jest:false, test:false, expect:false */
const sha1 = require("../src/sha1");
const verifySignature = require("../src/verify-signature");

jest.mock("../src/sha1");

const verify = verifySignature("secret");

test("it throws error if x-hub-signature is missing", () => {
  expect(() => verify({}, null, "data")).toThrow(/signature/i);

  expect(() =>
    verify(
      {
        headers: {
          "x-hub-signature": "foo=bar"
        }
      },
      null,
      "data"
    )
  ).toThrow(/signature/i);
});

test("it throws error if x-hub-signature is invalid", () => {
  sha1.mockReturnValue("1234");

  expect(() =>
    verify(
      {
        headers: {
          "x-hub-signature": "sha1=foo"
        }
      },
      null,
      "data"
    )
  ).toThrow(/signature/i);

  expect(sha1).toHaveBeenCalledTimes(1);
  expect(sha1).toHaveBeenCalledWith("data", "secret");
});

test("it returns undefined if signature is valid", () => {
  sha1.mockReturnValue("1234");

  expect(
    verify(
      {
        headers: {
          "x-hub-signature": "sha1=1234"
        }
      },
      null,
      "data"
    )
  ).toBeUndefined();

  expect(sha1).toHaveBeenCalledTimes(1);
  expect(sha1).toHaveBeenCalledWith("data", "secret");
});
