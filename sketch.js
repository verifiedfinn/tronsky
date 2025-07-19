const cloudPixelScale = 6;
const cloudCutOff = 0.5;

const panSpeed = 8;
const cloudEvolutionSpeed = 4;

const customChars = '01'; // Pure binary

const tronColor = [0, 190, 255];

let bgBuffer;
let skyTop, skyBottom;
let alphaFade = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  noStroke();

  skyTop = color(0, 0, 10);     // TRON black-blue
  skyBottom = color(10, 30, 50); // Electric dusk

  drawGradientToBuffer();
}

function draw() {
  image(bgBuffer, 0, 0, width, height); // Sky

  let t = millis() / 100000;
  let noiseScale = 0.01;

  textSize(cloudPixelScale * 1.15);

  for (let x = 0; x <= width; x += cloudPixelScale) {
    for (let y = 0; y <= height; y += cloudPixelScale) {
      let n = noise(
        x * noiseScale + t * panSpeed,
        y * noiseScale + t * 0.25 * panSpeed,
        t * cloudEvolutionSpeed
      );

      if (n < cloudCutOff) continue;

      let alpha = map(n, cloudCutOff, 0.65, 10, 255);
      fill(tronColor[0], tronColor[1], tronColor[2], alpha);
      text(getChar(x, y), x, y);
    }
  }

  // Fade from black faster (clean, no white flash)
  if (alphaFade < 255) {
    let overlayAlpha = 255 - alphaFade;
    fill(0, overlayAlpha);
    rect(0, 0, width, height);
    alphaFade += 5; // Faster fade
  }
}

function getChar(x, y) {
  let hash = (x + y) * sin(x * y);
  let index = abs(int(hash * 1000)) % customChars.length;
  return customChars.charAt(index);
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
}
