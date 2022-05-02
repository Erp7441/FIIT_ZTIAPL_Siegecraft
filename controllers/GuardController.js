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
}