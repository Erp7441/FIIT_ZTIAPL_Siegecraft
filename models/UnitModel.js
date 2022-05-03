import * as GameObject from "./GameObjectModel.js"

export class UnitModel extends GameObject.GameObjectModel{
    constructor({texture, position, dimensions, type, hp}){
        super({
            texture: texture,
            position: position,
            dimensions: dimensions
        });
        this.type = type;
        this.hp = hp;
        this.bIsMoving = false;
        this.timeoutID = undefined;
        this.moved = undefined;
    }
}