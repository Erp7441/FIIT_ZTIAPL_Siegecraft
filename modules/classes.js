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
        return (this.position.x > collidingObject.position.x + collidingObject.dimensions.width ||
                this.position.x + this.dimensions.width < collidingObject.position.x ||
                this.position.y > collidingObject.position.y + collidingObject.dimensions.height ||
                this.position.y + this.dimensions.height < collidingObject.position.y
        )
    }
}

export class Unit extends GameObject{
    constructor(color, position, dimensions, type, hp){
        super(color, position, dimensions);
        this.type = type;
        this.hp = hp;
    }
}

export class Character extends Unit{
    constructor(color, position, dimensions, type, hp, bIsMoving){
        super(color, position, dimensions, type, hp);
        this.bIsMoving = bIsMoving || false;
        this.posX = 0; this.posY = 0;
    }

    move(position, velocity){
        if(this.getbIsMoving() === true){
    
            // Diffs
            let dX = position.x - this.position.x;
            let dY = position.y - this.position.y;

            //TODO ked je dX a dY zaporne tak je pomalsi transition

            if(dX < 0){
                this.posX += (dX/velocity.x*2);
            }
            else{
                this.posX += (dX/velocity.x);
            }
    
            if(dY < 0){
                this.posY += (dY/velocity.y*2);
            }
            else{
                this.posY += (dY/velocity.y);
            }
    
            // Smoothly transitioning between positions
            
            // Updating position
            this.update(
                {x: this.posX, y: this.posY},
                {x:50, y:50},
            );
            
            // Checking if we need to move in another frame
            this.setbIsMoving(
                this.isColliding({
                    position:{
                        x: position.x,
                        y: position.y
                    },
                    dimensions:{
                        width: 10,
                        height: 10
                    }
                })
            );

            console.log("dX:" + Math.round(dX) + " dY:" + Math.round(dY));
            //console.log("posX:" + Math.round(this.posX) + " posY:" + Math.round(this.posY));
        }
    }

    setbIsMoving(bool){
        // TODO Check type
        this.bIsMoving = bool;
    }

    getbIsMoving(){ return this.bIsMoving; }
}

export class Peasent extends Character{
    build(){
        console.log("Building...");
    }
}

export class Guard extends Character{
    constructor(color, position, dimensions, type, hp, bIsMoving, armor){
        super(color, position, dimensions, "Guard", hp, bIsMoving);
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