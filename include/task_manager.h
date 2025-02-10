#ifndef TASK_MANAGER_H
#define TASK_MANAGER_H

#include <ESP8266WiFi.h>
#define MAX_TASKS 5  // Maximum number of tasks

struct Task {
    void (*function)();  // Task function pointer
    uint16_t interval;   // Execution interval (ms)
    uint32_t lastRun;    // Timestamp of last execution
}; 

void addTask(void (*func)(), uint16_t interval);
void runTasks();

#endif
