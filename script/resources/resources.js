import { buildings } from "../builds/buildings.js";
import { updateBuildButtons } from "../menus/buildMenu.js";

export let resources = localStorage.getItem("resources")
  ? JSON.parse(localStorage.getItem("resources"))
  : {
      population: 5,
      food: 100,
      wood: 100,
      stone: 100,
      iron: 100,
      land: 50
      
    };

export function saveResources() {
  localStorage.setItem("resources", JSON.stringify(resources));
}

const resourcesElement = document.getElementById("resources");

export function updateResourceDisplay() {
resourcesElement.innerHTML = 
` Population: ${resources.population} ||
  Food: ${resources.food} |
  Wood: ${resources.wood} |
  Stone: ${resources.stone} |
  Iron: ${resources.iron} ||
    Land: ${resources.land}
`;
}

const setResources = setInterval(() => {
    updateResourceDisplay();
    resourceProduction();
    updateBuildButtons();
    saveResources();
    increastePopulation(1);
}, 1000);

function resourceProduction() {
    Object.keys(buildings).forEach((key) => {
        const building = buildings[key];
        if (building.prod) {
            Object.keys(building.prod).forEach((res) => {
                const buildingQuantity = building.count || 0;
                const totalProduction = building.prod[res] * buildingQuantity;
                resources[res] += totalProduction;
            });
        }
    });
    saveResources();
}

function popCapacity() {
    let capacity = 0;  
    Object.keys(buildings).forEach((key) => {
        const building = buildings[key];
        if (building.population) {
            const buildingQuantity = building.count || 0;
            capacity += building.population * buildingQuantity;
        }
    });
    return capacity;
}

export function increastePopulation(amount) {
    const capacity = popCapacity();
    if (resources.population + amount <= capacity) {
        resources.population += amount;
    } else {
        resources.population = capacity;
    }
    saveResources();
    updateResourceDisplay();
}