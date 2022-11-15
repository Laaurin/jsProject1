let canvas;
let ctx;
let id;
let mouseX;

let width = 7;
let height = 6;
let offsetX;
let offsetY = 50;
let grid = new Array(height);
let gameOver = false;
var value = 0;
let empty = 2;

let humanTurn = 0, botTurn = 1;

let pieceRadius, gapSize = 12;

let currentShape, nextShape, holdingShape;

var fps, fpsInterval, startTime, now, then, elapsed;


function Start(){
    canvas = document.getElementById('canvas');
    iSlider = document.getElementById('iterationSlider');
    ctx = canvas.getContext('2d');

    for(let i = 0; i < height; i++){
        grid[i] = new Array(width).fill(empty);
    }


    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    pieceRadius = canvas.height / 30;
    offsetX = canvas.width/2-width*(pieceRadius+gapSize)/2;

    fps = 30;

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    //play();
    drawGrid();
    drawPieces();
}

function botMove(){

}

function negamax(node, depth, alpha, beta, turn){
    let temp = isTerminal(node);

    if(depth == 0 || temp != -1){
        //console.log("temp: " + temp)
        switch(temp){
            case humanTurn:
                console.log("human about to win")
                return -Infinity;
            case botTurn:
                console.log("Im about to win")

                return Infinity;
            case empty:
                return 0;
            case -1:
                return evaluateNode(node, turn);
        }
    }

    let evaluation = -Infinity;
    let copyNode = [];
    for(let i = 0; i < width; i++){
        if(!isPlayable(node, i)) continue;
        
        for(let idx = 0; idx < grid.length; idx++){
            copyNode[idx] = node[idx].slice();
        }
        
        let y = drop(copyNode, i);
        copyNode[y][i] = turn;

        

        evaluation = Math.max(value, -negamax(copyNode, depth-1, -beta, -alpha, (turn+1)%2));
        console.log("evaluation: " + evaluation);
        alpha = Math.max(alpha, evaluation);
        if(alpha >= beta) break;
    }

    return evaluation;
}

function evaluateNode(Grid, turn){
    let score = 0;
    let window = [];
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            // if(i < width-3){
            //     window = [Grid[j][i], Grid[j][i+1], Grid[j][i+2], Grid[j][i+3]];
            //     score += evaluateWindow(window, turn);
            // }
            // if(j < height-3){
            //     window = [Grid[j][i], Grid[j+1][i], Grid[j+2][i], Grid[j+3][i]];
            //     score += evaluateWindow(window, turn);
            // }
            // if(i > 2 && j < height-3){
            //     window = [Grid[j][i], Grid[j+1][i-1], Grid[j+2][i-2], Grid[j+3][i-3]];
            //     score += evaluateWindow(window, turn);
            // }
            // if(i < width-3 && j < width-3){
            //     window = [Grid[j][i], Grid[j+1][i+1], Grid[j+2][i+2], Grid[j+3][i+3]];
            //     score += evaluateWindow(window, turn);
            // }
            if(Grid[j][i] == empty)continue;
            if(Grid[j][i] == turn) score += 10-Math.abs(3 - i);
            else score -= 10-Math.abs(3-i);
        }
    }
    return score;
}

function evaluateWindow(window, turn){
    let amountTurn = 0;
    let amountOpponent = 0;
    let amountEmpty = 0;
    
    for(let i = 0; i < 4; i++){
        switch(window[i]){
            case turn:
                amountTurn++;
                break;
            case -turn:
                amountOpponent++;
                break;
            case empty:
                amountEmpty++;
                break;
        }
    }

    if(amountTurn == 3 && amountEmpty == 1) return 20;
    if(amountOpponent == 3 && amountTurn == 1) return 20;
    if(amountOpponent == 3 && amountEmpty == 1) return -20;

    return 0;
    
}

function play(){

    if(!paused)requestAnimationFrame(play);

    now = Date.now();

    elapsed = now - then;

    

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
        drawGrid();
        drawPieces();
        value++;

    }
}

function connect4(Grid){
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            if(Grid[j][i] == empty)continue;
            let color = Grid[j][i];
            if(i < width-3 && Grid[j][i+1] == Grid[j][i+2] && Grid[j][i+1] == Grid[j][i+3] && Grid[j][i+1] == color) return color;
            if(j < height-3 && Grid[j+1][i] == Grid[j+2][i] && Grid[j+1][i] == Grid[j+3][i] && Grid[j+1][i] == color) return color;
            if(i < width-3 && j < height-3 && Grid[j+1][i+1] == Grid[j+2][i+2] && Grid[j+1][i+1] == Grid[j+3][i+3] && Grid[j+1][i+1] == color) return color;
            if(i > 2 && j < height-3 && Grid[j+1][i-1] == Grid[j+2][i-2] && Grid[j+1][i-1] == Grid[j+3][i-3] && Grid[j+1][i-1] == color) return color;
        }
    }
}

function isTerminal(Grid){
    let temp = connect4(Grid);
    if(temp == 1 || temp == 0) return temp;
    let full = true;
    for(let i = 0; i < width; i++){
        if(isPlayable(Grid, i)){
            full = false;
            break;
        }
    }
    if(full) return 2;
    return -1;
}

function drop(Grid, row){
    let col = 0;

    while(col + 1 < height && Grid[col+1][row] == 2){
        col++;
    }

    return col;
}

function isPlayable(Grid, col){
    return Grid[0][col] == empty;
}

function drawGrid(){
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(offsetX, offsetY, (width) * (pieceRadius*2+gapSize) + gapSize, (height) * (pieceRadius*2+gapSize) + gapSize);
}

function drawPieces(){
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            drawPiece(i, j)
        }
    }
}

function drawPiece(centerX, centerY){
    ctx.fillStyle = getColor(grid[centerY][centerX]);
    ctx.beginPath();
    ctx.arc(offsetX + (centerX+1) * (pieceRadius*2+gapSize) - pieceRadius, offsetY + (centerY+1) * (pieceRadius*2+gapSize) - pieceRadius, pieceRadius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.stroke();
}

function getColor(value){
    switch(value){
        case 2:
            return 'blue';
        case 1:
            return 'yellow';
        case 0:
            return 'red';
    }
}

function getCursorPosition(canvas, event) {
    if(gameOver){
        for(let i = 0; i < height; i++){
            grid[i] = new Array(width).fill(empty);
        }
        drawPieces();
        gameOver = false;
        return;
    }
    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    //const mouseY = event.clientY - rect.top

    let x = Math.floor((mouseX-offsetX)/(pieceRadius*2+gapSize));
    let y;

    // console.log("x: " + row)
    // console.log(value);
    if(isPlayable(grid, x)) {
        y = drop(grid, x, value);
        grid[y][x] = value%2;
        drawPiece(x, y);
        let temp = isTerminal(grid);
        switch(temp){
            case -1:
                value++;
                let score, bestScore = -Infinity, bestMove = -1, copyNode = [];
                for(let i = 0; i < width; i++){
                    if(!isPlayable(grid, i)) continue;
                    
                    for(let idx = 0; idx < grid.length; idx++){
                        copyNode[idx] = grid[idx].slice();
                    }
                    
                    drop(copyNode, i);
            
                    score = negamax(copyNode, 2, -Infinity, Infinity, value%2);
                    console.log("score: " + score + ", pos: " + i);

                    if(score > bestScore){
                        bestScore = score;
                        bestMove = i;
                    }
                }
                console.log("bestMove: " + bestMove);

                break;
            case 0:
                gameOver = true;
                console.log("red won!");
                break;
            case 1:
                gameOver = true;
                console.log("yellow won!");
                break;
            case 2:
                gameOver = true;
                console.log("game tied");
        }
        
        
    }

}

document.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

function getMousePos(event){
    mouseX = event.clientX;
}







