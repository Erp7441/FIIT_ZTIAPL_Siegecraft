import * as Unit from "./UnitModel.js";

export class BuildingModel extends Unit.UnitModel{
    constructor({texture, position, dimensions, type, faction, hp}){
        super({
            texture:texture,
            position:position,
            dimensions:dimensions,
            type:type,
            hp:hp            
        });
        this.faction = faction;
    }
}