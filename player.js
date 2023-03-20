export class Player {
    constructor(game) {
        this.game = game;
        this.width = 48;
        this.height = 48;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - (this.game.height / 6);
        this.image = document.querySelector('#player');
        this.boost = document.querySelector('#boost');
        this.frameBoost = 0;
        this.frame = 0;
        this.speed = 5;
        this.mapPlacement = 1;
        this.isMoving = false;
        this.direction = '';
        this.destination = 1;

    }
    update(input) {
        if (!this.isMoving) {
            if (input.includes('ArrowRight') && this.mapPlacement <= 2) {
                this.mapPlacement++;
                this.direction = 'right';
                this.isMoving = true;
            } else if (input.includes('ArrowLeft') && this.mapPlacement >= 1) {
                this.mapPlacement--;
                this.direction = 'left';
                this.isMoving = true;
            }

            if (this.mapPlacement > 2) {
                this.mapPlacement = 2;
            }

            this.destination = parseInt(this.game.map.coordinates[this.mapPlacement] - this.width / 2);
            

        } else {

            if (this.x == this.destination){
                this.isMoving = false;
                this.direction = '';
                
            }else{
                if (this.direction === 'right') {
                    this.x += this.speed;
                    if (this.x > this.destination) {
                        this.x = this.destination;
                    }
                } else if (this.direction === 'left') {
                    this.x -= this.speed;
                    if (this.x < this.destination) {
                        this.x = this.destination;
                    }
                }
            }
        }


        for (let i = 0; i < this.game.obstacles.length; i++) {
            if (this.collisionDetection(this.game.obstacles[i])) {
                this.game.gameOver=true;
            }
        }
    }

    //collision detection
    collisionDetection(obstacle) {
        return (this.x < obstacle.x + obstacle.width &&
        this.x + this.width > obstacle.x &&
        this.y < obstacle.y + obstacle.height &&
        this.y + this.height > obstacle.y)
    }

    draw(context) {
        //context.fillStyle = 'blue';
        //context.fillRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        context.drawImage(this.boost, this.frameBoost*48, 0, this.width, this.height, this.x+2, this.y+24, this.width, this.height);
        

        if(this.frame%15==0){
            this.frameBoost++;
            if(this.game.isPaused ||this.game.gameOver) this.frameBoost=0;
            if(this.frameBoost>=15) this.frameBoost=0;
        }
        
        this.frame++;
    }

}