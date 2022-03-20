import * as Classes from './classes.js';

// -------------------------------- VARIABLES --------------------------------


let then = Date.now(), now, elapsed;


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
    obj.setbIsMoving(true);
})

// -------------------------------- FUNCTIONS --------------------------------


function clearScreen() {
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
}

// Game Loop
export function animate(fps){
    requestAnimationFrame(animate);
    clearScreen();
    

    // Calculating time elapsed since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has passed since last iteration generate a new frame

    if(elapsed > 1000/fps){ then = now - (elapsed % 1000/fps); }


    const velocity = {x:50, y:50}; //TODO set in object
    obj.move(mouse, velocity);
    obj.drawTexture(obj.color)
    // TODO smoothly update movment of rectangle from its origin to cursor location
    
}

let obj = new Classes.Character('black', {x:130, y:130}, {width:150, height:150}, 'rect', 100);
