import "./menus/buildMenu.js";
import "./resources/resources.js";
import "./menus/build.js";
import "./menus/world.js";

import { getOrInitCoords, navigateTo, initWorld } from "./menus/world.js";

import { resources, saveResources } from "./resources/resources.js";


export function resetAllLocalStorage() {
  clearInterval(window.resourceInterval);
  localStorage.clear();
    resources.population = 5;
    resources.food = 100;
    resources.wood = 100;
    resources.stone = 100;
    resources.iron = 100;
    resources.land = 50;
    saveResources();
    localStorage.removeItem("worldGenerated");
  location.reload();
}


document.getElementById("reset")?.addEventListener("click", () => {
  if (confirm("This will delete ALL progress. Are you sure?")) {
    resetAllLocalStorage();
  }
});

document.querySelectorAll(".nav-link[data-section]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const section = link.dataset.section;

    // toggle active nav state
    document.querySelectorAll(".nav-link[data-section]")
      .forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // hide all views
    document.querySelectorAll(".game-view")
      .forEach(view => view.classList.add("d-none"));

    // show selected view
    document.getElementById(`view-${section}`)
      ?.classList.remove("d-none");
  });
});

document.getElementById("world")?.addEventListener("click", (e) => {
  e.preventDefault();

  initWorld();

  const cityCoords = getOrInitCoords();

  // go UP from city → state, render only
  navigateTo("state", cityCoords, "up");
});




