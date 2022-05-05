import * as Models from './models/Models.js';
import * as Views from './views/Views.js'; 
import * as Controllers from './controllers/Controllers.js';


// -------------------------------- VARIABLES --------------------------------

let then = Date.now(), now = undefined, elapsed = undefined; // Used to calculate elapsed time (FPS)

const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let buildingUnits = new Array();
let playerUnits = new Array();
let enemyUnits = new Array();
let spawnPoints = new Array();
let numberOfBuldings = 10; // Controls number of neural buildings spawned into the game
let numberOfUnits = 5; // Controls number of units spawned into the game

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

// -------------------------------- EVENT LISTENERS --------------------------------

addEventListener('click', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    
    console.log(event.ctrlKey);

    // TODO remove console.log({mouseX: mouse.x, mouseY: mouse.y});

    playerUnits.forEach(playerUnit  => {

        if(event.ctrlKey){
            const mouseObject = { 
                model:{
                    position:{
                        x: mouse.x,
                        y: mouse.y
                    },
                    dimensions:{
                        width: 10,
                        height: 10
                    }
                }
            }
            playerUnit.setSelected(playerUnit.isColliding(mouseObject));
        }
        else{
            playerUnit.setbIsMoving(true);
        }
        
    })
})

// -------------------------------- FUNCTIONS --------------------------------

function clearScreen() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function generateRandom({min, max}){
    return Math.floor(Math.random() * (max - min)) + min;
}

function createBuildings(numberOfBuildings, storage) {

    for(let i = 0; i < numberOfBuildings; i++) {
        const model = new Models.BuildingModel.BuildingModel({
            texture: 'grey',
            position: generateCoordinates({
                min: 0,
                max: 600,
                storage: spawnPoints,
                spacing: 150
            }),
            dimensions: {width:50, height:50},
            type: 'Building',
            faction: 'neutral',
            hp: 100,
            damage: 15
        });
    
        const view = new Views.View.View({
            model: model,
            canvas: canvas,
            context: context
        })

        storage.push(
            new Controllers.BuildingController.BuildingController({
                model: model,
                view: view,
            })
        )
    }

    

    
}

function generateCoordinates({min, max, storage, spacing}){
    let random = {x: generateRandom({min:min, max:max}), y: generateRandom({min:min, max:max})};

    if(storage){
        storage.forEach(point => {
            const distance = Math.hypot(random.x - point.x, random.y - point.y);
            if(distance <= spacing){
                random = generateCoordinates({
                    min: min,
                    max: max,
                    storage: storage,
                    spacing: spacing
                });
                return random;
            }            
        })
        storage.push(random);
    }
    return random;
}

export function animate(fps, state){
    let frameID = requestAnimationFrame(() => animate(fps, state));
    // Calculating time elapsed since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has passed since last iteration generate a new frame

    if(elapsed > 1000/fps){
        then = now - (elapsed % 1000/fps);
        
        // Drawing code
        clearScreen();
        playerUnits.forEach(playerUnit => playerUnit.view.drawTexture());
        enemyUnits.forEach(enemyUnit => enemyUnit.view.drawTexture());
        buildingUnits.forEach(buildingUnit => buildingUnit.view.drawTexture());
    }

    // Player interactions
    let index = 0;
    playerUnits.forEach(playerUnit => {

        if(playerUnit.model.hp <= 0){
            playerUnits.splice(index, 1);
        }

        // Attack enemy
        let enemyIndex = 0;
        enemyUnits.forEach(enemyUnit => {
            if(playerUnit.isColliding(enemyUnit) && enemyUnit.model.attacked === undefined) {

                // Attacking enemy
                enemyUnit.model.attacked = setTimeout(() => {
                    playerUnit.attack(enemyUnit);
                    clearTimeout(enemyUnit.model.attacked);
                    enemyUnit.model.attacked = undefined;
                }, 1000);

                if(enemyUnit.model.hp <= 0) {
                    enemyUnits.splice(enemyIndex, 1);
                }
                
            }
            enemyIndex++;
        })

        // Attack enemy buildings
        buildingUnits.forEach(buildingUnit => {
            if(
                buildingUnit.model.faction === 'enemy' &&
                playerUnit.isColliding(buildingUnit) && buildingUnit.model.attacked === undefined){

                // Attacking enemy building
                buildingUnit.model.attacked = setTimeout(() => {
                    playerUnit.attack(buildingUnit);
                    buildingUnit.defend(playerUnit);
                    clearTimeout(buildingUnit.model.attacked);
                    buildingUnit.model.attacked = undefined;
                }, 1000);

                if(buildingUnit.model.hp <= 0 && buildingUnit.model.type !== 'base'){
                    buildingUnit.model.hp = 100;
                    buildingUnit.model.faction = playerUnit.model.faction;
                    buildingUnit.model.texture = playerUnit.model.texture; // TODO remove this
                }
                
            }
        })

        
        if(playerUnit.model.bIsMoving === true && playerUnit.getSelected() === true){
            playerUnit.move({
                x: mouse.x,
                y: mouse.y
            });
        }

        index++;
    });

    // Enemy interactions
    index = 0;
    enemyUnits.forEach(enemyUnit => {

        if(enemyUnit.model.hp <= 0){
            playerUnits.splice(index, 1);
        }
        
        let playerIndex = 0;
        
        // Attack player
        playerUnits.forEach(playerUnit => {
            enemyUnit.setCombatState(enemyUnit.isColliding(playerUnit));
            if(enemyUnit.getCombatState() && playerUnit.model.attacked === undefined){

                //enemyUnit.setMoved(undefined);
                // Attacking player
                playerUnit.model.attacked = setTimeout(() => {
                    enemyUnit.attack(playerUnit);
                    clearTimeout(playerUnit.model.attacked);
                    playerUnit.model.attacked = undefined;
                }, 1000);

                if(playerUnit.model.hp <= 0) {
                    playerUnits.splice(playerIndex, 1);
                }
                
            }
            playerIndex++;
        })

        if(enemyUnit.getCombatState() === false){
            // Attack player buldings
            buildingUnits.forEach(buildingUnit => {
                
                if(
                    buildingUnit.model.faction === 'player' &&
                    enemyUnit.isColliding(buildingUnit) && buildingUnit.model.attacked === undefined
                ){
                    enemyUnit.setMoved(undefined);
                    enemyUnit.setCombatState(true);

                    // Attacking player building
                    buildingUnit.model.attacked = setTimeout(() => {
                        enemyUnit.attack(buildingUnit);
                        buildingUnit.defend(enemyUnit);
                        clearTimeout(buildingUnit.model.attacked);
                        buildingUnit.model.attacked = undefined;
                    }, 1000);

                    if(buildingUnit.model.hp <= 0 && buildingUnit.model.type !== 'base'){
                        buildingUnit.model.hp = 100;
                        buildingUnit.model.faction = enemyUnit.model.faction;
                        buildingUnit.model.texture = enemyUnit.model.texture; // TODO remove this
                    }
                }
            })
        }
        
        if(enemyUnit.getCombatState() === false){
            // Move to nearest building
            if(enemyUnit.getMoved() === undefined){
                enemyUnit.setMoved(setTimeout(() => {
                    enemyUnit.moveToBuilding(buildingUnits);
                }, 1000/fps));
            }
            enemyUnit.setCombatState(false);       
        }
        index++;
    });

    // Buildings interactions
    buildingUnits.forEach(buildingUnit => {

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

            if(playerUnit.isColliding(buildingUnit) && buildingUnit.model.faction === 'neutral'){
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
        enemyUnits.forEach(enemyUnit => {

            if(enemyUnit.isColliding(buildingUnit) && buildingUnit.model.faction === 'neutral'){
                if(enemyUnit.model.timeoutID === undefined){
                    enemyUnit.model.timeoutID  = setTimeout(() => {
                        if(enemyUnit.isColliding(buildingUnit)){
                            buildingUnit.model.texture = enemyUnit.model.texture;
                            buildingUnit.model.faction = 'enemy'
                        }
                        clearTimeout(enemyUnit.model.timeoutID);
                        enemyUnit.model.timeoutID  = undefined;
                    }, 5000);    
                }        
            }
        })
        

        // Generating units
        if(buildingUnit.model.faction === 'player'){
            if(buildingUnit.model.timeoutID === undefined && playerUnits.length < numberOfUnits){
                buildingUnit.model.timeoutID = setTimeout(() => {
                    playerUnits.push(buildingUnit.createUnit({
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
            if(buildingUnit.model.timeoutID === undefined && enemyUnits.length < numberOfUnits){
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

        // TODO find better way to prevent from spawning more units than allowed
        while(playerUnits.length > numberOfUnits){
            playerUnits.splice(playerUnits.length - 1, 1);
        }
        while(enemyUnits.length > numberOfUnits){
            enemyUnits.splice(enemyUnits.length - 1, 1);
        }
        
    });

    // TODO Oznacovanie jednotiek playera
    // TODO Create list of buildings being captured and dont move more then two units to that position
    // TODO Obmedzit pocet jednotiek ktore mozu ist obsadit budovu
    // TODO Aplikovat textury do hry
    // TODO Priama detekcia kolizie alebo vypocet vzdialenosti? Kde a preco?
    // TODO Vytvor gettery a settery
    // TODO fixnut victory screen menu button bug

}

export function initialize(){
    
    // Used to calculate elapsed time (FPS)
    then = Date.now();
    now = undefined;
    elapsed = undefined; 

    buildingUnits = new Array();
    playerUnits = new Array();
    enemyUnits = new Array();
    spawnPoints = new Array();

    let buildingModels =[
        new Models.BuildingModel.BuildingModel({
            texture: 'green',
            position: {x:50, y:50},
            dimensions: {width:50, height:50},
            type: 'base',
            faction: 'player',
            hp: 100,
            damage: 30
        }),
        new Models.BuildingModel.BuildingModel({
            texture: 'red',
            position: {x:600, y:600},
            dimensions: {width:50, height:50},
            type: 'base',
            faction: 'enemy',
            hp: 100,
            damage: 30
        })
    ]
    
    let buildingViews = [
        new Views.View.View({
            model: buildingModels[0],
            canvas: canvas,
            context: context
        }),
        new Views.View.View({
            model: buildingModels[1],
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
        })
    ]

    createBuildings(numberOfBuldings, buildingUnits);

}