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
    createUnit({dimensions, hp, armor}, canvas, context) {
        let texture;

        if(this.model.faction === 'player'){
            texture = 'green';
        }
        else if(this.model.faction === 'enemy'){
            texture = 'red';
        }
        else if(this.model.faction === 'neutral'){
            texture = 'gray';
        }

        let model = new GuardModel.GuardModel({
            texture: texture,
            position: {
                x: this.model.position.x + (Math.random() * 30),
                y: this.model.position.y + (Math.random() * 30)
            },
            dimensions: dimensions,
            hp: hp,
            armor: armor,
            damage: 10,
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

    setIsBeingCaptured(bState){
        // TODO Check type
        this.model.isBeingCaptured = bState;
    }

    setID(ID){
        // TODO Check type
        this.model.ID = ID;
    }

    setConnections(connections){
        this.model.connections = connections;
    }
}