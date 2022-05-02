import * as Character from "./CharacterModel.js";

// TODO remove this class?
export class PeasentModel extends Character.CharacterModel{
    constructor({texture, position, dimensions, hp, damage}){
        super({
            texture: texture,
            position: position,
            dimensions: dimensions,
            type: "Peasent",
            hp: hp,
            damage: damage,
            timeoutID: undefined
        });
    }
}