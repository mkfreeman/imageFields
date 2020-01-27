// Main script to construct the noise field

// Compute maximum size -- this may come in handy for geting a good aspect ratio

// "Global" variables
let X_START = 0;
const Y_START = 0;
let particles = [];
let canvas;
let imgSample;
let nrow, ncol, rectWidth, rectHeight;
let xIncrementSlider, yIncrementSlider, zIncrementSlider, particleSlider, opacitySlider, strokeWeightSlider;

// Upload photo
let img;
let imgPreview;
let previewGet;
// function showImage() {
//   image(img, 0, 0, width, height);
// }

function imageUpload(file) {
  img = loadImage(file.data, function () {
    // showImage(img);
    makeImagePreview(imgPreview, img);
    createParticles();
    // hideImage();
  });
}

// function hideImage() {
//   background("white");
// }

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

  opacitySlider = makeSlider("Opacity", minVal = 1, maxVal = 100, value = 30, step = 1, parent = controlWrapper, createParticles);
  strokeWeightSlider = makeSlider("Stroke Weight", minVal = .5, maxVal = 20, value = 2, step = .5, parent = controlWrapper, createParticles);
  nrowSlider = makeSlider("Number of Rows", minVal = 2, maxVal = 100, value = 30, step = 1, parent = controlWrapper, createParticles);
  ncolSlider = makeSlider("Number of Columns", minVal = 2, maxVal = 100, value = 30, step = 1, parent = controlWrapper, createParticles);
  xSelect = makeSelect("Horizontal Distance", [0, 1, 2, 3], 0, controlWrapper, createParticles)
  ySelect = makeSelect("Vertical Distance", [0, 1, 2, 3], 0, controlWrapper, createParticles)

  // Buttons
  makeButton("Clear", controlWrapper, clear);
  makeButton("Download", controlWrapper, () => download());
  makeButton("About", controlWrapper, () => {}, "modal");
  makeButton("GitHub", controlWrapper, () => {
    window.open("https://github.com/mkfreeman/imageFields", "_blank");
  });
  return controlWrapper;
}

// Create particles
function createParticles() {
  clear()
  strokeWeight(strokeWeightSlider.value()); 
  particles = [];
  let nrow = nrowSlider.value()
  let ncol = ncolSlider.value()
  for (let row = 0; row < nrow; row++) {
    for (let col = 0; col < ncol; col++) {
      let xpos = row / nrow * width;
      let ypos = col / ncol * height
      let cellWidth = floor(width / nrow);
      let cellHeight = floor(height / ncol);
      let p = new Particle(xpos, ypos, cellWidth, cellHeight, imgSample);
      p.show()
    }
  }
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
  canvas = createCanvas(windowWidth, windowHeight).class("p5_canvas");
  canvasContainer.parent(container);
  canvas.parent(canvasContainer);

  // Set color mode to RGB percentages  
  colorMode(RGB, 100);
}



function draw() {
  // Show the particle
  noLoop();
}