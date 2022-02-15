const canvas = document.getElementById('board');
const c = canvas.getContext('2d');

// -------------------------------- CLASSES --------------------------------

export class GameObject{
    constructor(color, position, dimensions){
        this.color = color;
        this.position = {
            x: position.x,
            y: position.y
        }
        this.dimensions = {
            width: dimensions.width,
            height: dimensions.height
        };
        this.drawTexture(color);
    }

    drawTexture(color){
        //let object = new Image();
        //object.src = this.texture;
        //console.log("Drawing texture...");

        c.fillStyle = color || 'black';
        c.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    }

    update(position, velocity){
        this.drawTexture(this.color);
        this.position = {
            x: position.x + velocity.x,
            y: position.y + velocity.y
        };
    }

    isColliding(collidingObject, offsetX, offsetY){
        // TODO implement offset for texture collision
        return (!(this.x > collidingObject.x + collidingObject.width ||
                this.x + this.width < collidingObject.x ||
                this.y > collidingObject.y + collidingObject.height ||
                this.y + this.height < collidingObject.y)
        )
    }
}

export class Unit extends GameObject{
    constructor(texture, type, hp){
        super(texture)
        this.type = type;
        this.hp = hp;
    }

}

export class Peasent extends Unit{
    build(){
        console.log("Building...");
    }
}

export class Guard extends Unit{
    constructor(hp, armor){
        super("Guard",hp);
        this.armor = armor;
    }
    attack(){
        console.log("Attacking...");
    }
}

export class Building extends Unit{
    createUnit(){
        console.log("Creating unit...");
    }
}