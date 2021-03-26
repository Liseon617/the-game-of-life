class cell {
    static width = 10;
    static height = 10;

    constructor (context, gridX, gridY) {
        this.context = context;

        this.gridX = gridX;
        this.gridY = gridY;

        this.alive = Math.floor(Math.random()*2);
    }

    draw() {
        this.context.fillStyle = this.alive?'#000000':'#ffffff';
        this.context.fillRect(this.gridX*cell.width, this.gridY*cell.height, cell.width, cell.height);
        this.context.strokeStyle = "#ddd";
        this.context.stroke();
    }
}

class GameWorld {
    static numColumns = 100;
    static numRows = 90;

    constructor(cnv) {
        this.canvas = document.getElementById(cnv);
        this.context = this.canvas.getContext('2d');
        this.gameObjects = [];

        this.createGrid();

        window.requestAnimationFrame(() => this.gameLoop());
    }

    createGrid() {
        for (let y = 0; y < GameWorld.numRows; y++) {
            for (let x = 0; x < GameWorld.numColumns; x++) {
                this.gameObjects.push(new cell(this.context, x, y));
            }
        }
    }

    isAlive(x, y) {
        if(x<0 || x >=GameWorld.numColumns || y < 0 || y >= GameWorld.numRows) {
            return false;
        }
        return this.gameObjects[this.gridToIndex(x,y)].alive?1:0    
    }

    gridToIndex(x, y) {
        return x + (y * GameWorld.numColumns);
    }

    checkSurrounding() {
        for (let x = 0; x < GameWorld.numColumns; x++) {
            for (let y = 0; y < GameWorld.numRows; y++) {
                let numAlive = this.isAlive(x, y-1) + 
                this.isAlive(x-1,y-1) + 
                this.isAlive(x, y+1) + 
                this.isAlive(x+1, y-1) + 
                this.isAlive(x-1, y+1) +
                this.isAlive(x+1, y) +
                this.isAlive(x+1, y+1) +
                this.isAlive(x-1, y)
                let centerIndex = this.gridToIndex(x, y);

                if (numAlive == 2){
                    //stasis
                    this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
                }else if (numAlive == 3){
                    //birth
                    this.gameObjects[centerIndex].nextAlive = 1;
                }else{
                    //death
                    this.gameObjects[centerIndex].nextAlive = 0;
                }
            }
        }
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
        }
    }
    gameLoop() {
        this.checkSurrounding();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }
        setTimeout( () => {
            window.requestAnimationFrame(() => this.gameLoop());
        }, 100)
    }
}

window.onload = () => {
    // The page has loaded, start the game
    let gameWorld = new GameWorld('canvas');
}