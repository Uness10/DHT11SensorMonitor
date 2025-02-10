#include <Arduino.h>
#include "task_manager.h"
#include "device_manager.h"

void setup() {
    Serial.begin(9600);  // Start serial communication for debugging

    setupDeviceManager();  // Initialize devices (LED in this case)

    // Add tasks to the task scheduler
    addTask(blinkLED, 1000);  // Blink the LED every 1000ms
}

void loop() {
    runTasks();  // Execute all scheduled tasks
}
