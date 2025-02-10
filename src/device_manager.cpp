#include "device_manager.h"

void blinkLED() {
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));  // Toggle the LED state
}

void setupDeviceManager() {
    pinMode(LED_BUILTIN, OUTPUT);  // Set up the LED pin
}
