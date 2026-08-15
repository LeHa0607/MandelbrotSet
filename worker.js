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

    startIterating(cx, cy);

    console.log(cx, cy);
}


function startIterating(cx, cy){
    var x0 = 0;
    var y0 = 0;
    var x1 = Math.pow(x0, 2) - Math.pow(y0, 2) + cx;
    var y1 = 2 * x0 * y0 + cy;
    var i = 0;

    while(i < boundary){
        i = getDistance(x1, y1);
        console.log(i);
        var buffer = x1;
        x1 = Math.pow(x1, 2) - Math.pow(y1, 2) + cx;
        y1 = 2 * buffer * y1 + cy;
        
    }
}

function getDistance(x1, y1){
    var a = Math.sqrt((Math.pow(x1, 2) + Math.pow(y1, 2)) );
    return a;
}


