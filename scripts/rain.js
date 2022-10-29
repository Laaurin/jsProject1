let canvas;
let ctx;
let speed = 0.5;
let drops = [];
let sections = 10;
let x = 350, y = 350, radius = 300;
let sSlider;
let start = 0;

let animation;
let running;
let duration;

let arrowColor;

let steps;


function Start(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    sSlider = document.getElementById('sectionSlider');
    sections = sSlider.value;
    ctx.strokeStyle = 'black';

    x = canvas.width/2.5, y = canvas.height/2, radius = Math.min(canvas.width/3, canvas.height/3);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, -0.5, 2);
    ctx.closePath();
    ctx.fill();

    //drawArrow();
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#323232";

    //drawCircle(0, sections);

    //rain();
    
    sSlider.oninput = function(){
        sections = sSlider.value;
        document.getElementById('sections').innerHTML = sections;
        start = 0;
        drawCircle(0, sections);
    }
}

function Roll(){
    running = true;
    //start = 100;
    steps = 0;
    steps = Math.random()*(sections-1)+1;
    console.log("sections: " + sections);
    console.log("steps: " + steps);
    // steps = (Math.random()*sections+3)*4*Math.PI/sections;
    duration = steps*10 + sections*10 * 5;
    console.log("duration: " + duration);

    Spin();
}

function Spin(){
    animation = requestAnimationFrame(Spin);

    if(duration < 1){
        cancelAnimationFrame(animation);
       
        running = false;
        drawArrow();
        return;
    }
    //if(!running) return;
    drawCircle(start+=2*Math.PI/sections/10, sections);
    //drawCircle(start+=0.5*steps, sections);

    duration--;

    

}

function drawCircle(start, sections){
    let span = (start + 2 * Math.PI * 2 / sections) - (start + Math.PI * 2 / sections)
    let color = GetColor(0);
    for(let i = 0; i < sections; i++){
        ctx.fillStyle = GetColor(i);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, start + i * Math.PI * 2 / sections, start + (i+1) * Math.PI * 2 / sections);
        console.log(i)
        console.log(start + i * Math.PI * 2 / sections)
        console.log(start + (i+1) * Math.PI * 2 / sections)

        ctx.lineTo(x, y);

        ctx.fill();

        ctx.closePath();

        if(i * Math.PI * 2 / sections == 0){
            arrowColor = (GetColor(i));
            //console.log("yes");
        } 

    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
}

function drawArrow(){
    ctx.fillStyle = arrowColor;
    ctx.beginPath();
    ctx.moveTo(x+radius*1.2, y);
    ctx.lineTo(x+radius*1.4, y+30);
    ctx.lineTo(x+radius*1.4, y-30);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

}

function GetColor(value){
    switch(value % 10){
        case 0:
            return 'purple';
        case 9:
            return 'indigo';
        case 8:
            return 'blue';
        case 7:
            return 'teal';
        case 6:
            return 'cyan';
        case 4:
            return 'green';
        case 5:
            return 'lime';
        case 3:
            return 'yellow';
        case 2:
            return 'orange';
        case 1:
            return 'red';
    }
    return ;
}


function rain(){
    requestAnimationFrame(rain);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < drops.length; i++){
        drops[i].drop();
        drops[i].draw();
    }
}

class Secation{
    constructor(idx){
        this.color = GetColor(idx);
    }
}


class Drop{
    constructor(){
        this.x = Math.random()*canvas.width;
        this.y = Math.random() * -200;
        this.length = Math.random()*15+5;
        this.speed = Math.random()*8+5;
        this.distance = Math.random()*20;
    }

    draw(){
        ctx.lineWidth = 4-this.speed/5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y+this.length);
        ctx.closePath();
        ctx.stroke();
    }

    drop(){
        this.y += this.speed;


        if(this.y > canvas.height){
            this.y = Math.random() * -200;
            this.x = Math.random()*canvas.width;
        }
    }
}
