import { buildings } from "../builds/buildings.js";
import { resources } from "../resources/resources.js";
import { TECH_TREE, saveTech } from "../builds/techTree.js";
import { tech, isHigherLevel, ERAS } from "../builds/unlocks.js";   
import { addRawResearch } from "../main.js";

const productionEl = document.getElementById("tech-production-list")
const militaryEl = document.getElementById("tech-military-list")
const explorationEl = document.getElementById("tech-exploration-list")

export function createTech (){
    const myTech = tech();
    Object.keys(TECH_TREE).forEach((key) => {
        let passed = true
        const research = TECH_TREE[key];

        

        if (research.requires?.tech) {
        passed = Object.entries(research.requires.tech).every(
            ([k, v]) => (myTech[k] ?? 0) >= v
        );
        }

        if (research.requires?.age) {
        passed = passed && isHigherLevel(research.requires.age, myTech.age, ERAS);
        }

        if (research.requires?.research) {
        passed = passed && research.requires.research.every(reqKey =>
            (TECH_TREE[reqKey]?.current ?? 0) > 0
        );
        }

        if (!passed) return

        const existing = document.querySelector(`button[data-research="${key}"]`);

        if (existing) {
        existing.textContent = `${research.name} ${research.current}/${research.maxLevel}`;
        return;
        }

        const button = document.createElement("button")
        button.classList.add("btn", "btn-outline-light", "btn-game", "mb-2");
        button.type = "button";
        button.textContent = `${research.name} ${research.current}/${research.maxLevel}`
        button.title = `${research.description}`;

        button.dataset.research = key; // 🔥 important

        if (research.branch === "production") {
            productionEl.appendChild(button)
        }
        else if (research.branch === "military") {
            militaryEl.appendChild(button)
        }
        else if (research.branch === "exploration") {
            explorationEl.appendChild(button)
        }
        




    })
}

createTech()

function getResearchers() {
  return JSON.parse(localStorage.getItem("researchers")) ?? {
    total: 1,
    busy: 0
  };
}

function saveResearchersState(state) {
  localStorage.setItem("researchers", JSON.stringify(state));
}

document.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-research]");
  if (!button) return;

  const key = button.dataset.research;
  research(key);
});

function research(key) {
    const researchObj = addRawResearch()
    const researchPoints = researchObj.points
    const research = TECH_TREE[key];

    const researcherState = getResearchers();

    if (researcherState.busy >= researcherState.total) {
    console.log("No free builders");
    return;
    }


    if (researchPoints < research.pointCost) {
        console.log("Not enough research points");
        return;
    }

    if (research.current >= research.maxLevel) {
        console.log("Max level achieved");
        return;
    }

    let rp = JSON.parse(localStorage.getItem("researchPoints"));
    rp.researchPoints -= research.pointCost;
    localStorage.setItem("researchPoints", JSON.stringify(rp));



    researcherState.busy++;
    saveResearchersState(researcherState);

    const finishAt = Date.now() + research.time;

    const job = {
    researchKey: key,
    finishAt
    };

    let jobs = JSON.parse(localStorage.getItem("researchJobs")) ?? [];
    jobs.push(job);
    localStorage.setItem("researchJobs", JSON.stringify(jobs));


    research.time = Math.floor(research.time * 10);


  }

    function renderResearchTimers() {
      renderResearchers()


      const container = document.getElementById("researchTimers");
      if (!container) return; //not really needed as its always there but whatever
      container.innerHTML = "";
  
      const jobs = JSON.parse(localStorage.getItem("researchJobs")) ?? [];
      const now = Date.now();
  
      jobs.forEach((job, index) => {
          const remaining = Math.max(0, job.finishAt - now);
  
          const seconds = Math.ceil(remaining / 1000);
  
          const div = document.createElement("div");
          div.textContent = `${job.researchKey} — ${seconds}s remaining`;
          container.appendChild(div);
  
          // Finish job if done
        if (remaining <= 0) {
            const research = TECH_TREE[job.researchKey];
            research.current++;

            const researcherState = getResearchers();
            researcherState.busy = Math.max(0, researcherState.busy - 1);
            saveResearchersState(researcherState);

            if (research.upgrades) {
            for (const [stat, amount] of Object.entries(research.upgrades)) {
                tech(stat, true, amount);
            }
            }

  
            jobs.splice(index, 1);
            // unlock new tech buttons
            saveTech();
            createTech();
          }
  
      });
  
      localStorage.setItem("researchJobs", JSON.stringify(jobs));
  }
  
  function renderResearchers() {
      const el = document.getElementById("researchStatus");
      if (!el) return;
  
      const researchers = JSON.parse(localStorage.getItem("researchers")) ?? {
          total: 1,
          busy: 0
      };
  
      const free = researchers.total - researchers.busy;
      el.textContent = `Researchers: ${free} / ${researchers.total}`;
      }
  
  setInterval(renderResearchTimers, 1000);