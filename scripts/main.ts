import { world, system, Player, InventoryComponentContainer, EntityInventoryComponent } from "@minecraft/server";
import { RawInventory } from "./types";
import { readInventory, findSwaps } from "./utils";

let tickIndex = 0;
const swaps: any[] = [];
let inventory: InventoryComponentContainer | null = null;
let rawInventory: RawInventory | null = null;
/** index of inventory to announce. Resets to 0 on item use. */
let index: number = 0;
let isSorting: boolean = false;

const say = (msg: string) => world.getDimension("overworld").runCommandAsync(`say ${msg}`);

function mainTick() {
  try {
    tickIndex++;
    // announceSeconds(tickIndex, world);
    if (isSorting) {
      if (index < (rawInventory?.length ?? 0)) announceInventory();
      else if (swaps?.length > 0) processSwaps();
      else {
        say("Sort complete");
        isSorting = false;
      }
    }
  } catch (e) {
    console.warn("Script error: " + e);
  }
  system.run(mainTick);
}

const announceInventory = () => {
  /** ItemStack at current index in inventory. Undefined if slot is empty. Null if something went wrong. */
  const item = rawInventory?.[index];
  const str = item === undefined ? "Empty" : `${item.amount} ${item.typeId.substring("minecraft:".length)}`;
  say(`${index}: ${str}`);
  index++;
};

const processSwaps = () => {
  const swap = swaps.shift();
  const swapMsg = swap ? `from ${swap.from} to ${swap.to}` : "n/a";
  say(swapMsg);
  if (!swap || !inventory) return;
  // if there's an item in the dest slot, swap it with item to move.
  // Else, transfer item directly into the (empty) slot.
  inventory.transferItem(swap.from, swap.to, inventory);
  // say(`Swapping from ${swap.from} to ${swap.to}`);
};

system.run(mainTick);

/**
 * Wraps the given function in a try-catch and warns on exception
 * @param foo Function to wrap in a try-catch
 * @returns A function that calls `foo` within a try-catch and warns on exception
 */
function doSafely<T extends any[], V>(foo: (...args: T) => V): (...args: T) => V {
  return (...args: T) => {
    try {
      return foo(...args);
    } catch (e) {
      console.warn("Script error: " + e);
      return null as unknown as V;
    }
  };
}

world.events.beforeItemUse.subscribe(
  doSafely((event) => {
    const player = event.source as Player;
    if (!player.name) return;
    inventory = (player.getComponent("inventory") as EntityInventoryComponent).container;
    rawInventory = readInventory(inventory).slice(0, 3);

    index = 0;
    isSorting = true;
    const newSwaps = findSwaps(rawInventory);
    swaps.push(...newSwaps);
  })
);
