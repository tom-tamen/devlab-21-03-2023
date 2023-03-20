import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Map } from './map.js';

//console.log('hello');

let game;
window.addEventListener('load', function () {
    const canvas = document.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.input = new InputHandler();
            this.map = new Map(this);
            this.player = new Player(this);
            this.obstacles = [];
            this.gameOver = false;
            this.full = document.querySelector('#full');
            this.empty = document.querySelector('#empty');
            this.time = 0;
            this.isPaused = true;
        }

        update() {

            if (!this.gameOver) {
                if (this.input.keys.includes('p')) {
                    this.isPaused = !this.isPaused;
                    this.input.keys.splice(this.input.keys.indexOf('p'), 1);
                }
                if (!this.isPaused) {
                    this.player.update(this.input.keys);
                    this.map.update();
                }

            }
        }

        draw(context) {
            this.map.draw(context);
            this.player.draw(context);


            //life bar

            if(this.isPaused){
                context.fillStyle = "rgba(0, 0, 0, 0.7)";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.font = "30px Comic Sans MS";
                context.fillStyle = "red";
                context.textAlign = "center";
                context.fillText("P for play", canvas.width / 2, canvas.height / 2);
            }

            if (this.gameOver) {
                this.onGameOver(context);
            }
        }

        onGameOver(context) {
            context.fillStyle = "rgba(0, 0, 0, 0.7)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = "30px Comic Sans MS";
            context.fillStyle = "red";
            context.textAlign = "center";
            context.fillText("Game Over Press 'r' for restart", canvas.width / 2, canvas.height / 2);
        }

        pause(context) {
            context.fillStyle = "rgba(0, 0, 0, 0.7)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = "30px Comic Sans MS";
            context.fillStyle = "red";
            context.textAlign = "center";
            context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        }
    }

    game = new Game(canvas.width, canvas.height);
    //console.log(game);

    function gameLoop() {
        canvas.focus();
        if(game.gameOver && game.input.keys.includes('r')){
            game = new Game(canvas.width, canvas.height);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

});