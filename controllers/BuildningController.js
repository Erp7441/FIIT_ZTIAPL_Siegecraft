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
        let color;

        if(this.model.faction === 'player'){
            color = 'green';
        }
        else if(this.model.faction === 'enemy'){
            color = 'red';
        }
        else if(this.model.faction === 'neutral'){
            color = 'gray';
        }

        let model = new GuardModel.GuardModel({
            texture: color,
            position: position,
            dimensions: dimensions,
            hp: hp,
            armor: armor
        });
    
        let view = new View.View({
            model: model,
            canvas: canvas,
            context: context
        });
    
        let controller = new GuardController.GuardController({
            model: model,
            view: view,
        });
        return {model, view, controller};
    }
}