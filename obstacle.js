export class Obstacle{
    constructor(x, y){
        this.width = 48;
        this.height = 48;
        this.image = document.querySelector('#obstacle');
        this.x = x - this.width/2;
        this.y = y;
        this.speed = 3;
    }

    update(){
        this.y += this.speed;
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}