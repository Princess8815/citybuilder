

export const woodcutting = {
  woodenAxe: {
    name: "Wooden Axes",
    description: "increases wood production by 1% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "production",
    upgrades: { woodcutting: 1 },
    requires: {research: ["woodenHoe"]},
    era: "Ancient",
    time: 2000
  },

  ironAxe: {
    name: "Iron Axes",
    description: "increases wood production by 2% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "production",
    upgrades: { woodcutting: 2 },
    requires: ["woodenAxe"],
    era: "Bronze",
    time: 2000
  },

  diamondAxe: {
    name: "Diamond Axes",
    description: "increases wood production by 5% per level max 10",
    maxLevel: 10,
    current: 0,
    pointCost: 1,
    branch: "production",
    upgrades: { woodcutting: 5 },
    requires: [],
    era: "Medieval",
    time: 2000
  },
};
