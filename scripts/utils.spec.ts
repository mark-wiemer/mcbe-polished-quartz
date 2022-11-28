import { describe, expect, it } from "vitest";

describe("addition", () => {
  it.each([
    ["adds two numbers", 1, 1, 2],
    ["adds negative numbers", 1, -1, 0],
  ])("%s", async (...[name, a, b, expected]) => expect(a + b).toEqual(expected));
});
