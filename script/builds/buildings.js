
export const buildings =
  JSON.parse(localStorage.getItem("buildings")) ?? {
    hut:        { name: "Hut",        type: "housing",    population: 5,  cost: { wood: 10, stone: 5 }, count: 1 },
    house:      { name: "House",      type: "housing",    population: 15, cost: { wood: 30, stone: 15 }, count: 0 },
    lumberCamp: { name: "Lumber Camp",type: "production", cost: { wood: 20, stone: 10 }, prod: { wood: 1 }, count: 1 },
    quarry:     { name: "Quarry",     type: "production", cost: { wood: 15, stone: 25 }, prod: { stone: 1 }, count: 1 },
    farm:       { name: "Farm",       type: "production", cost: { wood: 10, stone: 15 }, prod: { food: 1 }, count : 1 },
    ironMine:   { name: "Iron Mine",  type: "production", cost: { wood: 25, stone: 30 }, prod: { iron: 1 }, count :1 },
    temple:     { name: "Temple",     type:"special",    cost:{ wood :25 ,stone :30}, count :0 },
    workshop:   { name: "Workshop",   type: "special",    cost: { wood: 20, stone: 20 }, count: 0 }
  };

export function saveBuildings() {
  localStorage.setItem("buildings", JSON.stringify(buildings));
}