// screens/ControlScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ref, onValue, off, set } from 'firebase/database';
import { database } from '../firebase';

export default function ControlScreen() {
  const [ledStatus, setLedStatus] = useState(false);

  useEffect(() => {
    // Listen for LED status
    const ledRef = ref(database, '/controls/led');
    onValue(ledRef, (snapshot) => {
      const status = snapshot.val();
      if (status !== null) {
        setLedStatus(status);
      }
    });

    // Cleanup listener
    return () => {
      off(ledRef);
    };
  }, []);

  const toggleLed = () => {
    const newStatus = !ledStatus;
    console.log(newStatus)
    set(ref(database, '/controls/led'), newStatus)
      .then(() => {
        console.log('LED status updated to:', newStatus);
      })
      .catch((error) => {
        console.error('Error updating LED status:', error);
        Alert.alert('Error', 'Failed to change LED status. Please try again.');
        // Revert the local state if Firebase update fails
        setLedStatus(!newStatus);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Device Control</Text>
      
      <View style={styles.controlCard}>
        <View style={styles.controlRow}>
          <MaterialCommunityIcons 
            name={ledStatus ? "lightbulb-on" : "lightbulb-outline"} 
            size={60} 
            color={ledStatus ? "#FFD700" : "#888888"} 
          />
          <View style={styles.controlInfo}>
            <Text style={styles.controlLabel}>LED Control</Text>
            <Text style={styles.controlStatus}>Status: {ledStatus ? "ON" : "OFF"}</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={ledStatus ? "#3498DB" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleLed}
            value={ledStatus}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          { backgroundColor: ledStatus ? "#e74c3c" : "#2ecc71" }
        ]}
        onPress={toggleLed}
      >
        <Text style={styles.buttonText}>
          {ledStatus ? "Turn OFF" : "Turn ON"}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          This control allows you to toggle the LED connected to your ESP32 device.
          When you press the button or use the switch, a command is sent to Firebase,
          which your ESP32 reads and responds to by changing the LED state.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333333',
  },
  controlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlInfo: {
    flex: 1,
    marginLeft: 16,
  },
  controlLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  controlStatus: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});