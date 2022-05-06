import * as Unit from "./UnitModel.js";

export class BuildingModel extends Unit.UnitModel{
    constructor({texture, position, dimensions, type, faction, hp, velocity, ID}){
        super({
            texture:texture,
            position:position,
            dimensions:dimensions,
            type:type,
            hp:hp,
            velocity:velocity, 
            faction:faction          
        });
        this.isBeingCaptured = false;
        this.ID = ID;
        this.connections = new Array();
    }
}