

export const ancientToMedevilCalvalry = {
  lightCavalry: {
    name: "Light Cavalry",
    attack: 4,
    defense: 2,
    health: 22,
    accuracy: 1,
    attackSpeed: 1.2,
    load: 20,
    range: 1,
    speed: 120,
    pop: 1,
    move: 5,
    resourceCost: { food: 50, wood: 20 },
    time: 9000,
    age: "bronze",
    upkeep: 2,
    trait: ["none"],
    recruitment: "stable"
  },

  armoredCavalry: {
    name: "Armored Cavalry",
    attack: 7,
    defense: 6,
    health: 35,
    accuracy: 1,
    attackSpeed: 1,
    load: 25,
    range: 1,
    speed: 90,
    pop: 1,
    move: 4,
    resourceCost: { food: 70, iron: 25 },
    time: 15000,
    age: "medevil",
    upkeep: 4,
    trait: ["none"],
    recruitment: "stable"
  },

  mountedArcher: {
    name: "Mounted Archer",
    attack: 5,
    defense: 3,
    health: 26,
    accuracy: 3,
    attackSpeed: 1,
    load: 18,
    range: 7,
    speed: 140,
    pop: 1,
    move: 6,
    resourceCost: { food: 60, wood: 25, iron: 5 },
    time: 12000,
    age: "medevil",
    upkeep: 3,
    trait: ["none"],
    recruitment: "stable"
  }
};
