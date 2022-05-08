import * as Models from './models/Models.js';
import * as Views from './views/Views.js'; 
import * as Controllers from './controllers/Controllers.js';
import * as Map from './maps.js';

const tiles = loadTextures('images/textures/PNG/Default size/Tile/scifiTile_XX.png',12);
const enviroment = loadTextures('images/textures/PNG/Default size/Environment/scifiEnvironment_XX.png', 20);


const UnitPrototype = {
    dimensions: {
        width:64,
        height:64
    },
    hp: 100,
    armor: 100,
    damage: 10
}

const BuildingPrototype = {
    dimensions: {
        width:64,
        height:64
    },
    hp: 100,
    damage: 30
}

const DifficultyPrototype = [
    {
        name: "Easy",
        time: 1801,
        numberOfBuildings: 5,
        numberOfPlayerUnits: 6,
        numberOfEnemyUnits: 3
    },
    {
        name: "Normal",
        time: 901,
        numberOfBuildings: 10,
        numberOfPlayerUnits: 5,
        numberOfEnemyUnits: 5
    },
    {
        name: "Hard",
        time: 451,
        numberOfBuildings: 15,
        numberOfPlayerUnits: 7,
        numberOfEnemyUnits: 10
    }
]


// -------------------------------- VARIABLES --------------------------------

let then = Date.now(), now = undefined, elapsed = undefined; // Used to calculate elapsed time (FPS)

const playerScore = document.getElementById('playerScore');
const enemyScore = document.getElementById('enemyScore');
const timer = document.getElementById('timer');
const difficultyButton = document.getElementById('difficultyButton');
const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let buildingUnits = new Array();
let playerUnits = new Array();
let enemyUnits = new Array();
let spawnPoints = new Array();
let map = undefined;
let props = undefined;
let numberOfPlayerBuildings = 0;
let numberOfEnemyBuildings = 0;
let timerID = undefined;
let time = undefined;
let difficulty = parseInt(localStorage.getItem('difficulty'));
let paused = false;

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

// -------------------------------- EVENT LISTENERS --------------------------------

addEventListener('click', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    const playSound = (path) => {
        const fx = new Audio(path);
        fx.load();
        fx.volume = parseFloat(localStorage.getItem('fxVolume'));
        fx.play().catch((e) => {
            //console.error(e); //? Uncomment if debugging
        });
    }

    playSound('./sounds/Click.wav');

    if(!paused){
        playerUnits.forEach(playerUnit  => {

            if(event.ctrlKey){
                const mouseObject = { 
                    model:{
                        position:{
                            x: mouse.x,
                            y: mouse.y
                        },
                        dimensions:{
                            width: 100,
                            height: 100
                        }
                    }
                }
                playerUnit.setSelected(playerUnit.isColliding(mouseObject));
            }
            else{
                playerUnit.setIsMoving(true);
            }
            
        })
    }
});

difficultyButton.addEventListener('click', () => {
    difficulty++;
    if(difficulty+1 > DifficultyPrototype.length){
        difficulty = 0;
    }
    localStorage.setItem('difficulty', difficulty);
    alert('Difficulty: ' + DifficultyPrototype[difficulty].name);
})

window.addEventListener('keydown', (event) => {
    event.preventDefault();
    if(event.key === 'Escape'){
        if(paused){
            let minutes = parseInt(time / 60, 10)
            let seconds = parseInt(time % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timer.innerHTML = minutes + ":" + seconds;
            paused = false;
        }
        else {
            timer.innerHTML = 'Paused';
            paused = true;
        }
    }
});

// -------------------------------- FUNCTIONS --------------------------------

function clearScreen() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMap(canvas, context, tiles, map);
    drawMap(canvas, context, enviroment, props);
}

function loadTextures(path, numberOfTextures){
    let textures = new Array();

    let file = path.split("XX");
    for(let i = 1; i <= numberOfTextures; i++){
        const image = new Image();
        image.src = file[0]+(i<10 ? '0' : '')+i+file[1];
        textures.push(image);
    }
    return textures;
}

function drawMap(canvas, context, textures, map ){
    for(let x = 0; x < canvas.width; x+=64) {
        for(let y = 0; y < canvas.height; y+=64) {
            if(map[y/64][x/64] !== 0){
                context.drawImage(textures[map[y/64][x/64]-1], x, y, 64, 64);
            }            
        }
    }
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

function generateID({length}){
    return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""));
}

function generateConnection({storage, exclude}){
    return new Promise((resolve, reject) => {
        if(!storage || storage.length === 0){
            reject(undefined);
        }

        let index = generateRandom({min: 0, max:storage.length-1});
        for(let ID in exclude){
            if(storage[index].getID() === ID){
                index = generateRandom({min: 0, max:storage.length-1});
            }
        }
        resolve(storage[index].getID());
    });
}

function generateConnections({storage, exclude, numberOfConnections}){
    let connections = new Array();
    for(let index = 0; index < numberOfConnections; index++) {
        generateConnection({
            storage: storage,
            exclude: exclude
        }).then(value => {
            if(!connections.includes(value)){
                connections.push(value);
            }
        });      
    }
    return connections;
}

function createBuildings({numberOfBuildings, storage}) {
    for(let i = 0; i < numberOfBuildings; i++) {

        const model = new Models.BuildingModel.BuildingModel({
            texture: 'images/textures/PNG/Default size/Structure/scifiStructure_0'+generateRandom({
                min: 2,
                max: 7
            })+'.png',
            position: generateCoordinates({
                min: 150,
                max: 800,
                storage: spawnPoints,
                spacing: 150
            }),
            dimensions: BuildingPrototype.dimensions,
            type: 'Building',
            faction: 'neutral',
            hp: BuildingPrototype.hp,
            damage: BuildingPrototype.damage,
            ID: generateID({
                length: 16
            })
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
    if(buildingUnit.getUnitType() === 'base' && buildingUnit.getHp() <= 0) {
        if(buildingUnit.getFaction() === 'player'){
            gameState.gameOver = true;
        }
        else if(buildingUnit.getFaction() === 'enemy'){
            gameState.victory = true;
        }
        cancelAnimationFrame(animationFrameToStop);
    }

}

function captureBuiding({attackingUnit, capturedUnit}){
    if(attackingUnit.isColliding(capturedUnit) && capturedUnit.getFaction() === 'neutral'){
        if(attackingUnit.getTimeoutID() === undefined){
            attackingUnit.setTimeoutID(setTimeout(() => {
                if(attackingUnit.isColliding(capturedUnit)){
                    capturedUnit.setFaction(attackingUnit.getFaction());
                }
                clearTimeout(attackingUnit.getTimeoutID());
                attackingUnit.setTimeoutID(undefined);
            }, 5000));
        }
        else if(paused && attackingUnit.getTimeoutID() !== undefined){
            clearTimeout(attackingUnit.getTimeoutID());
            attackingUnit.setTimeoutID(undefined);
        }        
    }
}

function generateUnits({buildingUnit, playerUnits, enemyUnits, canvas, context}){
    if(buildingUnit.getTimeoutID() === undefined && buildingUnit.getFaction() !== 'neutral'){
        buildingUnit.setTimeoutID(setTimeout(() => {
            let unitsStorage = (buildingUnit.getFaction() === 'player' ?  playerUnits : enemyUnits);
            let numberOfUnits = (buildingUnit.getFaction() === 'player' ? DifficultyPrototype[difficulty].numberOfPlayerUnits : DifficultyPrototype[difficulty].numberOfEnemyUnits);
            if(unitsStorage.length < numberOfUnits){
                unitsStorage.push(buildingUnit.createUnit({
                    texture: 'images/textures/PNG/Default size/Unit/scifiUnit_0'+generateRandom({
                        min: 1,
                        max: 5
                    })+'.png',
                    position: {
                        x: buildingUnit.getPosition().x,
                        y: buildingUnit.getPosition().y
                    },
                    dimensions: UnitPrototype.dimensions,
                    hp: UnitPrototype.hp,
                    armor: UnitPrototype.armor,
                    damage: UnitPrototype.damage
                }, canvas, context));
            }
            clearTimeout(buildingUnit.getTimeoutID());
            buildingUnit.setTimeoutID(undefined);
        }, 5000));
    }
    else if (paused && buildingUnit.getTimeoutID()){
        clearTimeout(buildingUnit.getTimeoutID());
        buildingUnit.setTimeoutID(undefined);
    }
}

function attackUnits({unit, enemyUnits}){
    let index = 0;
    enemyUnits.forEach(enemyUnit => {
        unit.setCombat(unit.isColliding(enemyUnit));
        if(unit.getCombat() && enemyUnit.getAttacked() === undefined){

            unit.setMoved(undefined);
            // Attacking enemy
            enemyUnit.setAttacked(setTimeout(() => {
                unit.attack(enemyUnit);
                clearTimeout(enemyUnit.getAttacked());
                enemyUnit.setAttacked(undefined);
            }, 1000));

            if(enemyUnit.getHp() <= 0) {
                enemyUnits.splice(index, 1);
            }
        }
        else if(paused && enemyUnit.getAttacked() !== undefined){
            clearTimeout(enemyUnit.getAttacked());
            enemyUnit.setAttacked(undefined);
        }
        index++;
    });
}

function attackBuildings({unit, buildingUnits}){
    if(unit.getCombat() === false){
        // Attack enemy buldings
        buildingUnits.forEach(buildingUnit => {
            
            if(
                (buildingUnit.getFaction() !== unit.getFaction() && buildingUnit.getFaction() !== 'neutral')
                && unit.isColliding(buildingUnit) && buildingUnit.getAttacked() === undefined
            ){

                if(
                    (buildingUnit.getUnitType() === 'base' && unit.getCanCaptureBase() === true)||
                    buildingUnit.getUnitType() !== 'base'
                ){
                    unit.setMoved(undefined);
                    unit.setCombat(unit.isColliding(buildingUnit));

                    // Attacking player building
                    buildingUnit.setAttacked(setTimeout(() => {
                        unit.attack(buildingUnit);
                        buildingUnit.defend(unit);
                        clearTimeout(buildingUnit.getAttacked());
                        buildingUnit.setAttacked(undefined);
                    }, 1000));

                    if(buildingUnit.getHp() <= 0 && buildingUnit.getUnitType() !== 'base'){
                        buildingUnit.setHp(100);
                        buildingUnit.setFaction(unit.getFaction());
                    }
                }
            }
            else if(paused && buildingUnit.getAttacked() !== undefined){
                clearTimeout(buildingUnit.getAttacked());
                buildingUnit.setAttacked(undefined);
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
    if(unit.getCombat() === false){
        // Move to nearest building
        if(unit.getMoved() === undefined){
            unit.setMoved(setTimeout(() => {
                unit.moveToBuilding(buildingUnits);
            }, 1000/fps));
        }
        else if(paused && unit.getMoved() !== undefined){
            clearTimeout(unit.getMoved());
            unit.setMoved(undefined);
        }
    }
}

function checkNumberOfUnits({units, max}){
    while(units.length > max){
        units.splice(units.length - 1, 1);
    }
}

function playerHandler(){

    // Player interactions
    let index = 0;
    playerUnits.forEach(playerUnit => {

        if(playerUnit.getHp() <= 0){
            playerUnits.splice(index, 1);
        }

        // Attacking enemy
        attackEnemy({
            unit: playerUnit,
            enemyUnits: enemyUnits,
            buildingUnits: buildingUnits
        });

        if(playerUnit.getIsMoving() === true && playerUnit.getSelected() === true){
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

        if(enemyUnit.getHp() <= 0){
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

function setCaptureState({playerCaptureState, enemyCaptureState}){
    playerUnits.forEach(playerUnit => {
        playerUnit.setCanCaptureBase(playerCaptureState);
    });
    enemyUnits.forEach(enemyUnit => {
        enemyUnit.setCanCaptureBase(enemyCaptureState);
    })
}

function buildingsHandler({state, animationFrame}){
    

    numberOfPlayerBuildings = 0;
    numberOfEnemyBuildings = 0;
    
    // Buildings interactions
    buildingUnits.forEach(buildingUnit => {

        if(buildingUnit.getUnitType() != 'base'){
            if(buildingUnit.getFaction() === 'player'){
                numberOfPlayerBuildings++;
            }
            else if(buildingUnit.getFaction() === 'enemy'){
                numberOfEnemyBuildings++;
            }
        }
        
        // Game end conditions
        checkEndGame({
            buildingUnit: buildingUnit,
            gameState: state,
            animationFrameToStop: animationFrame
        });

        // Collision detection
        playerUnits.forEach(playerUnit => captureBuiding({
            attackingUnit: playerUnit,
            capturedUnit: buildingUnit
        }));
        enemyUnits.forEach(enemyUnit => captureBuiding({
            attackingUnit: enemyUnit,
            capturedUnit: buildingUnit
        }));
        

        // Generating units
        generateUnits({
            buildingUnit: buildingUnit,
            playerUnits: playerUnits,
            enemyUnits: enemyUnits,
            canvas: canvas,
            context: context
        });

        // Checking if we haven't spawned more units than allowed
        checkNumberOfUnits({
            units: playerUnits,
            max: DifficultyPrototype[difficulty].numberPlayerOfUnits
        });
        checkNumberOfUnits({
            units: enemyUnits,
            max: DifficultyPrototype[difficulty].numberEnemyOfUnits
        });
        
    });

    if(numberOfPlayerBuildings > numberOfEnemyBuildings){
        setCaptureState({
            playerCaptureState: true,
            enemyCaptureState: false
        });
    }
    else if(numberOfPlayerBuildings < numberOfEnemyBuildings){
        setCaptureState({
            playerCaptureState: false,
            enemyCaptureState: true
        });
    }
    else{
        setCaptureState({
            playerCaptureState: false,
            enemyCaptureState: false
        });
    }
    
}

function updateScore(){
    playerScore.innerHTML = numberOfPlayerBuildings;
    enemyScore.innerHTML = numberOfEnemyBuildings;
}

function updateTime(gameState){
    let minutes, seconds;

    timerID = setInterval(() => {

        if(paused || gameState.victory || gameState.gameOver){
            return;
        }

        if (--time <= -1) {
            time = 0;   
        }

        minutes = parseInt(time / 60, 10)
        seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timer.innerHTML = minutes + ":" + seconds;

    }, 1000);
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
        playerUnits.forEach(playerUnit => playerUnit.drawTexture());
        enemyUnits.forEach(enemyUnit => enemyUnit.drawTexture());
        buildingUnits.forEach(buildingUnit => buildingUnit.drawTexture());
    }

    if(!paused){
        playerHandler();

        enemyHandler({
            fps: fps
        });

        new Promise((resolve) => {
            buildingsHandler({
                state: state,
                animationFrame: frameID
            });
            resolve()
        }).then(() => {
            updateScore();
        })

        if(!timerID){ updateTime(state); }
        if(time <= 0){
            cancelAnimationFrame(frameID);
            if(numberOfPlayerBuildings < numberOfEnemyBuildings){
                state.gameOver = true;
            }
            else{
                state.victory = true;
            }
        }
    }
}

export function initialize(){
    
    difficulty = parseInt(localStorage.getItem('difficulty'));

    // Used to calculate elapsed time (FPS)
    then = Date.now();
    now = undefined;
    elapsed = undefined; 

    buildingUnits = new Array();
    playerUnits = new Array();
    enemyUnits = new Array();
    spawnPoints = new Array();

    numberOfPlayerBuildings = 0;
    numberOfEnemyBuildings = 0;

    
    timer.innerHTML = "00:00";
    time = DifficultyPrototype[difficulty].time;
    timerID = undefined;

    const level = generateRandom({
        min: 0,
        max: Map.maps.length-1
    })
    
    map = Map.maps[level]
    props = Map.props[level]


    let buildingModels =[
        new Models.BuildingModel.BuildingModel({
            texture: 'images/textures/PNG/Default size/Structure/scifiStructure_01.png',
            position: {x:10, y:10},
            dimensions: {width:50, height:50},
            type: 'base',
            faction: 'player',
            hp: 100,
            damage: 30,
            ID: 1
        }),
        new Models.BuildingModel.BuildingModel({
            texture: 'images/textures/PNG/Default size/Structure/scifiStructure_01.png',
            position: {x:900, y:900},
            dimensions: {width:50, height:50},
            type: 'base',
            faction: 'enemy',
            hp: 100,
            damage: 30,
            ID: 2
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

    new Promise((resolve) => {
        createBuildings({
            numberOfBuildings: DifficultyPrototype[difficulty].numberOfBuildings,
            storage: buildingUnits
        });
        resolve()
    }).then(() => {
        buildingUnits.forEach(buildingUnit => {
            buildingUnit.setConnections(generateConnections({
                storage: buildingUnits,
                exclude: buildingUnit.getID(),
                numberOfConnections: 3
            }))
        });
    })

}