

export const farm = {
    woodenHoe: {
        name: "Wooden Hoes",
        description: "increases food prod by 1% per level max 10",
        maxLevel: 10,
        current: 0,
        pointCost: 1,
        branch: "production",
        upgrades: {farming: 1},
        requires: [],
        era: "Ancient",
        time: 2000
  },

    ironHoe: {
        name: "Iron Hoes",
        description: "increases food prod by 2% per level max 10",
        maxLevel: 10,
        current: 0,
        pointCost: 1,
        branch: "production",
        upgrades: {farming: 2},
        requires: [],
        era: "Ancient",
        time: 2000
  },

    diamondHoe: {
        name: "Diamond Hoes",
        description: "increases food prod by 2% per level max 10",
        maxLevel: 10,
        current: 0,
        pointCost: 1,
        branch: "production",
        upgrades: {farming: 5},
        requires: [],
        era: "Ancient",
        time: 2000
  },
}