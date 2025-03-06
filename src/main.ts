import { ErrorMapper } from "utils/ErrorMapper";
import { createConstructionSitesInGrid, createGridAndSelect, getWorkerCount, writeNumberToMemory } from "./utils/util";
import { runMiner, spawnMiner } from "./roles/miner";
import { runUpgrader, spawnUpgrader } from "./roles/upgrader";
import { runBuilder, spawnBuilder } from "./roles/builder";
import { runMover, spawnMover } from "roles/mover";
import { runClaimer, spawnClaimer } from "roles/claimer";
import { runTower } from "structures/tower";
import { spawn } from "child_process";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
    custom: any;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

//npm run push-main
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {


  let flagForTakeover: Flag | undefined = Game.flags["takeover"];
  for (let spawnName in Game.spawns) {
    let currentSpawn: StructureSpawn = Game.spawns[spawnName];

    let towers: StructureTower[] = currentSpawn.room.find(FIND_MY_STRUCTURES).filter(x => x.structureType === STRUCTURE_TOWER) as StructureTower[];
    let miners = getWorkerCount("miner", currentSpawn);
    let upgraders = getWorkerCount("upgrader", currentSpawn);
    let builders = getWorkerCount("builder", currentSpawn);
    let roomBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder" && creep.memory.custom)
    console.log("roomBuilders " + roomBuilders.length);
    let movers = getWorkerCount("mover", currentSpawn);
    let claimers = getWorkerCount("claimer", currentSpawn);
    console.log("Takeoverflag: " + flagForTakeover);
    console.log(claimers.length === 0 && flagForTakeover !== undefined)
    var extFlag = currentSpawn.room.find(FIND_FLAGS).filter(x => x.color === COLOR_RED)[0];
    createConstructionSitesInGrid(currentSpawn, extFlag, STRUCTURE_EXTENSION);
    var towerFlag = currentSpawn.room.find(FIND_FLAGS).filter(x => x.color === COLOR_BROWN)[0];
    createConstructionSitesInGrid(currentSpawn, towerFlag, STRUCTURE_TOWER);
    var containerFlag = currentSpawn.room.find(FIND_FLAGS).filter(x => x.color === COLOR_GREEN)
    for (let flag of containerFlag) {
      currentSpawn.room.createConstructionSite(flag.pos, STRUCTURE_CONTAINER)
    }
    let extensions = currentSpawn.room.find(FIND_MY_STRUCTURES).filter(x => x.structureType === STRUCTURE_EXTENSION);
    let extensionsCount = extensions.length;
    console.log(extensionsCount);
    let sources = currentSpawn.room.find(FIND_SOURCES)
    let assignedSources: Source[] = [];
    let allConstructionSites = currentSpawn.room.find(FIND_CONSTRUCTION_SITES).length;
    console.log(currentSpawn.room + " - " + (upgraders.length <= 3 && allConstructionSites === 0))
    if (miners.length === 0) {
      currentSpawn.spawnCreep(...spawnMiner(extensionsCount, currentSpawn.room.name === "E22N35"));
      console.log(currentSpawn.room.name)
    }
    else if (movers.length === 0)
      currentSpawn.spawnCreep(...spawnMover());
    else if (claimers.length === 0 && flagForTakeover !== undefined && extensionsCount >= 7) {
      currentSpawn.spawnCreep(...spawnClaimer(flagForTakeover));
    }
    else if (miners.length === 1 && sources.length > 1)
      currentSpawn.spawnCreep(...spawnMiner(extensionsCount));
    else if (movers.length === 1)
      currentSpawn.spawnCreep(...spawnMover());
    else if (roomBuilders.length <= 1 && Object.keys(Game.spawns).length != 2)
      currentSpawn.spawnCreep(...spawnBuilder(extensionsCount, Game.flags["newspawn"].room?.name));
    else if (builders.length <= 2 && allConstructionSites > 0)
      currentSpawn.spawnCreep(...spawnBuilder(extensionsCount));
    else if (upgraders.length <= 3 && allConstructionSites === 0)
      currentSpawn.spawnCreep(...spawnUpgrader(extensionsCount, currentSpawn.room.energyAvailable));
    else if (movers.length === 1)
      currentSpawn.spawnCreep(...spawnMover());
    else if(currentSpawn.room.energyAvailable ===  currentSpawn.room.energyCapacityAvailable && towers.length > 0 && towers[0].store.getFreeCapacity() === 0)
      currentSpawn.spawnCreep(...spawnUpgrader(extensionsCount, currentSpawn.room.energyAvailable));

    for (let worker of miners) {
      const availableSource = sources.filter(item => !assignedSources.includes(item))[0];
      assignedSources.push(availableSource);
      runMiner(worker, availableSource);
    }
    for (let worker of upgraders) {
      runUpgrader(worker);
    }
    for (let worker of builders) {
      runBuilder(worker);
    }
    for (let worker of movers) {
      runMover(worker);
    }
    for (let worker of claimers) {
      runClaimer(worker, flagForTakeover);
    }
    for (let tower of towers){
      runTower(tower);
    }
    const myStats: { [key: string]: any } = {
      movers: movers.length,
      builders: builders.length,
      miners: miners.length,
      upgraders: upgraders.length,
      rclProgress: currentSpawn.room.controller?.progress,
      rclProgressTotal: currentSpawn.room.controller?.progressTotal,
      test: true
    }


    writeNumberToMemory(myStats);
  };
  if (Game.cpu.bucket >= 10000)
    Game.cpu.generatePixel();
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});


