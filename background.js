var canvas, ctx;
var width, height;
var frameCount = 0;

var shapeConstructor = [{ red: 96, green: 8, blue: 216, multi: 1, frameC: 0}];

//Variables that relate to the expansion of the background shapes.
var expand, xFactor, yFactor;

var multiply = 72;

//Counts the amount of times the marker frame to create a new shape has been met.
//For this, its every 32 frames it creates a new 'shape'
var frameCounter = 1;

//Variables for the colour of the background shapes. 
var shapeRed = 0, shapeGreen = 0, shapeBlue = 0;

var k = 0;

var growthRate;

function updateGrowthRate(){
  var maxRadius = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2));
  var lifespanFrames = 10 * multiply;
  growthRate = (2* maxRadius - circleSize/2) / lifespanFrames;
}

var circleSize = 150; // fallback until CSS var is read

function updateCircleSize(){
  var probe = document.getElementById('circleSizeProbe');
  var resolved = probe.getBoundingClientRect().width;
  if(!isNaN(resolved) && resolved > 0){
    circleSize = resolved;
  }
}

function resizeCanvas(){
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  updateCircleSize();
  updateGrowthRate();
}

function createShape(f){
  shapeConstructor.push({red:96, green:8, blue:216, frameC: f})
}

function draw() {

  frameCount++

  ctx.setTransform(1,0,0,1,0,0)
  ctx.fillStyle = 'rgb(83,228,192)';
  ctx.fillRect(0,0,width, height)
  ctx.translate(width/2, height/2);
  
  if(frameCount == multiply * frameCounter){
    createShape(frameCount);
    frameCounter++;
  }

  

  //The bulk of the work of the site is here.
  //This creates a shape that expands to fill the screen whilst progressively changing colour
  for(var i = 0; i < shapeConstructor.length; i++) {
    //Gets the RGB colour values of the current shape in the array
    shapeRed = shapeConstructor[i].red;
    shapeGreen = shapeConstructor[i].green; 
    shapeBlue = shapeConstructor[i].blue;

    //Sets it as the fill of the shape
    ctx.fillStyle= 'rgb('+shapeRed+','+ shapeGreen+','+shapeBlue+')';

    //As the difference between the purple and blue is fixed
    //and the ideal amount of shapes visible is around 10
    //This changes the colour set in the array to a slight variation every pass
    //Giving the illusion of shifting colours.

    //The colours we are aiming for are R=83, G=228, B=192
    shapeConstructor[i].red = shapeRed-(1.5/multiply);
    shapeConstructor[i].green = shapeGreen + (24.5/multiply);
    shapeConstructor[i].blue = shapeBlue - (2.5/multiply);
    
    //Take the current frame count and subtract it from the frame the shape initially started
    //Multiplied by the scale of the screen.
    var expand = (frameCount - shapeConstructor[i].frameC) * growthRate;

    ctx.beginPath();
    ctx.arc(0,0,(circleSize+expand)/2, 0, Math.PI *2)
    ctx.fill();
  }

  while(shapeConstructor.length > 12){
    shapeConstructor.shift();
  }

  ctx.fillStyle = '#e4f5fa';
  ctx.beginPath();
  ctx.arc(0,0, circleSize/2 , 0, Math.PI*2);
  ctx.fill();

  requestAnimationFrame(draw)

}

function seedInitialShapes(){
  for(var k = 0; k < 10; k++){
    var currentFrame = -(multiply * (9 - k));
    createShape(currentFrame);
    shapeConstructor[k].red = 84.5 + (1.5 * k + 1);
    shapeConstructor[k].green = 252.5 - (24.5 * k + 1);
    shapeConstructor[k].blue = 194.5 + (2.5 * k + 1);
  }
}

function init(){
  canvas = document.getElementById('bgCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  seedInitialShapes();
  window.addEventListener('resize', resizeCanvas)
  requestAnimationFrame(draw);

}

window.addEventListener('DOMContentLoaded', init)
//Creates the shape with the first colour set and taking the current frame of the site.
