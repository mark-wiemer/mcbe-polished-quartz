import { ItemStack, TicksPerSecond, World } from "./types";

/** Every 5 seconds, announce the total number of seconds that have elapsed */
export const announceSeconds = (tickNum: number, world: World): void => {
  const shouldTrigger = tickNum % 100 === 0;
  const playerCount = [...world.getPlayers()].length;
  if (shouldTrigger && playerCount > 0) {
    const seconds = tickNum / TicksPerSecond;
    world.getDimension("overworld").runCommandAsync(`say It has been ${seconds} seconds`);
  }
};

type Inventory = (ItemStack | undefined)[];

export const sortInventory = (unsortedInventory: Inventory): ItemStack[] => {
  const sortedInventory: ItemStack[] = [];

  (unsortedInventory.filter((x) => x !== undefined) as ItemStack[]).forEach((itemStack) => {
    const sortedStack = sortedInventory.find((sortedStack) => sortedStack.typeId === itemStack.typeId);
    if (sortedStack) {
      sortedStack.amount += itemStack.amount;
    } else {
      sortedInventory.push(itemStack);
    }
  });

  return sortedInventory;
};
