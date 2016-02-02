
int setMode(String newMode);
int  mode = 0;

int led = D2;  // You'll need to wire an LED to this one to see it blink.
int led2 = D7; // This one is the built-in tiny one to the right of the USB jack
int setMode(String newMode){
  
   mode = newMode.toInt();
   return 1;
}

void setup() {
  Spark.function("setMode",setMode);
  pinMode(led, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop() {
    
    if(mode==1){
        digitalWrite(led, HIGH);   // Turn ON the LED pins
        digitalWrite(led2, HIGH);
         
    }else{
        
        digitalWrite(led, LOW);   // Turn ON the LED pins
        digitalWrite(led2, LOW);
    }

}