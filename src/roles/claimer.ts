export function spawnClaimer(roomFlag: Flag): [BodyPartConstant[], string, object] {
    const body = [MOVE, CLAIM];
    const name = "Claimer" + Game.time;
    const opts = { memory: { role: "claimer", working: false, custom: roomFlag } };
    return [body, name, opts];
}

export function runClaimer(creep: Creep, roomFlag: Flag) {
    roomFlag = Game.flags["takeover"];
    creep.room.createConstructionSite(roomFlag.pos.x, roomFlag.pos.y, STRUCTURE_SPAWN);
    if (creep.room != roomFlag.room) {
        console.log("moving claimer")
        console.log(creep.moveTo(roomFlag, { visualizePathStyle: { stroke: '#A020F0' } }));
    }
    else if (creep.room.controller) {
        if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#A020F0' } })
        }
    }
}
