export class GameObjectModel{
    constructor({color, position, dimensions}){
        this.color = color;
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