import { troops } from "./militaryIndex.js";
import { walls } from "./wall.js";
import { armyCalculations } from "./militaryCalculations.js";

const COMBAT_TECH_KEYS = [
  "infantry",
  "archery",
  "cavalry",
  "siege",
  "defense",
  "cavalryDefense",
  "siegeDefense",
  "footHealth",
  "horseHealth",
  "siegeHealth"
];

function normalizeTech(raw = {}) {
  return {
    infantry: raw.infantry ?? 0,
    archery: raw.archery ?? 0,
    cavalry: raw.cavalry ?? 0,
    siege: raw.siege ?? 0,

    // match YOUR calc's misspellings
    defence: raw.defense ?? 0,
    cavalryDefence: raw.cavalryDefense ?? 0,
    siegeDefence: raw.siegeDefense ?? 0,

    footHealth: raw.footHealth ?? 0,
    horseHealth: raw.horseHealth ?? 0,
    siegeHealth: raw.siegeHealth ?? 0,
  };
}

function readNum(input, fallback = 0) {
  const n = Number(input.value);
  return Number.isFinite(n) ? n : fallback;
  // or: const n = input.valueAsNumber; return Number.isFinite(n) ? n : fallback;
}


function makeRow(labelText) {
  const row = document.createElement("div");
  row.style.display = "grid";
  row.style.gridTemplateColumns = "150px 80px 160px";
  row.style.gap = "8px";
  row.style.alignItems = "center";
  row.style.marginBottom = "4px";

  const label = document.createElement("span");
  label.textContent = labelText;

  row.appendChild(label);
  return { row };
}


function buildTechSection(title, side) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `<h6>${title} Tech</h6>`;

  COMBAT_TECH_KEYS.forEach(key => {
    const { row } = makeRow(key);

    const input = document.createElement("input");
    input.type = "number";
    input.value = "0";
    input.style.width = "70px";
    input.dataset.tech = key;
    input.dataset.side = side;

    const spacer = document.createElement("span"); // placeholder column

    row.append(input, spacer);
    wrap.appendChild(row);
  });

  return wrap;
}

function buildWallSection() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `<h6>Defender Walls</h6>`;

  /* -------- Global Wall Health -------- */
  {
    const { row } = makeRow("Wall Health");

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.value = "0";
    input.style.width = "70px";
    input.dataset.wallHealth = "true";

    const spacer = document.createElement("span");

    row.append(input, spacer);
    wrap.appendChild(row);
  }

  /* -------- Individual Wall Structures -------- */
  Object.entries(walls).forEach(([key, wall]) => {
    const { row } = makeRow(wall.name);

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.value = "0";
    input.style.width = "70px";
    input.dataset.wall = key;

    const spacer = document.createElement("span");

    row.append(input, spacer);
    wrap.appendChild(row);
  });

  return wrap;
}


function buildTroopSection(title, side, casualties = {}) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `<h6>${title}</h6>`;

  Object.entries(troops).forEach(([groupKey, groupValue]) => {
    Object.entries(groupValue).forEach(([key, troop]) => {
      const { row } = makeRow(troop.name);

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = "0";
      input.style.width = "70px";
      input.dataset.troop = key;
      input.dataset.side = side;

      const loss = document.createElement("span");
      loss.textContent = `Lost: ${casualties[key]?.amount ?? 0}`;

      row.append(input, loss);
      wrap.appendChild(row);
    });
  });

  return wrap;
}


export function showSimulater(
  attackerCasualties = {},
  defenderCasualties = {}
) {
  const container = document.getElementById("simulator-forms");
  container.innerHTML = "";

  const attackerForm = document.createElement("div");
  attackerForm.className = "simulator-form";

  const defenderForm = document.createElement("div");
  defenderForm.className = "simulator-form";

  // 🔹 TECH FIRST
  attackerForm.appendChild(buildTechSection("Attacker", "attacker"));
  defenderForm.appendChild(buildTechSection("Defender", "defender"));

  // 🔹 WALLS (defender only)
  

  // 🔹 TROOPS LAST
  attackerForm.appendChild(buildTroopSection("Attacker Army", "attacker", attackerCasualties));
  defenderForm.appendChild(buildTroopSection("Defender Army", "defender", defenderCasualties));

  defenderForm.appendChild(buildWallSection());

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Simulate Battle";
  submitBtn.className = "btn btn-primary mt-2";

submitBtn.onclick = () => {
  // ---------- attacker / defender troop objs ----------
  const attacker = {};
  const deffender = {};

  // attacker inputs: everything inside attackerForm with data-troop
  attackerForm.querySelectorAll("input[data-troop]").forEach(input => {
    const troopKey = input.dataset.troop;
    const qty = readNum(input, 0);

    if (qty > 0) {
      // find troopObj from troops by key (you already have troops imported)
      const troopObj =
        Object.values(troops)
          .flatMap(group => Object.entries(group))
          .find(([k]) => k === troopKey)?.[1];

      if (troopObj) {
        attacker[troopKey] = { quantity: qty, troop: troopObj };
      }
    }
  });

  defenderForm.querySelectorAll("input[data-troop]").forEach(input => {
    const troopKey = input.dataset.troop;
    const qty = readNum(input, 0);

    if (qty > 0) {
      const troopObj =
        Object.values(troops)
          .flatMap(group => Object.entries(group))
          .find(([k]) => k === troopKey)?.[1];

      if (troopObj) {
        deffender[troopKey] = { quantity: qty, troop: troopObj };
      }
    }
  });

  // ---------- tech ----------
  const aTechRaw = {};
  const dTechRaw = {};

  attackerForm.querySelectorAll("input[data-tech]").forEach(input => {
    aTechRaw[input.dataset.tech] = readNum(input, 0);
  });

  defenderForm.querySelectorAll("input[data-tech]").forEach(input => {
    dTechRaw[input.dataset.tech] = readNum(input, 0);
  });

  const aTech = normalizeTech(aTechRaw);
  const dTech = normalizeTech(dTechRaw);

  // ---------- walls ----------
  const wall = {
    health: 0,
    towers: { quantity: 0, towers: walls.archerTowers },
    traps: { quantity: 0, traps: walls.traps },
    abatis: { quantity: 0, abatis: walls.abatis },
    boulders: { quantity: 0, boulders: walls.boulders },
  };

  // if you made a health input, give it data-wallhealth="true" or similar
  const wallHealthInput = defenderForm.querySelector("input[data-wall-health]");

  wall.health = wallHealthInput ? readNum(wallHealthInput, 0) : 0;
  console.log("wall health input", wallHealthInput)

  // your buildWallSection uses data-wall=key
  defenderForm.querySelectorAll("input[data-wall]").forEach(input => {
    const key = input.dataset.wall; // "traps" | "archerTowers" | "abatis" | "boulders"
    const qty = readNum(input, 0);

    if (key === "archerTowers") wall.towers.quantity = qty;
    if (key === "traps") wall.traps.quantity = qty;
    if (key === "abatis") wall.abatis.quantity = qty;
    if (key === "boulders") wall.boulders.quantity = qty;
  });
  console.log("wall", wall)
  // ---------- run sim ----------
  const result = armyCalculations(attacker, deffender, wall, 0, {}, {}, aTech, dTech);

  console.log("RESULT", result);

  // re-render UI with casualties (and optionally survivors)
  showSimulater(result.attackerCasualties ?? {}, result.deffenderCasualties ?? {});
};



  container.append(attackerForm, defenderForm, submitBtn);
}


function randomTech() {
  return {
    infantry: Math.floor(Math.random() * 50),
    archery: Math.floor(Math.random() * 50),
    cavalry: Math.floor(Math.random() * 50),
    siege: Math.floor(Math.random() * 50),

    defense: Math.floor(Math.random() * 50),
    cavalryDefense: Math.floor(Math.random() * 50),
    siegeDefense: Math.floor(Math.random() * 50),

    footHealth: Math.floor(Math.random() * 50),
    horseHealth: Math.floor(Math.random() * 50),
    siegeHealth: Math.floor(Math.random() * 50),
  };
}

function randomArmy(startLine) {
  const army = {};
  Object.values(troops).forEach(group => {
    Object.entries(group).forEach(([key]) => {
      if (Math.random() < 0.4) return;

      army[key] = {
        quantity: Math.floor(Math.random() * 500),
        line: startLine
      };
    });
  });
  return army;
}

function randomWall() {
  return {
    health: Math.floor(Math.random() * 50000),
    towers: {
      quantity: Math.floor(Math.random() * 20),
      towers: walls.archerTowers
    },
    traps: {
      quantity: Math.floor(Math.random() * 30),
      traps: walls.traps
    },
    abatis: {
      quantity: Math.floor(Math.random() * 20),
      abatis: walls.abatis
    },
    boulders: {
      quantity: Math.floor(Math.random() * 15),
      boulders: walls.boulders
    }
  };
}


for (let i = 0; i < 1; i++) {
  const attacker = randomArmy(25);
  const defender = randomArmy(1);

  const aTech = randomTech();
  const dTech = randomTech();
  const wall = randomWall();
  console.log(wall)

  const result = armyCalculations(
    attacker,
    defender,
    wall,
    0,
    {},
    {},
    aTech,
    dTech
  );

  console.log(result)

  if (!result || Number.isNaN(result.round)) {
    console.log("💀 BROKE", {
      iteration: i,
      attacker,
      defender,
      wall,
      aTech,
      dTech,
      result
    });
    break;
  }
}



