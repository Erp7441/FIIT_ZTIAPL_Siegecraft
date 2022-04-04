import * as Character from "./CharacterController.js";

export class PeasentController extends Character.CharacterController {
    constructor({model, view}){
        super({
            model: model,
            view: view
        });
    }
    build(){
        console.log("Building...");
    }
}
