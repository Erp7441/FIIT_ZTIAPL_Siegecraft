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
    createUnit({position, dimensions, hp, armor}, canvas, context) {
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
            position: position,
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
}