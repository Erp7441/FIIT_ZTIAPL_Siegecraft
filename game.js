/*
    1. Vytvorit mapu
        ?Ako vykreslit texturu?
        TODO Pridat base mapu
*/

// -------------------------------- IMPORTS --------------------------------

import * as Logic from './logic.js';

// -------------------------------- VARIABLES --------------------------------

const canvas = document.getElementById('board');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playButton = document.getElementById('playButton');
const optionsButton = document.getElementById('optionsButton');
const instructionsButton = document.getElementById('instructionsButton');
const retryButton = document.getElementById('retryButton');
const backButtons = document.getElementsByClassName('backButtons');

let state = { gameOver: false, victory: false };;

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
            //showVictoryScreen();
            return;
        }
        return setTimeout(listener, 250);
    };
    listener();
}

function showOptions(){
    const mainMenu = document.getElementById('mainMenu');
    const optionsMenu = document.getElementById('optionsMenu');
    mainMenu.style.visibility = 'hidden';
    optionsMenu.style.visibility = 'visible';
}

function showInstructions(){
    const mainMenu = document.getElementById('mainMenu');
    const instructionsMenu = document.getElementById('instructionsMenu');
    mainMenu.style.visibility = 'hidden';
    instructionsMenu.style.visibility = 'visible';
}

function showMainMenu(){
    const mainMenu = document.getElementById('mainMenu');
    const optionsMenu = document.getElementById('optionsMenu');
    const instructionsMenu = document.getElementById('instructionsMenu');
    const gameOverScreen = document.getElementById('gameOverScreen');

    mainMenu.style.visibility = 'visible';
    optionsMenu.style.visibility = 'hidden';
    instructionsMenu.style.visibility = 'hidden';
    gameOverScreen.style.visibility = 'hidden';
}

function showGameOver(){
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    gameOverScreen.style.visibility = 'visible';
    canvas.style.visibility = 'hidden';
}

// ----------------------------- EVENT LISTENERS ----------------------------

playButton.addEventListener('click', playGame);
optionsButton.addEventListener('click', showOptions);
instructionsButton.addEventListener('click', showInstructions);
retryButton.addEventListener('click', playGame);

for (let index = 0; index < backButtons.length; index++) {
    backButtons[index].addEventListener('click', showMainMenu);
}