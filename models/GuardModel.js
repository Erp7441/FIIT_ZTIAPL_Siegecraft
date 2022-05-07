import * as Character from "./CharacterModel.js";

export class GuardModel extends Character.CharacterModel{
    constructor({texture, position, dimensions, hp, armor, damage, faction, velocity}){
        super({
            texture: texture,
            position: position,
            dimensions: dimensions,
            type: "Guard",
            hp: hp,
            damage: damage,
            faction: faction,
            velocity: velocity
        });
        this.armor = armor;
        this.availableBuildings = new Array();
        this.canCaptureBase = false;
    }
}