import * as GameObject from "./GameObjectController.js"

export class UnitController extends GameObject.GameObjectController {
    constructor({model, view}){
        super({
            model: model,
            view: view
        });
    }

    defend(enemy){
        if(enemy && enemy.model && enemy.model.hp && this.model && this.model.damage){
            const coeficient =  Math.random() * (3 - 0.5) + 0.5;
            enemy.model.hp -= this.model.damage / coeficient;
        }
    }

    getCombatState(){
        return this.model.combat;
    }

    setCombatState(state){
        this.model.combat = state;
    }

    getMoved(){
        return this.model.moved;
    }

    setMoved(state){
        this.model.moved = state;
    }
    
}