/*
    1. Vytvorit mapu
        ?Ako vykreslit texturu?
        TODO Pridat base mapu
        TODO Vytvorit objekty na mape s koliziami
    2. Vytvorit jednotky. (Objekty s atributmi)
    3. Vytvorit budovy
*/

// -------------------------------- IMPORTS --------------------------------

import * as Functions from './modules/functions.js';

// -------------------------------- VARIABLES --------------------------------


const canvas = document.getElementById('board');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// -------------------------------- FUNCTIONS --------------------------------

Functions.animate(60)