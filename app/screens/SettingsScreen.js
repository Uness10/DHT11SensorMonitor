// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, off, set } from 'firebase/database';
import { database } from '../firebase';

export default function SettingsScreen() {
  const [autoMode, setAutoMode] = useState(false);
  const [tempThreshold, setTempThreshold] = useState('30');
  const [sampleInterval, setSampleInterval] = useState('30');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Load settings from Firebase
    const settingsRef = ref(database, '/settings');
    onValue(settingsRef, (snapshot) => {
      const settings = snapshot.val();
      if (settings) {
        setAutoMode(settings.autoMode || false);
        setTempThreshold(String(settings.tempThreshold || 30));
        setSampleInterval(String(settings.sampleInterval || 30));
      }
    });
    
    return () => {
      off(settingsRef);
    };
  }, []);
  
  const saveSettings = () => {
    // Validate inputs
    const tempValue = parseFloat(tempThreshold);
    const intervalValue = parseInt(sampleInterval);
    
    if (isNaN(tempValue) || isNaN(intervalValue)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for threshold and interval.');
      return;
    }
    
    if (intervalValue < 5) {
      Alert.alert('Invalid Interval', 'Sample interval must be at least 5 seconds.');
      return;
    }
    
    // Save to Firebase
    set(ref(database, '/settings'), {
      autoMode: autoMode,
      tempThreshold: tempValue,
      sampleInterval: intervalValue
    })
      .then(() => {
        Alert.alert('Success', 'Settings saved successfully');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error saving settings:', error);
        Alert.alert('Error', 'Failed to save settings. Please try again.');
      });
  };
  
  const toggleAutoMode = () => {
    const newMode = !autoMode;
    setAutoMode(newMode);
    
    // Save immediately when toggling auto mode
    set(ref(database, '/settings/autoMode'), newMode)
      .catch((error) => {
        console.error('Error updating auto mode:', error);
        setAutoMode(!newMode); // Revert on error
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Device Settings</Text>
      
      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Automatic LED Control</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={autoMode ? "#3498DB" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleAutoMode}
            value={autoMode}
          />
        </View>
        <Text style={styles.settingDescription}>
          When enabled, the LED will automatically turn on if temperature exceeds the threshold.
        </Text>
      </View>
      
      <View style={styles.settingCard}>
        <Text style={styles.settingGroupTitle}>Parameters</Text>
        
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Temperature Threshold (°C):</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={tempThreshold}
            onChangeText={setTempThreshold}
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Sample Interval (seconds):</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={sampleInterval}
            onChangeText={setSampleInterval}
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>
        
        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={saveSettings}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.editButton]} 
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Parameters</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About</Text>
        <Text style={styles.infoText}>
          IoT Temperature and Humidity Monitor v1.0{'\n'}
          Created with ESP32, Firebase, and Expo{'\n'}
          © 2025 All Rights Reserved
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
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  settingGroupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666666',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#eeeeee',
    color: '#888888',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#3498DB',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    flex: 1,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
    textAlign: 'center',
  },
});