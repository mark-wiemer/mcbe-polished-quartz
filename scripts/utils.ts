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
 * Find the swaps necessary to sort the inventory
 * TODO assumes all items are infinitely stackable
 * TODO assumes items with the same typeId can be stacked (ignore nameTags)
 * TODO does not order slots, just merges and removes empty slots
 */
export const findSwaps = (unsortedInventory: RawInventory): Swap[] => {
  const swaps: Swap[] = [];
  const sortedInv: ItemStack[] = [];

  unsortedInventory.forEach((unsortedStack, i) => {
    if (!unsortedStack) return;
    const matchIndex = sortedInv.findIndex((sortedStack) => sortedStack.typeId === unsortedStack.typeId);
    const foundMatch = matchIndex !== -1;
    const sortedIndex = foundMatch ? matchIndex : sortedInv.length;
    if (foundMatch) sortedInv[sortedIndex].amount += unsortedStack.amount;
    else sortedInv[sortedIndex] = unsortedStack;
    if (sortedIndex !== i) swaps.push({ from: i, to: sortedIndex });
  });
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
