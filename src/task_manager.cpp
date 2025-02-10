#include "task_manager.h"

Task taskList[MAX_TASKS];  // Array to store tasks
uint8_t taskCount = 0;     // Number of tasks added

// Function to add a task to the scheduler
void addTask(void (*func)(), uint16_t interval) {
    if (taskCount < MAX_TASKS) {
        taskList[taskCount] = {func, interval, 0};
        taskCount++;
    }
}

// Round-robin scheduler to run tasks
void runTasks() {
    uint32_t currentTime = millis();
    for (uint8_t i = 0; i < taskCount; i++) {
        if (currentTime - taskList[i].lastRun >= taskList[i].interval) {
            taskList[i].function();
            taskList[i].lastRun = currentTime;
        }
    }
}
