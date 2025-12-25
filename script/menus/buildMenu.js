import { buildings } from "../builds/buildings.js";
import { resources } from "../resources/resources.js"; // or wherever they live

const houseBuilds = document.getElementById("housing");
const productionBuilds = document.getElementById("production");
const specialBuilds = document.getElementById("special");

export function createBuildButton() {
  Object.keys(buildings).forEach((key) => {
    const building = buildings[key];

    const button = document.createElement("button");
    button.classList.add("btn", "btn-outline-light", "btn-game", "mb-2");
    button.type = "button";
    button.textContent = `Build ${building.name} cost: ${Object.entries(building.cost)
      .map(([res, amt]) => `${amt} ${res}`)
      .join(", ")}`;

    button.dataset.building = key; // 🔥 important

    if (building.type === "housing") {
      houseBuilds.appendChild(button);
    } else if (building.type === "production") {
      productionBuilds.appendChild(button);
    } else if (building.type === "special") {
      specialBuilds.appendChild(button);
    }
  });
}
 

createBuildButton();


export function updateBuildButtons() {
  document.querySelectorAll("button[data-building]").forEach((button) => {
    const key = button.dataset.building;
    const building = buildings[key];

    // rebuild label (in case costs change later)
    button.textContent = `Build ${building.name} cost: ${Object.entries(building.cost)
      .map(([res, amt]) => `${amt} ${res}`)
      .join(", ")}`;

    // affordability check
    const canAfford = Object.entries(building.cost)
      .every(([res, amt]) => (resources[res] ?? 0) >= amt);

    button.disabled = !canAfford;
  });
}
