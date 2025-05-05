// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';

export default function DashboardScreen() {
  // State for current readings
  const [currentTemp, setCurrentTemp] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [ledStatus, setLedStatus] = useState(false);

  useEffect(() => {
    // Check if database is available
    console.log("fetching")
  if (!database) {
    console.log("Database not initialized");
    return;
  } 
    // Listen for latest readings
    const latestRef = ref(database, '/latest_reading');
    onValue(latestRef, (snapshot) => {
      const data = snapshot.val();
      console.log("dd")
      if (data) {
        console.log(data)

        setCurrentTemp(data.temperature);
        setCurrentHumidity(data.humidity);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    });
    
    // Listen for LED status
    const ledRef = ref(database, '/controls/led');
    onValue(ledRef, (snapshot) => {
       
      const status = snapshot.val();
      if (status !== null) {
        setLedStatus(status);
      }
    });

   
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>DHT11 Sensor Monitor</Text>
      
      <View style={styles.currentReadings}>
        <View style={styles.readingCard}>
          <MaterialCommunityIcons name="thermometer" size={40} color="#FF5733" />
          <Text style={styles.readingValue}>{currentTemp}°C</Text>
          <Text style={styles.readingLabel}>Temperature</Text>
        </View>
        
        <View style={styles.readingCard}>
          <MaterialCommunityIcons name="water-percent" size={40} color="#3498DB" />
          <Text style={styles.readingValue}>{currentHumidity}%</Text>
          <Text style={styles.readingLabel}>Humidity</Text>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusCard}>
          <MaterialCommunityIcons 
            name={ledStatus ? "lightbulb-on" : "lightbulb-outline"} 
            size={40} 
            color={ledStatus ? "#FFD700" : "#888888"} 
          />
          <Text style={styles.statusLabel}>LED Status: {ledStatus ? "ON" : "OFF"}</Text>
        </View>
      </View>
      
      <Text style={styles.timestamp}>Last updated: {lastUpdated}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 16,
    color: '#333333',
  },
  currentReadings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  readingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '45%',
  },
  readingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  readingLabel: {
    fontSize: 16,
    color: '#666666',
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333333',
  },
  timestamp: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 16,
  },
});