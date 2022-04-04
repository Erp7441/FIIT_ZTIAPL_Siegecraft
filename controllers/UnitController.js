import * as GameObject from "./GameObjectController.js"

export class UnitController extends GameObject.GameObjectController {
    constructor({model, view}){
        super({
            model: model,
            view: view
        });
    }
    
}