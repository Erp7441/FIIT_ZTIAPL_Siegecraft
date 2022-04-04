import * as Unit from "./UnitController.js";

export class CharacterController extends Unit.UnitController {
    constructor({model, view}){
        super({
            model: model,
            view: view
        });
    }
    
    update({position, velocity}){
        this.model.position = {
            x: position.x + velocity.x,
            y: position.y + velocity.y
        };
    }

    move(position, velocity){
        if(this.getbIsMoving() === true){
    
            // Diffs
            let dX = position.x - this.model.position.x;
            let dY = position.y - this.model.position.y;

            //TODO ked je dX a dY zaporne tak je pomalsi transition

            if(dX < 0){
                this.model.posX += (dX/velocity.x*2);
            }
            else{
                this.model.posX += (dX/velocity.x);
            }
    
            if(dY < 0){
                this.model.posY += (dY/velocity.y*2);
            }
            else{
                this.model.posY += (dY/velocity.y);
            }

            // Smoothly transitioning between positions
            
            // Updating position
            this.update({
                position: {x: this.model.posX, y: this.model.posY},
                velocity: {x:50, y:50},
            });
            
            // Checking if we need to move in another frame
            this.setbIsMoving(
                !this.isColliding({
                    model: {
                        position:{
                            x: position.x,
                            y: position.y
                        },
                        dimensions:{
                            width: 10,
                            height: 10
                        }
                    }
                })
            );            
            
            /*console.log("dX:" + Math.round(dX) + " dY:" + Math.round(dY)); // TODO remove
            console.log("posX:" + Math.round(this.model.posX) + " posY:" + Math.round(this.model.posY));*/
        }
    }
        
    setbIsMoving(bool){
        // TODO Check type
        this.model.bIsMoving = bool;
    }

    getbIsMoving(){ return this.model.bIsMoving; }
}