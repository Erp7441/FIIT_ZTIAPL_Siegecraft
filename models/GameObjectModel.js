export class GameObjectModel{
    constructor({texture, position, dimensions}){
        this.texture = texture;
        this.position = {
            x: position.x,
            y: position.y
        }
        this.dimensions = {
            width: dimensions.width,
            height: dimensions.height
        };
    }
}