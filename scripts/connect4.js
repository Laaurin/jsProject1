let canvas;
let ctx;
let id;
let mouseX, clientY;

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

//für minimax ´/negamax variante
let gewünschteTiefe = 9, gespeicherterZug;


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

    play();
    drawGrid();
    drawPieces();
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

        for(let idx = 0; idx < grid.length; idx++){
            console.log(copyNode[idx]);
        }


        evaluation = Math.max(value, -negamax(copyNode, depth-1, -beta, -alpha, (turn+1)%2));
        console.log("evaluation: " + evaluation);
        alpha = Math.max(alpha, evaluation);
        if(alpha >= beta) break;
    }

    return evaluation;
}

function minimax(turn, depth, alpha, beta){
    
    if(depth == 0 || isTerminal(grid) != -1){
        return evaluateNode(grid, turn);
    }
    let maxValue = alpha;
    for(let i = 0; i < width; i++){
        if(!isPlayable(grid, i)) continue;
        grid[drop(grid, i)][i] = turn;
        

        let wert = -minimax((turn+1)%2, depth-1, -beta, -maxValue);
        undoLastDrop(i);
        if(wert > maxValue){
            maxValue = wert;
            if(depth == gewünschteTiefe){
                gespeicherterZug = i;
            }
            if(maxValue >= beta){
                break;
            }
        }
    }

    return maxValue;
}

function evaluateNode(Grid, turn){
    let score = 0;
    let window = [];

    let winner = connect4(Grid);
    if(winner == turn){
        // printGridToConsole()
        // console.log("yes winning ^");
        return Infinity;
    } 
    else if(winner == (turn+1)%2){
        // printGridToConsole()
        // console.log("no loosing ^");
        return -Infinity;
    } 

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

    requestAnimationFrame(play);

    now = Date.now();

    elapsed = now - then;

    

    if(mouseX > offsetX && mouseX < offsetX + width * (pieceRadius*2+gapSize) && mouseY < offsetY + (height+2) * (pieceRadius*2+gapSize) && mouseY > offsetY){
    
            let x = Math.floor((mouseX-offsetX)/(pieceRadius*2+gapSize));
            if(isPlayable(grid, x)){
                let y = drop(grid, x);
                //ctx.clearRect(offsetX, offsetY, width * (pieceRadius*2 + gapSize), height * (pieceRadius*2 + gapSize));
                drawGrid();
                drawPieces();
                drawPiece(x, y, getColor((value)%2));
            }
            
        }

    // if enough time has elapsed, draw the next frame

    // if (elapsed > fpsInterval) {

    //     // Get ready for next frame by setting then=now, but also adjust for your
    //     // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    //     then = now - (elapsed % fpsInterval);

    //     // Put your drawing code here
    //     drawGrid();
    //     drawPieces();
    //     value++;

    // }
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

function undoLastDrop(row){
    for(let i = 0; i < height; i++){
        if(grid[i][row] != empty){
            grid[i][row] = empty;
            return;
        } 
    }
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
            drawPiece(i, j, getColor(grid[j][i]))
        }
    }
}

function drawPiece(centerX, centerY, color){
    ctx.fillStyle = color;
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
        y = drop(grid, x);
        grid[y][x] = value%2;
        drawPiece(x, y, getColor(grid[y][x]));
        let temp = isTerminal(grid);
        switch(temp){
            case -1:
                value++;
                //printGridToConsole();
                var t1 = new Date();
                minimax(value%2, gewünschteTiefe, -Infinity, Infinity);
                var t2 = new Date();
                var dt = t2 - t1;
                console.log('elapsed time = ' + dt + ' ms');
                if(gespeicherterZug != null) console.log("gespeicherter zug: " + gespeicherterZug);

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
    mouseY = event.clientY;
}

function printGridToConsole(){
    for(let i = 0; i < height; i++){
        let myString = "";
        myString+=i;
        for(let j = 0; j < width; j++){
            
            let sign = grid[i][j];
            if(sign == empty) myString+= " - ";
            else if(sign == 1) myString+= " x ";
            else if(sign == 0)myString+= " o ";
            else {
                myString+=" ";
                myString+=sign;
                myString+=" ";

            }
        }
        
        console.log(myString);
    }
    console.log("---------------------");
}

function displayNextPossibleMove(){

}







