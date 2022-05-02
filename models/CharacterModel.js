import * as Unit from './UnitModel.js';

export class CharacterModel extends Unit.UnitModel {
    constructor({texture, position, dimensions, type, hp, bIsMoving, damage}){
        super({
            texture: texture,
            position: position,
            dimensions: dimensions,
            type: type,
            hp: hp,
            timeoutID: undefined
        })
        this.bIsMoving = bIsMoving || false;
        this.posX = 0; this.posY = 0;
        this.damage = damage;
    }
}