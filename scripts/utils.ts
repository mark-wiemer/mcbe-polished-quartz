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

export const sortInventory = (unsortedInventory: RawInventory): Swap[] => {
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
  collapsedInv.forEach((itemStack, i) => {
    if (!itemStack.typeId) return;
    const destSlot = collapsedInv.find((invStack) => invStack.typeId === itemStack.typeId)?.trueIndex ?? -1;
    if (destSlot !== -1 && destSlot !== itemStack.trueIndex) {
      swaps.push({ from: itemStack.trueIndex, to: destSlot });
    }
  });

  // TODO post-processing to simplify swaps

  return swaps;
};

export const readInventory = (inv: Pick<InventoryComponentContainer, "getItem" | "size">): RawInventory =>
  new Array(inv.size).fill(0).map((_, i) => inv.getItem(i));
