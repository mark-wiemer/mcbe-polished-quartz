import { world, system, TicksPerSecond } from "@minecraft/server";

let tickIndex = 0;

function mainTick() {
  try {
    tickIndex++;

    // Say hello every five seconds
    if (!(tickIndex % (5 * TicksPerSecond))) {
      world.getDimension("overworld").runCommandAsync("say Hello starter!");
    }
  } catch (e) {
    console.warn("Script error: " + e);
  }

  system.run(mainTick);
}

system.run(mainTick);
