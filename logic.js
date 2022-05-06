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
let numberOfBuildings = 10; // Controls number of neural buildings spawned into the game
let numberOfUnits = 7; // Controls number of units spawned into the game

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

// -------------------------------- EVENT LISTENERS --------------------------------

addEventListener('click', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

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
                        width: 50,
                        height: 50
                    }
                }
            }
            playerUnit.setSelected(playerUnit.isColliding(mouseObject));
        }
        else{
            playerUnit.setbIsMoving(true);
        }
        
    })
});

// -------------------------------- FUNCTIONS --------------------------------

function clearScreen() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function generateRandom({min, max}){
    return Math.floor(Math.random() * (max - min)) + min;
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
        });
        storage.push(random);
    }
    return random;
}

function createBuildings({numberOfBuildings, storage}) {
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
        });

        storage.push(
            new Controllers.BuildingController.BuildingController({
                model: model,
                view: view,
            })
        );
    }
}

function checkEndGame({buildingUnit, gameState, animationFrameToStop}){
    if(buildingUnit.model.type === 'base' && buildingUnit.model.hp <= 0) {
        if(buildingUnit.model.faction === 'player'){
            gameState.gameOver = true;
        }
        else if(buildingUnit.model.faction === 'enemy'){
            gameState.victory = true;
        }
        cancelAnimationFrame(animationFrameToStop);
    }

}

function checkColision({collidingUnit, collidedUnit}){
    if(collidingUnit.isColliding(collidedUnit) && collidedUnit.model.faction === 'neutral'){
        if(collidingUnit.model.timeoutID === undefined){
            collidingUnit.model.timeoutID  = setTimeout(() => {
                if(collidingUnit.isColliding(collidedUnit)){
                    collidedUnit.model.texture = collidingUnit.model.texture;
                    collidedUnit.model.faction = collidingUnit.model.faction;
                }
                clearTimeout(collidingUnit.model.timeoutID);
                collidingUnit.model.timeoutID  = undefined;
            }, 5000);    
        }        
    }
}

function generateUnits({buildingUnit, storages, canvas, context}){
    let unitsStorage = undefined;
    let promise = new Promise((resolve) => {
        Object.values(storages).forEach((storageObject, index, array) => {
            if(buildingUnit.model.faction === storageObject.faction){
                unitsStorage = storageObject.storage;
            }
            if (index === array.length-1) resolve();
        })
    })

    promise.then(() => {
        if(unitsStorage !== undefined){
            if(buildingUnit.model.timeoutID === undefined && unitsStorage.length < numberOfUnits && buildingUnit.model.faction !== 'neutral'){
                buildingUnit.model.timeoutID = setTimeout(() => {
                    unitsStorage.push(buildingUnit.createUnit({
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
}

function attackUnits({unit, enemyUnits}){
    let index = 0;
    enemyUnits.forEach(enemyUnit => {
        unit.setCombatState(unit.isColliding(enemyUnit));
        if(unit.getCombatState() && enemyUnit.model.attacked === undefined){

            // Attacking enemy
            enemyUnit.model.attacked = setTimeout(() => {
                unit.attack(enemyUnit);
                clearTimeout(enemyUnit.model.attacked);
                enemyUnit.model.attacked = undefined;
            }, 1000);

            if(enemyUnit.model.hp <= 0) {
                enemyUnits.splice(index, 1);
            }
        }
        index++;
    });
}

function attackBuildings({unit, buildingUnits}){
    if(unit.getCombatState() === false){
        // Attack enemy buldings
        buildingUnits.forEach(buildingUnit => {
            
            if(
                (buildingUnit.model.faction !== unit.model.faction && buildingUnit.model.faction !== 'neutral')
                && unit.isColliding(buildingUnit) && buildingUnit.model.attacked === undefined
            ){
                unit.setMoved(undefined);
                unit.setCombatState(true);

                // Attacking player building
                buildingUnit.model.attacked = setTimeout(() => {
                    unit.attack(buildingUnit);
                    buildingUnit.defend(unit);
                    buildingUnit.model.attacked = undefined;
                    clearTimeout(buildingUnit.model.attacked);
                }, 1000);

                if(buildingUnit.model.hp <= 0 && buildingUnit.model.type !== 'base'){
                    buildingUnit.model.hp = 100;
                    buildingUnit.model.faction = unit.model.faction;
                    buildingUnit.model.texture = unit.model.texture; // TODO remove this
                }
            }
        });
    }
}

function attackEnemy({unit, enemyUnits, buildingUnits}){
    // Attack enemyUnits
    attackUnits({
        unit: unit,
        enemyUnits: enemyUnits
    });
    // Attack buildingUnits
    attackBuildings({
        unit: unit,
        buildingUnits: buildingUnits
    });
}

function moveUnit({unit, buildingUnits, fps}){
    if(unit.getCombatState() === false){
        // Move to nearest building
        if(unit.getMoved() === undefined){
            unit.setMoved(setTimeout(() => {
                unit.moveToBuilding(buildingUnits);
            }, 1000/fps));
        }
        unit.setCombatState(false);       
    }
}

function checkNumberOfUnits({units, max}){
    // TODO find better way to prevent from spawning more units than allowed
    while(units.length > max){
        units.splice(units.length - 1, 1);
    }
}

function playerHandler(){

    // Player interactions
    let index = 0;
    playerUnits.forEach(playerUnit => {

        if(playerUnit.model.hp <= 0){
            playerUnits.splice(index, 1);
        }

        // Attacking enemy
        attackEnemy({
            unit: playerUnit,
            enemyUnits: enemyUnits,
            buildingUnits: buildingUnits
        });

        if(playerUnit.model.bIsMoving === true && playerUnit.getSelected() === true){
            playerUnit.move({
                x: mouse.x,
                y: mouse.y
            });
        }
        index++;
    });
}

function enemyHandler({fps}){
    
    // Enemy interactions
    let index = 0;
    enemyUnits.forEach(enemyUnit => {

        if(enemyUnit.model.hp <= 0){
            enemyUnits.splice(index, 1);
        }
        
        attackEnemy({
            unit: enemyUnit,
            enemyUnits: playerUnits,
            buildingUnits: buildingUnits
        });

        moveUnit({
            unit: enemyUnit,
            buildingUnits: buildingUnits,
            fps: fps
        });
        
        index++;
    });
}

function buildingsHandler({state, animationFrame}){
    
    // Buildings interactions
    buildingUnits.forEach(buildingUnit => {

        // Game end conditions
        checkEndGame({
            buildingUnit: buildingUnit,
            gameState: state,
            animationFrameToStop: animationFrame
        });

        // Collision detection
        playerUnits.forEach(playerUnit => checkColision({
            collidingUnit: playerUnit,
            collidedUnit: buildingUnit
        }));
        enemyUnits.forEach(enemyUnit => checkColision({
            collidingUnit: enemyUnit,
            collidedUnit: buildingUnit
        }));
        

        // Generating units
        generateUnits({
            buildingUnit: buildingUnit,
            storages: {
                player: {
                    faction: 'player',
                    storage: playerUnits
                },
                enemy: {
                    faction: 'enemy',
                    storage: enemyUnits
                }
            },
            canvas: canvas,
            context: context
        });

        // Checking if we haven't spawned more units than allowed
        checkNumberOfUnits({
            units: playerUnits,
            max: numberOfUnits
        });
        checkNumberOfUnits({
            units: enemyUnits,
            max: numberOfUnits
        });
        
    });
}

export function animate({fps, state}){
    let frameID = requestAnimationFrame(() => animate({fps: fps, state: state}));
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

    playerHandler();

    enemyHandler({
        fps: fps
    });

    buildingsHandler({
        state: state,
        animationFrame: frameID
    });    

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

    createBuildings({
        numberOfBuildings: numberOfBuildings,
        storage: buildingUnits
    });

}