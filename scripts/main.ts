import { world, system } from "@minecraft/server";
import { announceSeconds } from "./utils";

let tickIndex = 0;

function mainTick() {
  try {
    tickIndex++;
    announceSeconds(tickIndex, world);
  } catch (e) {
    console.warn("Script error: " + e);
  }
  system.run(mainTick);
}

system.run(mainTick);
