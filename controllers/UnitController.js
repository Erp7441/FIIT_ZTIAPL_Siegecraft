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

    getAttacked(){
        return this.model.attacked;
    }

    getUnitType(){
        return this.model.type;
    }

    getHp(){
        return this.model.hp;
    }

    getCombat(){
        return this.model.combat;
    }

    getMoved(){
        return this.model.moved;
    }

    getIsMoving(){
        return this.model.isMoving;
    }

    getTimeoutID(){
        return this.model.timeoutID;
    }

    getVelocity(){
        return this.model.velocity
    }

    getDamage(){
        return this.model.damage
    }

    getFaction(){
        return this.model.faction
    }

    setAttacked(attacked){
        // TODO Check type
        this.model.attacked = attacked;
    }

    setUnitType(type){
        // TODO Check type
        this.model.type = type;
    }

    setHp(hp){
        // TODO Check type
        this.model.hp = hp;
    }

    setCombat(bState){
        // TODO Check type
        this.model.combat = bState;
    }

    setMoved(state){
        // TODO Check type
        this.model.moved = state;
    }

    setIsMoving(bState){
        // TODO Check type
        this.model.isMoving = bState;
    }

    setTimeoutID(ID){
        // TODO Check type
        this.model.timeoutID = ID;
    }

    setVelocity(velocity){
        // TODO Check type
        this.model.velocity = velocity;
    }

    setDamage(damage){
        // TODO Check type
        this.model.damage = damage;
    }

    setFaction(faction){
        // TODO Check type
        this.model.faction = faction;
    }
    
}