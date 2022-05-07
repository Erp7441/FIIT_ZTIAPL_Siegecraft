export class View{
    constructor({model, context, canvas}){
        this.model = model;
        this.context = context;
        this.canvas = canvas;
    }
    drawTexture(){
        if(this.model.faction === 'player'){
            this.context.filter = "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(+50deg) saturate(600%) contrast(0.8)";
        }
        else if(this.model.faction === 'enemy'){
            this.context.filter = "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
        }
        
        this.context.drawImage(this.model.texture, this.model.position.x, this.model.position.y, this.model.dimensions.width, this.model.dimensions.height);
        this.context.filter = "none";      
    }
}