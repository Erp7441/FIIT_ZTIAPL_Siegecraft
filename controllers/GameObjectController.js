export class GameObjectController{
    constructor({model, view}){
        this.model = model;
        this.view = view;
        this.view.drawTexture();
    }
    isColliding(collidingObject){
        return (this.model.position.x < collidingObject.model.position.x + collidingObject.model.dimensions.width &&
                this.model.position.x + this.model.dimensions.width > collidingObject.model.position.x &&
                this.model.position.y < collidingObject.model.position.y + collidingObject.model.dimensions.height &&
                this.model.position.y + this.model.dimensions.height > collidingObject.model.position.y
        )
    }

    getDistance(object) {
        return Math.hypot(object.model.position.x - this.model.position.x, object.model.position.y - this.model.position.y);
    }

    getTexture(){
        return this.model.texture;
    }

    getPosition(){
        return this.model.position;
    }

    getDimensions(){
        return this.model.dimensions;
    }

    setTexture(texture){
        if(texture && typeof(texture) !== "string") {
            console.error("Wrong type detected for variable \"texture\" expected string\nvalue: " + texture + ", type: " + typeof(texture));
            return; 
        }
        this.model.texture = texture;
    }

    setPosition(position){
        if(position.x && typeof(position.x) !== "number") {
            console.error("Wrong type detected for variable \"position\" expected number\nvalue: " + position.x + ", type: " + typeof(position.x));
            return; 
        }
        if(position.y && typeof(position.y) !== "number") {
            console.error("Wrong type detected for variable \"position\" expected number\nvalue: " + position.y + ", type: " + typeof(position.y));
            return; 
        }
        this.model.position = position;
    }

    setDimensions(dimensions){
        if(dimensions.width && typeof(dimensions.width) !== "number") {
            console.error("Wrong type detected for variable \"dimensions\" expected number\nvalue: " + dimensions.width + ", type: " + typeof(dimensions.width));
            return; 
        }
        if(dimensions.height && typeof(dimensions.height) !== "number") {
            console.error("Wrong type detected for variable \"dimensions\" expected number\nvalue: " + dimensions.height + ", type: " + typeof(dimensions.height));
            return; 
        }
        this.model.dimensions = dimensions;
    }

    drawTexture(){
        this.view.drawTexture()
    }
}