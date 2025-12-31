import { troops } from "./militaryIndex.js"

export function GetAddOrRemoveArmy(cityID, troopKey = null, mode = "get", amount = 0) {
    let armyTotal = JSON.parse(localStorage.getItem(cityID))
    if (!armyTotal) {
        armyTotal = {}
        Object.entries(troops).forEach(([groupKey, groupValue]) => {
            Object.entries(groupValue).forEach(([key, value]) => {
                armyTotal[key] = {
                    quantity: 0,
                    troop: value
                }
            })
        })
    }

    if (!troopKey){
        localStorage.setItem(cityID, JSON.stringify(armyTotal))
        return armyTotal
    }

    if (!armyTotal[troopKey]) {
        if (!recheckTroopsToUpdate(troopKey, cityID)) {
            console.log("key was an invalid troop")
            return
        }
        armyTotal = JSON.parse(localStorage.getItem(cityID))
    
    }

    switch (mode) {
        case "add":
            armyTotal[troopKey].quantity += amount
            break
        case "remove":
            if (armyTotal[troopKey].quantity < amount) {
                console.log("not enough troops to remove")
            }
            else {
                armyTotal[troopKey].quantity -= amount
            }
            break
    }
    localStorage.setItem(cityID, JSON.stringify(armyTotal))
    return armyTotal[troopKey]
}

function recheckTroopsToUpdate (key, cityID) {
    let found = false
    Object.entries(troops).forEach(([groupKey, groupValue]) => {
        const hit = Object.entries(groupValue).find(([k, v]) => k === key);

        if (hit) {
            found = true
            const [foundKey, foundTroopObj] = hit;

            const armyToUpdate = JSON.parse(localStorage.getItem(cityID));

            armyToUpdate[foundKey] = {
                quantity: 0,
                troop: foundTroopObj
            };
            localStorage.setItem(cityID, JSON.stringify(armyToUpdate))
        }
    })
    return found
}