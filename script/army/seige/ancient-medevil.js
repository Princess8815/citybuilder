

export const ancientToMedevilSiege = {
  ballista: {
    name: "Ballista",
    attack: 10,
    defense: 2,
    health: 40,
    accuracy: 3,
    attackSpeed: 0.6,
    load: 30,
    range: 10,
    speed: 4,
    pop: 2,
    move: 1,
    resourceCost: { wood: 80, iron: 30 },
    time: 16000,
    age: "medevil",
    upkeep: 4,
    trait: ["none"],
    recruitment: "siegeWorkshop"
  },

  batteringRam: {
    name: "Battering Ram",
    attack: 12,
    defense: 6,
    health: 80,
    accuracy: 1,
    attackSpeed: 0.4,
    load: 50,
    range: 1,
    speed: 2,
    pop: 3,
    move: 1,
    resourceCost: { wood: 120, iron: 20 },
    time: 18000,
    age: "medevil",
    upkeep: 5,
    trait: { target: "wall" },
    recruitment: "siegeWorkshop"
  },

  catapult: {
    name: "Catapult",
    attack: 150,
    defense: 2,
    health: 45,
    accuracy: 2,
    attackSpeed: 0.3,
    load: 60,
    range: 12,
    speed: 3,
    pop: 3,
    move: 1,
    resourceCost: { wood: 100, stone: 80, iron: 25 },
    time: 20000,
    age: "medevil",
    upkeep: 6,
    trait: ["none"],
    recruitment: "siegeWorkshop"
  }
};
