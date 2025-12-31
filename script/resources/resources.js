import { buildings } from "../builds/buildings.js";
import { updateBuildButtons } from "../menus/buildMenu.js";
import { addRawResearch } from "../main.js";
import { tech, addTechMulti} from "../builds/unlocks.js";

export let resources = localStorage.getItem("resources")
  ? JSON.parse(localStorage.getItem("resources"))
  : {
      population: 5,
      food: 100,
      wood: 100,
      stone: 100,
      iron: 100,
      land: 500
      
    };

export function saveResources() {
  localStorage.setItem("resources", JSON.stringify(resources));
}

export function incOrDecResources(resource, amount) {
    resources[resource] = (resources[resource] || 0) + amount;
    saveResources();
    updateResourceDisplay();
}

const resourcesElement = document.getElementById("resources");

export function updateResourceDisplay() {
    const researchObj = addRawResearch()
    const resPoints = researchObj.points
resourcesElement.innerHTML = 
` Population: ${resources.population} ||
  Food: ${resources.food} |
  Wood: ${resources.wood} |
  Stone: ${resources.stone} |
  Iron: ${resources.iron} ||
    Land: ${resources.land}
    research points ${resPoints}
`;
}

const setResources = setInterval(() => {
    updateResourceDisplay();
    resourceProduction();
    updateBuildButtons();
    saveResources();
    increasePopulation(1);
}, 1000);

function resourceProduction() {
    Object.keys(buildings).forEach((key) => {
        const building = buildings[key];
        if (building.prod) {
            Object.keys(building.prod).forEach((res) => {
                const buildingQuantity = building.count || 0;
                const grossTotalProduction = building.prod[res] * buildingQuantity;
                const netTotalProduction = Math.round(grossTotalProduction * addTechMulti(res))
                console.warn(netTotalProduction)
                resources[res] += netTotalProduction;
            });
        }
        if (building.tech) {
            Object.keys(building.tech).forEach((res) => {
                const buildingQuantity = building.count || 0;
                const totalTech = building.tech[res] * buildingQuantity;
                addRawResearch(totalTech)
                
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

export function increasePopulation(amount) {
    const capacity = popCapacity();
    if (resources.population + amount <= capacity) {
        resources.population += amount;
    } else {
        resources.population = capacity;
    }
    saveResources();
    updateResourceDisplay();
}

