let canvas;
let ctx;
let xx;
let yy;
let alpha = 90;
let aSlider;
let dSlider;
let lSlider;
let fSlider;

let factor = 0.67;

let x1, y1, x2, y2;




function Start(){
    canvas = document.getElementById('canvas');
    aSlider = document.getElementById('angleSlider');
    dSlider = document.getElementById('depthSlider');
    lSlider = document.getElementById('lengthSlider');
    fSlider = document.getElementById('factorSlider');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    let depth = 10;
    let length = 350;
    let y = canvas.height;
    
    document.getElementById('alpha').innerHTML = alpha;
    document.getElementById('depth').innerHTML = depth;
    document.getElementById('length').innerHTML = length/10;
    document.getElementById('factor').innerHTML = factor;



    lSlider.maxValue = canvas.height;

    xx = canvas.width/2;
    yy = canvas.height;


    Tree2(canvas.width/2, y, length, 90, depth);

    //animate(400, 300, 24, 56);

    //x1 = 200, y1 = 20, x2 = 415, y2 = 300;
    //animate();




    aSlider.oninput = function(){
        ctx.fillStyle = "#323232";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        alpha = parseInt(aSlider.value);
        document.getElementById("alpha").innerHTML = alpha;
        xx = canvas.width/2;
        yy = canvas.height;


        Tree2(canvas.width/2, y, length, 90, depth);

    }

    dSlider.oninput = function(){
        ctx.fillStyle = "#323232";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        depth = parseInt(dSlider.value);
        document.getElementById("depth").innerHTML = depth;
        xx = canvas.width/2;
        yy = canvas.height;


        Tree2(canvas.width/2, y, length, 90, depth);
    }

    lSlider.oninput = function(){
        ctx.fillStyle = "#323232";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        length = parseInt(lSlider.value) * 10;
        document.getElementById("length").innerHTML = lSlider.value;
        xx = canvas.width/2;
        yy = canvas.height;


        Tree2(canvas.width/2, y, length, 90, depth);
    }

    fSlider.oninput = function(){
        ctx.fillStyle = "#323232";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        factor = parseInt(fSlider.value) / 100;
        document.getElementById("factor").innerHTML = factor;
        xx = canvas.width/2;
        yy = canvas.height;


        Tree2(canvas.width/2, y, length, 90, depth);
    }

}

function drawLine(x1,y1,x2,y2,ratio) {
    //ctx.fillRect(0,0,300,300);
    ctx.moveTo(x1,y1);
    x2 = x1 + ratio * (x2-x1);
    y2 = y1 + ratio * (y2-y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }

  function animate(ratio) {
    ratio = ratio || 0;
    drawLine(x1, y1, x2, y2,ratio);
    if(ratio<1) {
      requestAnimationFrame(function() {
        animate(ratio + 0.01);
      });
    }
  }

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function Tree(len){
    ctx.fillStyle = 'black';
    //ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xx, yy);
    // ctx.lineTo(xx, yy-len);
    // yy -= len;
    DrawLine(len*0.67, 90, 10);


    ctx.stroke();
}

function DrawLine(len, angle, depth){
    if(depth == 0)return;
    let x = xx + Math.cos(angle * Math.PI / 180) * len;
    let y = yy - Math.sin(angle * Math.PI / 180) * len;

    ctx.lineWidth = depth;
    
    depth;

    ctx.lineTo(x, y);
    //ctx.stroke();

    xx = x;
    yy = y;

    

    //ctx.moveTo(xx, yy);
    
    ctx.fillStyle = 'yellow';
    DrawLine(len*0.67, angle+alpha, depth-1);
    ctx.moveTo(x, y);
    xx = x;
    yy = y;
    ctx.fillStyle = 'red';
    DrawLine(len*0.67, angle-alpha, depth-1);


}

function oldTree2(len){

    ctx.strokeStyle = 'black';
    // ctx.lineTo(xx, yy-len);
    // yy -= len;
    DrawLine2(canvas.width/2, canvas.height, len*0.67, 90, 4);


}

function Tree2(fx, fy, len, angle, depth){
    if(depth == 0)return;
    let x = fx + Math.cos(angle * Math.PI / 180) * len;
    let y = fy - Math.sin(angle * Math.PI / 180) * len;

    //ctx.strokeStyle = GetColor(depth);
    //ctx.lineWidth = depth / 2;

    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    ctx.closePath();

    // x1 = fx;
    // x2 = x;
    // y1 = fy;
    // y2 = y;

    // animate();

    fx = x;
    fy = y;

    

    ctx.moveTo(xx, yy);
    

    // Tree2(fx, fy, len*0.67, angle+alpha, depth-1);
    // Tree2(fx, fy, len*0.67, angle-alpha, depth-1);
    Tree2(fx, fy, len * factor, angle+alpha, depth-1);
    Tree2(fx, fy, len * factor, angle-alpha, depth-1);
    //Tree2(fx, fy, len*0.67, angle, depth-1);

    // if(Math.random() > 0.5){
    //     Tree2(fx, fy, len*0.67, angle-alpha/2, depth-1);
    // }
    // else{
    //     Tree2(fx, fy, len*0.67, angle+alpha/2, depth-1);
    // }
    





}

function GetColor(value){
    value = 11 - value;
    switch(value){
        case 10:
            return "#fff";
        case 9:
            return "#f0f0f0";
        case 8:
            return "#e0e0e0"; // 4.
        case 7:
            return "#cfcfcf"; //dritt äußerste zackige fläche im kreis
        case 6:
            return "#ababab"; //zweite äußerste zackige fläche im kreis
        case 4:
            return "#666"; //kreis der fraktal eingrenzt
        case 5:
            return "#808080"; //äußerste zackige fläche im kreis
        case 3:
            return "#3d3d3d"; // größte fläche außen
        case 2:
            return "#303030";
        case 1:
            return "#2c2c2c";
    }
    return ;
}