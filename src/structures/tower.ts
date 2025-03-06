export function runTower(tower: StructureTower) {
    var closestEnemy = tower.room.find(FIND_HOSTILE_CREEPS).sort((a, b) => a.pos.getRangeTo(tower) - b.pos.getRangeTo(tower))[0];
    if (closestEnemy) {
        tower.attack(closestEnemy);
        return;
    }
    repair(tower);
}

function repair(tower: StructureTower){
    var structureToRepair = tower.room.find(FIND_STRUCTURES).filter(x => x.hits != x.hitsMax && x.structureType != "constructedWall").sort((a,b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits))[0];
    if(structureToRepair)
        tower.repair(structureToRepair)
}
