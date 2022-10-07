let canvas;
let ctx;
let townDrawingSize = 10;
let towns = [];
let order = [];
let totalDistance = 0;
let backgroundColor = "#3b3b3b";



function Start(){
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    ctx = canvas.getContext('2d');
    document.getElementById('distance').innerHTML = totalDistance;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    slider = document.getElementById("mySlider");
    ouput = document.getElementById("slider");
    

    // towns = [new Town(50, 50), new Town(200, 10), new Town(10, 200),
    //     new Town(325, 190), new Town(24, 400), new Town(561, 309),
    //     new Town(152, 189), new Town(200, 421)];

    FillTownArray();

    
    //t.NearestNeighbour(t.order);

    //console.log("helloooo it works!!")



}

function FillTownArray(){
    canvas.addEventListener("click", function (evt) {
        var mousePos = getMousePos(canvas, evt);
        if(mousePos.x > canvas.width-townDrawingSize|| mousePos.x < townDrawingSize || mousePos.y > canvas.height-townDrawingSize * 2 || mousePos.y < townDrawingSize*2) return;
        //console.log(mousePos);
        var town = new Town(mousePos.x, mousePos.y);
        for(let i = 0; i < towns.length; i++){
            let distance = Math.abs(Math.sqrt(Math.pow(town.x - towns[i].x, 2) + Math.pow(town.y - towns[i].y, 2)));
            if(distance > townDrawingSize*4) continue;
            if(distance > townDrawingSize){
                console.log("to close!");
                console.log(Math.abs(Math.sqrt(Math.pow(town.x - towns[i].x, 2) + Math.pow(town.y - towns[i].y, 2))))
                return;
            }
            towns.splice(i, 1);
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for(let i = 0; i < towns.length; i++){
                towns[i].Draw(i);
            }
            ResetDistance();
            return;
        }
        towns[towns.length] = new Town(mousePos.x, mousePos.y);
        towns[towns.length-1].Draw(towns.length-1);
        ResetDistance();
        console.log("town added")
    }, false);
    //console.log(document.getElementById('mySlider'));
}

function SolveWithNearestNeighbour(){
    if(towns.length < 1) return;
    console.log("nearest neighbour solution");
    let t = new Tour(towns);
    order = t.NearestNeighbour();
    t.Connect(order);
    totalDistance = t.GetTotalDistance(order);
    console.log("distance: ", totalDistance);
    document.getElementById('distance').innerHTML = Math.round(totalDistance);
}

function SolveWithGenetic(){
    if(towns.length < 1) return;
    console.log("genetic algorithm solution");
    let t = new Tour(towns);
    order = t.GeneticAlg(t.order);
    t.Connect(order);
    totalDistance = t.GetTotalDistance(order);
    console.log("distance: ", totalDistance);
    document.getElementById('distance').innerHTML = Math.round(totalDistance);
}

function SolveWithBruteForce(){
    if(towns.length < 1 || towns.length > 10) return;
    console.log("Brute Force solution");
    let t = new Tour(towns);
    order = t.BruteForce(t.order);
    t.Connect(order);
    totalDistance = t.GetTotalDistance(order);
    console.log("distance: ", totalDistance);
    document.getElementById('distance').innerHTML = Math.round(totalDistance);
}

function ClearTowns(){
    towns = [];
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("cleared towns");
    ctx.strokeStyle = 'black';
    ResetDistance();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
    };
}

function Fakultät(a){
    result = a;
    while (a>1)
    {
        result *= --a;
    }

    return result;
}

function ResetDistance(){
    totalDistance = 0;
    document.getElementById('distance').innerHTML = Math.round(totalDistance);
}


class Tour{
    // constructor(amount){
    //     this.towns = [];
    //     this.order = [];


    //     // while(amount > 0){
    //     //     canvas.addEventListener("click", function (evt) {
    //     //         this.order[amount-1] = amount-1;
    //     //         amount--;
    //     //         var mousePos = getMousePos(canvas, evt);
    //     //         console.log(mousePos);
    //     //     }, false);
    //     // }

        
    //     for(let i = 0; i< amount; i++){
            
    //         this.order[i] = i;
             
    //         this.towns[i] = new Town(Math.round(Math.random()*(canvas.width-townDrawingSize*2)+townDrawingSize*2), Math.round(Math.random()*(canvas.height-townDrawingSize*2)+townDrawingSize*2));
    //         this.towns[i].Draw();
    //     }
    //     console.log(this.order);
    // }

    constructor(towns){
        this.towns = towns;
        this.order = [];

        for(let i = 0; i< towns.length; i++){
            
            this.order[i] = i;
             
            this.towns[i].Draw();
        }
        //this.Connect(this.order);
    }
    

    NearestNeighbour(){
        let newOrder = [];
        var current;
        newOrder[0] = 0;
        for(let i = 1; i < this.order.length; i++){
        let closest = -1;
        current = this.towns[newOrder[i-1]];
            for(let j = 1; j < this.towns.length; j++){
                if(closest == -1 && !newOrder.includes(j)) closest = j;
                else if(!newOrder.includes(j) && this.GetDistance(current, this.towns[j]) < this.GetDistance(current, this.towns[closest])){
                    closest = j;
                }
            }
            newOrder[i] = closest;
        }
        return newOrder;

    }

    BruteForce(order){
        let border = Fakultät(order.length);
        let bestOrder = [];
        let shortestDist = Infinity;
        let distance;
        let count = 0;

        let nums = this.leetcode(order);

        for(let i = 0; i < nums.length; i++){
            distance = this.GetTotalDistance(nums[i]);
            if(distance < shortestDist){
                //console.log("dist", shortestDist);
                bestOrder = nums[i].slice();
                shortestDist = distance;
            }
        }
        
        
        
        
        return bestOrder;
    }

    leetcode(nums) {
        let tempa=[];
        let final=[];
        function backtrack(tempa,nums){
            if(nums.length===0){
                final.push(tempa.slice());
                return;
            }
            for(let i=0;i<nums.length;i++){
                tempa.push(nums[i]);
                nums.splice(i,1);
                backtrack(tempa,nums,final);
                nums.splice(i,0,tempa.pop());
    
            }
        }
        backtrack(tempa,nums,final);
        return final;
    }

    SavingAlg(){
        //alle savings berechnen und speichern
        let index = 0;
        let savings = [];
        for(let i = 1; i < this.towns.length; i++){
            for(let j = i+1; j < this.towns.length; j++){
                savings[index] = new Saving(i, j, this.GetDistance(this.towns[0], this.towns[i]) + this.GetDistance(this.towns[0], this.towns[j]) - this.GetDistance(this.towns[i], this.towns[j]));
                index++;
            }
        }


        //find best saving

        let bestSavingIdx = 0;
        let newOrder = [];

        for(let i = 1; i < savings.length; i++){
            if(savings[i].saving > savings[bestSavingIdx].saving) bestSavingIdx = i;
        }

        newOrder[0] = savings[bestSavingIdx].from;
        newOrder[1] = savings[bestSavingIdx].to;

        savings.splice(bestSavingIdx, 1);

        console.log(newOrder);

        while(savings.length > 0){
            bestSavingIdx = 0;

            for(let i = 1; i < newOrder.length - 1; i++){
                for(let j = 0; j < savings.length; j++){
                    if(j >= savings.length) continue;
                    // if(savings[j].includes(newOrder[i].from) || savings[j].includes(newOrder[i].to)){
                    //     savings.splice(j, 1);
                    //     j--;
                    // }
                    index = newOrder.indexOf(savings[j].from);
                    let index2 = newOrder.indexOf(savings[j].to);


                    if(index > 0 && index < newOrder.length-1 || index2 > 0 && index2 < newOrder.length-1){
                        savings.splice(j, 1);
                        j--;
                    }


                    else if((savings[j].from, savings[j].to) == (newOrder[0], newOrder[newOrder.length-1])){
                        savings.splice(j, 1);
                        j--;
                    }
                }
            }

            if(savings.length < 1) break;

            for(let i = 0; i < savings.length; i++){
                if(savings[i].saving > savings[bestSavingIdx].saving && (savings[i].from == newOrder[0] || savings[i].to == newOrder[0] || savings[i].from == newOrder[newOrder.length-1] || savings[i].to == newOrder[newOrder.length-1])) bestSavingIdx = i;
            }

            if(savings[bestSavingIdx].to == newOrder[0]) newOrder.splice(0, 0, savings[bestSavingIdx].from);

            else if(savings[bestSavingIdx].from == newOrder[0]) newOrder.splice(0, 0, savings[bestSavingIdx].to);

            else if(savings[bestSavingIdx].to == newOrder[newOrder.length-1]) newOrder[newOrder.length] = savings[bestSavingIdx].from;

            else if(savings[bestSavingIdx].from == newOrder[newOrder.length-1]) newOrder[newOrder.length] = savings[bestSavingIdx].to;

            savings.splice(bestSavingIdx, 0);

        }
        console.log(newOrder);
        return newOrder;
    }


    GeneticAlg(order){
        let popSize = 300;

        let population = []

        let shortestDist = Infinity;

        let bestOrder = [];

        let depth = 10000;

        for(let i = 0; i < popSize; i++){
        //random anordnung
        

            population[i] = this.Shuffle(order.slice(), order.length);
            //beste aussuchen
            let distance = this.GetTotalDistance(population[i])
            if(distance < shortestDist){
                shortestDist = distance;
                bestOrder = population[i];
            }
        }
        
        population = this.Mutate(bestOrder, popSize);
        

        while(depth > 0){
            depth--;
            for(let i = 0; i < popSize; i++){
                let distance = this.GetTotalDistance(population[i])
                if(distance < shortestDist){
                    shortestDist = distance;
                    bestOrder = population[i];
                }
            }
    
    
            //neue population mit mutationen
            population = this.Mutate(bestOrder, popSize);
            
        }
        
        return bestOrder;
    }

    Mutate(order, popSize){
        let population = [];
        //population[0] = order.slice();
        for(let i = 0; i < popSize; i++){
            population[i] = this.Shuffle(order.slice(), 1);
        }
        return population;
    }

    Shuffle(order, amount){
        for(let i = 0; i < amount; i++){
            let indexA = Math.floor(Math.random() * order.length);
            let indexB = Math.floor(Math.random() * order.length);

            this.Swap(order, indexA, indexB)
        }
        return order;
    }

    Swap(arr, indA, indB){
        let temp = arr[indA];
        arr[indA] = arr[indB];
        arr[indB] = temp;
    }

    GetTotalDistance(order){
        
        let distance = 0;
        for(let i = 1; i < order.length; i++){
            distance += this.GetDistance(this.towns[order[i-1]], this.towns[order[i]]);
        }
        distance += this.GetDistance(this.towns[order[this.towns.length-1]], this.towns[order[0]]);
        return distance;
        
       
    }

    GetDistance(townA, townB){
        try{
            return Math.abs(Math.sqrt(Math.pow(townB.x - townA.x, 2) + Math.pow(townB.y - townA.y, 2)));
        }
        catch{
            console.log("A: ", townA);
            console.log("B: ", townB);

        }
        
     
        
    }

    Connect(order){
        //ctx.strokeStyle = 'red';
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.towns[order[0]].x, this.towns[order[0]].y);
        for(let i = 1; i < this.order.length; i++){
            ctx.lineTo(this.towns[order[i]].x, this.towns[order[i]].y);
            
            //this.towns[i].Draw(i);

        }
        ctx.closePath();
        ctx.stroke();

        for(let i = 0; i < this.order.length; i++){
            
            this.towns[i].Draw(i);

        }

        
    }
}

class Saving{
    constructor(from, to, saving){
        this.from = from;
        this.to = to;
        this.saving = saving;
    }
}

class Town{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    

    Draw(number){
        ctx.fillStyle = 'beige';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y-townDrawingSize*2);
        ctx.lineTo(this.x-townDrawingSize, this.y-townDrawingSize);
        ctx.lineTo(this.x+townDrawingSize, this.y-townDrawingSize);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillRect(this.x-townDrawingSize, this.y-townDrawingSize, townDrawingSize*2, townDrawingSize*2);
        //ctx.fillStyle = backgroundColor;
        //ctx.fillRect(this.x+townDrawingSize/4, this.y, townDrawingSize/2, townDrawingSize);
        //ctx.fillRect(this.x-townDrawingSize/1.5, this.y, townDrawingSize/2, townDrawingSize/2);


        ctx.fillStyle = 'lightgrey';
        ctx.fillText(number, this.x-townDrawingSize, this.y+townDrawingSize+10);

    }
}