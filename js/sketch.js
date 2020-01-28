// Main script to construct the noise field

// Compute maximum size -- this may come in handy for geting a good aspect ratio
// let widthRatio = width / img.width;
// let heightRatio = height / img.height;
// let ratio = min(widthRatio, heightRatio);
// "Global" variables
let X_START = 0;
const Y_START = 0;
let xoff = 0;
let yoff = 0;
let zoff = 0;
let particles = [];
let flowfield = [];
let canvas;
let imgSample;
let nrow, ncol, rectWidth, rectHeight;
let xIncrementSlider, yIncrementSlider, zIncrementSlider, particleSlider, opacitySlider, strokeWeightSlider;

// Upload photo
let img;
let imgPreview;
let previewGet;
function showImage() {
  image(img, 0, 0, width, height);
}

function imageUpload(file) {
  img = loadImage(file.data, function () {
    showImage(img);
    makeImagePreview(imgPreview, img);
    createEmptyParticles();
    hideImage();
  });
}

function hideImage() {
  background("white");
}

function makeImagePreview(containerDiv, img) {
  // Empty div, if there is already an image
  containerDiv.html("")

  // For now, make it as a p5 sketch -- a little overkill
  s = ( sketch ) => {
    sketch.setup = () => {
      sketch.createCanvas(200, 200);      
      sketch.noLoop();
      previewGet = sketch.get;
    };
    sketch.draw = () => {      
      sketch.image(img, 0, 0, 200, 200);
    }
  };
  imgSample = new p5(s, containerDiv.id());
}

// console.log(s.get)
function makeControls() {
  // Controls 
  let controlWrapper = createDiv().id("control-wrapper");
  let controlHeader = createDiv("<h2>Controls</h2>");
  controlHeader.parent(controlWrapper);

  // File input
  let fileInputWrapper = createDiv("<label id='file_label' for='file'>Upload File</label");
  let fileInput = createFileInput(imageUpload);
  fileInput.id("file"); 
  fileInput.parent(fileInputWrapper);
  fileInputWrapper.parent(controlWrapper);
  imgPreview = createDiv().id("img_preview");
  imgPreview.parent(controlWrapper);

  particleSlider = makeSlider("Number of Particles", minVal = 10, maxVal = 10000, value = 500, step = 10, parent = controlWrapper, clearContent);  
  opacitySlider = makeSlider("Opacity", minVal = 1, maxVal = 100, value = 30, step = 1, parent = controlWrapper);
  strokeWeightSlider = makeSlider("Stroke Weight", minVal = .5, maxVal = 20, value = 2, step = .5, parent = controlWrapper);
  nrowSlider = makeSlider("Vertical Anchors", minVal = 2, maxVal = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  ncolSlider = makeSlider("Horizontal Anchors", minVal = 2, maxVal = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  xIncrementSlider = makeSlider("Horizontal Smoothness", minVal = .0001, maxVal = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  yIncrementSlider = makeSlider("Vertical Smoothness", minVal = .0001, maxVal = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  zIncrementSlider = makeSlider("Fluctuations in Forces", minVal = 0, maxVal = .3, value = .01, step = .0001, parent = controlWrapper, clearContent);
  speedSlider = makeSlider("Maximum Particle Velocity", minVal = 1, maxVal = 5, value = 1, step = 1, parent = controlWrapper);

  // Buttons
  makeButton("Pause", controlWrapper, noLoop);
  makeButton("Resume", controlWrapper, loop);
  makeButton("Clear", controlWrapper, clearContent);
  makeButton("Download", controlWrapper, () => download());
  makeButton("About", controlWrapper, () => {}, "modal");
  makeButton("GitHub", controlWrapper, () => {
    window.open("https://github.com/mkfreemaan/imageFields", "_blank");
  });
  return controlWrapper;
}

// Create particles
function createEmptyParticles() {
  particles = [];
  for (let i = 0; i < particleSlider.value(); i++) {
    particles[i] = new Particle(rectWidth, rectHeight, imgSample, () => speedSlider.value());
  }
}

// Clear content
function clearContent() {
  showImage();
  createEmptyParticles();
  hideImage();
  flowfield = [];
  xoff = X_START = random(100);
  yoff = random(100);
  zoff = random(100);
}

// Download canvas
function download() {
  noLoop(); // pause
  let link = document.createElement('a');
  link.download = 'noise_field.png';
  link.href = document.querySelector('.p5_canvas').toDataURL()
  link.click();
}

// Set up (elements only drawn once)
function setup() {
  // Get window size 
  let windowWidth = window.innerWidth - 270;
  let windowHeight = window.innerHeight - 180;

  // Container for everything
  let container = createDiv().class("container");

  // Create controls and canvas
  let controls = makeControls();
  controls.parent(container);
  let canvasContainer = createDiv();
  console.log(container)
  canvas = createCanvas(windowWidth, windowHeight, SVG).class("p5_canvas");
  canvasContainer.parent(container);
  // canvas.parent(canvasContainer);

  // Set color mode to RGB percentages  
  colorMode(RGB, 100);

  // Create set of particles
  getSize();
  // createEmptyParticles();
}

function getSize() {
  // Construct a grid of rectangles (rows/columns)
  nrow = nrowSlider.value();
  ncol = ncolSlider.value();
  rectWidth = width / ncol;
  rectHeight = height / nrow;
}

function draw() {
  getSize();
  strokeWeight(strokeWeightSlider.value());
  // Iterate through grid and set vector forces
  for (let row = 0; row < nrow; row++) {
    for (let col = 0; col < ncol; col++) {
      let angle = noise(xoff, yoff, zoff) * 4 * PI;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield.push([v.x, v.y]);
      xoff += xIncrementSlider.value();
    }
    xoff = X_START;
    yoff += yIncrementSlider.value();
  }  

  // Position particles given field of vector forces
  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  zoff += zIncrementSlider.value(); // think of this as time!
}