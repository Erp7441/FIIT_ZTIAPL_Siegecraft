import * as Unit from "./UnitController.js"

export class Building extends Unit.UnitController {
    constructor({model, view, faction}){
        super({
            model: model,
            view: view
        });
        this.faction = faction;
    }
    createUnit(){
        console.log("Creating unit...");
    }
}