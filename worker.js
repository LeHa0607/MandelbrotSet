var width;
var height;
var maxIterations;
var xMin;
var xMax;
var yMin;
var yMax;
var pixelx;
var pixely;
var boundary = 2;
let colorArray;
let rowColors;

self.onmessage = function(event) {
    console.log("Worker received message");
    maxIterations = event.data.maxIterations;
    height = event.data.height;
    width = event.data.width;
    xMin = event.data.xMin;
    xMax = event.data.xMax;
    yMin = event.data.yMin;
    yMax = event.data.yMax;
    pixelx = event.data.pixelx;
    pixely = event.data.pixely;
    createColorGradient();

    //console.log(width, height, maxIterations, xMin, xMax, yMin, yMax, pixelx, pixely );
    
    const results = calculateCoordiates(xMin, xMax, yMin, yMax, pixelx, pixely, width, height);
    const colors = getColorOfPixel(results);

    self.postMessage({
        row: pixely,
        colors: colors
    });
}


function calculateCoordiates(xMin, xMax, yMin, yMax, pixelx, pixely, width, height) {
    const results = [];
    var cy = yMax - (pixely/height)* (yMax - yMin);

    for (let pixelx = 0; pixelx < width; pixelx++) {

        const cx =
            xMin +
            (pixelx / width) *
            (xMax - xMin);

        const iterations = startIterating(cx, cy);

        results.push(iterations);
        //console.log(cx, cy);
    }

    return results;
    
}


function startIterating(cx, cy){
    let x = 0;
    let y = 0;

    for (let j = 0; j < maxIterations; j++) {

        const newX = Math.pow(x, 2) - Math.pow(y, 2) + cx;
        const newY = 2 * x * y + cy;

        x = newX;
        y = newY;

        const distance = getDistance(x, y);

        if (distance > boundary) {
            return j + 1;
        }
    }

    return maxIterations;
}

function getDistance(x1, y1){
    var a = Math.sqrt((Math.pow(x1, 2) + Math.pow(y1, 2)) );
    return a;
}


function createColorGradient(){
    const colors = [];
    const steps = 255/3;
    let index = 0;

    // red to green
    for(var i = 0; i<= steps; i++){
        let r = 255 - Math.round(i * (255 / steps));
        let g = Math.round(i * (255 / steps));
        colors.push(`rgb(${r}, ${g}, 0)`);
        index++;
    }

    // green to blue
    for(var i = 0; i<= steps; i++){
        let g = 255 - Math.round(i * (255 / steps));
        let b = Math.round(i * (255 / steps));
        colors.push(`rgb(0, ${g}, ${b})`);
        index++;
    }

    //blue to red
    for(var i = 0; i<= steps; i++){
        let b = 255 - Math.round(i * (255 / steps));
        let r = Math.round(i * (255 / steps));
        colors.push(`rgb(${r}, 0, ${b})`);
        index++;
    }
    setColorinArray(colors);
}

function setColorinArray(colors){
    colorArray = colors;
}

function getColorOfPixel(results){
    rowColors = new Array(results.length);
    for(let i = 0; i< results.length; i++){
        if (results[i] === maxIterations) {
            rowColors[i] = "rgb(0, 0, 0)";
        }
        else {
            rowColors[i] = colorArray[results[i]];
        }
    }
    return rowColors;
}
