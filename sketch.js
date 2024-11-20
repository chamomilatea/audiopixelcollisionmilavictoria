let mic; // to get audio input from mic
let spacing = 100;
let circleSize;
let colors = []; // Array to hold the range of colors
let currentColorIndex = 0; // letiable to keep track of the current color index
let images = []; // Array to hold images
let charactertwoImages = []; // Array to hold character two images
let zoom2xImages = []; // Array to hold zoom2x images
let c2OverlayImages = [];
let currentImage; // To hold the current image
let overlayImage; // To hold the overlay image
let c2Overlay;
let textureImages = [];
let currentTexture;
let lastBeatTime = 0;
let beatThreshold = 0.05; // Adjust this threshold for beat detection
let slider;
let ratioNum = 1.6;
let globeScale;
let colorChangeInterval = 2000; // 2 seconds
let lastColorChangeTime = 0;

function preload() {
  // character one from images folder
  images.push(loadImage('images/1.png'));
  images.push(loadImage('images/2.png'));
  // images.push(loadImage('images/3.png'));
  images.push(loadImage('images/4.png'));
  // images.push(loadImage('images/5.png'));
  images.push(loadImage('images/6.png'));
  // images.push(loadImage('images/7.png'));
  images.push(loadImage('images/8.png'));
  images.push(loadImage('images/green3.png'));
  images.push(loadImage('images/green5.png'));
  images.push(loadImage('images/green7.png'));
  // images.push(loadImage('images/green8.png'));

  // character two from charactertwo folder
  charactertwoImages.push(loadImage('charactertwo/outlinepartygirlone.png'));
  charactertwoImages.push(loadImage('charactertwo/outlinepartygirltwo.png'));
  charactertwoImages.push(loadImage('charactertwo/outlinepartygirlthree.png'));
  charactertwoImages.push(loadImage('charactertwo/outlinepartygirlfour.png'));
  charactertwoImages.push(loadImage('charactertwo/outlinepartygirlfive.png'));

  zoom2xImages.push(loadImage('zoom2x/z2_2.png'));
  zoom2xImages.push(loadImage('zoom2x/z2_4.png'));
  zoom2xImages.push(loadImage('zoom2x/z2_6.png'));
  zoom2xImages.push(loadImage('zoom2x/z2_8.png'));

  c2OverlayImages.push(loadImage('charTwoOverlay/c2_1.png'));
  c2OverlayImages.push(loadImage('charTwoOverlay/c2_2.png'));
  c2OverlayImages.push(loadImage('charTwoOverlay/c2_3.png'));
  c2OverlayImages.push(loadImage('charTwoOverlay/c2_4.png'));
  c2OverlayImages.push(loadImage('charTwoOverlay/c2_5.png'));

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
  createCanvas(window.innerWidth, window.innerWidth / ratioNum);
  globeScale = min(width, height);
  imageMode(CENTER);
  
  mic = new p5.AudioIn();
  getAudioContext().suspend();
  
  // Create a button to start the audio context
  let startButton = createButton('Start Audio');
  startButton.position(10, 10);
  startButton.mousePressed(startAudio);
  
  // Apply inline styles to the button for tint and opacity
  startButton.style('background-color', 'rgba(0, 17, 255, 0.3)'); // Blue tint with 30% opacity
  startButton.style('color', 'white'); // Set text color to white
  startButton.style('border', 'none'); // Remove border
  startButton.style('padding', '10px 20px'); // Add padding
  startButton.style('border-radius', '5px'); // Add border radius for rounded corners

  // Define a range of colors
  colors = [
    color(250, 90, 131), // rosy pinky
    color(250, 86, 67), // salmon
    color(250, 90, 227), // bubblegum pink
    color(67, 137, 250), // sky blue
    color(68, 79, 250), // periwinkle
    color(67, 189, 250), // light blue
    color(178, 67, 250), //bright purple
    color(250, 67, 163), // hot pink
    color(118, 67, 250) // lavendar purple
  ];
  
  currentImage = random(images); // Load a random image at start
  overlayImage = random(zoom2xImages); // Load a random overlay image at start
  c2Overlay = random(c2OverlayImages);
  currentTexture = random(textureImages);
  currentCharacterTwoImage = random(charactertwoImages); // Load a random charactertwo image at start

  // Create a sensitivity slider
  slider = createSlider(0, 0.1, beatThreshold, 0.001); 
  slider.position(120, 15);
  
  slider.addClass('slider');
}

function startAudio() {
  mic.start();
  getAudioContext().resume();
}

function draw() {
  background(0, 30);
  
  // Audio level from mic
  let vol = mic.getLevel();
  let beatThreshold = slider.value(); // Get the sensitivity value from the slider
  //vol *= sensitivity; // Adjust the volume based on the sensitivity
  
  circleSize = map(vol, 0, 1, 25, 200);
  
  // Change color every 2 seconds
  if (millis() - lastColorChangeTime > colorChangeInterval) {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    lastColorChangeTime = millis();
  }
  
  noFill(); 
  for (let x = 0; x <= width; x += spacing) {
    for (let y = 0; y <= height + circleSize / 2; y += spacing) {
      ratio2 = map(y, 0, height, 0, 1);
      let gradientColor = lerpColor(colors[currentColorIndex], colors[(currentColorIndex + 1) % colors.length], ratio2);
      stroke(gradientColor);
      ellipse(x, y, circleSize, circleSize);
      gradientColor = lerpColor(colors[(currentColorIndex + 1) % colors.length], colors[(currentColorIndex + 2) % colors.length], ratio2);
      stroke(gradientColor);
      ellipse(x, y, circleSize / 2, circleSize / 2);
      gradientColor = lerpColor(colors[(currentColorIndex + 2) % colors.length], colors[(currentColorIndex + 3) % colors.length], ratio2);
      stroke(gradientColor);
      ellipse(x, y, circleSize + 20, circleSize + 20);
    }
  }
  
   // Draw the current charactertwo image on top with increased size
   let charactertwoX = width*0.35; // Example x-coordinate
   let charactertwoY = height/2; // Example y-coordinate
   let charactertwoWidth = globeScale; // Increase width by 55%
   let charactertwoHeight = globeScale; // Increase height by 55%
   tint(230, 20, 150); // Set opacity to 50% (128 out of 255)
   image(currentCharacterTwoImage, charactertwoX, charactertwoY, charactertwoWidth, charactertwoHeight);
   noTint(); // Reset tint
   
  // Draw the current image
  let currentImageWidth = globeScale;
  let currentImageHeight = globeScale;
  let currentImageX = width*0.65;
  let currentImageY = height/2;
  image(currentImage, currentImageX, currentImageY, currentImageWidth, currentImageHeight);
  
  blendMode(OVERLAY);
  tint(255, 70);
  if (overlayImage) {
    image(overlayImage, currentImageX, currentImageY, currentImageWidth, currentImageHeight);
  }

  blendMode(OVERLAY);
  
  noTint(); // Reset tint
  //tint(255, 70);
  if (c2Overlay) {
  tint(3, 230, 250, 50); 
  image(c2Overlay, charactertwoX, charactertwoY, charactertwoWidth, charactertwoHeight);
    //image(c2Overlay, width / 2 - c2Overlay.width / 2, height / 2 - c2Overlay.height / 2);
  }
  noTint();

  //blendMode(SUBTRACT); //CAN'T USE THIS
  tint(255, 255, 255, 50);
  if (currentTexture) {
    image(currentTexture, width/2, height/2, width, height);
  }
  noTint();
  blendMode(BLEND);

  console.log(beatThreshold);
  //console.log(vol);

  // Check for beat detection
  if (vol > beatThreshold && millis() - lastBeatTime > 285) { // 300ms gap for beat detection
    console.log('Beat detected');
    lastBeatTime = millis(); 
    currentImage = random(images); // Load a new random image on beat
    overlayImage = random(zoom2xImages); // Change the overlay image
    c2Overlay = random(c2OverlayImages);
    currentTexture = random(textureImages);
    currentCharacterTwoImage = random(charactertwoImages); // Change the charactertwo image
  }
}