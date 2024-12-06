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
  int potentValue = analogRead(A0); 
  int buttonState = digitalRead(buttonPin);
    if (buttonState != lastButtonState) {
    lastDebounceTime = millis();  
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (buttonState == LOW && lastButtonState == HIGH) {  // Button was pressed (LOW because it's a pull-up)
      Serial.println("BUTTON_PRESSED");  
    }
  }

  lastButtonState = buttonState;  
  
  Serial.println(potentValue);
  delay(100);  
}
