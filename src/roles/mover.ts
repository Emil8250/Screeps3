import { pickupAndDoTask } from "../utils/util";

export function runMover(creep: Creep) {
    let mySpawn = creep.room.find(FIND_MY_SPAWNS)[0];
    let myExt = creep.room.find(FIND_MY_STRUCTURES).filter(x => x.structureType === STRUCTURE_EXTENSION && x.store.getFreeCapacity(RESOURCE_ENERGY) > 0).sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
    let myTower = creep.room.find(FIND_MY_STRUCTURES).filter(x => x.structureType === STRUCTURE_TOWER && x.store.getFreeCapacity(RESOURCE_ENERGY) > 0).sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
    let creepShouldMove = pickupAndDoTask(creep);

    if (creepShouldMove && mySpawn && mySpawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.transfer(mySpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(mySpawn, { visualizePathStyle: { stroke: '#fafafa' } });
        }
    }
    else if(creepShouldMove && myExt){
        if (creep.transfer(myExt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myExt, { visualizePathStyle: { stroke: '#fafafa' } });
        }
    }
    else if(creepShouldMove && myTower){
        if (creep.transfer(myTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myTower, { visualizePathStyle: { stroke: '#fafafa' } });
        }
    }
}

export function spawnMover(): [BodyPartConstant[], string, object] {
    const body = [CARRY, CARRY, CARRY, MOVE, MOVE];
    const name = "Mover" + Game.time;
    const opts = { memory: { role: "mover" } };
    return [body, name, opts];
}
