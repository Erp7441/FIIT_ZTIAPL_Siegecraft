export class GameObjectModel{
    constructor({texture, position, dimensions}){
        this.position = position
        this.dimensions = dimensions
        this.texture = new Image();
        this.texture.src = texture;
    }
}