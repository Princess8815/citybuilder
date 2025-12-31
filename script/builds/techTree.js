import { farm } from "./techTrees/farming.js"; 
import { woodcutting } from "./techTrees/woodcutting.js";
import { mining } from "./techTrees/mining.js";
import { infantry, archery, cavalry, siege, cavalryDefense, defense, siegeDefense } from "./techTrees/militaryStart.js";


export const TECH_TREE = JSON.parse(localStorage.getItem("research")) ?? {
    ...farm,
    ...woodcutting,
    ...mining,
    ...infantry,
    ...archery,
    ...cavalry,
    ...siege,
    ...cavalryDefense,
    ...defense,
    ...siegeDefense

};

export function saveTech() {
  localStorage.setItem("research", JSON.stringify(TECH_TREE));
} 
