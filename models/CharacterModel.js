import * as Unit from './UnitModel.js';

export class CharacterModel extends Unit.UnitModel {
    constructor({texture, position, dimensions, type, hp, isMoving, damage, faction, velocity}){
        super({
            texture: texture,
            position: position,
            dimensions: dimensions,
            type: type,
            hp: hp,
            velocity: velocity,
            damage: damage,
            faction: faction
        });
        this.isMoving = isMoving || false;
        this.selected = false;
    }
}