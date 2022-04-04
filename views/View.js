export class View{
    constructor({model, context, canvas}){
        this.model = model;
        this.context = context;
        this.canvas = canvas;
    }
    drawTexture(){
        //let object = new Image();
        //object.src = this.texture;
        this.context.fillStyle = this.model.color || 'black';
        this.context.fillRect(
            this.model.position.x,
            this.model.position.y,
            this.model.dimensions.width,
            this.model.dimensions.height
        );
    }
}