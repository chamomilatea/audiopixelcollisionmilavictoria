var mic; // to get audio input from mic
var spacing = 100;
var circleSize;
var col1, col2, col3;
var images = []; // Array to hold images
var zoom2xImages = []; // Array to hold zoom2x images
var currentImage; // To hold the current image
var overlayImage; // To hold the overlay image
var textureImages = [];
var currentTexture;
var lastBeatTime = 0;
var beatThreshold = 0.1; // Adjust this threshold for beat detection
let slider;
let ratio = 1.6;
let globeScale;

function preload() {
  // Load your specific images
  images.push(loadImage('images/1.png'));
  images.push(loadImage('images/2.png'));
 // images.push(loadImage('images/3.png'));
  images.push(loadImage('images/4.png'));
  //images.push(loadImage('images/5.png'));
  images.push(loadImage('images/6.png'));
  //images.push(loadImage('images/7.png'));
  images.push(loadImage('images/8.png'));
  images.push(loadImage('images/green3.png'));
  images.push(loadImage('images/green5.png'));
  images.push(loadImage('images/green7.png'));
  //images.push(loadImage('images/green8.png'));


  zoom2xImages.push(loadImage('zoom2x/z2_2.png'));
  zoom2xImages.push(loadImage('zoom2x/z2_4.png'));
  zoom2xImages.push(loadImage('zoom2x/z2_6.png'));
  zoom2xImages.push(loadImage('zoom2x/z2_8.png'));

  images.push(loadImage('zoom3x/z3_1.png'));
  images.push(loadImage('zoom3x/z3_3.png'));
  images.push(loadImage('zoom3x/z3_5.png'));
  images.push(loadImage('zoom3x/z3_7.png'));

  textureImages.push(loadImage('textures/paper.jpg'));
  textureImages.push(loadImage('textures/grunge.jpg'));
  textureImages.push(loadImage('textures/paint.jpg'));
  textureImages.push(loadImage('textures/pink.jpg'));
  textureImages.push(loadImage('textures/spray.jpg'));
  textureImages.push(loadImage('textures/crayon.jpg'));
  textureImages.push(loadImage('textures/gray.jpg'));
}

function setup() {
  createCanvas(window.innerWidth, window.innerWidth / ratio);
  globeScale = min(width, height);
  
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
  overlayImage = random(zoom2xImages); // Load a random overlay image at start
  currentTexture = random(textureImages);

  slider = createSlider(0,1,0.1,0.01);
  slider.position(100, 10);
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
      stroke(col1);
      ellipse(x, y, circleSize, circleSize);
      stroke(col2);
      ellipse(x, y, circleSize / 2, circleSize / 2);
      stroke(col3);
      ellipse(x, y, circleSize + 20, circleSize + 20);
    }
  }
  
  // Draw the current image
  image(currentImage, width / 2 - currentImage.width / 2, height / 2 - currentImage.height / 2);
  
 blendMode(OVERLAY);
 tint(255, 70);
 if (overlayImage) {
  image(overlayImage, width / 2 - overlayImage.width / 2, height / 2 - overlayImage.height / 2);
}

blendMode(SUBTRACT);
tint(255, 255,255, 50);
if (currentTexture) {
  image(currentTexture, width / 2 - currentTexture.width / 2, height / 2 - currentTexture.height / 2);
}
noTint();
blendMode(BLEND);

  // Check for beat detection
  if (vol > beatThreshold && millis() - lastBeatTime > 285) { // 300ms gap for beat detection
    console.log('Beat detected');
    lastBeatTime = millis(); 
    currentImage = random(images); // Load a new random image on beat
    overlayImage = random(zoom2xImages); // Change the overlay image
    currentTexture = random(textureImages);
  }
}

function mousePressed() {
  col1 = color(random(255), 100, 0);
  col2 = color(100, random(255), 0);
  col3 = color(100, 0, random(255));
}