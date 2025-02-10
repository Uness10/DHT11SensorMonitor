# ardOS - A Lightweight OS for Arduino Uno

## Overview
ardOS is a simple and lightweight operating system designed for the Arduino Uno. It provides a minimalistic framework to manage classic electronic components efficiently while offering basic multitasking capabilities.

## Features

### 1. Task Management
- Supports **cooperative multitasking** (round-robin scheduling).
- Simple API to **add, remove, and execute tasks**.
- Task execution based on time intervals.

### 2. Device Management
- Built-in support for common electronic components:
  - **LEDs** (on/off, blinking, PWM control)
  - **Buttons** (interrupt-based input handling)
  - **Sensors** (temperature, distance, light, etc.)
  - **Motors** (DC motors, servos)
- Unified API for easy component control.

### 3. Event Handling
- **Interrupt-based event handling** for buttons and sensors.
- Efficient **non-blocking execution** to optimize performance.

### 4. Serial Command Interface (CLI)
- Control components via the serial monitor.
- Example commands:
  - `led on` - Turns on an LED.
  - `sensor read` - Reads sensor data.
  - `motor start` - Starts a motor.

### 5. Lightweight Kernel
- Small memory footprint (optimized for ATmega328P).
- Written in **C/C++** with Arduino libraries.
- Uses a simple task scheduler to manage execution.

## Future Enhancements
- **Basic filesystem support** for SD card storage.
- **Priority-based task scheduling**.
- **More advanced device drivers**.

## Getting Started
1. Flash ardOS onto the Arduino Uno.
2. Add tasks using the provided API.
3. Interact with components via the serial interface.

---
### 🚀 Work in Progress
Stay tuned for updates and improvements!

