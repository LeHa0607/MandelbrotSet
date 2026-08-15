var width;
var height;
var maxIterations;
var xMin;
var xMax;
var yMin;
var yMax;
var pixelx;
var pixely;

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

    console.log(width, height, maxIterations, xMin, xMax, yMin, yMax, pixelx, pixely );
    calculateCoordiates(xMin, xMax, yMin, yMax, pixelx, pixely, width, height);
}


function calculateCoordiates(xMin, xMax, yMin, yMax, pixelx, pixely, width, height) {
    var cx = xMin + (pixelx/width) * (xMax - xMin);
    var cy = yMax - (pixely/height)* (yMax - yMin);
    console.log(cx, cy);
}


function startIterating(){
    
}

function getDistance(){

}
