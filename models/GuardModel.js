import * as Character from "./CharacterModel.js";

export class GuardModel extends Character.CharacterModel{
    constructor({texture, position, dimensions, hp, armor, damage, faction}){
        super({
            texture: texture,
            position: {
                x: position.x,
                y: position.y
            },
            dimensions: dimensions,
            type: "Guard",
            hp: hp,
            damage: damage,
            faction: faction
        });
        this.armor = armor;
        this.attacked = undefined;
    }
}