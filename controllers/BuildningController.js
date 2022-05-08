import * as Unit from "./UnitController.js"
import * as GuardController from "./GuardController.js"
import * as GuardModel from "../models/GuardModel.js"
import * as View from "../views/View.js"

export class BuildingController extends Unit.UnitController {
    constructor({model, view}){
        super({
            model: model,
            view: view
        });
    }
    createUnit({dimensions, hp, armor, damage, texture}, canvas, context) {
        
        const generateRandom = ({min, max}) => {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        // TODO vymysliet lepsi offset
        let offsetX= this.getPosition().x < canvas.width/2 ? generateRandom({min: 20, max: 40}) : generateRandom({min: -40, max: -20});
        let offsetY= this.getPosition().y < canvas.height/2 ? generateRandom({min: 20, max: 40}) : generateRandom({min: -40, max: -20});
        
        let model = new GuardModel.GuardModel({
            texture: texture,
            position: {
                x: this.model.position.x + offsetX,
                y: this.model.position.y + offsetY
            },
            dimensions: dimensions,
            hp: hp,
            armor: armor,
            damage: damage,
            faction: this.model.faction
        });
    
        let view = new View.View({
            model: model,
            canvas: canvas,
            context: context
        });

        return new GuardController.GuardController({
            model: model,
            view: view,
        });
    }

    getIsBeingCaptured(){
        return this.model.isBeingCaptured;
    }

    getID(){
        return this.model.ID;
    }

    getConnections(){
        return this.model.connections;
    }

    setIsBeingCaptured(state){
        if(state && typeof(state) !== "boolean") {
            console.error("Wrong type detected for variable \"state\" expected boolean\nvalue: " + state + ", type: " + typeof(state));
            return; 
        }
        this.model.isBeingCaptured = state;
    }

    setID(ID){
        if(ID && typeof(ID) !== "number") {
            console.error("Wrong type detected for variable \"ID\" expected number\nvalue: " + ID + ", type: " + typeof(ID));
            return; 
        }
        this.model.ID = ID;
    }

    setConnections(connections){
        this.model.connections = connections;
    }
}