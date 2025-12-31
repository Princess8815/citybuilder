import { buildings, saveBuildings } from "../builds/buildings.js";
import { resources, saveResources, updateResourceDisplay } from "../resources/resources.js";
import { updateBuildButtons } from "./buildMenu.js";

function getBuilders() {
  return JSON.parse(localStorage.getItem("builders")) ?? {
    total: 2,
    busy: 0
  };
}

function saveBuildersState(state) {
  localStorage.setItem("builders", JSON.stringify(state));
}


document.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-building]");
  if (!button) return;

  const key = button.dataset.building;
  build(key);
});

function build(key) {
    const building = buildings[key];

    const buildersState = getBuilders();

    if (buildersState.busy >= buildersState.total) {
    console.log("No free builders");
    return;
    }


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
    building.cost[resource] = Math.floor(building.cost[resource] * building.growth); // increase cost by 15%
    }

    resources.land -= 1; // decrease land by 1
    buildersState.busy++;
    saveBuildersState(buildersState);

    const finishAt = Date.now() + building.time;

    const job = {
    buildingKey: key,
    finishAt
    };

    let jobs = JSON.parse(localStorage.getItem("buildJobs")) ?? [];
    jobs.push(job);
    localStorage.setItem("buildJobs", JSON.stringify(jobs));


    Math.floor(building.time = building.time * building.growth)

  }

  function renderBuildTimers() {
    renderBuilders()

    const container = document.getElementById("buildTimers");
    container.innerHTML = "";

    const jobs = JSON.parse(localStorage.getItem("buildJobs")) ?? [];
    const now = Date.now();

    jobs.forEach((job, index) => {
        const remaining = Math.max(0, job.finishAt - now);

        const seconds = Math.ceil(remaining / 1000);

        const div = document.createElement("div");
        div.textContent = `${job.buildingKey} — ${seconds}s remaining`;
        container.appendChild(div);

        // Finish job if done
        if (remaining === 0) {
            const building = buildings[job.buildingKey];
            building.count++;

            const buildersState = getBuilders();
            buildersState.busy = Math.max(0, buildersState.busy - 1);
            saveBuildersState(buildersState);

            jobs.splice(index, 1);
            saveBuildings();
        }

    });

    localStorage.setItem("buildJobs", JSON.stringify(jobs));
}

function renderBuilders() {
    const el = document.getElementById("builderStatus");

    const builders = JSON.parse(localStorage.getItem("builders")) ?? {
        total: 2,
        busy: 0
    };

    const free = builders.total - builders.busy;
    el.textContent = `Builders: ${free} / ${builders.total}`;
    }

setInterval(renderBuildTimers, 1000);


