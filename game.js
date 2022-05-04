/*
    1. Vytvorit mapu
        ?Ako vykreslit texturu?
        TODO Pridat base mapu
*/

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

let state = { gameOver: false, victory: false };

// -------------------------------- FUNCTIONS --------------------------------

function playGame(){
    const mainMenu = document.getElementById('mainMenu');
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    mainMenu.style.visibility = 'hidden';
    gameOverScreen.style.visibility = 'hidden';
    canvas.style.visibility = 'visible';

    // -------------------------------- START GAME --------------------------------

    state.gameOver = false;
    state.victory = false;

    music(false); // Stops music on playGame // TODO change music on playGame
    Logic.initialize();
    Logic.animate(60, state);
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

    mainMenu.style.visibility = 'visible';
    settingsMenu.style.visibility = 'hidden';
    controlsMenu.style.visibility = 'hidden';
    gameOverScreen.style.visibility = 'hidden';
}

function showGameOver(){
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    gameOverScreen.style.visibility = 'visible';
    canvas.style.visibility = 'hidden';
}

function showVictory(){
    const victoryScreen = document.getElementById('victoryScreen');
    
    victoryScreen.style.visibility = 'visible';
    canvas.style.visibility = 'hidden';
}

function quitGame(){
    alert('Thank you for playing!');
    window.close();
    location.replace("about:blank"); // If window.close() fails then redirect to blank page
}

function sound(){
    if(localStorage.getItem('bPlayFx') === 'true'){
        localStorage.setItem('bPlayFx', false);
    }
    else{
        localStorage.setItem('bPlayFx', true);
    }
}

function music(override){
    // TODO use .volume attribue to set volume gradually

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

function playFx(path){

    if(localStorage.getItem('bPlayFx') === 'false'){ return; }

    try {

        // TODO get rid of "Uncaught (in promise) DOMException: The fetching process for the media resource was aborted by the user agent at the user's request."

        const fx = new Audio(path);
        fx.load();
        fx.volume = 0.5; // TODO set volume dynamically
        fx.play();
    } catch (error) {
        console.log(error);
    }
    
}

// ----------------------------- EVENT LISTENERS ----------------------------

window.addEventListener('load', () => {
    if(localStorage.getItem('bPlayFx') === null){
        localStorage.setItem('bPlayFx', true);
    }
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
soundButton.addEventListener('click', sound);
musicButton.addEventListener('click', () => music());

for (const button of buttons) {
    button.addEventListener('click', () => playFx('sounds/combat/metal4.wav'));
}

for (const button of quitButtons){
    button.addEventListener('click', quitGame);
}

for (const button of backButtons) {
    button.addEventListener('click', showMainMenu);
}