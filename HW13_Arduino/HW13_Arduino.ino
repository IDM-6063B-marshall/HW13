const int buttonPin = 2;  
unsigned long lastDebounceTime = 0; 
unsigned long debounceDelay = 200; 
int buttonState = 0; 
int lastButtonState = 0; 

void setup() {
  Serial.begin(9600);  
  pinMode(A0, INPUT);  
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int potentValue = analogRead(A0);  // Read potentiometer value
  int currentButtonState = digitalRead(buttonPin);  // Read button state
  
  // Check if button state has changed (debounce)
  if (currentButtonState != lastButtonState) {
    lastDebounceTime = millis();  // Reset debounce timer
  }

  // Only process the button press if debounce delay has passed
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (currentButtonState == HIGH && lastButtonState == LOW) { 
    }
  }

  // Send data as plain text (potentiometer_value,button_state)
  //ChatGPT helped me debug the JSON stuff
  String dataToSend = String(potentValue) + "," + String(currentButtonState == LOW ? 1 : 0); 
  Serial.println(dataToSend);

  lastButtonState = currentButtonState;  

  delay(100); 
}
