let canvas;
let ctx;
let speed = 0.5;
let sSlider;
let stars = [];

function Start(){
    canvas = document.getElementById('canvas');
    sSlider = document.getElementById('speedSlider');
    document.getElementById('speed').innerHTML = speed;
    ctx = canvas.getContext('2d');


    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < 300; i++){
        stars[i] = new Star();
        stars[i].draw();
    }

    lightspeed();
    
    
    // sSlider.oninput = function(){
    //     iteration = iSlider.value;
    //     document.getElementById('iteration').innerHTML = iteration;

    //     ctx.fillStyle = "#323232";

    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     triangle(x, y , size, iteration);
    // }

}

function lightspeed(){
    requestAnimationFrame(lightspeed);
    ctx.fillStyle = "#323232";

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < stars.length; i++){
        stars[i].update();
        stars[i].draw();
    }
}

class Star{
    constructor(){
        this.x = Math.random() * canvas.width / 4 + canvas.width/8 * 3;
        this.y = Math.random() * canvas.height / 4 + canvas.height/8 * 3;

        this.dx = 2;
        this.dy = 1;
    }

    update(){
        this.x += Math.sign(this.x-canvas.width/2) * canvas.height/this.y * speed;
        this.y += Math.sign(this.y-canvas.height/2) * canvas.width/this.x * speed;

        if(this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0){
            this.x = Math.random() * canvas.width / 4 + canvas.width/8 * 3;
            this.y = Math.random() * canvas.height / 4 + canvas.height/8 * 3;
        }
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
}

