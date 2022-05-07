export class GameObjectModel{
    constructor({texture, position, dimensions}){
        this.position = {
            x: position.x,
            y: position.y
        }
        this.dimensions = {
            width: dimensions.width,
            height: dimensions.height
        };
        this.texture = new Image();
        this.texture.src = texture;
    }
}