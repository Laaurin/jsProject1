let canvas;
let ctx;
let xx;
let yy;
let alpha;
let aSlider;



function Start(){
    canvas = document.getElementById('canvas');
    aSlider = document.getElementById('angleSlider');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    
    document.getElementById('alpha').innerHTML = alpha;

    xx = canvas.width/2;
    yy = canvas.height;


    Tree2(350);

    
    //Tree(400);

    aSlider.oninput = function(){
        if(alpha == 360) aSlider.value = 0;
        ctx.fillStyle = "#3b3b3b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        alpha = parseInt(aSlider.value);
        console.log(alpha);
        document.getElementById("alpha").innerHTML = alpha;
        xx = canvas.width/2;
        yy = canvas.height;


        Tree(400);
    }

}
function Tree(len){
    ctx.fillStyle = 'black';
    //ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xx, yy);
    // ctx.lineTo(xx, yy-len);
    // yy -= len;
    DrawLine(len*0.67, 90, 15);


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

function Tree2(len){

    ctx.strokeStyle = 'white';
    // ctx.lineTo(xx, yy-len);
    // yy -= len;
    DrawLine2(canvas.width/2, canvas.height, len*0.67, 90, 10);


}

function DrawLine2(fx, fy, len, angle, depth){
    if(depth == 0)return;
    let x = fx + Math.cos(angle * Math.PI / 180) * len;
    let y = fy - Math.sin(angle * Math.PI / 180) * len;

    //ctx.strokeStyle = GetColor(depth);
    //ctx.lineWidth = depth;

    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    ctx.closePath();

    fx = x;
    fy = y;

    

    ctx.moveTo(xx, yy);
    

    DrawLine2(fx, fy, len*0.67, angle+alpha, depth-1);
    ctx.closePath();
    ctx.beginPath();
    //ctx.moveTo(x, y);
    DrawLine2(fx, fy, len*0.67, angle-alpha, depth-1);


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