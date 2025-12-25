import { buildings, saveBuildings } from "../builds/buildings.js";
import { resources, saveResources, updateResourceDisplay } from "../resources/resources.js";
import { updateBuildButtons } from "./buildMenu.js";

document.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-building]");
  if (!button) return;

  const key = button.dataset.building;
  build(key);
});

function build(key) {
  const building = buildings[key];

  // example cost check
  for (const resource in building.cost) {
    if (resources[resource] < building.cost[resource]) {
      console.log("Not enough", resource);
      return;
    }
  }

  // pay cost
// 1️⃣ Check if player can afford it
for (const resource in building.cost) {
  if ((resources[resource] ?? 0) < building.cost[resource]) {
    console.log(`Not enough ${resource}`);
    return; // stop build
  }
  if (resources.land < 1) {
    console.log("Not enough land");
    return; // stop build
}
}

// 2️⃣ Pay the cost (only runs if check passed)
for (const resource in building.cost) {
  resources[resource] -= building.cost[resource];
  building.cost[resource] = Math.floor(building.cost[resource] * 1.15); // increase cost by 15%
}

  resources.land -= 1; // decrease land by 1
  building.count = (building.count || 0) + 1;


  //console.log(`Built ${building.name}`);
  saveResources();
  saveBuildings();
  updateResourceDisplay();
  updateBuildButtons();
  }

