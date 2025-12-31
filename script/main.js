import "./menus/buildMenu.js";
import "./resources/resources.js";
import "./menus/build.js";
import "./menus/world.js";
import "./menus/techMenu.js"
import "./army/simulater.js"

import { levelToArea } from "./menus/world.js";

import { resources, saveResources } from "./resources/resources.js";

import { showSimulater } from "./army/simulater.js";

showSimulater()

selectDifficulty()


export function resetAllLocalStorage() {
  clearInterval(window.resourceInterval);
  localStorage.clear();
    resources.population = 5;
    resources.food = 100;
    resources.wood = 100;
    resources.stone = 100;
    resources.iron = 100;
    resources.land = 500;
    saveResources();
    localStorage.removeItem("worldGenerated");
    localStorage.setItem("currentCoords", JSON.stringify({
            superCluster: 0,
            cluster: 0,
            galaxy: 0,
            planet: 0,
            continent: 0,
            nation: 0,
            state: 0
    }))
    //selectDifficulty(); commented cause its driving me crazy
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
    const coords = JSON.parse(localStorage.getItem("currentCoords")); //set on reset so shouldnt need an if

    levelToArea(coords, "city");

});

export function selectDifficulty() {
  let difficulty = localStorage.getItem("difficulty");
  if (difficulty) return difficulty;

  const choice = prompt(
`Select Difficulty: this cannot be changed later
0 - Peaceful for relaxing game
1 - Easy reccommended for beginners
2 - Normal for casual gamers
3 - Hard you are insane`,
"2"
  );

  const map = {
    "0": "Peaceful",
    "1": "Easy",
    "2": "Normal",
    "3": "Hard"
  };

  difficulty = map[choice] ?? "Normal";

  localStorage.setItem("difficulty", difficulty);
  return difficulty;
}


export function renderProgressBar(parent, current, max, options = {}) {
  const rawPercent = (current / max) * 100;
  const percent = Math.max(0, Math.min(100, rawPercent));

  let bar = parent.querySelector(".progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "progress";
    bar.style.width = "100%";
    bar.style.height = options.height ?? "20px";
    bar.style.background = "#333";
    bar.style.borderRadius = "6px";
    bar.style.overflow = "hidden";

    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.height = "100%";
    fill.style.width = "0%";
    fill.style.background = options.color ?? "#4caf50";
    fill.style.transition = "width 0.2s linear";

    bar.appendChild(fill);
    parent.appendChild(bar);
  }

  const fill = bar.querySelector(".progress-fill");
  fill.style.width = `${percent}%`;

  // ✅ RETURN STATUS
  return {
    full: current >= max,
    overflow: Math.max(0, current - max)
  };
}

export function addRawResearch(amount = 0) {
  let researchPoints = JSON.parse(localStorage.getItem("researchPoints"));
  if (!researchPoints) {
    researchPoints = {
      rawResearch: 0,
      researchPoints: 0,
      nextPoint: 83
    };
  }

  researchPoints.rawResearch += amount;

  const researchEl = document.getElementById("research");

  // 🔁 Handle overflow properly
  while (true) {
    const result = renderProgressBar(
      researchEl,
      researchPoints.rawResearch,
      researchPoints.nextPoint
    );

    if (!result.full) break;

    researchPoints.rawResearch = result.overflow;
    researchPoints.researchPoints++;
    researchPoints.nextPoint = Math.floor(researchPoints.nextPoint * 1.1);
  }

  // final render (in case loop didn’t run)
  renderProgressBar(
    researchEl,
    researchPoints.rawResearch,
    researchPoints.nextPoint
  );

  // 💾 SAVE STATE
  localStorage.setItem("researchPoints", JSON.stringify(researchPoints));

  return {
    points: researchPoints.researchPoints,
    raw: researchPoints.rawResearch,
    next: researchPoints.nextPoint
  }
}











