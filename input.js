export class InputHandler{
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', (event) => {
            //console.log(event.key);
            if ((event.key === 'ArrowRight' ||
                event.key === 'ArrowLeft' ||
                event.key === 'p' ||
                event.key ==='r'
                )&& this.keys.indexOf(event.key) === -1){
                    this.keys.push(event.key);
            }
        });
        window.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowRight' ||
                event.key === 'ArrowLeft' ||
                event.key === 'p' ||
                event.key ==='r'
                ){
                    this.keys.splice(this.keys.indexOf(event.key), 1);
            }
            //console.log(this.keys);
        });
    }
}