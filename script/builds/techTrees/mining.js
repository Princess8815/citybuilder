

export const mining = {
  woodenPick: {
    name: "Wooden Pickaxes",
    description: "increases stone and iron production by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "production",
    upgrades: { quarrying: 1, mining: 1 },
    requires: ["woodenHoe"],
    era: "Ancient",
    time: 2000
  },

  ironPick: {
    name: "Iron Pickaxes",
    description: "increases stone and iron production by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "production",
    upgrades: { quarrying: 2, mining: 2 },
    requires: [],
    era: "Bronze",
    time: 2000
  },

  diamondPick: {
    name: "Diamond Pickaxes",
    description: "increases stone and iron production by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "production",
    upgrades: { quarrying: 5, mining: 5 },
    requires: [],
    era: "Medieval",
    time: 2000
  },
};
