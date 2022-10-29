let canvas;
let ctx;
let iteration
let iSlider;

let x, y, size, iter, width, height;
let shrinked = false;

function Start(){
    canvas = document.getElementById('canvas');
    iSlider = document.getElementById('iterationSlider');
    document.getElementById('iteration').innerHTML = 0;
    ctx = canvas.getContext('2d');



    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    width = canvas.width;
    height = canvas.height;
    
    size = canvas.height * 2 / Math.sqrt(3)-2;
    x = (canvas.width-size);
    y = canvas.height-1;
    iter = 4;
    

    ctx.strokeStyle = 'black';
    
    triangle(x, y, size, 7);
    

    //triangle2(x, y, size, 4);
    //animate2();
    
    iSlider.oninput = function(){
        iteration = iSlider.value;
        document.getElementById('iteration').innerHTML = iteration;

        ctx.fillStyle = "#323232";

        ctx.fillRect(0, 0, canvas.width, canvas.height);
        triangle(x, y , size, iteration);
    }

}

function triangle(x, y, size, iteration){
    if(iteration < 0) return;
    let height = Math.sqrt(3)*size/2
    ctx.lineWidth = iteration;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size/2, y-height);
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();

    triangle(x, y, size / 2, iteration-1);
    triangle(x+size/2, y, size / 2, iteration-1);
    triangle(x+size/4, y-height/2, size / 2, iteration-1);


}


function triangle2(x, y, size, iteration){
    //ctx.fillStyle = 'black';
    if(size < 30) return;
    let height = Math.sqrt(3)*size/2

    ctx.beginPath();
    ctx.moveTo(x+size/2, y);
    ctx.lineTo(x+size/4*3, y-height/2);
    ctx.lineTo(x+size/4, y-height/2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();


    triangle2(x, y, size/2, iteration-1);
    triangle2(x+size/2, y, size/2, iteration-1);
    triangle2(x+size/4, y-height/2, size/2, iteration-1);


}

function animate2(){
    ctx.fillStyle = "#323232";
    requestAnimationFrame(animate2);
    ctx.fillRect(0, 0, width, height);

    triangle2(x, y, size++, iter);

    if(size > (canvas.height * 2 / Math.sqrt(3)-2)*2){
        size = canvas.height * 2 / Math.sqrt(3)-2;

    }

}


function animate(){
    ctx.fillStyle = "#323232";

    requestAnimationFrame(animate);
    ctx.fillRect(0, 0, width, height);
    triangle(x, y, size++, iter);

    if(!shrinked && size >= (canvas.height * 2 / Math.sqrt(3)-2)*1.4){
        iter++;
        shrinked = true;
        console.log("yes");
    }

    if(size >= (canvas.height * 2 / Math.sqrt(3)-2)*2){
        size = canvas.height * 2 / Math.sqrt(3)-2;
        iter--
        console.log("nooooow")
        shrinked = false;
    }

    


    // triangle(x, y, size--, iter);
    // console.log(size);
    // if(!shrinked && size <= (canvas.height * 2 / Math.sqrt(3)-2)*1.1){
    //     iter--;
    //     shrinked = true;
    //     console.log("yes");
    // }
    // if(size <= (canvas.height * 2 / Math.sqrt(3)-2)){
    //     size = (canvas.height * 2 / Math.sqrt(3)-2) * 2;
    //     iter++;
    //     shrinked = false;
    // } 
}
