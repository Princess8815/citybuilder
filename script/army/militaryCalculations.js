import { troops } from "./militaryIndex.js"
import { walls } from "./wall.js";
//attacker and deffender {troopkey{quantity, line, troopobj}}
export function armyCalculations(attacker, deffender, wall, round = 0, attackerCasualtyCarried, deffenderCasualtyCarried, aTech = {}, dTech = {}, logHistory = []) {
    let logging = {
        first: {attacker: attacker, deffender: deffender, wall: wall, round: round, attackerCasualtyCarried: attackerCasualtyCarried, deffenderCasualtyCarried: deffenderCasualtyCarried, aTech: aTech, dTech: dTech}
    }
    const attackerTroops = {};
    const deffenderTroops = {};
    const attackerCasualties = attackerCasualtyCarried ?? {}
    const deffenderCasualties = deffenderCasualtyCarried ?? {}
    const defWall = {
        line: 13,
        name: "wall",
        //made a consistent typo called the obj towers to lazy to fix
        wallHealth: wall?.health ?? 0,
        defense: wall?.defense ?? 0,
        towers: wall?.towers ?? {quantity: 0, towers: walls.archerTowers}, //fires start of round at infantry {quntity, wallfort key}
        traps: wall?.traps ?? {quantity: 0, traps: walls.traps}, //fires any time infantry move
        abatis: wall?.abatis ?? {quantity: 0, abatis: walls.abatis}, //will harm cavalry close to wall
        boulders: wall?.boulders ?? {quantity: 0, boulders: walls.boulders}, //fires at seige weapons
        speed: 0
    }

    if (defWall.wallHealth <= 0) { //req wall hp to be 0
        defWall.dead = true
    }
    logging.second = defWall

    const roundLog = {
        round,
        wallStart: {
            health: defWall.wallHealth,
            defense: defWall.defense,
            towers: defWall.towers.quantity,
            traps: defWall.traps.quantity,
            abatis: defWall.abatis.quantity,
            boulders: defWall.boulders.quantity
        },
        attackerStart: {},
        defenderStart: {},
        events: []
    }

    Object.entries(troops).forEach(([groupKey, group]) => {
        if (!group || typeof group !== "object") return;


        Object.entries(group).forEach(([troopKey, troop]) => {
            // troop is the inner definition object
            let attackTechAttacker = 0
            let defenseTechAttacker = 0
            let healthTechAttacker = 0
            let attackTechDeffender = 0
            let defenseTechDeffender = 0
            let healthTechDeffender = 0

            switch (groupKey) {
                case "infantry":
                    attackTechAttacker = aTech.infantry ?? 0
                    defenseTechAttacker = aTech.defense ?? 0
                    healthTechAttacker = aTech.footHealth ?? 0
                    attackTechDeffender = dTech.infantry ?? 0
                    defenseTechDeffender = dTech.defense ?? 0
                    healthTechDeffender = dTech.footHealth ?? 0
                    break
                case "archers":
                    attackTechAttacker = aTech.archery ?? 0
                    defenseTechAttacker = aTech.defense ?? 0 //same tech as infantry
                    healthTechAttacker = aTech.footHealth ?? 0 //same here to
                    attackTechDeffender = dTech.archery ?? 0
                    defenseTechDeffender = dTech.defense ?? 0
                    healthTechDeffender = dTech.footHealth ?? 0
                    break
                case "cavalry":
                    attackTechAttacker = aTech.cavalry ?? 0
                    defenseTechAttacker = aTech.cavalryDefense ?? 0 
                    healthTechAttacker = aTech.horseHealth ?? 0 
                    attackTechDeffender = dTech.cavalry ?? 0
                    defenseTechDeffender = dTech.cavalryDefense ?? 0
                    healthTechDeffender = dTech.horseHealth ?? 0
                    break
                case "siege":
                    attackTechAttacker = aTech.siege ?? 0
                    defenseTechAttacker = aTech.siegeDefense ?? 0 
                    healthTechAttacker = aTech.siegeHealth ?? 0 
                    attackTechDeffender = dTech.siege ?? 0
                    defenseTechDeffender = dTech.siegeDefense ?? 0
                    healthTechDeffender = dTech.siegeHealth ?? 0
                    break
            }

            // attacker match
            if (attacker?.[troopKey] !== undefined) {
                const troopDefense = Number(troop.defense);
                const troopHealth  = Number(troop.health);

                const defenseVal = Number.isFinite(troopDefense) && troopDefense > 0 ? troopDefense : 1;
                const healthVal  = Number.isFinite(troopHealth)  && troopHealth  > 0 ? troopHealth  : 1;


                const quantity = attacker[troopKey].quantity;
                if (quantity <= 0) return
                const line = attacker[troopKey].line ?? 25

                attackerTroops[troopKey] = {
                    side: "attacker",
                    name: troopKey,
                    group: groupKey,        // ← layer awareness
                    quantity,

                    attack: troop.attack * (1 + (attackTechAttacker / 100)),
                    defense: defenseVal * (1 + (defenseTechAttacker || 0) / 100),
                    health:  healthVal  * (1 + (healthTechAttacker  || 0) / 100),

                    range: troop.range,
                    moveSpeed: troop.move,
                    speed: troop.speed, //determines move order

                    totalAttack: troop.attack * quantity * (1 + (attackTechAttacker / 100)),
                    totalHealth: healthVal * quantity * (1 + (healthTechAttacker / 100)),

                    troopObj: troop, //ill need this stored
                    trait: troop.trait,

                    line: line
                };
            }

            // defender match
            if (deffender?.[troopKey] !== undefined) {
                const troopDefense = Number(troop.defense);
                const troopHealth  = Number(troop.health);

                const defenseVal = Number.isFinite(troopDefense) && troopDefense > 0 ? troopDefense : 1;
                const healthVal  = Number.isFinite(troopHealth)  && troopHealth  > 0 ? troopHealth  : 1;


                const quantity = deffender[troopKey].quantity;
                if (quantity <= 0) return
                const line = deffender[troopKey].line ?? 1

                deffenderTroops[troopKey] = {
                    side: "deffender",
                    name: troopKey,
                    group: groupKey,
                    quantity,

                    attack: troop.attack * (1 + (attackTechDeffender / 100)),
                    defense: defenseVal * (1 + (defenseTechDeffender || 0) / 100),
                    health:  healthVal  * (1 + (healthTechDeffender  || 0) / 100),
                    range: troop.range,
                    moveSpeed: troop.move,
                    speed: troop.speed, //determines move order

                    totalAttack: troop.attack * quantity  * (1 + (attackTechDeffender / 100)),
                    totalHealth: healthVal * quantity * (1 + (healthTechDeffender / 100)),

                    troopObj: troop, //ill need this stored

                    trait: troop.trait,

                    line: line
                };
            }
        });
    });

    if (round >= 100) {
        return {
            attacker: attacker,
            deffender: deffender,
            attackerCasualties: attackerCasualties,
            deffenderCasualties: deffenderCasualties,
            wall: wall

        }
    }

    const battlefield = []

    battlefield.push(
        ...Object.values(attackerTroops),
        ...Object.values(deffenderTroops)
    );

    // sort by speed (highest speed goes first)
    battlefield.sort((a, b) => b.speed - a.speed);

    let attackerSide = []
    let deffenderSide = []

    attackerSide.push(
        ...Object.values(attackerTroops)
    )
    Object.values(attackerTroops).forEach(unit => {
        roundLog.attackerStart[unit.name] = { quantity: unit.quantity, line: unit.line }
    })

    deffenderSide.push(
        ...Object.values(deffenderTroops),
        defWall
    )
    Object.values(deffenderTroops).forEach(unit => {
        roundLog.defenderStart[unit.name] = { quantity: unit.quantity, line: unit.line }
    })

    attackerSide.sort((a, b) => a.line - b.line)

    deffenderSide.sort((a, b) => b.line - a.line)

    const BaseArcherTowerAttack = defWall.towers.towers.attack * defWall.towers.quantity;

    for (const unit of attackerSide) {
    if (unit.group === "siege") continue;

    if (BaseArcherTowerAttack > 0) {
        const def = Number(unit.defense);
        if (Number.isFinite(def) && def > 0) {
        unit.totalHealth -= BaseArcherTowerAttack / def;
        roundLog.events.push({
            type: "archerTowers",
            target: unit.name,
            attack: BaseArcherTowerAttack,
            damage: BaseArcherTowerAttack / def,
            remainingHealth: unit.totalHealth
        })
        }
    }

    const newQuantity = Math.max(Math.ceil(unit.totalHealth / unit.health), 0);
    const casualties = unit.quantity - newQuantity;

    unit.quantity = newQuantity;

    const key = unit.name;
    if (attackerCasualties[key]) attackerCasualties[key].amount += casualties;
    else attackerCasualties[key] = { name: unit.name, amount: casualties };

    if (unit.quantity <= 0) {
        unit.dead = true;
        break;
    }

    unit.totalAttack = unit.quantity * unit.attack;
    unit.totalHealth = unit.quantity * unit.health;
    break;
    }



    battlefield.forEach(unit => {
        console.log(unit)
        if (unit.dead) return
        if (unit.side === "deffender"){
            logging.def1 = unit
            const unitTrait = unit.trait
            let targetPriority;
            let found = false

            if (typeof unitTrait == "object" && unitTrait.target) {
                targetPriority = unitTrait.target
            }
            for (const target of attackerSide) {
                logging.def2 = {unit: unit, target: target}
                if (target.dead) continue
                logging.def3 = {unit: unit, target: target}
                if (targetPriority && targetPriority !== target.name) continue //ensures troop is allowed to attack
                    const distance = Math.abs(unit.line - target.line)
                    if (unit.range >= distance){
                        const baseAttack = unit.totalAttack / target.defense
                        target.totalHealth = target.totalHealth - baseAttack
                        const newQuantity = Math.max(Math.ceil(target.totalHealth / target.health), 0)
                    const casualties = target.quantity - newQuantity
                    target.quantity = newQuantity
                    logging.def4 = {unit: unit, target: target}
                    const key = target.name
                    if (attackerCasualties[key]){
                        attackerCasualties[key].amount += casualties
                        logging.def5a = {unit: unit, target: target, attackerCasualties: attackerCasualties}
                    }
                    else {
                        attackerCasualties[key] = {
                            name: target.name,
                            amount: casualties
                        }
                        logging.def5b = {unit: unit, target: target, attackerCasualties: attackerCasualties}
                    }
                    if (target.quantity <= 0) {
                        logging.def6 = target
                        target.dead = true
                        found = true
                        break
                    }
                target.totalAttack = target.quantity * target.attack
                target.totalHealth = target.quantity * target.health
                found = true
                console.log("def 7" + target.totalAttack + target.totalHealth)
                logging.def7 = {totalAttack: target.totalAttack, totalHealth: target.totalHealth}
                break
                }
            }
            if (!found) {
                unit.line = unit.line + unit.moveSpeed
                if (unit.line >= 12) {
                    unit.line = 12 //prevents runaway troops
                }
            }
        }

        if (unit.side === "attacker"){
            logging.attk1 = unit
            const unitTrait = unit.trait
            let targetPriority;
            let found = false

            if (typeof unitTrait == "object" && unitTrait.target) {
                targetPriority = unitTrait.target
            }
            for (const target of deffenderSide) {
                logging.attk2 = {unit: unit, target: target}
                if (target.dead) continue
                logging.attk3 = {unit: unit, target: target}
                const distance = Math.abs(unit.line - target.line)
            if (unit.range >= distance){
                if (target.name === "wall") {
                    logging.attk4= {unit: unit, target: target, targetName: target.name}
                    if (unit.dead) return
                    const key = unit.name
                    let siegeBonus = 0
                    switch (unit.group) {
                        case "cavalry": //no continue cause the troops can go on to attack wall still
                            if (defWall.abatis.quantity > 0) {
                                const abatisAttack = defWall.abatis.abatis.attack * defWall.abatis.quantity //def doesnt protect
                                unit.totalHealth = unit.totalHealth - abatisAttack
                                const newQuantity = Math.max(Math.ceil(unit.totalHealth / unit.health), 0)
                                const casualties = unit.quantity - newQuantity
                                unit.quantity = newQuantity
                                defWall.abatis.quantity = Math.max((defWall.abatis.quantity - casualties), 0)
                                
                                if (attackerCasualties[key]) {
                                    attackerCasualties[key].amount += casualties
                                }
                                else {
                                    attackerCasualties[key] = {
                                        name: unit.name,
                                        amount: casualties
                                    }
                                }

                            }
                            break;
                        case "infantry":
                        case "archers":
                            if (defWall.traps.quantity > 0) {
                                let effectiveQuantity = Math.round(defWall.traps.quantity / 4)
                                if (effectiveQuantity >= unit.quantity) {
                                    effectiveQuantity = unit.quantity
                                }
                                defWall.traps.quantity -= effectiveQuantity
                                unit.quantity -= effectiveQuantity
                                if (attackerCasualties[key]) {
                                    attackerCasualties[key].amount += effectiveQuantity
                                }
                                else {
                                    attackerCasualties[key] = {
                                        name: unit.name,
                                        amount: effectiveQuantity
                                    }
                                }
                            }
                            break
                        case "siege":
                            if (defWall.boulders.quantity > 0) {
                                const boulderAttack = defWall.boulders.boulders.attack * defWall.boulders.quantity //def doesnt protect
                                unit.totalHealth = unit.totalHealth - boulderAttack
                                const newQuantity = Math.max(Math.ceil(unit.totalHealth / unit.health), 0)
                                const casualties = unit.quantity - newQuantity
                                unit.quantity = newQuantity
                                defWall.boulders.quantity = Math.max((defWall.boulders.quantity - casualties), 0)
                                
                                if (attackerCasualties[key]) {
                                    attackerCasualties[key].amount += casualties
                                }
                                else {
                                    attackerCasualties[key] = {
                                        name: unit.name,
                                        amount: casualties
                                    }
                                }
                                siegeBonus = 0.25 //there are better ways to do this i know

                            }



                    }
                    if (unit.quantity <= 0) {
                        unit.dead = true
                        found = true
                        break
                    }

                    const baseAttack = unit.totalAttack * (1 + siegeBonus)
                    const wallDefense = defWall.defense ?? 0
                    const effectiveWallDefense = wallDefense > 0 ? (unit.group === "siege" ? wallDefense * 0.6 : wallDefense) : 0
                    const effectiveDamage = effectiveWallDefense > 0 ? baseAttack / effectiveWallDefense : baseAttack

                    roundLog.events.push({
                        type: "wallAttack",
                        attacker: unit.name,
                        group: unit.group,
                        baseAttack,
                        wallDefense: defWall.defense,
                        effectiveWallDefense,
                        effectiveDamage,
                        preHealth: defWall.wallHealth
                    })

                    defWall.wallHealth -= effectiveDamage
                    if (defWall.towers.quantity > 0) {
                        const archerAmountDestroyed = Math.round(effectiveDamage / defWall.towers.towers.health)
                        defWall.towers.quantity = Math.max(defWall.towers.quantity - archerAmountDestroyed, 0)

                    }
                    if (defWall.wallHealth <= 0) { //again req wall health to be 0
                        defWall.dead = true //yes i realize wall i could have called target as well but i feel since its only wall this is clear
                    }
                    found = true
                    continue
                }
                if (targetPriority && targetPriority !== target.name) continue //ensures troop is allowed to attack


                    const baseAttack = unit.totalAttack / target.defense
                    roundLog.events.push({
                        type: "attack",
                        attacker: unit.name,
                        target: target.name,
                        baseAttack,
                        targetDefense: target.defense
                    })
                    target.totalHealth = target.totalHealth - baseAttack
                    const newQuantity = Math.max(Math.ceil(target.totalHealth / target.health), 0)
                    const casualties = target.quantity - newQuantity
                    target.quantity = newQuantity
                    const key = target.name
                    if (deffenderCasualties[key]){
                        deffenderCasualties[key].amount += casualties
                    }
                    else {
                        deffenderCasualties[key] = {
                            name: target.name,
                            amount: casualties
                        }
                    }
                    if (target.quantity <= 0) {
                        target.dead = true
                        found = true
                        break
                    }
                target.totalAttack = target.quantity * target.attack
                target.totalHealth = target.quantity * target.health
                found = true
                break
                }
            }
            if (!found) {
                unit.line = unit.line - unit.moveSpeed
                if (unit.line <= 13) {
                    unit.line = 13 //prevents runaway troops
                }
            }
        }
    })

    attackerSide = attackerSide.filter(u => !u.dead);
    deffenderSide = deffenderSide.filter(u => !u.dead); //wall will nort be filtered out if it does not have wall.dead = true if wall health is above 0 its not true
    const attackerSurvivors = {}
    const deffenderSurvivors = {}
    let wallReturn = {
                health: defWall.wallHealth,
                defense: defWall.defense,
                towers: defWall.towers,
                abatis: defWall.abatis,
                traps: defWall.traps,
                boulders: defWall.boulders
    } //defined 1 time not defined earlier

    attackerSide.forEach(unit => {
        attackerSurvivors[unit.name] = {
            quantity: unit.quantity,
            line: unit.line,
            troop: unit.troopObj
        }
    })
    let logId = 0
    deffenderSide.forEach(unit => {
        let logFull = "deffenderSide" + logId
        logging[logFull] = unit.name
        logId++
        if (unit.name === "wall") {
            wallReturn = { //not being set right
                health: defWall.wallHealth,
                defense: defWall.defense,
                towers: defWall.towers,
                abatis: defWall.abatis,
                traps: defWall.traps,
                boulders: defWall.boulders
            }
            return
        }
        deffenderSurvivors[unit.name] = {
            quantity: unit.quantity,
            line: unit.line,
            troop: unit.troopObj
        }
    })
    roundLog.wallEnd = {
        health: defWall.wallHealth,
        defense: defWall.defense,
        towers: defWall.towers.quantity,
        traps: defWall.traps.quantity,
        abatis: defWall.abatis.quantity,
        boulders: defWall.boulders.quantity
    }
    roundLog.attackerEnd = {}
    roundLog.defenderEnd = {}
    attackerSide.forEach(unit => {
        roundLog.attackerEnd[unit.name] = { quantity: unit.quantity, line: unit.line }
    })
    deffenderSide.forEach(unit => {
        if (unit.name === "wall") return
        roundLog.defenderEnd[unit.name] = { quantity: unit.quantity, line: unit.line }
    })
    logHistory.push(roundLog)
    console.log(logging)
    if (attackerSide.length <= 0) { 
        return {
            winner: "Defender",
            deffenderSurvivors: deffenderSurvivors,
            attackerCasualties: attackerCasualties,
            deffenderCasualties: deffenderCasualties,
            wallReturn: wallReturn, //is comming back as {}
            round: round,
            logHistory: logHistory
        }
    }

    if (deffenderSide.length <= 0) { 
        return {
            winner: "Attacker",
            attackerSurvivors: attackerSurvivors,
            attackerCasualties: attackerCasualties,
            deffenderCasualties: deffenderCasualties,
            round: round,
            logHistory: logHistory
        }
    }

    const newRound = round + 1

    return armyCalculations(
    attackerSurvivors,
    deffenderSurvivors,
    wallReturn,
    newRound,
    attackerCasualties,
    deffenderCasualties,
    aTech,
    dTech,
    logHistory
    )
}
