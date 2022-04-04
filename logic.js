import * as Models from './models/Models.js';
import * as Views from './views/Views.js'; 
import * as Controllers from './controllers/Controllers.js';


// -------------------------------- VARIABLES --------------------------------

let then = Date.now(), now, elapsed;

const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

// -------------------------------- EVENT LISTENERS --------------------------------

addEventListener('click', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    playerController.setbIsMoving(true);
})

// -------------------------------- FUNCTIONS --------------------------------

function clearScreen() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

export function animate(fps){
    requestAnimationFrame(animate);
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

    if(playerController.isColliding(buildingController)){
        console.log("Coliding building");
        setInterval(() => {
            if(playerController.isColliding(buildingController)){
                buildingController.model.color = playerController.model.color;
                buildingController.model.faction = 'player';
            }
            else{ return; }
        }, 5000);
    }
}

let playerModel = new Models.GuardModel.GuardModel({
    texture: 'green',
    position: {x:130, y:130},
    dimensions: {width:50, height:50},
    hp: 100,
    armor: 100
});

let playerView = new Views.View.View({
    model: playerModel,
    canvas: canvas,
    context: context
});

let playerController = new Controllers.GuardController.GuardController({
    model: playerModel,
    view: playerView,
});

let enemyModel = new Models.GuardModel.GuardModel({
    texture: 'red',
    position: {x:50, y:30},
    dimensions: {width:50, height:50},
    hp: 100,
    armor: 100
});

let enemyView = new Views.View.View({
    model: enemyModel,
    canvas: canvas,
    context: context
});

let enemyController = new Controllers.GuardController.GuardController({
    model: enemyModel,
    view: enemyView,
});

let buildingModel = new Models.BuildingModel.BuildingModel({
    texture: 'grey',
    position: {x:300, y:30},
    dimensions: {width:50, height:50},
    type: 'Building',
    faction: 'neutral',
    hp: 100,
});

let buildingView = new Views.View.View({
    model: buildingModel,
    canvas: canvas,
    context: context
});

let buildingController = new Controllers.GuardController.GuardController({
    model: buildingModel,
    view: buildingView,
});

//let obj = new Classes.GameObject({});
//let obj2 = new Classes.GameObject('red', {x:0, y:0},{width:150, height:150});