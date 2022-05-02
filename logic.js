import * as Models from './models/Models.js';
import * as Views from './views/Views.js'; 
import * as Controllers from './controllers/Controllers.js';


// -------------------------------- VARIABLES --------------------------------

let then = Date.now(), now, elapsed; // Used to calculate elapsed time (FPS)

const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerModel
let playerView
let playerController
let enemyModel
let enemyView
let enemyController
let buildingModels
let buildingViews
let buildingUnits
let playerUnits = new Array();
let enemyUnits = new Array();

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

// -------------------------------- EVENT LISTENERS --------------------------------

addEventListener('click', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    playerUnits.forEach(playerUnit  => {
        playerUnit.setbIsMoving(true);
    })
})

// -------------------------------- FUNCTIONS --------------------------------

function clearScreen() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

export function animate(fps, state){
    let frameID = requestAnimationFrame(() => animate(fps, state));
    clearScreen();

    // Calculating time elapsed since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has passed since last iteration generate a new frame

    if(elapsed > 1000/fps){ then = now - (elapsed % 1000/fps); }

    let index = 0;
    playerUnits.forEach(playerUnit => {

        if(playerUnit.model.hp <= 0){
            playerUnits.splice(index, 1);
        }

        playerUnit.view.drawTexture();
        if(playerUnit.model.bIsMoving === true){
            const velocity = {x:50, y:50}; //TODO set in object
            playerUnit.move(mouse, velocity); // TODO remove mouse and add something more sensible here
        }

        enemyUnits.forEach(enemyUnit => {
            if(playerUnit.isColliding(enemyUnit) && enemyUnit.model.attacked === undefined) {

                // Attacking enemy
                enemyUnit.model.attacked = setTimeout(() => {
                    playerUnit.attack(enemyUnit);
                    clearTimeout(enemyUnit.model.attacked);
                    enemyUnit.model.attacked = undefined;
                }, 1000);
                
            }
        })

        index++;
    });

    index = 0;
    enemyUnits.forEach(enemyUnit => {
        enemyUnit.view.drawTexture();
        // TODO move enemy units

        if(enemyUnit.model.hp <= 0){
            playerUnits.splice(index, 1);
        }

        playerUnits.forEach(playerUnit => {
            if(enemyUnit.isColliding(playerUnit) && playerUnit.model.attacked === undefined){

                // Attacking player
                playerUnit.model.attacked = setTimeout(() => {
                    enemyUnit.attack(playerUnit);
                    clearTimeout(playerUnit.model.attacked);
                    playerUnit.model.attacked = undefined;
                }, 1000);
                
            }
        })

        index++;
    });

    buildingUnits.forEach(buildingUnit => {

        buildingUnit.view.drawTexture();

        // Game end conditions
        if(buildingUnit.model.type === 'base' && buildingUnit.model.hp <= 0) {

            if(buildingUnit.model.faction === 'player'){
                state.gameOver = true;
            }
            else if(buildingUnit.model.faction === 'enemy'){
                state.victory = true;
            }
            cancelAnimationFrame(frameID);
        }

        // Collision detection
        playerUnits.forEach(playerUnit => {

            if(playerUnit.isColliding(buildingUnit) && buildingUnit.model.faction == 'neutral'){
                if(playerUnit.model.timeoutID === undefined){
                    playerUnit.model.timeoutID  = setTimeout(() => {
                        if(playerUnit.isColliding(buildingUnit)){
                            buildingUnit.model.texture = playerUnit.model.texture;
                            buildingUnit.model.faction = 'player'
                        }
                        clearTimeout(playerUnit.model.timeoutID);
                        playerUnit.model.timeoutID  = undefined;
                    }, 5000);    
                }        
            }
        })
        

        // Generating units
        if(buildingUnit.model.faction === 'player'){
            if(buildingUnit.model.timeoutID === undefined && playerUnits.length < 6){
                buildingUnit.model.timeoutID = setTimeout(() => {
                    playerUnits.push(buildingUnit.createUnit({
                        position: {
                            x: buildingUnit.model.position.x + Math.random() * 30,
                            y: buildingUnit.model.position.y + Math.random() * 30
                        },
                        dimensions: {width: 50, height: 50},
                        hp:100,
                        armor: 100
                    }, canvas, context));
                    clearTimeout(buildingUnit.model.timeoutID);
                    buildingUnit.model.timeoutID = undefined;
                }, 5000); 
            }
        }
        else if(buildingUnit.model.faction === 'enemy'){
            if(buildingUnit.model.timeoutID === undefined && enemyUnits.length < 6){
                buildingUnit.model.timeoutID = setTimeout(() => {
                    enemyUnits.push(buildingUnit.createUnit({
                        position: {
                            x: buildingUnit.model.position.x + Math.random() * 30,
                            y: buildingUnit.model.position.y + Math.random() * 30
                        },
                        dimensions: {width: 50, height: 50},
                        hp:100,
                        armor: 100
                    }, canvas, context));
                    clearTimeout(buildingUnit.model.timeoutID);
                    buildingUnit.model.timeoutID = undefined;
                }, 5000);
            }
        }
        
    });

    //TODO vymysliet ako manipulovat hracove a enemakove units
    //TODO prepojit zakladne, pridat nejaku premennu ktora bude odkazovat na dalsiu zakladnu ALEBO radius ktory by urcil tieto spojenia a urcil by kam sa treba pohnut
    //TODO priama detekcia kolizie alebo vypocet vzdialenosti? Kde a preco?
    

    
}

export function initialize(){
    
    buildingModels =[
        new Models.BuildingModel.BuildingModel({
            texture: 'green',
            position: {x:0, y:0},
            dimensions: {width:50, height:50},
            type: 'Base',
            faction: 'player',
            hp: 100,
        }),
        new Models.BuildingModel.BuildingModel({
            texture: 'red',
            position: {x:600, y:600},
            dimensions: {width:50, height:50},
            type: 'Base',
            faction: 'enemy',
            hp: 100,
        }),
        new Models.BuildingModel.BuildingModel({
            texture: 'grey',
            position: {x:600, y:50},
            dimensions: {width:50, height:50},
            type: 'Building',
            faction: 'neutral',
            hp: 100,
        }),
        new Models.BuildingModel.BuildingModel({
            texture: 'grey',
            position: {x:350, y:350},
            dimensions: {width:50, height:50},
            type: 'Building',
            faction: 'neutral',
            hp: 100,
        }),
        new Models.BuildingModel.BuildingModel({
            texture: 'grey',
            position: {x:0, y:600},
            dimensions: {width:50, height:50},
            type: 'Building',
            faction: 'neutral',
            hp: 100,
        })
    ]
    
    buildingViews = [
        new Views.View.View({
            model: buildingModels[0],
            canvas: canvas,
            context: context
        }),
        new Views.View.View({
            model: buildingModels[1],
            canvas: canvas,
            context: context
        }),
        new Views.View.View({
            model: buildingModels[2],
            canvas: canvas,
            context: context
        }),
        new Views.View.View({
            model: buildingModels[3],
            canvas: canvas,
            context: context
        }),
        new Views.View.View({
            model: buildingModels[4],
            canvas: canvas,
            context: context
        })
    ]
    
    buildingUnits = [
        new Controllers.BuildingController.BuildingController({
            model: buildingModels[0],
            view: buildingViews[0],
        }),
        new Controllers.BuildingController.BuildingController({
            model: buildingModels[1],
            view: buildingViews[1],
        }),
        new Controllers.BuildingController.BuildingController({
            model: buildingModels[2],
            view: buildingViews[2],
        }),
        new Controllers.BuildingController.BuildingController({
            model: buildingModels[3],
            view: buildingViews[3],
        }),
        new Controllers.BuildingController.BuildingController({
            model: buildingModels[4],
            view: buildingViews[4],
        })
    ]

}