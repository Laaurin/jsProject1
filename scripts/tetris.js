let canvas;
let ctx;
let id;
let mouseX;

let width = 10;
let height = 20;
let x;
let y = 50;
let grid = new Array(height);
let paused = false;

let blocksize, linewidth = 3;

let currentShape, nextShape, holdingShape;

var fps, fpsInterval, startTime, now, then, elapsed;

let finalPos = [-5, -1], holdingPos = [-5, -5];

function Start(){
    canvas = document.getElementById('canvas');
    iSlider = document.getElementById('iterationSlider');
    ctx = canvas.getContext('2d');

    for(let i = 0; i < height; i++){
        grid[i] = new Array(width).fill(0);
    }


    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    blocksize = canvas.height / 30;
    x = canvas.width/2-width*(blocksize+linewidth)/2;

    fps = 3;

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    currentShape = getNewShape();
    nextShape = getNewShape();

    ctx.font = "30px Georgia";

    ctx.fillText("next:", x + (width+2) * (blocksize + linewidth), y + blocksize - linewidth);

    ctx.fillText("holding:", x - 6 * (blocksize + linewidth), y + blocksize - linewidth);
    drawNextShape();
    drawHoldingShape();
    //play2();
    storeShape();
    botPlay();
}



document.addEventListener('keydown', function(event) {

    if(event.keyCode == 32) {
        fpsInterval = 20;
    }

    else if(event.keyCode == 37) {
        if(validPosition(grid, currentShape, currentShape.x-1, currentShape.y)) currentShape.x--;
    }
    
    else if(event.keyCode == 38) {
        //if(validPosition(getRotatedShape(currentShape), currentShape.x, currentShape.y)) currentShape.rotate();
        
        let rotated = getRotatedShape(currentShape);
        if(validPosition(grid, rotated, rotated.x, rotated.y)) {
            currentShape.rotate();
        }
    }

    else if(event.keyCode == 39) {
        if(validPosition(grid, currentShape, currentShape.x+1, currentShape.y)) currentShape.x++;
    }

    else if(event.keyCode == 40){
            storeShape();
    }

    else if(event.keyCode == 80 || event.keyCode == 27){
        if(paused){
            console.log("resume")
            paused = false;
            play2();
        } 
        else {
            paused = true;
            console.log("paused");
        }
    }
});

function getMousePos(event){
    mouseX = event.clientX;
}

function play2(){

    if(!paused)requestAnimationFrame(play2);

    now = Date.now();

    elapsed = now - then;

    drawSingleShape(currentShape);

    // if(mouseX >= x && mouseX <= width * (blocksize+linewidth)+x){
    //     let newX = Math.floor((mouseX-x)/(blocksize+linewidth));
    //     if(validPosition(currentShape, newX, currentShape.y)) currentShape.x = newX;//-Math.floor(currentShape.len/2);
    //     //console.log("newX: " + newX);

    // }

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        if(drop(currentShape)){
            console.log(getHoles(grid));
            fpsInterval = 1000 / fps;
            if(tetris()) console.log("TETRIS")
            currentShape = nextShape;
            nextShape = getNewShape();
            drawNextShape();
        }
        draw();


    }


}

function dropAll(height){
    while(height > 0){
        for(let i = 0; i < width; i++){
            grid[height][i] = grid[height-1][i];
        }
        height--;
    }
    
}

function tetris(){
    let count = 0;
    for(let i = height-1; i >= 0; i--){
        if(rowFilled(grid, i)) {
            dropAll(i);
            i = height;
        }
    }
    return count;
}

function rowFilled(Grid, row){
    for(let i = 0; i < width; i++){
        if(Grid[row][i] == 0) return false;
    }
    return true;
}

function getNewShape(){
    return new Shape(2, 4, 0);
    return new Shape(Math.floor(Math.random()*6), 4, 0);
}

function getRotatedShape(shape){
    

    
    let rotated = new Shape(shape.value-1, shape.x, shape.y);
    rotated.shape = shape.shape.slice();
    rotated.rotate();
    return rotated;
}
    

function validPosition(Grid, shape, newX, newY){
    
    for(let i = 0; i < shape.shape.length; i++){
        //idx = newX + i % shape.len + (newY + Math.floor(i / shape.len))*width;
        if(shape.shape[i] == 0) continue;

        if(newY + Math.floor(i/shape.len) >= height) return false;

        if(Grid[newY+Math.floor(i/shape.len)][newX + (i % shape.len)] > 0) return false;
        
        if(newX + (i % shape.len) >= width || newX + (i % shape.len) < 0) return false;
    }
    return true;
}

function storeShape(){
    if(holdingShape == null){
        holdingShape = currentShape;
        currentShape = nextShape;
        nextShape = getNewShape();
        drawNextShape();
    }
    else{
        let temp = currentShape;
        currentShape = holdingShape;
        holdingShape = temp;
    }
    
    currentShape.y = 0;
    drawHoldingShape();
}

function draw(){
    ctx.clearRect(x, y, width * (blocksize+linewidth), height * (blocksize + linewidth));
    drawGrid();
    drawShapes();
}

function drop(shape){
    let newX = shape.x;
    //let frame = requestAnimationFrame(() => this.drop);
    
    

    if(!validPosition(grid, shape, newX, Math.floor(shape.y+1))){
        for(let i = 0; i < shape.shape.length; i++){
            if(shape.shape[i] == 0)continue;
            grid[(shape.x + i % shape.len) + (Math.floor(shape.y) + Math.floor(i / shape.len))*this.width] = shape.shape[i];
            grid[shape.y + Math.floor(i / shape.len)][shape.x + i % shape.len] = shape.shape[i];
        }
        //cancelAnimationFrame(frame);
        clearInterval(id);
        return true;
    }

    shape.y+=1;
    shape.x = newX;
    requestAnimationFrame(() => drop);
    //return true;
    //setTimeout(this.drop(shape), 5000);
}

function getRotatedShape(shape){
    let rotated = new Shape(shape.value-1, shape.x, shape.y);

    for (let i = 0; i < shape.shape.length; i++)
    {
        rotated.shape[i] = shape.shape[shape.shape.length - shape.len - shape.len * (i % shape.len) + Math.floor(i / shape.len)];
    }
    return rotated;
}

function drawGrid(){
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    for(let i = 0; i <= width; i++){
        ctx.moveTo(x + i * (blocksize+linewidth), y);
        ctx.lineTo(x + i * (blocksize+linewidth), y+(height)*(blocksize+linewidth));
    }
    for(let i = 0; i <= height; i++){
        ctx.moveTo(x, y + i * (blocksize + linewidth));
        ctx.lineTo(x + width * (blocksize+linewidth), y + i * (blocksize + linewidth));
    }

    ctx.closePath();
    ctx.stroke();
    
}

function drawShapes(){
    // for(let i = 0; i < width * height; i++){
    //     if(grid[i] > 0){
    //         ctx.fillStyle = getColor(grid[i]);
    //         ctx.fillRect(x + (i%width)*(blocksize+linewidth) + linewidth/2, y + Math.floor(i/width) * (blocksize+linewidth) + linewidth/2,blocksize, blocksize);
    //     }
    // }

    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            if(grid[i][j] > 0){
                ctx.fillStyle = getColor(grid[i][j]);
                ctx.fillRect(x + j * (blocksize + linewidth) + linewidth/2, y + i * (blocksize+linewidth) + linewidth/2, blocksize, blocksize);
            }
        }
    }
}

function drawNextShape(){
    ctx.clearRect(x + (width+2) * (blocksize + linewidth), y + blocksize + linewidth, 4 * (blocksize + linewidth), 4 * (blocksize + linewidth));
    
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = getColor(nextShape.value);

    ctx.beginPath();
    for(let i = 0; i <= 4; i++){
        ctx.moveTo(x + (width+2+i) * (blocksize + linewidth), y + blocksize + linewidth);
        ctx.lineTo(x + (width+2+i) * (blocksize + linewidth), y+(5)*(blocksize+linewidth));
    
        ctx.moveTo(x + (width+2) * (blocksize + linewidth), y + (i + 1) * (blocksize + linewidth));
        ctx.lineTo(x + (width+6) * (blocksize + linewidth), y + (i + 1) * (blocksize + linewidth));
    }

    ctx.closePath();
    ctx.stroke();

    for(let i = 0; i < nextShape.shape.length; i++){
        if(nextShape.shape[i] > 0){
            ctx.fillRect(x + (width+2 + i%nextShape.len) * (blocksize + linewidth) + linewidth / 2, y + Math.floor(i/nextShape.len+1) * (blocksize + linewidth) + linewidth / 2, blocksize, blocksize);
        }
    }
}

function drawHoldingShape(){
    ctx.clearRect(x - 6 * (blocksize + linewidth), y + blocksize + linewidth, 4 * (blocksize + linewidth), 4 * (blocksize + linewidth));

    ctx.linewidth = linewidth;
    ctx.stroleStyle = 'white';

    ctx.beginPath();
    for(let i = 0; i <= 4; i++){
        ctx.moveTo(x - (6-i) * (blocksize + linewidth), y + blocksize+linewidth);
        ctx.lineTo(x - (6-i) * (blocksize + linewidth), y+(5)*(blocksize+linewidth));
    
        ctx.moveTo(x - 6 * (blocksize + linewidth), y + (i+1) * (blocksize + linewidth));
        ctx.lineTo(x - 2 * (blocksize + linewidth), y + (i+1) * (blocksize + linewidth));
    }
    ctx.closePath();
    ctx.stroke();

    if(holdingShape == null) return;

    ctx.fillStyle = getColor(holdingShape.value || 0);

    for(let i = 0; i < holdingShape.shape.length; i++){
        if(holdingShape.shape[i] > 0){
            ctx.fillRect(x - (6 - i%holdingShape.len) * (blocksize + linewidth) + linewidth/2, y + Math.floor(i/holdingShape.len+1) * (blocksize + linewidth) + linewidth/2, blocksize, blocksize);
        }
    }
}

function drawSingleShape(shape){
    draw();
    ctx.fillStyle = getColor(shape.value);
    for(let i = 0; i < shape.shape.length; i++){
        if(shape.shape[i] > 0){
            ctx.fillRect(x+(i%shape.len+shape.x)*(blocksize+linewidth)+linewidth/2,
             y + (Math.floor(i/shape.len) + shape.y)*(blocksize + linewidth)+linewidth/2,blocksize, blocksize);

        }
    }

}

function botPlay(){

    if(!paused)requestAnimationFrame(botPlay);

    now = Date.now();

    elapsed = now - then;


    // if(mouseX >= x && mouseX <= width * (blocksize+linewidth)+x){
    //     let newX = Math.floor((mouseX-x)/(blocksize+linewidth));
    //     if(validPosition(currentShape, newX, currentShape.y)) currentShape.x = newX;//-Math.floor(currentShape.len/2);
    //     //console.log("newX: " + newX);

    // }

    // if enough time has elapsed, draw the next frame
    //console.log(holdingPos[0]);

    //if(holdingPos[0] == -5) storeShape();
    if(finalPos[0] == -5){
        console.log("also here");

        finalPos = bestMove(currentShape);
        holdingPos = bestMove(holdingShape);

        currentShape.rotate();
        holdingShape.rotate();

        if(holdingPos[2] > finalPos[2]){
            storeShape();
            currentShape.x = holdingPos[0];
            for(let i = 0; i < holdingPos[1]-1; i++){
                currentShape.rotate;
            }
        }
        else{
            currentShape.x = finalPos[0];
        
            for(let i = 0; i < finalPos[1]-1; i++){
                currentShape.rotate();
            }
        }

        currentShape.y = 0;
    } 
    drawSingleShape(currentShape);


    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        if(drop(currentShape)){
            finalPos = [-5];
            fpsInterval = 1000 / fps;
            if(tetris()) console.log("TETRIS")
            currentShape = nextShape;
            nextShape = getNewShape();
            drawNextShape();
        }
        draw();


    }
}

function bestMove(shape){
    let copyGrid = [];

    let bestPos = [0, 0], bestScore = -Infinity, score;

    for(let rotation = 0; rotation < 4; rotation++){

        for(let pos = -3; pos < width; pos++){
            shape.y = 0;

            //deep copy grid

            for(let idx = 0; idx < grid.length; idx++){
                copyGrid[idx] = grid[idx].slice();
            }


            if(!validPosition(copyGrid, shape, pos, shape.y)) continue;
            while(validPosition(copyGrid, shape, pos, shape.y+1)){
                shape.y++;
            }
            for(let i = 0; i < shape.shape.length; i++){
                if(shape.shape[i] == 0)continue;
                //copyGrid[(pos + i % shape.len) + (Math.floor(shape.y) + Math.floor(i / shape.len))*this.width] = shape.shape[i];
                copyGrid[shape.y + Math.floor(i / shape.len)][pos + i % shape.len] = shape.shape[i];
            }

            
            
            
            
            //console.log(copyGrid);
            score = shape.y * 10 + evaluateGrid(copyGrid);
            if(score > bestScore){
                bestScore = score;
                bestPos = [pos, rotation, bestScore];
                //console.log("best shape: " + shape.shape);
            }

            for(let i = 0; i < copyGrid.length; i++){
                console.log(copyGrid[i]);
            }
            console.log(score);
        }

        shape.rotate()
    }

    return bestPos;
}

function evaluateGrid(Grid){
    let score = 0, holes = 0, filledRows = 0, unevenness;

    for(let i = height-1; i > -1; i--){
        if(rowFilled(Grid, i)) filledRows++;
    }

    holes = getHoles(Grid);

    unevenness = getUnevenness(Grid);


    switch(filledRows){
        case 1:
            score += 40;
            break;
        case 2:
            score += 100;
            break;
        case 3:
            score += 300;
            break;
        case 4: 
            score += 1200;
            break;   
    }
    

    score -= unevenness;
    score -= holes * 21;
    console.log(score);
    return score;
}

function getHoles(Grid){
    let holes = 0;
    for(let i = height-1; i > 0; i--){
        for(let j = 0; j < width; j++){
            if(Grid[i][j] == 0 && Grid[i-1][j] > 0)holes++;
        }
    }
    return holes;
}


function getUnevenness(Grid){
    let unevenness = 0; 
    let lastY = height -1;

    for(let i = 0; i < height; i++){
        if(Grid[i][0] > 0){
            lastY = i-1;
            break;
        }
    }

    for(let i = 1; i < width; i++){
        for(let j = 0; j < height; j++){
            if(Grid[j][i] > 0){
                unevenness += Math.abs(lastY-(j-1));
                //console.log("i: " + i + " lastY: " +lastY + " currentY: " + (j-1) + " unevenness: " + unevenness);
                lastY = j-1;
                break;
            }

            else if(j == height-1){
                unevenness += Math.abs(lastY-j);
                //console.log("i: " + i + " lastY: " +lastY + " currentY: " + j + " unevenness: " + unevenness);

                lastY = j;

            }
        }

    }

    return unevenness;
}





function getColor(value){
    switch(value){
        case 6:
            return 'red' //zweite äußerste zackige fläche im kreis
        case 4:
            return 'green'; //kreis der fraktal eingrenzt
        case 5:
            return 'blue'; //äußerste zackige fläche im kreis
        case 3:
            return 'purple'; // größte fläche außen
        case 2:
            return 'orange';
        case 1:
            return 'yellow';
    }
    return ;
    
}


class Shape{
    constructor(i, x, y){
        this.x = x;
        this.y = y;
        switch(i){
            case 0:
                this.value = 1;
                this.len = 2;
                this.shape = [
                    1, 1,
                    1, 1
                ]
                break;
            
            case 1:
                this.value = 2;
                this.len = 3;
                this.shape = [
                    0, 2, 0,
                    0, 2, 0,
                    2, 2, 0
                ]
                break;
            case 2:
                this.value = 3;
                this.len =3;
                this.shape = [
                    3, 0, 0,
                    3, 0, 0,
                    3, 3, 0
                ]
                break;
            
            case 3:
                this.value = 4;
                this.len =3;
                this.shape = [
                    0, 4, 0,
                    4, 4, 4,
                    0, 0, 0
                ]
                break;

            case 4:
                this.value = 5;
                this.len =4;
                this.shape = [
                    0, 5, 0, 0,
                    0, 5, 0, 0,
                    0, 5, 0, 0,
                    0, 5, 0, 0,

                ]
                break;
            
            case 5:
                this.value = 6;
                this.len = 3;
                this.shape = [
                    6, 0, 0,
                    6, 6, 0,
                    0, 6, 0
                ]
                break;
            
        }
    }

    rotate(){
        let rotated = new Array(this.shape.length).fill(0);

        for (let i = 0; i < this.shape.length; i++)
        {
            
            rotated[i] = this.shape[this.shape.length - this.len - this.len * (i % this.len) + Math.floor(i / this.len)];
        }

        this.shape = rotated;
    }
}






