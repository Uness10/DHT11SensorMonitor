#pragma once 

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

#define WIFI_SSID "Redmi"
#define  WIFI_PASSWORD "you123456789" 

void connect(){


  WiFi.disconnect(true, true);  
  delay(1000);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  
}
