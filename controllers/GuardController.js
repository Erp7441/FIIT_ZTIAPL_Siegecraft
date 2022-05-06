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
            const coeficient =  Math.random() * (4 - 1) + 1;
            enemy.model.hp -= this.model.damage * coeficient;
        }
        if(enemy.model.hp <= 0){
            this.setCombat(false);
        }
    }

    //TODO prepojit zakladne, pridat nejaku premennu ktora bude odkazovat na dalsiu zakladnu ALEBO radius ktory by urcil tieto spojenia a urcil by kam sa treba pohnut
    detectBuilding(buildingUnits){
        let buildingToMoveTo = undefined;
        let distance = Infinity;
        buildingUnits.forEach(buildingUnit => {
            if(
                buildingUnit.model.faction !== this.model.faction &&
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
                this.move(buildingToMoveTo.model.position, this.getCombat());
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
}