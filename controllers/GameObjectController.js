export class GameObjectController{
    constructor({model, view}){
        this.model = model;
        this.view = view;
        this.view.drawTexture();
    }
    isColliding(collidingObject){
        // TODO implement offset for texture collision
        return (this.model.position.x < collidingObject.model.position.x + collidingObject.model.dimensions.width &&
                this.model.position.x + this.model.dimensions.width > collidingObject.model.position.x &&
                this.model.position.y < collidingObject.model.position.y + collidingObject.model.dimensions.height &&
                this.model.position.y + this.model.dimensions.height > collidingObject.model.position.y
        )
    }

    getDistance(object) {
        return Math.hypot(object.model.position.x - this.model.position.x, object.model.position.y - this.model.position.y);
    }
}