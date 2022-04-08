import * as Models from './models/Models.js';
import * as Views from './views/Views.js'; 
import * as Controllers from './controllers/Controllers.js';


// -------------------------------- VARIABLES --------------------------------

let then = Date.now(), now, elapsed; // Used to calculate elapsed time (FPS)

// TODO use arrays for multiple timeouts
let timeoutID; // Store the timeout ID for later use

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
let buildingModel
let buildingView
let buildingController

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
    buildingController.view.drawTexture();
    enemyController.view.drawTexture();
    playerController.view.drawTexture(); // Vykresli texturu
    
    if(playerController.isColliding(enemyController)){
        console.log("Colliding enemy");
        // Colliding enemy
    }

    // TODO compact collision code to a function
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
        state.gameOver = true;
        cancelAnimationFrame(frameID);
    }
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

    enemyModel = new Models.GuardModel.GuardModel({
        texture: 'red',
        position: {x:50, y:30},
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
    
    buildingModel = new Models.BuildingModel.BuildingModel({
        texture: 'grey',
        position: {x:300, y:30},
        dimensions: {width:50, height:50},
        type: 'Building',
        faction: 'neutral',
        hp: 100,
    });
    
    buildingView = new Views.View.View({
        model: buildingModel,
        canvas: canvas,
        context: context
    });
    
    buildingController = new Controllers.GuardController.GuardController({
        model: buildingModel,
        view: buildingView,
    });

}