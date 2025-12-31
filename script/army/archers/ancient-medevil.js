

export const ancientToMedevilArchers = {
  slinger: {
    name: "Slinger",
    attack: 2,
    defense: 1,
    health: 10,
    accuracy: 1,
    attackSpeed: 1.1,
    load: 8,
    range: 6,
    speed: 10,
    pop: 1,
    move: 1,
    resourceCost: { wood: 10, stone: 15, food: 15 },
    time: 6000,
    age: "stone",
    upkeep: 1,
    trait: ["none"],
    recruitment: "shooting range"
  },

  archer: {
    name: "Archer",
    attack: 4,
    defense: 2,
    health: 14,
    accuracy: 2,
    attackSpeed: 1.0,
    load: 10,
    range: 8,
    speed: 9,
    pop: 1,
    move: 1,
    resourceCost: { wood: 25, food: 25, iron: 5 },
    time: 9000,
    age: "bronze",
    upkeep: 2,
    trait: ["none"],
    recruitment: "shooting range"
  },

  crossbow: {
    name: "Crossbowman",
    attack: 6,
    defense: 3,
    health: 18,
    accuracy: 3,
    attackSpeed: 0.8,
    load: 12,
    range: 9,
    speed: 8,
    pop: 1,
    move: 1,
    resourceCost: { wood: 20, iron: 15, food: 35 },
    time: 12000,
    age: "medevil",
    upkeep: 3,
    trait: ["none"],
    recruitment: "shooting range"
  }
};
