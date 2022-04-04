import * as Unit from './UnitModel.js';

export class CharacterModel extends Unit.UnitModel {
    constructor(color, position, dimensions, type, hp, bIsMoving){
        super(color, position, dimensions, type, hp);
        this.bIsMoving = bIsMoving || false;
        this.posX = 0; this.posY = 0;
    }
}