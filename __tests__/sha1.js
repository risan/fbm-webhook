/* global test:false, expect:false */
const sha1 = require("../src/sha1");

test("it can generate sha-1 hash", () => {
  expect(sha1("foo", "secret")).toBe(
    "9baed91be7f58b57c824b60da7cb262b2ecafbd2"
  );
});
