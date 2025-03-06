export function runMiner(creep: Creep, target: Source) {
    if(!target)
        return;
    let rangeToCurrentSource = creep.room.getPositionAt(target.pos.x, target.pos.y)?.getRangeTo(creep.pos.x, creep.pos.y);
    if (!rangeToCurrentSource)
        return;

    if (rangeToCurrentSource > 1) {
        creep.moveTo(target);
        return;
    }
    creep.harvest(target);
}

export function spawnMiner(extentions: number, doSmall?: boolean): [BodyPartConstant[], string, object] {
    const body: BodyPartConstant[] = [WORK, WORK, MOVE];
    const name = "Miner" + Game.time;
    const opts = { memory: { role: "miner" } };
    if(doSmall)
        return [body, name, opts];
    let extraBodyParts = Math.floor((extentions * 50) / 100);
    if(extraBodyParts >= 3)
        extraBodyParts = 3

    for (let index = 0; index < extraBodyParts; index++) {
        body.push(WORK);
    }
    return [body, name, opts];
}
