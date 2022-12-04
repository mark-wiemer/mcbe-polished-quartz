import { sortOrder } from "./constants";
import { InventoryComponentContainer, ItemStack, RawInventory, TicksPerSecond, World } from "./types";

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

/**
 * Find the swaps necessary to sort the inventory.
 * TODO assumes all items are infinitely stackable
 * TODO assumes items with the same typeId can be stacked (ignore nameTags)
 * TODO makes some unnecessary swaps
 * TODO does not order slots, just merges and removes empty slots
 *
 * TODO sorting doesn't work in Minecraft
 */
export const findSwaps = (originalInv: RawInventory): Swap[] => {
  const swaps: Swap[] = [];
  const mergedInv: ItemStack[] = [];

  originalInv.forEach((unsortedStack, i) => {
    if (!unsortedStack) return;
    const matchIndex = mergedInv.findIndex((mergedStack) => canMerge(mergedStack, unsortedStack));
    const foundMatch = matchIndex !== -1;
    const mergedIndex = foundMatch ? matchIndex : mergedInv.length;
    if (foundMatch) mergedInv[mergedIndex].amount += unsortedStack.amount;
    else mergedInv[mergedIndex] = unsortedStack;
    if (mergedIndex !== i) swaps.push({ from: i, to: mergedIndex });
  });

  const sortedInv = [...mergedInv].sort((a, b) => compareFn(a.typeId, b.typeId));
  mergedInv.forEach((mergedStack, i) => {
    console.warn(`${i}: ${mergedStack.typeId}`);
    const newIndex = sortedInv.findIndex((sortedStack) => canMerge(sortedStack, mergedStack));
    if (newIndex < i) swaps.push({ from: i, to: newIndex });
  });

  return swaps;
};

const canMerge = (a: ItemStack, b: ItemStack): boolean => a.typeId === b.typeId;

export const compareFn = (a: string, b: string): number => kachow(a) - kachow(b);

const kachow = (a: string) => {
  const result = sortOrder.indexOf(a);
  console.warn(`${a}: ${result}`);
  return sortOrder.indexOf(a);
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
