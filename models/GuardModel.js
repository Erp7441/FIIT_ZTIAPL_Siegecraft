import * as Character from "./CharacterModel.js";

export class GuardModel extends Character.CharacterModel{
    constructor({texture, position, dimensions, hp, armor}){
        super({
            texture: texture,
            position: {
                x: position.x,
                y: position.y
            },
            dimensions: dimensions,
            type: "Guard",
            hp: hp
        });
        this.armor = armor;
    }
}