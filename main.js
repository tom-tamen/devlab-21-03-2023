import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Map } from './map.js';

function updateScoreBoarde() {
    while(document.querySelector('.scoreboard').firstElementChild) document.querySelector('.scoreboard').firstElementChild.remove()
    let scoreboard = localStorage.getItem('scoreboard')
    if(!scoreboard) return
    scoreboard = JSON.parse(localStorage.getItem('scoreboard')).scoreboard.sort().reverse()
    scoreboard.forEach((element, index) => {
        let liEl = document.createElement('li')
        let sp1 = document.createElement('span')
        sp1.textContent = index + 1
        let sp2 = document.createElement('span')
        sp2.textContent = element
        liEl.appendChild(sp1)
        liEl.appendChild(sp2)
        document.querySelector('.scoreboard').appendChild(liEl)
    });
}

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
            this.score = 0;
            this.scoreSaved = false;
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
    updateScoreBoarde()
    //console.log(game);

    function gameLoop() {
        canvas.focus();
        if(game.gameOver && !game.scoreSaved) {
            game.scoreSaved = true
            console.log(JSON.stringify([]))
            if(!localStorage.getItem('scoreboard')) localStorage.setItem('scoreboard', JSON.stringify({scoreboard: []}))
            let scoreboard = JSON.parse(localStorage.getItem('scoreboard'))
            console.log(scoreboard)
            scoreboard.scoreboard.push(game.score)
            localStorage.setItem('scoreboard', JSON.stringify(scoreboard))
            updateScoreBoarde()
        }
        if(game.gameOver && game.input.keys.includes('r')){
            game = new Game(canvas.width, canvas.height);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        if(game) {
            if(!game.gameOver) {
                if(!game.isPaused) {
                    game.score += 10
                    document.querySelector('.score > span').textContent = game.score
                }
            }
        }
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

});