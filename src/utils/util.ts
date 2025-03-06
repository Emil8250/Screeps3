const ROOM_NAME = "E23N35";
export function createGridAndSelect(startPos: RoomPosition, width: number): RoomPosition[] {
    const selectedPositions: RoomPosition[] = [];

    // Select every second position
    for (let y = startPos.y; y < startPos.y + width; y++) {
        for (let x = startPos.x; x < startPos.x + width; x++) {
            if ((x + y) % 2 === 0) {
                selectedPositions.push(new RoomPosition(x, y, ROOM_NAME));
            }
        }
    }

    return selectedPositions;
}

export function getWorkerCount(workerType: string, spawn: StructureSpawn) {
    let workers = _.filter(Game.creeps, (creep) => creep.memory.role == workerType && creep.room.name === spawn.room.name)
    console.log(`${workerType}: ${workers.length}`)
    return workers;
}

export function pickupAndDoTask(creep: Creep): boolean {
    let resourcesOnGround = creep.room.find(FIND_DROPPED_RESOURCES);
    let resourceCount = resourcesOnGround.length;
    let creepShouldPickup = !creep.memory.working && resourceCount > 0;
    let creepShouldUpgrade = creep.memory.working && creep.store.getUsedCapacity() != 0;
    if (creepShouldPickup === true) {
        let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        const nearRecources = _.filter(creep.room.find(FIND_DROPPED_RESOURCES), resource => creep.pos.getRangeTo(resource) < 4);
        if (nearRecources.length > 0) {
            target = _.max(nearRecources, "amount");
        }

        if (target && creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        if (creep.store.getFreeCapacity() === 0) {
            console.log("set memory working true")
            creep.memory.working = true;
        }

    }
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory.working = false;
    }

    return creepShouldUpgrade;
}

export function writeNumberToMemory(stats: { [key: string]: any }) {
    RawMemory.segments[0] = JSON.stringify(stats);
}

export function createConstructionSitesInGrid(spawn: StructureSpawn, flag: Flag | undefined, structure: any){
    if (flag != undefined) {
        const extPos = createGridAndSelect(flag.pos, 5);
        for (let pos of extPos) {
            spawn.room.createConstructionSite(pos.x, pos.y, structure);
        }
      }
}
