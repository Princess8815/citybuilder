

export const walls = {
    traps: {
        name: "traps",
        attack: 0,
        deffense: 0,
        health: 1,
        range: 0,
        description: "kills infantry at rate 1-1 25% chance to activate"
    },
    archerTowers: {
        name: "Archer Towers",
        attack: 13,
        deffense: 3,
        health: 100,
        range: 13, //pointless tbh as they fire at start 
        description: "attacks infantry at start"

    },
        abatis: {
        name: "abatis",
        attack: 100,
        deffense: 0,
        health: 1,
        range: 0,
        description: "hurts cavalry that get close but dies"
    },
        boulders: {
        name: "boulders",
        attack: 200,
        deffense: 0,
        health: 1,
        range: 1, //pointless tbh as they fire at start 
        description: "attacks seige close to wall"

    }
}