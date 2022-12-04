import { InventoryComponentContainer, RawInventory, TicksPerSecond, World } from "./types";

/** Every 5 seconds, announce the total number of seconds that have elapsed */
export const announceSeconds = (tickNum: number, world: World): void => {
  const shouldTrigger = tickNum % 100 === 0;
  const playerCount = [...world.getPlayers()].length;
  if (shouldTrigger && playerCount > 0) {
    const seconds = tickNum / TicksPerSecond;
    world.getDimension("overworld").runCommandAsync(`say It has been ${seconds} seconds`);
  }
};

interface Swap {
  from: number;
  to: number;
}

/** Find the swaps necessary to sort the inventory */
export const findSwaps = (unsortedInventory: RawInventory): Swap[] => {
  const swaps: Swap[] = [];

  let undefCount = 0;
  const collapsedInv = unsortedInventory
    // Collapse empty slots
    .map((stack, i) => {
      if (!stack) undefCount++;
      const trueIndex = i - undefCount;
      if (stack && undefCount) swaps.push({ from: i, to: trueIndex });
      return { ...stack, trueIndex };
    });

  // Merge stacks
  collapsedInv.forEach((itemStack) => {
    if (!itemStack.typeId) return;
    const destSlot = collapsedInv.find((invStack) => invStack.typeId === itemStack.typeId)?.trueIndex ?? -1;
    if (destSlot !== -1 && destSlot !== itemStack.trueIndex) {
      swaps.push({ from: itemStack.trueIndex, to: destSlot });
    }
  });

  // TODO post-processing to simplify swaps

  return swaps;
};

/** Extract a simplified inventory from the given one, for easier processing. */
export const readInventory = (inv: Pick<InventoryComponentContainer, "getItem" | "size">): RawInventory =>
  new Array(inv.size).fill(0).map((_, i) => {
    const itemStack = inv.getItem(i);
    // property access when getting the item from Minecraft is very wonky. Explicitly accessing properties does work.
    return itemStack ? { amount: itemStack?.amount ?? 0, typeId: itemStack?.typeId ?? "" } : undefined;
  });

/** Execute the given function in a try-catch, warning and returning `null` on throw */
export const doSafely = <T extends any[], V>(foo: (...args: T) => V): ((...args: T) => V | null) => {
  return (...args: T) => {
    try {
      return foo(...args);
    } catch (e) {
      console.warn("Script error: " + e);
      return null;
    }
  };
};
