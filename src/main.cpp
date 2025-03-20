#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <time.h>
#include "connect.h"

// Firebase credentials
#define FIREBASE_HOST "https://dhtmonitorapp-default-rtdb.europe-west1.firebasedatabase.app"
#define FIREBASE_AUTH "OnWJq5fvi2pHdW1OtXk2RSLqfo5zQbEj6Vb5jlMu"

// DHT11 sensor
#define DHTPIN 4        
#define DHTTYPE DHT11  

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// Sensor variables
float temperature;
float humidity;
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 30000; 

void setup() {
  Serial.begin(115200);
  delay(1000); 
  
  // Connect to WiFi
  connect();
  
  // Initialize Firebase
  Serial.println("Initializing Firebase...");
  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Wait for Firebase initialization (10s timeout)
  unsigned long startAttemptTime = millis();
  while (!Firebase.ready() && millis() - startAttemptTime < 10000) {
    Serial.println("Waiting for Firebase...");
    delay(500);
  }

  if (Firebase.ready()) {
    Serial.println("Firebase is ready.");
  } else {
    Serial.println("Firebase failed to initialize.");
  }

  // Initialize DHT11 sensor
  dht.begin();
}

void loop() {
  // Send data every 30 seconds
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    
    // Read temperature and humidity
    humidity = dht.readHumidity();
    temperature = dht.readTemperature();
    
    // Check if reading failed
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }
    
    // Log sensor data
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print("°C, Humidity: ");
    Serial.print(humidity);
    Serial.println("%");
    
    // Get timestamp
    unsigned long currentTime = millis() / 1000;
    
    // Create JSON data
    FirebaseJson json;
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("timestamp", currentTime);
    
    // Send to Firebase
    String path = "/sensor_data/" + String(currentTime);
    Serial.print("Sending data to Firebase: ");
    Serial.println(path);

    if (Firebase.setJSON(fbdo, path, json)) {
      Serial.println("Data sent to Firebase successfully");
    } else {
      Serial.println("Failed to send data to Firebase");
      Serial.println("Reason: " + fbdo.errorReason());
    }

    // Update latest reading
    Serial.println("Updating latest reading...");
    if (Firebase.setJSON(fbdo, "/latest_reading", json)) {
      Serial.println("Latest reading updated successfully");
    } else {
      Serial.println("Failed to update latest reading");
      Serial.println("Reason: " + fbdo.errorReason());
    }

    Serial.println("--------------------------------------");
  }
}
