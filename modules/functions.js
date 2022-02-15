import * as Classes from './classes.js';

// -------------------------------- VARIABLES --------------------------------

let then = Date.now(); 
let now;
let elapsed;

const canvas = document.getElementById('board');
const c = canvas.getContext('2d');
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
})

// -------------------------------- FUNCTIONS --------------------------------

export function animate(fps){
    requestAnimationFrame(animate);

    // Calculating time elapsed since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has passed since last iteration generate a new frame

    if(elapsed > 1000/fps){ then = now - (elapsed % 1000/fps); }

    obj.drawTexture(obj.color)
    obj2.drawTexture(obj2.color)

    obj.update({x:mouse.x, y:mouse.y}, {x:100, y:100});
    const dist = Math.hypot(mouse.x - obj.position.x, mouse.y - obj.position.y);
    
    // TODO smoothly update movment of rectangle from its origin to cursor location
    
}

let obj = new Classes.GameObject('black', {x:130, y:130},{width:150, height:150});
let obj2 = new Classes.GameObject('red', {x:0, y:0},{width:150, height:150});