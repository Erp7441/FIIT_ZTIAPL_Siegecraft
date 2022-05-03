import * as Character from "./CharacterController.js";
import { BuildingController } from "./Controllers.js";

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

    // TODO enemy sa spawne zo zlej strany pri pohybe

    //TODO prepojit zakladne, pridat nejaku premennu ktora bude odkazovat na dalsiu zakladnu ALEBO radius ktory by urcil tieto spojenia a urcil by kam sa treba pohnut
    detectBuilding(buildingUnits){
        let buildingToMoveTo = undefined;
        let distance = buildingUnits[0];
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
        const velocity = {x:50, y:50}; //TODO set in object
        if(buildingUnits.length > 0) {
            let buildingToMoveTo = this.detectBuilding(buildingUnits);
            buildingToMoveTo = buildingUnits[4];
            if(buildingToMoveTo){
                this.setbIsMoving(true);
                this.move(buildingToMoveTo.model.position, velocity);
                console.log(buildingToMoveTo);
            }
            return buildingToMoveTo;
        }
        return undefined;
    }
}