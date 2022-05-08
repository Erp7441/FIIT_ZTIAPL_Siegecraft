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
        if(attacked && typeof(attacked) !== "number") {
            console.error("Wrong type detected for variable \"attacked\" expected number\nvalue: " + attacked + ", type: " + typeof(attacked));
            return; 
        }
        this.model.attacked = attacked;
    }

    setUnitType(type){
        if(type && typeof(type) !== "string") {
            console.error("Wrong type detected for variable \"type\" expected string\nvalue: " + type + ", type: " + typeof(type));
            return; 
        }
        this.model.type = type;
    }

    setHp(hp){
        if(hp && typeof(hp) !== "number") {
            console.error("Wrong type detected for variable \"hp\" expected number\nvalue: " + hp + ", type: " + typeof(hp));
            return; 
        }
        this.model.hp = hp;
    }

    setCombat(state){
        if(state && typeof(state) !== "boolean") {
            console.error("Wrong type detected for variable \"state\" expected boolean\nvalue: " + state + ", type: " + typeof(state));
            return; 
        }
        this.model.combat = state;
    }

    setMoved(state){
        if(state && typeof(state) !== "number") {
            console.error("Wrong type detected for variable \"state\" expected number\nvalue: " + state + ", type: " + typeof(state));
            return; 
        }
        this.model.moved = state;
    }

    setIsMoving(state){
        if(state && typeof(state) !== "boolean") {
            console.error("Wrong type detected for variable \"state\" expected boolean\nvalue: " + state + ", type: " + typeof(state));
            return; 
        }
        this.model.isMoving = state;
    }

    setTimeoutID(ID){
        if(ID && typeof(ID) !== "number") {
            console.error("Wrong type detected for variable \"ID\" expected number\nvalue: " + ID + ", type: " + typeof(ID));
            return; 
        }
        this.model.timeoutID = ID;
    }

    setVelocity(velocity){
        if(velocity && typeof(velocity) !== "number") {
            console.error("Wrong type detected for variable \"velocity\" expected number\nvalue: " + velocity + ", type: " + typeof(velocity));
            return; 
        }
        this.model.velocity = velocity;
    }

    setDamage(damage){
        if(damage && typeof(damage) !== "number") {
            console.error("Wrong type detected for variable \"damage\" expected number\nvalue: " + damage + ", type: " + typeof(damage));
            return; 
        }
        this.model.damage = damage;
    }

    setFaction(faction){
        if(faction && typeof(faction) !== "string") {
            console.error("Wrong type detected for variable \"faction\" expected string\nvalue: " + faction + ", type: " + typeof(faction));
            return; 
        }
        this.model.faction = faction;
    }
    
}