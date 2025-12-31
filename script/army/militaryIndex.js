import { ancientToMedevilInfantry } from "./infantry/ancient-medevil.js"
import { ancientToMedevilArchers } from "./archers/ancient-medevil.js"
import { ancientToMedevilCalvalry } from "./cavalry/ancient-medevil.js"
import { ancientToMedevilSiege } from "./seige/ancient-medevil.js"

export const troops = {
    infantry: {
        //can only attack front line
        ...ancientToMedevilInfantry
    },
    archers: {
        //default behavior targets infantry first
        ...ancientToMedevilArchers
    },
    cavalry: {
        //pony go gallop barrel into infantry or abatis it cant tell dif til its dead
        ...ancientToMedevilCalvalry
    },
    seige: {
        //boom boom wall go down
        ...ancientToMedevilSiege
    }
    
}