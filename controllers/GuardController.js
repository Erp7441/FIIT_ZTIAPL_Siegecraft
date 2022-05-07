import * as Character from "./CharacterController.js";

export class GuardController extends Character.CharacterController {
    constructor({model, view}){
        super({
            model: model,
            view: view
        });
    }
    attack(enemy){
        if(enemy && enemy.model && enemy.model.hp && this.model && this.model.damage){
            this.setCombat(true);
            const coeficient =  Math.random() * (4 - 1) + 1;
            enemy.model.hp -= this.model.damage * coeficient;
        }
        if(enemy.model.hp <= 0){
            this.setCombat(false);
        }
    }

    checkAvailableBuildings(buldingUnits){
        buldingUnits.forEach(buildingUnit => {
            if(buildingUnit.getFaction() === this.getFaction()){
                buildingUnit.getConnections().forEach(connection => {
                    if(!this.getAvailableBuildings().includes(connection)){
                        this.getAvailableBuildings().push(connection);
                    }
                })
            }
        })
    }

    detectBuilding(buildingUnits){

        this.checkAvailableBuildings(buildingUnits);
        
        let buildingToMoveTo = undefined;
        let distance = Infinity;
        buildingUnits.forEach(buildingUnit => {
            if(
                this.getAvailableBuildings().includes(buildingUnit.getID()) &&
                buildingUnit.getFaction() !== this.getFaction() &&
                this.getDistance(buildingUnit) < distance
            ){
                distance = this.getDistance(buildingUnit);
                buildingToMoveTo = buildingUnit;
            }
        });
        return buildingToMoveTo;
    }

    moveToBuilding(buildingUnits){
        if(buildingUnits.length > 0) {

            let buildingToMoveTo = this.detectBuilding(buildingUnits);
            if(buildingToMoveTo){
                this.setIsMoving(true);
                this.move(buildingToMoveTo.getPosition());
            }
            this.setMoved(undefined);
            // return buildingToMoveTo; //TODO remove this
        }
        return undefined;
    }

    getArmor(){
        return this.model.armor;
    }

    setArmor(armor){
        // TODO Check type
        this.model.armor = armor;
    }

    getAvailableBuildings(){
        return this.model.availableBuildings;
    }

    setAvailableBuildings(array){
        this.model.availableBuildings = array;
    }

    getCanCaptureBase(){
        return this.model.canCaptureBase;
    }

    setCanCaptureBase(bState){
        this.model.canCaptureBase = bState;
    }
    
}