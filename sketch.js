// Serial variables
let mSerial;
let connectButton;
let readyToReceive = false;

// Project variables
let rectLength = 20; 
let canvasRotation = 0; 
let lastButtonState = 0;  

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  trim(line);
  if (!line) return;

  // Log the raw data to the console for debugging
  console.log("Raw data received:", line);

  // Split the line by comma (potentiometer value, button state)
  //ChatGPT helped me debug the JSON stuff
  let data = line.split(",");
  if (data.length === 2) {
    let potentiometerValue = int(data[0]);  // Potentiometer value
    let buttonState = int(data[1]);  // Button state 

    // Use potentiometer value to control the rectangle length (map to 10-50)
    rectLength = map(potentiometerValue, 0, 4095, 10, 50);

    // Check if the button was pressed (only when it changes from released to pressed)
    if (buttonState === 1 && lastButtonState === 0) {
      canvasRotation += 90;  // Rotate canvas by 90 degrees
      if (canvasRotation >= 360) {
        canvasRotation = 0;  // Reset to 0 degrees after a full rotation
      }
    }

    lastButtonState = buttonState;
    readyToReceive = true;
  }
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    readyToReceive = true;
    connectButton.hide();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(5);  // Set frame rate to 5 FPS or it looks very bad 

  mSerial = createSerial();
  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);  // (0, 0) at center
  rotate(radians(canvasRotation));  // Rotate canvas

  // Draw the grid of rectangles
  for (let y = -height / 2; y < height / 2; y += rectLength * 1.5) {
    for (let x = -width / 2; x < width / 2; x += rectLength * 1.5) {
      let rx = random(5, 15);  // Randomize X position
      let ry = random(5, 15);  // Randomize Y position

      push();
      translate(x, y);
      rect(rx, ry, 1, rectLength);  // Draw rectangle with dynamic length
      pop();
    }
  }

  if (mSerial.opened() && readyToReceive) {
    readyToReceive = false;
    mSerial.clear();
    mSerial.write(0xab); 
  }

  if (mSerial.availableBytes() > 8) {
    receiveSerial();
  }
}
