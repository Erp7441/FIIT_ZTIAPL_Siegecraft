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
        }
        return undefined;
    }

    getArmor(){
        return this.model.armor;
    }

    getAvailableBuildings(){
        return this.model.availableBuildings;
    }
    
    getCanCaptureBase(){
        return this.model.canCaptureBase;
    }

    setAvailableBuildings(array){
        if(array && typeof(array) !== "object") {
            console.error("Wrong type detected for variable \"array\" expected object\nvalue: " + array + ", type: " + typeof(array));
            return; 
        }
        this.model.availableBuildings = array;
    }
    
    setArmor(armor){
        if(armor && typeof(armor) !== "number") {
            console.error("Wrong type detected for variable \"velocity\" expected number\nvalue: " + armor + ", type: " + typeof(armor));
            return;
        }
        this.model.armor = armor;
    }
    
    setCanCaptureBase(state){
        if(state && typeof(state) !== "boolean") {
            console.error("Wrong type detected for variable \"state\" expected boolean\nvalue: " + state + ", type: " + typeof(state));
            return; 
        }
        this.model.canCaptureBase = state;
    }
    
}