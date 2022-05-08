// -------------------------------- IMPORTS --------------------------------

import * as Logic from './logic.js';

// -------------------------------- VARIABLES --------------------------------

const canvas = document.getElementById('board');
canvas.width = 960;
canvas.height = 960;

const playButton = document.getElementById('playButton');
const settingsButton = document.getElementById('settingsButton');
const controlsButton = document.getElementById('controlsButton');
const retryButton = document.getElementById('retryButton');
const backButtons = document.getElementsByClassName('backButtons');
const quitButtons = document.getElementsByClassName('quitButtons');
const soundButton = document.getElementById('soundButton');
const musicButton = document.getElementById('musicButton');
const buttons = document.getElementsByClassName('buttons');
const counters = document.getElementById('counters');

let state = { gameOver: false, victory: false };
let fxVolume = 0.5;

// -------------------------------- FUNCTIONS --------------------------------

function playGame(){
    const mainMenu = document.getElementById('mainMenu');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const victoryScreen = document.getElementById('victoryScreen');
    
    mainMenu.style.visibility = 'hidden';
    gameOverScreen.style.visibility = 'hidden';
    victoryScreen.style.visibility = 'hidden';
    canvas.style.visibility = 'visible';
    counters.style.visibility = 'visible';

    // -------------------------------- START GAME --------------------------------

    state.gameOver = false;
    state.victory = false;

    changeMusic('./sounds/soundtrack/'+generateRandom({
        min: 1,
        max: 8
    })+'.mp3');

    let init = new Promise((resolve) => {
        Logic.initialize();
        resolve()
    })

    init.then(() => Logic.animate({
        fps: 60,
        state:state
    }));

    stateListener();
}

function stateListener() {
    const listener = () => {
        // Po prvom game over vzdy true
        if (state.gameOver === true) {
            showGameOver();
            return;
        }
        else if (state.victory === true) {
            showVictory();
            return;
        }
        return setTimeout(listener, 250);
    };
    listener();
}

function showSettings(){
    const mainMenu = document.getElementById('mainMenu');
    const settingsMenu = document.getElementById('settingsMenu');
    mainMenu.style.visibility = 'hidden';
    settingsMenu.style.visibility = 'visible';
}

function showControls(){
    const mainMenu = document.getElementById('mainMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    mainMenu.style.visibility = 'hidden';
    controlsMenu.style.visibility = 'visible';
}

function showMainMenu(){
    const mainMenu = document.getElementById('mainMenu');
    const settingsMenu = document.getElementById('settingsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const victoryScreen = document.getElementById('victoryScreen');

    changeMusic('./sounds/MainTheme.mp3');

    mainMenu.style.visibility = 'visible';
    settingsMenu.style.visibility = 'hidden';
    controlsMenu.style.visibility = 'hidden';
    gameOverScreen.style.visibility = 'hidden';
    victoryScreen.style.visibility = 'hidden';
    counters.style.visibility = 'hidden';
}

function showGameOver(){
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    gameOverScreen.style.visibility = 'visible';
    canvas.style.visibility = 'hidden';
    playFx('./sounds/GameOver.mp3');
}

function showVictory(){
    const victoryScreen = document.getElementById('victoryScreen');
    
    victoryScreen.style.visibility = 'visible';
    canvas.style.visibility = 'hidden';
    playFx('./sounds/Victory.mp3');
}

function quitGame(){
    alert('Thank you for playing!');
    window.close();
    location.replace("about:blank"); // If window.close() fails then redirect to blank page
}

function setVolumeDynamically(volume){
    if(volume > 0){
        volume -= 0.1;
        volume = volume.toFixed(1);
    }
    else{
        volume = 1;
    }
    return volume;
}

function music(override){

    const musicElement = document.getElementById('musicElement');

    if(override !== undefined){
        localStorage.setItem('bPlayMusic', !override);
    }
    else{
        localStorage.setItem('bPlayMusic', !musicElement.paused);
    }

    if(localStorage.getItem('bPlayMusic') === 'true'){
        musicElement.pause();
        localStorage.setItem('bPlayMusic', false);
    }
    else{
        musicElement.currentTime = 0;
        musicElement.play();
        localStorage.setItem('bPlayMusic', true);
    }
}

function changeMusic(path){
    
    music(false);
    const musicElement = document.getElementById('musicElement');
    musicElement.src = path;
    music(true);
}

function playFx(path){

    if(localStorage.getItem('bPlayFx') === 'false'){ return; }

    try {
        const fx = new Audio(path);
        fx.load();
        fx.volume = fxVolume;
        fx.play();
    } catch (error) {
        console.log(error);
    }
    
}

function generateRandom({min, max}){
    return Math.floor(Math.random() * (max - min)) + min;
}

// ----------------------------- EVENT LISTENERS ----------------------------

window.addEventListener('load', () => {
    if(localStorage.getItem('bPlayMusic') === null){
        localStorage.setItem('bPlayMusic', true);
        
    }
    if(localStorage.getItem('bPlayMusic') === 'true'){
        music(true);
    }
});

playButton.addEventListener('click', playGame);
settingsButton.addEventListener('click', showSettings);
controlsButton.addEventListener('click', showControls);
retryButton.addEventListener('click', playGame);

soundButton.addEventListener('click', () => {
    fxVolume = setVolumeDynamically(fxVolume);
});

musicButton.addEventListener('click', () => {
    const musicElement = document.getElementById('musicElement');
    musicElement.volume = setVolumeDynamically(musicElement.volume);
});

for (const button of buttons) {
    button.addEventListener('click', () => playFx('sounds/combat/metal4.wav'));
}

for (const button of quitButtons){
    button.addEventListener('click', quitGame);
}

for (const button of backButtons) {
    button.addEventListener('click', showMainMenu);
}
