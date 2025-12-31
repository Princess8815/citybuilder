import { incOrDecResources } from "../resources/resources.js";
import { GetAddOrRemoveArmy } from "../army/setArmy.js";

//{superCluster: 0, cluster: 0, galaxy: 0, planet: 0, continent: 0, nation: 0, state: 0}
export function levelToArea(fullCoords, child) {
    const current = getCurrent(child);
    const key = JSON.stringify(fullCoords); // ✅ THIS is the fix

    let level = JSON.parse(localStorage.getItem(key));

    if (!level) {
        level = {};
        const total = randCount();

        for (let ci = 0; ci < total; ci++) {
            const areaKey = `${child}${ci}`;
            level[areaKey] = {
                name: ci === 0 ? `Capital ${child}` : `${child} ${ci}`,
                coords: { ...fullCoords, [child]: ci },

                    // 👇 ONLY added when child === "city"
                ...(child === "city" && {
                    population: randCount() * 1000,
                    troops: {},
                    land: randCount() * 50,
                    destroyed: false
                })
            };

        }

        localStorage.setItem(key, JSON.stringify(level));
    }

    const map = document.getElementById("map");
    map.innerHTML = "";
    const parentCoord = popCoordLayer(fullCoords);
    if (current) {
        const parentCoord = popCoordLayer(fullCoords);
        const upBtn = document.createElement("button");
        upBtn.textContent = "⬆ Up";
        upBtn.className = "btn btn-secondary m-2";
        upBtn.onclick = () => levelToArea(parentCoord, current);
        map.appendChild(upBtn);
    }

    if (child !== "city") {
        Object.keys(level).forEach((areaKey) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-primary m-2";
        btn.textContent = level[areaKey].name;
        btn.onclick = () => {
            levelToArea(level[areaKey].coords, getNext(child))
        };
        map.appendChild(btn);
    })
    }
    else {
        Object.keys(level).forEach((areaKey) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-primary m-2";
        btn.textContent = `${level[areaKey].name} (Pop: ${level[areaKey].population})`;
        btn.onclick = () => {

            showCityInfo(level[areaKey], fullCoords, child);
        };
        map.appendChild(btn);
    })
    }
    //localStorage.setItem(key, JSON.stringify(level));

    return level; //doubt i need this 
}


function randCount() {
  return Math.floor(Math.random() * 10) + 1;
}

function popCoordLayer(fullCoords) {
    const order = [
        "superCluster", //futuristic
        "cluster", //deep space
        "galaxy", //space
        "planet", //modern
        "continent", //exploration
        "nation", //medevil
        "state", //stone
        "city" //ancient
    ];

    const next = { ...fullCoords };

    for (let i = order.length - 1; i >= 0; i--) {
        if (order[i] in next) {
            delete next[order[i]];
            break;
        }
    }

    return next;
}

function getCurrent(child) {
    switch (child) {
        case "cluster":
            return "superCluster";
        case "galaxy":
            return "cluster";
        case "planet":
            return "galaxy";
        case "continent":
            return "planet";
        case "nation":
            return "continent";
        case "state":
            return "nation";
        case "city":
            return "state";
    }
}

function getNext(child) {
    switch (child) {
        case "superCluster": return "cluster";
        case "cluster": return "galaxy";
        case "galaxy": return "planet";
        case "planet": return "continent";
        case "continent": return "nation";
        case "nation": return "state";
        case "state": return "city";
        default: return null;
    }
}


const WEIGHTS = {
  state: 1,
  nation: 5,
  continent: 25,
  planet: 125,
  galaxy: 625,
  cluster: 3125,
  superCluster: 15625
};

function calcDistance(a, b) {
  let distance = 0;

  for (const key in WEIGHTS) {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    distance += Math.abs(av - bv) * WEIGHTS[key];
  }

  return distance;
}

function calcDifficulty(coords) {
  let raw = 0;

  for (const key in WEIGHTS) {
    raw += (coords[key] ?? 0) * WEIGHTS[key];
  }

  return Math.floor(Math.log10(raw + 1) * 100);
}

function showCityInfo(city, fullkey, child) {
    const levelKey = JSON.stringify(fullkey);
    const level = JSON.parse(localStorage.getItem(levelKey));
    let warriorTest;
    const armyKey = `army:${JSON.stringify(city)}`
    if (!localStorage.getItem(armyKey)) {
        warriorTest = GetAddOrRemoveArmy(armyKey, "warrior", "add", Math.round(Math.random() * 5))
    }
    else {
        warriorTest = GetAddOrRemoveArmy(armyKey, "warrior")
    }
    
    const army = GetAddOrRemoveArmy(armyKey)

    const cityKey = Object.keys(level).find(k => level[k]?.coords?.city === city.coords.city);
    if (!cityKey) return; // or console.log("City not found in level", city, level);

    city = level[cityKey];

    const currentLocation = JSON.parse(localStorage.getItem("currentCoords"))
    const map = document.getElementById("map");
    map.innerHTML = "";

    const btn = document.createElement("button");
    btn.className = "btn btn-primary m-2";
    btn.textContent = "back";
    btn.onclick = () => {
        levelToArea(fullkey, child)
    };
    map.appendChild(btn);

        const attk = document.createElement("button");
        attk.className = "btn btn-primary m-2";
        attk.textContent = `ATTACK!!`;

        const cityDiff = calcDifficulty(city.coords)
        const cityDist = calcDistance(city.coords, currentLocation)
    let info = `Population: ${city.population}\n Land: ${city.land}\n
    difficulty: ${cityDiff} distance: ${cityDist} levelKey:`

    Object.entries(army).forEach(([key, value]) => {
        info = info + "\n" + value.quantity + " " + value.troop.name + " " + key
    })

    
    
    const text = document.createElement("p");
    text.style.whiteSpace = "pre-line";
    text.textContent = info;
    map.appendChild(text);

    attk.onclick = () => {

        if (city.destroyed !== true) {
            city.population -= 100; // just a demo action


            if (city.population <= 0) {
                city.population = 0;
                city.conquered = true;
                incOrDecResources("land", city.land);
                alert(`${city.name} has been conquered!`);
            }

            localStorage.setItem(levelKey, JSON.stringify(level));
        }
        else {

        }

        showCityInfo(city, fullkey, child);
    };
    map.appendChild(attk);


}



