let mSerial;
let connectButton;
let readyToReceive;
let ll = 25;  // Initial line length (set to an average value)
let rotationAngle = 0;  // Start with 0 degree rotation
let rectColor;  // Variable to hold the rectangle color

function setup() {
  createCanvas(windowWidth, windowHeight);  // Create the canvas

  mSerial = createSerial();  // Initialize serial communication

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);  // Position the button in the center
  connectButton.mousePressed(connectToSerial);  // Call the connect function when clicked

  frameRate(2);  // Set frame rate to 2 frames per second (slow)
  readyToReceive = false;  // Initially, we are not ready to receive data
  rectColor = color(0, 0, 0);  // Default color (black)
}

function receiveSerial() {
  let mLine = mSerial.readUntil("\n");  // Read data until newline
  
  // Check if the received line is a button press signal
  if (mLine === "BUTTON_PRESSED") {
    rectColor = color(random(255), random(255), random(255));  // Randomize rectangle color
  } else {
    let potentValue = int(mLine);  // Convert the string to an integer (potentiometer value)
    print(mLine, potentValue);  // Debugging: print raw data and converted value
    
    // Map the potentiometer value (0-1023) to a line length range (10-50)
    ll = map(potentValue, 0, 4095, 10, 50);  
    readyToReceive = true;  // Mark serial data as ready to use
  }
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);  // Open serial connection at 9600 baud
    connectButton.hide();  // Hide the connect button
    readyToReceive = true;
  }
}

function draw() {
  background(255);  // Use a white background

  // Generate the grid of rectangles
  for (let y = -10; y < windowHeight + 100; y += 40) {
    for (let x = 0; x < windowWidth + 100; x += 40) {
      // Randomize X and Y for rectangle placement
      let rx = random(5, 15);
      let ry = random(5, 15);
      push();
      translate(x, y);
      rotate(radians(rotationAngle));  // Rotate the entire grid by the current angle
      fill(rectColor);  // Set the fill color to the randomized color
      rect(rx, ry, ll, 1);  // Horizontal line
      pop();
    }
  }

  // If serial connection is open and data is ready to be sent, request new data
  if (mSerial.opened() && readyToReceive) {
    mSerial.clear();  // Clear any old data in the serial buffer
    mSerial.write(0xAB);  // Send a byte to request data from Arduino
    readyToReceive = false;  // Reset ready-to-receive flag
  }

  // If there's data available in the serial buffer, process it
  if (mSerial.availableBytes() > 0) {
    receiveSerial();  // Process the incoming serial data
  }
}
