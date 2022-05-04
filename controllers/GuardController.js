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
            enemy.model.hp -= this.model.damage;
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
                this.setbIsMoving(true);
                this.move(buildingToMoveTo.model.position);
            }
            return buildingToMoveTo;
        }
        return undefined;
    }
}