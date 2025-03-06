import { pickupAndDoTask } from "../utils/util";

export function spawnUpgrader(extension: number, energyAvailable: number): [BodyPartConstant[], string, object] {
    const body = [CARRY, WORK, MOVE];
    const name = "Upgrader" + Game.time;
    const opts = { memory: { role: "upgrader", working: false } };

    if(energyAvailable === 300)
        return [body, name, opts];

    if (extension > 5)
        extension = 5;
    for (let i = 0; i < extension; i++) {
        body.push(CARRY)
    }
    return [body, name, opts];
}

export function runUpgrader(creep: Creep) {
    let currentController = creep.room.controller;
    let creepShouldUpgrade = pickupAndDoTask(creep);
    if (creepShouldUpgrade && currentController != undefined) {
        if (creep.upgradeController(currentController) == ERR_NOT_IN_RANGE)
            creep.moveTo(currentController, { visualizePathStyle: { stroke: '#ffffff' } });
    }
}
