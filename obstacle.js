export class Obstacle{
    constructor(x, y){
        if(Math.random() < 0.5){
            this.isJump = true;
            this.image = document.querySelector('#obstacle1');
            this.width = 64;
            this.height = 16;
        }else{
            this.isJump = false;
            this.image = document.querySelector('#obstacle2');
            this.width = 64;
            this.height = 32;
        }
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