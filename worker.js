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

// function to receive messages from the main thread
self.onmessage = function(event) {
    //-- console.log("Worker received message");
    maxIterations = event.data.maxIterations;
    height = event.data.height;
    width = event.data.width;
    xMin = event.data.xMin;
    xMax = event.data.xMax;
    yMin = event.data.yMin;
    yMax = event.data.yMax;
    pixelx = event.data.pixelx;
    pixely = event.data.pixely;

    // create the color gradient
    createColorGradient();

    //-- console.log(width, height, maxIterations, xMin, xMax, yMin, yMax, pixelx, pixely );
    
    // calculate the coordinates of each pixel and get the color of each pixel
    const results = calculateCoordiates(xMin, xMax, yMin, yMax, pixelx, pixely, width, height);
    
    const colors = getColorOfPixel(results);

    // send the row and colors back to the main thread
    self.postMessage({
        row: pixely,
        colors: colors
    });
}

// function to calculate the coordinates of each pixel in the complex plane
function calculateCoordiates(xMin, xMax, yMin, yMax, pixelx, pixely, width, height) {
    const results = [];
    var cy = yMax - (pixely/height)* (yMax - yMin);

    // loop through each pixel in the row and calculate the corresponding complex number
    for (let pixelx = 0; pixelx < width; pixelx++) {

        const cx = xMin + (pixelx / width) * (xMax - xMin);

        const iterations = startIterating(cx, cy);

        results.push(iterations);
        //-- console.log(cx, cy);
    }

    return results;
    
}

// function to iterate through the complex numbers and check if they escape the boundary
function startIterating(cx, cy){
    let x = 0;
    let y = 0;

    for (let j = 0; j < maxIterations; j++) {

        const newX = Math.pow(x, 2) - Math.pow(y, 2) + cx;
        const newY = 2 * x * y + cy;

        x = newX;
        y = newY;

        const distance = getDistance(x, y);

        // check if the distance is greater than the boundary
        if (distance > boundary) {
            return j + 1;
        }
    }
    return maxIterations;
}

// function to calculate the distance from the origin
function getDistance(x1, y1){
    var a = Math.sqrt((Math.pow(x1, 2) + Math.pow(y1, 2)) );
    return a;
}

// function to create a color gradient from red to green to blue
function createColorGradient(){
    const colors = [];
    // calculate the number of steps for each color transition
    const steps = 255/3;
    let index = 0;

    // red to green
    for(var i = 0; i<= steps; i++){
        // calculate the red and green values based on the current step
        let r = 255 - Math.round(i * (255 / steps));
        let g = Math.round(i * (255 / steps));
        colors.push(`rgb(${r}, ${g}, 0)`);
        index++;
    }

    // green to blue
    for(var i = 0; i<= steps; i++){
        // calculate the green and blue values based on the current step
        let g = 255 - Math.round(i * (255 / steps));
        let b = Math.round(i * (255 / steps));
        colors.push(`rgb(0, ${g}, ${b})`);
        index++;
    }

    //blue to red
    for(var i = 0; i<= steps; i++){
        // calculate the red and blue values based on the current step
        let b = 255 - Math.round(i * (255 / steps));
        let r = Math.round(i * (255 / steps));
        colors.push(`rgb(${r}, 0, ${b})`);
        index++;
    }

    // set the color array
    setColorinArray(colors);
}

// function to set the color array
function setColorinArray(colors){
    colorArray = colors;
}

// function to get the color of each pixel based on the number of iterations
function getColorOfPixel(results){
    rowColors = new Array(results.length);
    
    for(let i = 0; i< results.length; i++){
        // if the number of iterations is equal to the maximum number of iterations, set the color to black
        if (results[i] === maxIterations) {
            rowColors[i] = "rgb(0, 0, 0)";
        }
        // otherwise, set the color to the corresponding color in the color array
        else {
            rowColors[i] = colorArray[results[i]];
        }
    }
    return rowColors;
}
