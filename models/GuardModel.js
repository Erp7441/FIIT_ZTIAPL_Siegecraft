import * as Character from "./CharacterModel.js";

export class GuardModel extends Character.CharacterModel{
    constructor({texture, position, dimensions, hp, armor, damage, faction, velocity}){
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
            faction: faction,
            velocity: velocity
        });
        this.armor = armor;
        this.attacked = undefined;
    }
}