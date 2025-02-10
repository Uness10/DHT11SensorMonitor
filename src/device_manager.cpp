#include "device_manager.h"

void setupDeviceManager() {
    pinMode(2, OUTPUT);  // Set up GPIO2 (built-in LED on ESP8266)
}

void blinkLED() {
    digitalWrite(2, !digitalRead(2));  // Toggle the LED on GPIO2
}
