import * as Unit from "./UnitController.js";

export class CharacterController extends Unit.UnitController {
    constructor({model, view}){
        super({
            model: model,
            view: view
        });
    }
    
    update(position){
        this.model.position.x += position.x * this.model.velocity.x;
        this.model.position.y += position.y * this.model.velocity.y;
    }

    move(position, bCombat){
        if(this.getbIsMoving() === true){
    
            if(bCombat) { return; }

            // Diffs
            let dX = position.x - this.model.position.x;
            let dY = position.y - this.model.position.y;
            let dLenght = Math.hypot(dX, dY);

            dX /= dLenght;
            dY /= dLenght;
            
            // Smoothly transitioning between positions
            
            // Updating position
            this.update({x: dX, y: dY});
            
            // Checking if we need to move in another frame
            this.setbIsMoving(
                !this.isColliding({
                    model: {
                        position:{
                            x: position.x,
                            y: position.y
                        },
                        dimensions:{
                            width: this.model.dimensions.width/2, // TODO set dynamically
                            height: this.model.dimensions.height/2
                        }
                    }
                })
            );           
            
        }
    }
        
    setbIsMoving(bool){
        // TODO Check type
        this.model.bIsMoving = bool;
    }

    getbIsMoving(){ return this.model.bIsMoving; }
}