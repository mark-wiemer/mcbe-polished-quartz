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

export const sortInventory = (unsortedInventory: RawInventory): ItemStack[] => {
  const sortedInventory: ItemStack[] = [];

  (unsortedInventory.filter((x) => x) as ItemStack[]).forEach((itemStack) => {
    const sortedStack = sortedInventory.find((sortedStack) => sortedStack.typeId === itemStack.typeId);
    if (sortedStack) {
      sortedStack.amount += itemStack.amount;
    } else {
      sortedInventory.push(itemStack);
    }
  });

  return sortedInventory;
};

export const readInventory = (inv: Pick<InventoryComponentContainer, "getItem" | "size">): RawInventory =>
  new Array(inv.size).fill(0).map((_, i) => inv.getItem(i));
