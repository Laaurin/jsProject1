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

let knotRadius;

let knots = [];

let deleting = false;




function Start(){
    canvas = document.getElementById('canvas');
    iSlider = document.getElementById('iterationSlider');
    ctx = canvas.getContext('2d');

    for(let i = 0; i < height; i++){
        grid[i] = new Array(width).fill(empty);
    }


    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    knotRadius = Math.min(canvas.height, canvas.width) / 20;
    offsetX = canvas.width/2-width*(pieceRadius+gapSize)/2;
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    for(let i = 0; i < knots.length; i++){
        let distance = Math.sqrt(Math.pow(knots[i].x - mouseX, 2) + Math.pow(knots[i].y-mouseY, 2))
        if(distance < knotRadius*2){
            editKnots(i);
            return;
        }
    }

    knots.push(new Knot(mouseX, mouseY));
    knots[knots.length-1].drawKnot();
}

function editKnots(knotIndex){
    if(deleting) 
    {
        if(knots[knotIndex].value == 0)knots.splice(knotIndex, 1);
        else knots[knotIndex].value--;
    }
    else knots[knotIndex].value++;
    draw();
}

document.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

function getMousePos(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function draw(){
    ctx.fillStyle = "#323232";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    knots.forEach(element => {
        element.drawKnot();
    });
}


class Knot{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.value = 0;
    }

    drawKnot(){
        ctx.fillStyle = 'black'
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, knotRadius, 0, 2 * Math.PI, false);
       
        ctx.lineWidth = 5;
        ctx.stroke();

        switch(this.value){
            case 0:
                break;
            case 1:
                ctx.beginPath();
                ctx.arc(this.x, this.y, knotRadius / 4, 0, 2 * Math.PI, false);
            
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();
                break;
            case 2:
                ctx.beginPath();
                ctx.arc(this.x - knotRadius/3, this.y, knotRadius / 4, 0, 2 * Math.PI, false);
            
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x + knotRadius/3, this.y, knotRadius / 4, 0, 2 * Math.PI, false);
            
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();
                break;
            case 3:
                ctx.beginPath();
                ctx.arc(this.x, this.y - knotRadius/3, knotRadius / 4, 0, 2 * Math.PI, false);
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x - knotRadius/3, this.y + knotRadius/3, knotRadius / 4, 0, 2 * Math.PI, false);
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x + knotRadius/3, this.y+knotRadius/3, knotRadius / 4, 0, 2 * Math.PI, false);
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();
                break;
            case 4:
                ctx.beginPath();
                ctx.arc(this.x + knotRadius/3, this.y+knotRadius/3, knotRadius / 4, 0, 2 * Math.PI, false);
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x - knotRadius/3, this.y+knotRadius/3, knotRadius / 4, 0, 2 * Math.PI, false);
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x + knotRadius/3, this.y-knotRadius/3, knotRadius / 4, 0, 2 * Math.PI, false);
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x - knotRadius/3, this.y-knotRadius/3, knotRadius / 4, 0, 2 * Math.PI, false);
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();
                break;
            default:
                ctx.font = "30px Georgia";

                ctx.fillText(">4", this.x-knotRadius/3, this.y+knotRadius/6);
        }
    }
}

class Transition{

}
