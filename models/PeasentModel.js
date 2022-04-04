import * as Character from "./CharacterModel.js";

export class PeasentModel extends Character.CharacterModel{
    constructor({texture, position, dimensions, hp}){
        super({
            texture: texture,
            position: position,
            dimensions: dimensions,
            type: "Peasent",
            hp: hp
        });
    }
}