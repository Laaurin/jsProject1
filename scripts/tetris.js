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

let blocksize = 25, linewidth = 2;

let currentShape, nextShape, holdingShape;

var fps, fpsInterval, startTime, now, then, elapsed;

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

    fps = 2;

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    currentShape = getNewShape();
    nextShape = getNewShape();

    drawNextShape();
    drawHoldingShape();
    play2();

}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        if(validPosition(currentShape, currentShape.x-1, currentShape.y)) currentShape.x--;
    }
    
    else if(event.keyCode == 38) {
        currentShape.rotate();
    }

    else if(event.keyCode == 39) {
        if(validPosition(currentShape, currentShape.x+1, currentShape.y)) currentShape.x++;
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

    try{
        drawSingleShape(currentShape);

    }
    catch{
        console.log("error")
        console.log(currentShape);
    }

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
            if(tetris()) console.log("TETRIS")
            currentShape = nextShape;
            nextShape = getNewShape();
            drawNextShape();
        }
        draw();


    }


}

function dropAll(height){
    console.log("here")
    while(height > 0){
        console.log(height);
        for(let i = 0; i < width; i++){
            grid[height][i] = grid[height-1][i];
        }
        height--;
    }
    
}

function tetris(){
    let count = 0;
    let empty;
    let tetris;
    for(let i = height-1; i >= 0; i--){
        empty = true;
        tetris = true;
        for(let j = 0; j < width; j++){
            if(grid[i][j] > 0) empty = false;
            else{
               tetris = false;
                break; 
            } 
        }
        if(tetris) {
            dropAll(i);
            i = height;
        }
        if(empty == true) return false;
    }
    return count;
}

function getNewShape(){
    return new Shape(Math.floor(Math.random()*6), 4, 0);
}
    

function validPosition(shape, newX, newY){
    
    for(let i = 0; i < shape.shape.length; i++){
        //idx = newX + i % shape.len + (newY + Math.floor(i / shape.len))*width;
        if(shape.shape[i] == 0) continue;
        try{
            if(grid[newY+Math.floor(i/shape.len)][newX + (i % shape.len)] > 0) return false;

        }
        catch{
            console.log("newY: " + newY + "i: " + i)
            console.log(newY+Math.floor(i/shape.len))
        }
        if(newY + Math.floor(i/shape.len) >= height) return false;
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
    printGrid();
    drawShapes();
}

function drop(shape){
    let newX = shape.x;
    //let frame = requestAnimationFrame(() => this.drop);
    
    

    if(!validPosition(shape, newX, Math.floor(shape.y+1))){
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

function printGrid(){
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
    ctx.clearRect(x + (width+2) * (blocksize + linewidth), y, 4 * (blocksize + linewidth), 4 * (blocksize + linewidth));
    
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = getColor(nextShape.value);

    ctx.beginPath();
    for(let i = 0; i <= 4; i++){
        ctx.moveTo(x + (width+2+i) * (blocksize + linewidth), y);
        ctx.lineTo(x + (width+2+i) * (blocksize + linewidth), y+(4)*(blocksize+linewidth));
    
        ctx.moveTo(x + (width+2) * (blocksize + linewidth), y + i * (blocksize + linewidth));
        ctx.lineTo(x + (width+6) * (blocksize + linewidth), y + i * (blocksize + linewidth));
    }

    ctx.closePath();
    ctx.stroke();

    for(let i = 0; i < nextShape.shape.length; i++){
        if(nextShape.shape[i] > 0){
            ctx.fillRect(x + (width+2 + i%nextShape.len) * (blocksize + linewidth) + linewidth/2, y + Math.floor(i/nextShape.len) * (blocksize + linewidth) + linewidth/2, blocksize, blocksize);
        }
    }
}

function drawHoldingShape(){
    ctx.clearRect(x - 6 * (blocksize + linewidth), y, 4 * (blocksize + linewidth), 4 * (blocksize + linewidth));

    ctx.linewidth = linewidth;
    ctx.stroleStyle = 'white';

    ctx.beginPath();
    for(let i = 0; i <= 4; i++){
        ctx.moveTo(x - (6-i) * (blocksize + linewidth), y);
        ctx.lineTo(x - (6-i) * (blocksize + linewidth), y+(4)*(blocksize+linewidth));
    
        ctx.moveTo(x - 6 * (blocksize + linewidth), y + i * (blocksize + linewidth));
        ctx.lineTo(x - 2 * (blocksize + linewidth), y + i * (blocksize + linewidth));
    }
    ctx.closePath();
    ctx.stroke();

    if(holdingShape == null) return;

    ctx.fillStyle = getColor(holdingShape.value || 0);

    for(let i = 0; i < holdingShape.shape.length; i++){
        if(holdingShape.shape[i] > 0){
            ctx.fillRect(x - (6 - i%holdingShape.len) * (blocksize + linewidth) + linewidth/2, y + Math.floor(i/holdingShape.len) * (blocksize + linewidth) + linewidth/2, blocksize, blocksize);
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
                    0, 0, 0,
                    2, 2, 2,
                    0, 0, 2
                ]
                break;
            case 2:
                this.value = 3;
                this.len =3;
                this.shape = [
                    0, 0, 3,
                    3, 3, 3,
                    0, 0, 0
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
                    5, 5, 5, 5,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0,

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





