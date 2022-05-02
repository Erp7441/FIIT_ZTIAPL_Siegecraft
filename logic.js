import * as Models from './models/Models.js';
import * as Views from './views/Views.js'; 
import * as Controllers from './controllers/Controllers.js';


// -------------------------------- VARIABLES --------------------------------

let then = Date.now(), now, elapsed; // Used to calculate elapsed time (FPS)

// TODO use arrays for multiple timeouts
let timeoutID; // Store the timeout ID for later use
let timeoutIDPlayer;
let timeoutIDEnemy;

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
let buildingControllers
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

    if(playerController){
        playerController.setbIsMoving(true);
    }
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

    
    if(playerController.model.bIsMoving === true){
        const velocity = {x:50, y:50}; //TODO set in object
        playerController.move(mouse, velocity);
    }

    buildingControllers.forEach(buildingController => {
        buildingController.view.drawTexture();
    });
    enemyController.view.drawTexture();
    playerController.view.drawTexture();
    
    playerUnits.forEach(playerUnit => {
        playerUnit.view.drawTexture();
    })

    enemyUnits.forEach(enemyUnit => {
        enemyUnit.view.drawTexture();
    })
    
    if(playerController.model.hp <= 0) {
        state.gameOver = true;
        cancelAnimationFrame(frameID);
    }

    if(playerController.isColliding(enemyController)){
        console.log("Colliding enemy");
        // Colliding enemy
    }
    
    // TODO compact collision code to a function
    buildingControllers.forEach(buildingController => {
        if(playerController.isColliding(buildingController) && buildingController.model.faction != 'player'){
            console.log("Coliding building");
            
            if(timeoutID === undefined){
                timeoutID = setTimeout(() => {
                    if(playerController.isColliding(buildingController)){
                        buildingController.model.color = playerController.model.color;
                        buildingController.model.faction = 'player'
                    }
                    clearTimeout(timeoutID);
                    timeoutID = undefined;
                }, 5000);    
            }        
        }
    
        if(buildingController.model.faction === 'player'){
            if(timeoutIDPlayer === undefined && playerUnits.length < 6){
                timeoutIDPlayer = setTimeout(() => {
                    playerUnits.push(buildingController.createUnit({
                        position: {
                            x: buildingController.model.position.x + Math.random() * 30,
                            y: buildingController.model.position.y + Math.random() * 30
                        },
                        dimensions: {width: 50, height: 50},
                        hp:100,
                        armor: 100
                    }, canvas, context));
                    clearTimeout(timeoutIDPlayer);
                    timeoutIDPlayer = undefined;
                }, 5000); 
            }
        }
        else if(buildingController.model.faction === 'enemy'){
            if(timeoutIDEnemy === undefined && enemyUnits.length < 6){
                timeoutIDEnemy = setTimeout(() => {
                    enemyUnits.push(buildingController.createUnit({
                        position: {
                            x: buildingController.model.position.x + Math.random() * 30,
                            y: buildingController.model.position.y + Math.random() * 30
                        },
                        dimensions: {width: 50, height: 50},
                        hp:100,
                        armor: 100
                    }, canvas, context));
                    clearTimeout(timeoutIDEnemy);
                    timeoutIDEnemy = undefined;
                }, 5000);
            }
        }
    });

    //TODO implementuj attack
    //TODO implementuj vypocet vzdialenosti medzi dvoma objektami
    //TODO vymysliet ako manipulovat hracove a enemakove units
    //TODO prepojit zakladne, pridat nejaku premennu ktora bude odkazovat na dalsiu zakladnu ALEBO radius ktory by urcil tieto spojenia a urcil by kam sa treba pohnut

    

    
}

export function initialize(){
    playerModel = new Models.GuardModel.GuardModel({
        texture: 'green',
        position: {x:130, y:130},
        dimensions: {width:50, height:50},
        hp: 100,
        armor: 100
    });

    playerView = new Views.View.View({
        model: playerModel,
        canvas: canvas,
        context: context
    });

    playerController = new Controllers.GuardController.GuardController({
        model: playerModel,
        view: playerView,
    });


    // TODO treba toto pri incializacii, Nebolo by spravit iba buildingy?
    enemyModel = new Models.GuardModel.GuardModel({
        texture: 'red',
        position: {x:500, y:600},
        dimensions: {width:50, height:50},
        hp: 100,
        armor: 100
    });

    enemyView = new Views.View.View({
        model: enemyModel,
        canvas: canvas,
        context: context
    });
    
    enemyController = new Controllers.GuardController.GuardController({
        model: enemyModel,
        view: enemyView,
    });
    
    buildingModels =[
        new Models.BuildingModel.BuildingModel({
            texture: 'red',
            position: {x:600, y:600},
            dimensions: {width:50, height:50},
            type: 'Building',
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
    ]
    
    buildingControllers = [
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
        })
    ]

}