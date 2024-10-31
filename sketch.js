var mic; // to get audio input from mic
var spacing = 100;
var circleSize;
var col1, col2, col3;
var images = []; // Array to hold images
var currentImage; // To hold the current image
var lastBeatTime = 0;
var beatThreshold = 0.1; // Adjust this threshold for beat detection

function preload() {
  // Load your specific images
  images.push(loadImage('images/1.png'));
  images.push(loadImage('images/2.png'));
  images.push(loadImage('images/3.png'));
  images.push(loadImage('images/4.png'));
  images.push(loadImage('images/5.png'));
  images.push(loadImage('images/6.png'));
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  
  mic = new p5.AudioIn();
  getAudioContext().suspend();
  
  // Create a button to start the audio context
  let startButton = createButton('Start Audio');
  startButton.position(10, 10);
  startButton.mousePressed(startAudio);
  
  col1 = color(random(255), 100, 0);
  col2 = color(100, random(255), 0);
  col3 = color(100, 0, random(255));
  
  currentImage = random(images); // Load a random image at start
}

function startAudio() {
  mic.start();
  getAudioContext().resume();
}

function draw() {
  background(0, 30);
  
  // Audio level from mic
  var vol = mic.getLevel();
  console.log(vol);
  circleSize = map(vol, 0, 1, 25, 200);
  
  
  
  noFill(); 
  for (var x = 0; x <= width; x += spacing) {
    for (var y = 0; y <= height + circleSize/2; y += spacing) {
      stroke(col1); //play with opacity 
      ellipse(x, y, circleSize, circleSize);
      stroke(col2);
      ellipse(x, y, circleSize / 2, circleSize / 2);
      stroke(col3);
      ellipse(x, y, circleSize + 20, circleSize + 20);
    }
  }
  
  // Draw the current image
  //tint(3, 236, 252); 
  image(currentImage, width / 2 - currentImage.width / 2, height / 2 - currentImage.height / 2);
 // noTint(); 
 
  // Check for beat detection
  if (vol > beatThreshold && millis() - lastBeatTime > 300) { // 300ms gap for beat detection
    console.log('Beat detected');
    lastBeatTime = millis();
    currentImage = random(images); // Load a new random image on beat
  }
}

function mousePressed() {
  col1 = color(random(255), 100, 0);
  col2 = color(100, random(255), 0);
  col3 = color(100, 0, random(255));
}