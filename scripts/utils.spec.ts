import { beforeEach, describe, expect, it, vi } from "vitest";
import { announceSeconds, findSwaps, readInventory } from "./utils";

describe("addition", () => {
  it.each([
    ["adds two numbers", 1, 1, 2],
    ["adds negative numbers", 1, -1, 0],
  ])("%s", async (...[, a, b, expected]) => expect(a + b).toEqual(expected));
});

describe("announceSeconds", () => {
  const mockRunCommandAsync = vi.fn();

  const world = {
    getDimension: () => ({ runCommandAsync: mockRunCommandAsync }),
    getPlayers: () => {
      let iter: any = {};
      iter[Symbol.iterator] = function* () {
        let start = 0;
        const end = 1;
        while (start < end) yield start++;
      };
      return iter;
    },
  };

  beforeEach(() => {
    mockRunCommandAsync.mockClear();
  });

  it.each([
    ["announces on the first interval", 100, 1],
    ["announces on the second interval", 200, 1],
    ["does nothing before the interval", 99, 0],
  ])("%s", async (...[, tickNum, callCount]) => {
    announceSeconds(tickNum, world);
    expect(mockRunCommandAsync).toHaveBeenCalledTimes(callCount);
  });
});

describe("findSwaps", () => {
  it.each([
    [
      "merge stacks",
      [
        { typeId: "apple", amount: 1 },
        { typeId: "apple", amount: 2 },
      ],
      [{ from: 1, to: 0 }],
    ],
    [
      "single empty slot",
      [{ typeId: "apple", amount: 1 }, undefined, { typeId: "bread", amount: 2 }],
      [{ from: 2, to: 1 }],
    ],
    [
      "many empty slots",
      [
        undefined,
        { typeId: "a", amount: 1 },
        { typeId: "b", amount: 1 },
        undefined,
        { typeId: "b", amount: 1 },
        { typeId: "c", amount: 1 },
        { typeId: "a", amount: 1 },
        undefined,
        { typeId: "a", amount: 1 },
      ],
      [
        { from: 1, to: 0 },
        { from: 2, to: 1 },
        { from: 4, to: 1 },
        { from: 5, to: 2 },
        { from: 6, to: 0 },
        { from: 8, to: 0 },
      ],
    ],
  ])("%s", async (...[, unsortedInventory, expected]) => expect(findSwaps(unsortedInventory)).toEqual(expected));
});

describe("readInventory", () => {
  it.each([
    [
      "small inventory",
      {
        size: 3,
        getItem: (slot: number) => {
          const inv: Record<number, { typeId: string; amount: number }> = {
            0: { typeId: "apple", amount: 1 },
            1: { typeId: "potato", amount: 4 },
            2: { typeId: "sword", amount: 1 },
          };
          return inv[slot] ?? null;
        },
      },
      [
        { typeId: "apple", amount: 1 },
        { typeId: "potato", amount: 4 },
        { typeId: "sword", amount: 1 },
      ],
    ],
    [
      "empty slot",
      {
        size: 1,
        getItem: () => undefined,
      },
      [undefined],
    ],
  ])("%s", async (...[, container, expected]) => expect(readInventory(container)).toStrictEqual(expected));
});
