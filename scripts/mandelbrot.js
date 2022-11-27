let canvas;
let ctx;
let zoom, x, y, MaxIterations;
let quality;
let qSlider;






function Start(){
    canvas = document.getElementById('canvas');
    qSlider = document.getElementById("qualitySlider");
    iSlider = document.getElementById("iterationSlider");

    MaxIterations = iSlider.max/2*10;
    zoom = 0.5;
    x = 0;
    y = 0;

    document.getElementById("quality").innerHTML = (qSlider.value)/qSlider.max*100;
    document.getElementById("iteration").innerHTML = MaxIterations;
    document.getElementById("zoom").innerHTML = zoom;

    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    
    
    console.log(qSlider.value);
    console.log(parseInt(qSlider.value));
    quality = 5;
    console.log(quality);
    // let a = new Complex(0,0);
    // let b = IsInMandelBrot(a, 1000);
    // console.log(b);
    MandelBrot(x, y, zoom, MaxIterations);


    qSlider.oninput = function(){
        quality = 11-qSlider.value;
        document.getElementById("quality").innerHTML = (qSlider.value)/qSlider.max*100;
        
        MandelBrot(x, y, zoom, MaxIterations);
    }

    iSlider.oninput = function(){
        MaxIterations = iSlider.value * 10;
        document.getElementById("iteration").innerHTML = MaxIterations;
        
        MandelBrot(x, y, zoom, MaxIterations);
    }

    canvas.addEventListener("click", function (evt) {
        var mousePos = getMousePos(canvas, evt);
        console.log("x: ", (mousePos.x - canvas.width/2)/canvas.width*4/zoom+x , "y: ", (canvas.height/2 - mousePos.y)/canvas.height*2/zoom+y);
        x = (mousePos.x - canvas.width/2)/canvas.width*4/zoom+x;
        y = (canvas.height/2 - mousePos.y)/canvas.height*2/zoom+y;
        MandelBrot(x, y, zoom, MaxIterations);
    }, false);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
    };
}

function drawPixel(xx, yy, color) {
    ctx.fillStyle = color || '#000';
  	ctx.fillRect(xx, yy, quality, quality);
}

function MandelBrot(xx, yy, zoom, MaxIterations){
    let xStart = xx-2 / zoom;
    let yStart = yy + 1 / zoom;
    let IncrementX = (4 / canvas.width) / zoom;
    let IncrementY = (2 / canvas.height) / zoom;

    ctx.fillStyle = "#3b3b3b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = id.data;

    

    //ctx.ClearRect(0, 0, canvas.width, canvas.height)

    for(let i = 0; i < canvas.height; i+=quality){
        xx = xStart;
        for(let j = 0; j < canvas.width; j+=quality){
            //setzt einzelne pixel mit putImageData
            let value = IsInMandelBrot(new Complex(xx, yStart), MaxIterations);
            var off = (i * id.width + j) * 4;
            pixels[off] = pixels[off + 1] = pixels[off + 2] = GetColorReDo(value);
           
            pixels[off + 3] = 255;

            //oder viele Quadrate zeichnen
            //drawPixel(j, i, GetColor(5));
            xx += IncrementX * quality;
        }
        yStart -= IncrementY * quality;
    }
    ctx.putImageData(id, 0, 0);
    //DrawGrid(xStart, IncrementX, yStart, IncrementY);
}

function ZoomIn(){
    zoom *= 2;
    document.getElementById("zoom").innerHTML = zoom;
    MandelBrot(x, y, zoom, MaxIterations)
}

function ZoomOut(){
    if(zoom <= 0)return;
    zoom /= 2;
    document.getElementById("zoom").innerHTML = zoom;
    MandelBrot(x, y, zoom, MaxIterations);
}

function Left(){
    x -= 0.5/zoom;
    MandelBrot(x, y, zoom, MaxIterations);
}

function Right(){
    x += 0.5/zoom;
    MandelBrot(x, y, zoom, MaxIterations);
}

function Up(){
    y += 0.5/zoom;
    MandelBrot(x, y, zoom, MaxIterations);
}

function Down(){
    y -= 0.5/zoom;
    MandelBrot(x, y, zoom, MaxIterations);
}

function IsInMandelBrot(number, MaxIterations){
    let Z = new Complex(0, 0);
    let iteration = 0;

    do{
        iteration++;
        let squared = Square(Z);
        Z = Add(squared, number);

    } while(Dist(Z) < 4 && iteration < MaxIterations);

    if(iteration < MaxIterations){
        return iteration / MaxIterations;
    }
    return 0;
}

function DrawGrid(x, incX, y, incY){
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.moveTo(0, canvas.height/2);
    // ctx.lineTo(canvas.width, canvas.height/2);
    // ctx.moveTo(canvas.width/2, 0);
    // ctx.lineTo(canvas.width/2, canvas.height);
    // ctx.stroke();
    // ctx.closePath();

    for(let i = 0; i <= 10; i++){
        ctx.fillText(x + incX * (canvas.width / 10) * i, canvas.width/10*i, canvas.height-10);
        if(i < 6)ctx.fillText(y + incY * (canvas.height / 10) * i, canvas.width-40, canvas.height/6*i);

    }

}

function GetColor2(value){
    value = Math.round(Math.pow(value, 0.2) * 10);
    switch(value){
        case 10:
            return 'purple';
        case 9:
            return 'indigo';
        case 8:
            return 'blue';
        case 7:
            return 'cyan';
        case 6:
            return 'teal';
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

function GetColor(value){
    value = Math.round(Math.pow(value, 0.2) * 10);
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

function GetColorReDo(value){
    value = Math.round(Math.pow(value, 0.2) * 10);
    switch(value){
        case 10:
            return 255;
        case 9:
            return 240;
        case 8:
            return 224; // 4.
        case 7:
            return 207; //dritt äußerste zackige fläche im kreis
        case 6:
            return 171; //zweite äußerste zackige fläche im kreis
        case 4:
            return 102; //kreis der fraktal eingrenzt
        case 5:
            return 128; //äußerste zackige fläche im kreis
        case 3:
            return 61; // größte fläche außen
        case 2:
            return 48;
        case 1:
            return 44;
    }
    return ;
}

function Add(a, b){
    return new Complex(a.real + b.real, a.imaginary + b.imaginary);
}
function Square(a){
    return new Complex(Math.pow(a.real, 2) - Math.pow(a.imaginary, 2), a.imaginary * a.real * 2);
}
function Dist(a){
    return a.real * a.real + a.imaginary * a.imaginary;
}

class Complex{
    constructor(real, imaginary){
        this.real = real;
        this.imaginary = imaginary;
    }


}
