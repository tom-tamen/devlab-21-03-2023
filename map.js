import { Obstacle } from './obstacle.js';

export class Map{

    constructor(game){
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.coordinates = [this.width/6, this.width/2, this.width/6*5];
        
    }

    update(){
        if(this.game.obstacles.length == 0){
            this.createObstacle();
        }else{
            if(this.game.obstacles[this.game.obstacles.length-1].y >= this.height/2){
                this.createObstacle();
            }
        }

        for(let i = 0; i<this.game.obstacles.length; i++){
            if(this.game.obstacles[i].y >= this.height){
                this.game.obstacles.splice(i, 1);
            }
        }

    }

    draw(context){
        // context.lineWidth = 2;
        // context.strokeStyle = "black";

        // for(let i = 0; i<3; i++ ){
        //     context.beginPath();
        //     context.moveTo(this.coordinates[i] ,0);
        //     context.lineTo(this.coordinates[i], this.height);
        //     context.stroke();
        // }

        for(let i = 0; i<this.game.obstacles.length; i++){
            if(!this.game.isPaused){
                this.game.obstacles[i].update();
            }
            this.game.obstacles[i].draw(context);
        }
    }

    createObstacle(){
        let randomX = Math.floor(Math.random()*3);
        let obstacle = new Obstacle(this.coordinates[randomX], 0);
        this.game.obstacles.push(obstacle);
    }
}