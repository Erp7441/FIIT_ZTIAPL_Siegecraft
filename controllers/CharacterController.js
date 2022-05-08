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
        if(this.getIsMoving() === true){
    
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
            this.setIsMoving(
                !this.isColliding({
                    model: {
                        position:{
                            x: position.x,
                            y: position.y
                        },
                        dimensions:{
                            width: this.model.dimensions.width/2,
                            height: this.model.dimensions.height/2
                        }
                    }
                })
            );           
            
        }
    }

    getIsMoving(){
        return this.model.isMoving;
    }
    
    getSelected(){
        return this.model.selected;
    }
        
    setIsMoving(state){
        if(state && typeof(state) !== "boolean") {
            console.error("Wrong type detected for variable \"state\" expected boolean\nvalue: " + state + ", type: " + typeof(state));
            return; 
        }
        this.model.isMoving = state;
    }

    setSelected(state){
        if(state && typeof(state) !== "boolean") {
            console.error("Wrong type detected for variable \"state\" expected boolean\nvalue: " + state + ", type: " + typeof(state));
            return; 
        }
        this.model.selected = state;
    }

}