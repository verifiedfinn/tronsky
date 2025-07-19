const cloudPixelScale = 8;
const cloudCutOff = 0.5;

const panSpeed = 8;
const cloudEvolutionSpeed = 4;

const customChars = '01'; // Pure binary
const tronColor = [0, 190, 255];

let bgBuffer;
let skyTop, skyBottom;
let alphaFade = 0;

let charGrid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  noStroke();
  textFont('Courier New'); // More binary-looking

  skyTop = color(0, 0, 10);
  skyBottom = color(10, 30, 50);

  drawGradientToBuffer();
  generateCharGrid();
}

function draw() {
  image(bgBuffer, 0, 0, width, height);

  let t = millis() / 100000;
  let noiseScale = 0.01;

  textSize(cloudPixelScale * 1.15);

  // Glow
  drawingContext.shadowBlur = 4;
  drawingContext.shadowColor = color(tronColor[0], tronColor[1], tronColor[2]);

  for (let x = 0, xIdx = 0; x <= width; x += cloudPixelScale, xIdx++) {
    for (let y = 0, yIdx = 0; y <= height; y += cloudPixelScale, yIdx++) {
      let n = noise(
        x * noiseScale + t * panSpeed,
        y * noiseScale + t * 0.25 * panSpeed,
        t * cloudEvolutionSpeed
      );

      if (n < cloudCutOff) continue;

      let alpha = map(n, cloudCutOff, 0.65, 10, 255);
      fill(tronColor[0], tronColor[1], tronColor[2], alpha);
      text(charGrid[xIdx][yIdx], x, y);
    }
  }

  drawingContext.shadowBlur = 0; // Reset

  // Fade from black
  if (alphaFade < 255) {
    fill(0, 255 - alphaFade);
    rect(0, 0, width, height);
    alphaFade += 10;
  }
}

function generateCharGrid() {
  charGrid = [];
  for (let x = 0; x <= width; x += cloudPixelScale) {
    let row = [];
    for (let y = 0; y <= height; y += cloudPixelScale) {
      let hash = (x + y) * sin(x * y);
      let index = abs(int(hash * 1000)) % customChars.length;
      row.push(customChars.charAt(index));
    }
    charGrid.push(row);
  }
}

function drawGradientToBuffer() {
  bgBuffer = createGraphics(windowWidth, windowHeight);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(skyTop, skyBottom, inter);
    bgBuffer.stroke(c);
    bgBuffer.line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawGradientToBuffer();
  generateCharGrid(); // Recreate cached chars
}

