export const infantry = {
  woodenSword: {
    name: "Wooden Swords",
    description: "increases infantry attack by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { infantry: 1 },
    requires: [],
    era: "Ancient",
    time: 2000
  },

  ironSword: {
    name: "Iron Swords",
    description: "increases infantry attack by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { infantry: 2 },
    requires: [],
    era: "Bronze",
    time: 2000
  },

  diamondSword: {
    name: "Diamond Swords",
    description: "increases infantry attack by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { infantry: 5 },
    requires: [],
    era: "Medieval",
    time: 2000
  },
};


export const archery = {
  shortBow: {
    name: "Short Bows",
    description: "increases archer attack by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { archery: 1 },
    requires: [],
    era: "Ancient",
    time: 2000
  },

  longBow: {
    name: "Long Bows",
    description: "increases archer attack by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { archery: 2 },
    requires: [],
    era: "Medieval",
    time: 2000
  },

  compositeBow: {
    name: "Composite Bows",
    description: "increases archer attack by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { archery: 5 },
    requires: [],
    era: "Renaissance",
    time: 2000
  },
};

export const cavalry = {
  lightCavalry: {
    name: "Light Cavalry",
    description: "increases cavalry speed and attack by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { cavalry: 1 },
    requires: [],
    era: "Ancient",
    time: 2000
  },

  heavyCavalry: {
    name: "Heavy Cavalry",
    description: "increases cavalry speed and attack by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { cavalry: 2 },
    requires: [],
    era: "Medieval",
    time: 2000
  },

  armoredCavalry: {
    name: "Armored Cavalry",
    description: "increases cavalry speed and attack by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { cavalry: 5 },
    requires: [],
    era: "Renaissance",
    time: 2000
  },
};

export const siege = {
  batteringRam: {
    name: "Battering Rams",
    description: "increases siege damage to structures by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { siege: 1 },
    requires: [],
    era: "Ancient",
    time: 2000
  },

  trebuchet: {
    name: "Trebuchets",
    description: "increases siege damage to structures by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { siege: 2 },
    requires: [],
    era: "Medieval",
    time: 2000
  },

  cannon: {
    name: "Cannons",
    description: "increases siege damage to structures by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { siege: 5 },
    requires: [],
    era: "Renaissance",
    time: 2000
  },
};

export const defense = {
  woodenShields: {
    name: "Wooden Shields",
    description: "increases infantry defense by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { defense: 1 },
    requires: [],
    era: "Ancient",
    time: 2000
  },

  ironArmor: {
    name: "Iron Armor",
    description: "increases infantry defense by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { defense: 2 },
    requires: [],
    era: "Bronze",
    time: 2000
  },

  plateArmor: {
    name: "Plate Armor",
    description: "increases infantry defense by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { defense: 5 },
    requires: [],
    era: "Medieval",
    time: 2000
  },
};

export const cavalryDefense = {
  leatherBarding: {
    name: "Leather Barding",
    description: "increases cavalry defense by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { cavalryDefense: 1 },
    requires: [],
    era: "Ancient",
    time: 2000
  },

  chainBarding: {
    name: "Chain Barding",
    description: "increases cavalry defense by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { cavalryDefense: 2 },
    requires: [],
    era: "Bronze",
    time: 2000
  },

  plateBarding: {
    name: "Plate Barding",
    description: "increases cavalry defense by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { cavalryDefense: 5 },
    requires: [],
    era: "Medieval",
    time: 2000
  },
};

export const siegeDefense = {
  reinforcedGates: {
    name: "Reinforced Gates",
    description: "increases city defense against siege damage by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { siegeDefense: 1 },
    requires: [],
    era: "Ancient",
    time: 2000
  },

  stoneWalls: {
    name: "Stone Walls",
    description: "increases city defense against siege damage by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { siegeDefense: 2 },
    requires: [],
    era: "Medieval",
    time: 2000
  },

  bastions: {
    name: "Bastions",
    description: "increases city defense against siege damage by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "military",
    upgrades: { siegeDefense: 5 },
    requires: [],
    era: "Renaissance",
    time: 2000
  },
};
