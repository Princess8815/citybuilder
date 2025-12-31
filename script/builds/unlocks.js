import { TECH_TREE } from "./techTree.js";


export function tech(techName = null, set = false, amount = null) {
    let technology = JSON.parse(localStorage.getItem("technology"));

    if (!technology) {
        technology = {
        // 🧺 Economy / Production
        farming: 0,        // +food %
        woodcutting: 0,    // +wood %
        quarrying: 0,      // +stone %
        mining: 0,         // +iron %
        architecture: 0,   // -build cost %

        // 🧠 Meta
        age: "Ancient",    // Ancient → Stone → Bronze → Medieval → Industrial → Modern → Space → Deep Space → Futuristic

        // ⚔️ Military – Attack
        infantry: 0,       // infantry attack %
        archery: 0,        // archer attack %
        cavalry: 0,        // cavalry attack %
        siege: 0,          // siege damage %

        // 🛡️ Military – Defense
        defense: 0,        // infantry and archerdefense %
        cavalryDefense: 0, // cavalry defense %
        siegeDefense: 0,    // city vs siege defense %

        footHealth: 0, //infantry and archer
        horseHealth: 0, //cavalry
        siegeHealth: 0

        };

    }

    if (set && typeof technology[techName] == "number" && amount !== null) {
        technology[techName] += amount;
    }
    else if (set && typeof technology[techName] == "string" && amount !== null) {
        technology[techName] = amount;
    }
    localStorage.setItem("technology", JSON.stringify(technology));

    return technology;
}

export const ERAS = [
  "Ancient",
  "Stone", //state
  "Bronze",
  "Medieval",  // nation
  "Industrial", //continent
  "Modern",     //planet
  "Space",      //galaxy
  "Deep Space", //cluster
  "Futuristic" //supercluster
];



export function isHigherLevel(a, b, hierarchy) {
  const aIndex = hierarchy.indexOf(a);
  const bIndex = hierarchy.indexOf(b);

  if (aIndex === -1 || bIndex === -1) {
    throw new Error("Invalid hierarchy value");
  }

  return aIndex <= bIndex;
}

export function addTechMulti(res) {
    const techTotal = tech()
    let multi = 0
    switch (res) {
        case "food":
            multi = 1+ (techTotal.farming * 0.01);
            break;
        case "stone":
            multi = 1+ (techTotal.quarrying * 0.01);
            break;
        case "wood":
            multi = 1+ (techTotal.woodcutting * 0.01);
            break;
        case "iron":
            multi = 1+ (techTotal.mining * 0.01);
            break;
        
            
    }
    return multi
}





