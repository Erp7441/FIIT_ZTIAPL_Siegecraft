import * as GameObject from "./GameObjectModel.js"

export class UnitModel extends GameObject.GameObjectModel{
    constructor({texture, position, dimensions, type, hp, velocity}){
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
        this.velocity = velocity || {x: 3, y: 3};
    }
}