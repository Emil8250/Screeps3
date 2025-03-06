import { pickupAndDoTask } from "../utils/util";

export function runBuilder(creep: Creep) {
    if(creep.memory.custom && creep.room != Game.rooms[creep.memory.custom]){
        creep.moveTo(Game.flags["newspawn"]);
    }
    if(creep.store.getUsedCapacity() === 0 && creep.memory.custom && creep.room === Game.rooms[creep.memory.custom]){
        creep.moveTo(Game.flags["ext"]);
    }
    let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
    if(constructionSites.length === 0){
        if(creep.transfer(creep.room.find(FIND_MY_SPAWNS)[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.find(FIND_MY_SPAWNS)[0])
        }
    }


    let currentConstructionSite = constructionSites.filter(x => x.progress < x.progressTotal).sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
    let creepShouldBuild = pickupAndDoTask(creep);
    if (creepShouldBuild && currentConstructionSite) {
        if (creep.build(currentConstructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(currentConstructionSite, { visualizePathStyle: { stroke: '#fafafa' } });
        }
    }
}

export function spawnBuilder(extentions: number, roomName?: string): [BodyPartConstant[], string, object] {
    const body = [WORK, CARRY, CARRY, CARRY, MOVE];
    for (let i = 0; i < extentions; i++) {
        if(i % 2 === 0)
            body.push(MOVE)
        else
            body.push(CARRY)
    }

    const name = "Builder" + Game.time;
    const opts = { memory: { role: "builder", custom: roomName } };
    return [body, name, opts];
}
