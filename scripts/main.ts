import { world, system, Player, EntityInventoryComponent } from "@minecraft/server";
import { readInventory, findSwaps, doSafely } from "./utils";

let tickIndex = 0;

// const say = (msg: string) => world.getDimension("overworld").runCommandAsync(`say ${msg}`);

function mainTick() {
  try {
    tickIndex++;
  } catch (e) {
    console.warn("Script error: " + e);
  }
  system.run(mainTick);
}

system.run(mainTick);

// Sort player's inventory every time they use an item
// TODO add GameTests
world.events.beforeItemUse.subscribe(
  doSafely((event) => {
    const player = event.source as Player;
    if (!player.name) return;
    const inventory = (player.getComponent("inventory") as EntityInventoryComponent).container;
    findSwaps(readInventory(inventory)).forEach((swap) => {
      console.warn(swap);
      inventory.transferItem(swap.from, swap.to, inventory);
    });
  })
);
