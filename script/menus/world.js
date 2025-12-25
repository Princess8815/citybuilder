function loadWorld() {
  return JSON.parse(localStorage.getItem("world")) ?? {};
}

function saveWorld(world) {
  localStorage.setItem("world", JSON.stringify(world));
}

const NODE_NAMES = {
  superCluster: (id) => `Super Cluster ${id}`,
  cluster:      (id) => `Cluster ${id}`,
  galaxy:       (id) => `Galaxy ${id}`,
  planet:       (id) => `Planet ${id}`,
  continent:    (id) => `Continent ${id}`,
  nation:       (id) => `Nation ${id}`,
  state:        (id) => `State ${id}`,
  city:         (id) => `City ${id}`
};

const COLLECTION_KEYS = {
  superCluster: "clusters",
  cluster:      "galaxies",
  galaxy:       "planets",
  planet:       "continents",
  continent:    "nations",
  nation:       "states",
  state:        "cities"
};

const LEVEL_KEY_PREFIX = {
  superCluster: "superCluster",
  cluster:      "cluster",
  galaxy:       "galaxy",
  planet:       "planet",
  continent:    "continent",
  nation:       "nation",
  state:        "state",
  city:         "city"
};

function ensure(obj, key, defaultValue = {}) {
  if (!obj[key]) obj[key] = defaultValue;
  return obj[key];
}

function ensureBranch(world, coords) {
  const scKey = `${LEVEL_KEY_PREFIX.superCluster}${coords.superCluster ?? 0}`;
  const clKey = `${LEVEL_KEY_PREFIX.cluster}${coords.cluster ?? 0}`;
  const gKey  = `${LEVEL_KEY_PREFIX.galaxy}${coords.galaxy ?? 0}`;
  const pKey  = `${LEVEL_KEY_PREFIX.planet}${coords.planet ?? 0}`;
  const cKey  = `${LEVEL_KEY_PREFIX.continent}${coords.continent ?? 0}`;
  const nKey  = `${LEVEL_KEY_PREFIX.nation}${coords.nation ?? 0}`;
  const sKey  = `${LEVEL_KEY_PREFIX.state}${coords.state ?? 0}`;

  const sc = ensure(world, scKey, {
    name: NODE_NAMES.superCluster(coords.superCluster ?? 0),
    coords: { superCluster: coords.superCluster ?? 0 },
    clusters: {},
    clustersGenerated: false
  });

  const clusters   = ensure(sc, COLLECTION_KEYS.superCluster, {});
  const cl         = ensure(clusters, clKey, {
    name: NODE_NAMES.cluster(coords.cluster ?? 0),
    coords: { ...sc.coords, cluster: coords.cluster ?? 0 },
    galaxies: {},
    galaxiesGenerated: false
  });

  const galaxies   = ensure(cl, COLLECTION_KEYS.cluster, {});
  const g          = ensure(galaxies, gKey, {
    name: NODE_NAMES.galaxy(coords.galaxy ?? 0),
    coords: { ...cl.coords, galaxy: coords.galaxy ?? 0 },
    planets: {},
    planetsGenerated: false
  });

  const planets    = ensure(g, COLLECTION_KEYS.galaxy, {});
  const p          = ensure(planets, pKey, {
    name: NODE_NAMES.planet(coords.planet ?? 0),
    coords: { ...g.coords, planet: coords.planet ?? 0 },
    continents: {},
    continentsGenerated: false
  });

  const continents = ensure(p, COLLECTION_KEYS.planet, {});
  const c          = ensure(continents, cKey, {
    name: NODE_NAMES.continent(coords.continent ?? 0),
    coords: { ...p.coords, continent: coords.continent ?? 0 },
    nations: {},
    nationsGenerated: false
  });

  const nations    = ensure(c, COLLECTION_KEYS.continent, {});
  const n          = ensure(nations, nKey, {
    name: NODE_NAMES.nation(coords.nation ?? 0),
    coords: { ...c.coords, nation: coords.nation ?? 0 },
    states: {},
    statesGenerated: false
  });

  const states     = ensure(n, COLLECTION_KEYS.nation, {});
  const s          = ensure(states, sKey, {
    name: NODE_NAMES.state(coords.state ?? 0),
    coords: { ...n.coords, state: coords.state ?? 0 },
    cities: {},
    citiesGenerated: false
  });

  return { world, sc, cl, g, p, c, n, s };
}

export function proceduralWorldGeneration(level, coords) {
  const { world, sc, cl, g, p, c, n, s } = ensureBranch(loadWorld(), coords);

  switch (level) {
    case "superCluster": generateClusters(sc, coords); break;
    case "cluster":      generateGalaxies(cl, coords); break;
    case "galaxy":       generatePlanets(g, coords); break;
    case "planet":       generateContinents(p, coords); break;
    case "continent":    generateNations(c, coords); break;
    case "nation":       generateStates(n, coords); break;
    case "state":        generateCities(s, coords); break;
  }

  saveWorld(world);
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


export function navigateTo(level, coords = {}, direction = "render") {
  const world = loadWorld();
  const branch = ensureBranch(world, coords);

  const map = document.getElementById("map");
  map.innerHTML = "";

  switch (level) {
    case "world":
      showSuperClusters(world);
      break;

    case "superCluster":
      generateClusters(world, branch.sc, coords);
      break;

    case "cluster":
      generateGalaxies(world, branch.cl, coords);
      break;

    case "galaxy":
      generatePlanets(world, branch.g, coords);
      break;

    case "planet":
      generateContinents(world, branch.p, coords);
      break;

    case "continent":
      generateNations(world, branch.c, coords);
      break;

    case "nation":
      generateStates(world, branch.n, coords);
      break;

    case "state":
      generateCities(world, branch.s, coords);
      break;
  }

  localStorage.setItem("currentCoords", JSON.stringify(coords));
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
