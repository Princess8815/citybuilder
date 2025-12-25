function loadWorld() {
  return JSON.parse(localStorage.getItem("world")) ?? {};
}

export function proceduralWorldGeneration(level, coords) {
  const world = loadWorld();

  // Ensure root path
  const scKey = `superCluster${coords.superCluster ?? 0}`;
  const clKey = `cluster${coords.cluster ?? 0}`;
  const gKey  = `galaxy${coords.galaxy ?? 0}`;
  const pKey  = `planet${coords.planet ?? 0}`;
  const cKey  = `continent${coords.continent ?? 0}`;
  const nKey  = `nation${coords.nation ?? 0}`;
  const sKey  = `state${coords.state ?? 0}`;

const sc = ensure(world, scKey, { coords });

const clusters   = ensure(sc, "clusters", {});
const cl         = ensure(clusters, clKey, { coords });

const galaxies   = ensure(cl, "galaxies", {});
const g          = ensure(galaxies, gKey, { coords });

const planets    = ensure(g, "planets", {});
const p          = ensure(planets, pKey, { coords });

const continents = ensure(p, "continents", {});
const c          = ensure(continents, cKey, { coords });

const nations    = ensure(c, "nations", {});
const n          = ensure(nations, nKey, { coords });

const states     = ensure(n, "states", {});
const s          = ensure(states, sKey, { coords });


  switch (level) {
    case "superCluster": generateClusters(sc, coords); break;
    case "cluster":   generateGalaxies(cl, coords); break;
    case "galaxy":    generatePlanets(g, coords); break;
    case "planet":    generateContinents(p, coords); break;
    case "continent": generateNations(c, coords); break;
    case "nation":    generateStates(n, coords); break;
    case "state":     generateCities(s, coords); break;
  }

  saveWorld(world);
}



function ensure(obj, key, defaultValue = {}) {
  if (!obj[key]) obj[key] = defaultValue;
  return obj[key];
}

const DISTANCE_WEIGHTS = {
  superCluster: 1_000_000,
  cluster:      100_000,
  galaxy:       10_000,
  planet:       1_000,
  continent:    500,      // ADD THIS
  nation:       100,
  state:        10,
  city:         1
};


export function distanceBetweenCoords(a, b) {
  let distance = 0;

  for (const key in DISTANCE_WEIGHTS) {
    const diff = Math.abs((a[key] ?? 0) - (b[key] ?? 0));
    distance += diff * DISTANCE_WEIGHTS[key];
  }

  return distance;
}

function randCount() {
  return Math.floor(Math.random() * 10) + 1;
}

function showSuperClusters(world) {
  const map = document.getElementById("map");
  map.innerHTML = "";

  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Add Super Cluster";
  addBtn.classList.add("btn", "btn-success", "m-2");

  addBtn.onclick = () => addSuperCluster();
  map.appendChild(addBtn);

  Object.entries(world).forEach(([key, sc]) => {
    if (!key.startsWith("superCluster")) return;

    const btn = document.createElement("button");
    btn.textContent = `${sc.name} (SC ${sc.coords.superCluster})`;
    btn.classList.add("btn", "btn-outline-light", "m-1");

    btn.onclick = () =>
      navigateTo("superCluster", { superCluster: sc.coords.superCluster });

    map.appendChild(btn);
  });
}



function generateClusters(world, superCluster, coords) {
  const worldElement = document.getElementById("map");

  // -------- RENDER MODE --------
  if (superCluster.clustersGenerated) {
    worldElement.innerHTML = "";

    // ⬆️ BACK TO WORLD BUTTON
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Up to World";
    backBtn.classList.add("btn", "btn-secondary", "btn-game", "m-2");
    backBtn.type = "button";

    backBtn.addEventListener("click", () => {
      navigateTo("world", {}, "up");
    });

    worldElement.appendChild(backBtn);

    // ⬇️ CLUSTER BUTTONS
    Object.keys(superCluster.clusters).forEach((key) => {
      const cluster = superCluster.clusters[key];
      const { name, coords: clusterCoords } = cluster;

      const button = document.createElement("button");

      button.textContent =
        `${name} (SC ${clusterCoords.superCluster})`;

      button.dataset.clusterCoords = JSON.stringify(clusterCoords);
      button.classList.add("btn", "btn-outline-light", "btn-game", "m-1");
      button.type = "button";

      button.addEventListener("click", (e) => {
        const nextCoords = JSON.parse(e.currentTarget.dataset.clusterCoords);

        // ⬇️ drill down into THIS cluster
        navigateTo("cluster", nextCoords, "down");
      });

      worldElement.appendChild(button);
    });

    return;
  }

  // -------- GENERATION MODE --------
  superCluster.clustersGenerated = true;
  superCluster.clusters ??= {};

  const count = randCount();

  for (let i = 0; i < count; i++) {
    superCluster.clusters[`cluster${i}`] = {
      name: "Unidentified Cluster",
      coords: { ...coords, cluster: i }
    };
  }

  // second pass to render
  generateClusters(world, superCluster, coords);
}


function generateGalaxies(world, cluster, coords) {
  const worldElement = document.getElementById("map");

  // -------- RENDER MODE --------
  if (cluster.galaxiesGenerated) {
    worldElement.innerHTML = "";

    // ⬆️ BACK TO CLUSTER BUTTON
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Back to Cluster";
    backBtn.classList.add("btn", "btn-secondary", "btn-game", "m-2");
    backBtn.type = "button";

    backBtn.addEventListener("click", () => {
      navigateTo("superCluster", {
        superCluster: coords.superCluster
      }, "up");
    });

    worldElement.appendChild(backBtn);

    // ⬇️ GALAXY BUTTONS
    Object.keys(cluster.galaxies).forEach((key) => {
      const galaxy = cluster.galaxies[key];
      const { coords: galaxyCoords } = galaxy;

      const button = document.createElement("button");

      button.textContent =
        `Galaxy ${galaxyCoords.galaxy} (SC ${galaxyCoords.superCluster}, C ${galaxyCoords.cluster})`;

      button.dataset.galaxyCoords = JSON.stringify(galaxyCoords);
      button.classList.add("btn", "btn-outline-light", "btn-game", "m-1");
      button.type = "button";

      button.addEventListener("click", (e) => {
        const nextCoords = JSON.parse(e.currentTarget.dataset.galaxyCoords);

        // ⬇️ drill down into THIS galaxy
        navigateTo("galaxy", nextCoords, "down");
      });

      worldElement.appendChild(button);
    });

    return;
  }

  // -------- GENERATION MODE --------
  cluster.galaxiesGenerated = true;
  cluster.galaxies ??= {};

  const count = randCount();

  for (let i = 0; i < count; i++) {
    cluster.galaxies[`galaxy${i}`] = {
      name: "Unidentified Galaxy",
      coords: { ...coords, galaxy: i }
    };
  }

  // second pass to render
  generateGalaxies(world, cluster, coords);
}


function generatePlanets(world, galaxy, coords) {
  const worldElement = document.getElementById("map");

  // -------- RENDER MODE --------
  if (galaxy.planetsGenerated) {
    worldElement.innerHTML = "";

    // ⬆️ BACK TO GALAXY
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Back to Galaxy";
    backBtn.classList.add("btn", "btn-secondary", "btn-game", "m-2");
    backBtn.type = "button";

    backBtn.addEventListener("click", () => {
      navigateTo("cluster", {
        superCluster: coords.superCluster,
        cluster: coords.cluster
      }, "up");
    });

    worldElement.appendChild(backBtn);

    // ⬇️ PLANET BUTTONS
    Object.keys(galaxy.planets).forEach((key) => {
      const planet = galaxy.planets[key];
      const { coords: planetCoords } = planet;

      const button = document.createElement("button");

      button.textContent =
        `Planet ${planetCoords.planet} (SC ${planetCoords.superCluster}, C ${planetCoords.cluster}, G ${planetCoords.galaxy})`;

      button.dataset.planetCoords = JSON.stringify(planetCoords);
      button.classList.add("btn", "btn-outline-light", "btn-game", "m-1");
      button.type = "button";

      button.addEventListener("click", (e) => {
        const nextCoords = JSON.parse(e.currentTarget.dataset.planetCoords);

        // ⬇️ drill down into THIS planet
        navigateTo("planet", nextCoords, "down");
      });

      worldElement.appendChild(button);
    });

    return;
  }

  // -------- GENERATION MODE --------
  galaxy.planetsGenerated = true;
  galaxy.planets ??= {};

  const count = randCount();

  for (let i = 0; i < count; i++) {
    galaxy.planets[`planet${i}`] = {
      name: "Unidentified Planet",
      coords: { ...coords, planet: i }
    };
  }

  // second pass to render
  generatePlanets(world, galaxy, coords);
}


function generateContinents(world,planet, coords) {
  const worldElement = document.getElementById("map");

  // -------- RENDER MODE --------
  if (planet.continentsGenerated) {
    worldElement.innerHTML = "";

    // ⬆️ BACK TO PLANET
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Back to Planet";
    backBtn.classList.add("btn", "btn-secondary", "btn-game", "m-2");
    backBtn.type = "button";

    backBtn.addEventListener("click", () => {
      navigateTo("galaxy", {
        superCluster: coords.superCluster,
        cluster: coords.cluster,
        galaxy: coords.galaxy
      }, "up");
    });

    worldElement.appendChild(backBtn);

    // ⬇️ CONTINENT BUTTONS
    Object.keys(planet.continents).forEach((key) => {
      const continent = planet.continents[key];
      const { coords: continentCoords } = continent;

      const button = document.createElement("button");

      button.textContent =
        `Continent ${continentCoords.continent} (SC ${continentCoords.superCluster}, C ${continentCoords.cluster}, G ${continentCoords.galaxy}, P ${continentCoords.planet})`;

      button.dataset.continentCoords = JSON.stringify(continentCoords);
      button.classList.add("btn", "btn-outline-light", "btn-game", "m-1");
      button.type = "button";

      button.addEventListener("click", (e) => {
        const nextCoords = JSON.parse(e.currentTarget.dataset.continentCoords);

        // ⬇️ drill down into THIS continent
        navigateTo("continent", nextCoords, "down");
      });

      worldElement.appendChild(button);
    });

    return;
  }

  // -------- GENERATION MODE --------
  planet.continentsGenerated = true;
  planet.continents ??= {};

  const count = randCount();

  for (let i = 0; i < count; i++) {
    planet.continents[`continent${i}`] = {
      name: "Unidentified Continent",
      coords: { ...coords, continent: i }
    };
  }
  // second pass to render
  generateContinents(world, planet, coords);
}


function generateNations(world, continent, coords) {
  const worldElement = document.getElementById("map");

  // -------- RENDER MODE --------
  if (continent.nationsGenerated) {
    worldElement.innerHTML = "";

    // ⬆️ BACK TO CONTINENT
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Up to Continent";
    backBtn.classList.add("btn", "btn-secondary", "btn-game", "m-2");
    backBtn.type = "button";

    backBtn.addEventListener("click", () => {
      navigateTo("planet", {
        superCluster: coords.superCluster,
        cluster: coords.cluster,
        galaxy: coords.galaxy,
        planet: coords.planet
      }, "up");
    });

    worldElement.appendChild(backBtn);

    // ⬇️ NATION BUTTONS
    Object.keys(continent.nations).forEach((key) => {
      const nation = continent.nations[key];
      const { coords: nationCoords } = nation;

      const button = document.createElement("button");

      button.textContent =
        `Nation ${nationCoords.nation} (SC ${nationCoords.superCluster}, C ${nationCoords.cluster}, G ${nationCoords.galaxy}, P ${nationCoords.planet}, Co ${nationCoords.continent})`;

      button.dataset.nationCoords = JSON.stringify(nationCoords);
      button.classList.add("btn", "btn-outline-light", "btn-game", "m-1");
      button.type = "button";

      button.addEventListener("click", (e) => {
        const nextCoords = JSON.parse(e.currentTarget.dataset.nationCoords);

        // ⬇️ drill down into THIS nation
        navigateTo("nation", nextCoords, "down");
      });

      worldElement.appendChild(button);
    });

    return;
  }

  // -------- GENERATION MODE --------
  continent.nationsGenerated = true;
  continent.nations ??= {};

  const count = randCount();

  for (let i = 0; i < count; i++) {
    continent.nations[`nation${i}`] = {
      name: "Unidentified Nation",
      coords: { ...coords, nation: i }
    };
  }

  // second pass to render
  generateNations(world, continent, coords);
}


function generateStates(world, nation, coords) {
  const worldElement = document.getElementById("map");

  // -------- RENDER MODE --------
  if (nation.statesGenerated) {
    worldElement.innerHTML = "";

    // ⬆️ BACK TO NATION
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Up to Nation";
    backBtn.classList.add("btn", "btn-secondary", "btn-game", "m-2");
    backBtn.type = "button";

    backBtn.addEventListener("click", () => {
      navigateTo("continent", {
        superCluster: coords.superCluster,
        cluster: coords.cluster,
        galaxy: coords.galaxy,
        planet: coords.planet,
        continent: coords.continent
      }, "up");
    });

    worldElement.appendChild(backBtn);

    // ⬇️ STATE BUTTONS
    Object.keys(nation.states).forEach((key) => {
      const state = nation.states[key];
      const { coords: stateCoords } = state;

      const button = document.createElement("button");

      button.textContent =
        `State ${stateCoords.state} (SC ${stateCoords.superCluster}, C ${stateCoords.cluster}, G ${stateCoords.galaxy}, P ${stateCoords.planet}, Co ${stateCoords.continent}, N ${stateCoords.nation})`;

      button.dataset.stateCoords = JSON.stringify(stateCoords);
      button.classList.add("btn", "btn-outline-light", "btn-game", "m-1");
      button.type = "button";

      button.addEventListener("click", (e) => {
        const nextCoords = JSON.parse(e.currentTarget.dataset.stateCoords);

        // ⬇️ drill down into THIS state
        navigateTo("state", nextCoords, "down");
      });

      worldElement.appendChild(button);
    });

    return;
  }

  // -------- GENERATION MODE --------
  nation.statesGenerated = true;
  nation.states ??= {};

  const count = randCount();

  for (let i = 0; i < count; i++) {
    nation.states[`state${i}`] = {
      name: "Unidentified State",
      coords: { ...coords, state: i }
    };
  }


  // second pass to render
  generateStates(world, nation, coords);
}


function generateCities(world, state, coords) {
  const worldElement = document.getElementById("map");

  // -------- RENDER MODE --------
  if (state.citiesGenerated) {
    worldElement.innerHTML = "";

    // ⬆️ BACK TO STATE
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Up to State";
    backBtn.classList.add("btn", "btn-secondary", "btn-game", "m-2");
    backBtn.type = "button";

    backBtn.addEventListener("click", () => {
      navigateTo("nation", {
        superCluster: coords.superCluster,
        cluster: coords.cluster,
        galaxy: coords.galaxy,
        planet: coords.planet,
        continent: coords.continent,
        nation: coords.nation
      }, "up");
    });

    worldElement.appendChild(backBtn);

    // 🏙️ CITY BUTTONS
    Object.keys(state.cities).forEach((key) => {
      const city = state.cities[key];
      const { coords: cityCoords, isStateCapital } = city;

      const button = document.createElement("button");

      button.textContent = isStateCapital
        ? `★ Capital City (City ${cityCoords.city})`
        : `City ${cityCoords.city} (SC ${cityCoords.superCluster}, C ${cityCoords.cluster}, G ${cityCoords.galaxy}, P ${cityCoords.planet}, Co ${cityCoords.continent}, N ${cityCoords.nation}, S ${cityCoords.state})`;

      button.classList.add(
        "btn",
        isStateCapital ? "btn-warning" : "btn-outline-light",
        "btn-game",
        "m-1"
      );

      button.type = "button";

      // Optional: city click handler (future expansion)
      button.addEventListener("click", () => {
        console.log(`Selected City ${cityCoords.city}`);
      });

      worldElement.appendChild(button);
    });

    return;
  }

  // -------- GENERATION MODE --------
  state.citiesGenerated = true;
  state.cities ??= {};
  state.stateCapitalCityId = 0;

  const count = randCount();

  // 🏛️ State capital (always exists)
  state.cities["city0"] = {
    name: "State Capital",
    isStateCapital: true,
    coords: { ...coords, city: 0 },
    // TODO: Add richer city details (population, traits, notes) here.
    details: {}
  };

  // Other cities
  for (let i = 1; i < count; i++) {
    state.cities[`city${i}`] = {
      name: `City ${i}`,
      isStateCapital: false,
      coords: { ...coords, city: i },
      details: {}
    };
  }


  // second pass to render
  generateCities(world, state, coords);
}

function addSuperCluster() {
  const name = prompt("Name the new Super Cluster:");
  if (!name) return;

  const world = loadWorld();

  const indexes = Object.keys(world)
    .filter(k => k.startsWith("superCluster"))
    .map(k => Number(k.replace("superCluster", "")));

  const nextIndex = indexes.length ? Math.max(...indexes) + 1 : 0;

  world[`superCluster${nextIndex}`] = {
    name,
    coords: { superCluster: nextIndex },
    clusters: {},
    clustersGenerated: false
  };

  saveWorld(world);
  showSuperClusters(world); // re-render THIS view
}


function ensureInitialSuperCluster(world) {
  if (!Object.keys(world).some(k => k.startsWith("superCluster"))) {
    world.superCluster0 = {
      name: "Home Super Cluster",
      coords: { superCluster: 0 },
      clusters: {},
      clustersGenerated: false
    };

    saveWorld(world);
  }
}

export function navigateTo(level, coords = {}, direction = "render") {
  // 1️⃣ Load world ONCE
  let world = loadWorld();
  let generatedMissingPath = false;

  const map = document.getElementById("map");
  map.innerHTML = "";

  // 2️⃣ Check if path exists
  function pathExists(level, coords) {
    try {
      switch (level) {
        case "superCluster":
          return !!world[`superCluster${coords.superCluster}`];

        case "cluster":
          return !!world[`superCluster${coords.superCluster}`]
            ?.clusters?.[`cluster${coords.cluster}`];

        case "galaxy":
          return !!world[`superCluster${coords.superCluster}`]
            ?.clusters?.[`cluster${coords.cluster}`]
            ?.galaxies?.[`galaxy${coords.galaxy}`];

        case "planet":
          return !!world[`superCluster${coords.superCluster}`]
            ?.clusters?.[`cluster${coords.cluster}`]
            ?.galaxies?.[`galaxy${coords.galaxy}`]
            ?.planets?.[`planet${coords.planet}`];

        case "continent":
          return !!world[`superCluster${coords.superCluster}`]
            ?.clusters?.[`cluster${coords.cluster}`]
            ?.galaxies?.[`galaxy${coords.galaxy}`]
            ?.planets?.[`planet${coords.planet}`]
            ?.continents?.[`continent${coords.continent}`];

        case "nation":
          return !!world[`superCluster${coords.superCluster}`]
            ?.clusters?.[`cluster${coords.cluster}`]
            ?.galaxies?.[`galaxy${coords.galaxy}`]
            ?.planets?.[`planet${coords.planet}`]
            ?.continents?.[`continent${coords.continent}`]
            ?.nations?.[`nation${coords.nation}`];

        case "state":
          return !!world[`superCluster${coords.superCluster}`]
            ?.clusters?.[`cluster${coords.cluster}`]
            ?.galaxies?.[`galaxy${coords.galaxy}`]
            ?.planets?.[`planet${coords.planet}`]
            ?.continents?.[`continent${coords.continent}`]
            ?.nations?.[`nation${coords.nation}`]
            ?.states?.[`state${coords.state}`];
      }
    } catch {
      return false;
    }
  }

  // 3️⃣ Generate ONLY if missing
  if (!pathExists(level, coords)) {
    generatedMissingPath = true;
    proceduralWorldGeneration(level, coords);
  }

  // If we just generated missing data, reload the freshest copy so
  // we don't accidentally overwrite the new structure when saving.
  if (generatedMissingPath) {
    world = loadWorld();
  }

  // 4️⃣ Render from THE SAME OBJECT
  switch (level) {
    case "world":
      showSuperClusters(world);
      break;

    case "superCluster": {
      const sc = world[`superCluster${coords.superCluster}`];
      generateClusters(world, sc, coords);
      break;
    }

    case "cluster": {
      const cluster =
        world[`superCluster${coords.superCluster}`]
          .clusters[`cluster${coords.cluster}`];
      generateGalaxies(world, cluster, coords);
      break;
    }

    case "galaxy": {
      const galaxy =
        world[`superCluster${coords.superCluster}`]
          .clusters[`cluster${coords.cluster}`]
          .galaxies[`galaxy${coords.galaxy}`];
      generatePlanets(world, galaxy, coords);
      break;
    }

    case "planet": {
      const planet =
        world[`superCluster${coords.superCluster}`]
          .clusters[`cluster${coords.cluster}`]
          .galaxies[`galaxy${coords.galaxy}`]
          .planets[`planet${coords.planet}`];
      generateContinents(world, planet, coords);
      break;
    }

    case "continent": {
      const continent =
        world[`superCluster${coords.superCluster}`]
          .clusters[`cluster${coords.cluster}`]
          .galaxies[`galaxy${coords.galaxy}`]
          .planets[`planet${coords.planet}`]
          .continents[`continent${coords.continent}`];
      generateNations(world, continent, coords);
      break;
    }

    case "nation": {
      const nation =
        world[`superCluster${coords.superCluster}`]
          .clusters[`cluster${coords.cluster}`]
          .galaxies[`galaxy${coords.galaxy}`]
          .planets[`planet${coords.planet}`]
          .continents[`continent${coords.continent}`]
          .nations[`nation${coords.nation}`];
      generateStates(world, nation, coords);
      break;
    }

    case "state": {
      const state =
        world[`superCluster${coords.superCluster}`]
          .clusters[`cluster${coords.cluster}`]
          .galaxies[`galaxy${coords.galaxy}`]
          .planets[`planet${coords.planet}`]
          .continents[`continent${coords.continent}`]
          .nations[`nation${coords.nation}`]
          .states[`state${coords.state}`];
      generateCities(world, state, coords);
      break;
    }
  }

  // 5️⃣ SAVE EXACTLY ONCE
  saveWorld(world);
}


export function getOrInitCoords() {
  const defaultCoords = {
    superCluster: 0,
    cluster: 0,
    galaxy: 0,
    planet: 0,
    continent: 0,
    nation: 0,
    state: 0,
    city: 0
  };

  const stored = localStorage.getItem("currentCoords");

  if (!stored) {
    localStorage.setItem("currentCoords", JSON.stringify(defaultCoords));
    return { ...defaultCoords };
  }

  return { ...defaultCoords, ...JSON.parse(stored) };
}

export function resetCoords() {
  const zeroCoords = {
    superCluster: 0,
    cluster: 0,
    galaxy: 0,
    planet: 0,
    continent: 0,
    nation: 0,
    state: 0,
    city: 0
  };

  localStorage.setItem("currentCoords", JSON.stringify(zeroCoords));
  return zeroCoords;
}

export function initWorld() {
  const generated = localStorage.getItem("worldGenerated") === "true";
  if (generated) return;

  // build the whole chain down to state0 so navigateTo("state") has parents
  proceduralWorldGeneration("state", {
    superCluster: 0,
    cluster: 0,
    galaxy: 0,
    planet: 0,
    continent: 0,
    nation: 0,
    state: 0,
    city: 0
  });

  localStorage.setItem("worldGenerated", "true");
}

function saveWorld(world) {
  localStorage.setItem("world", JSON.stringify(world));
}



