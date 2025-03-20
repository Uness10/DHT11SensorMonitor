import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { database, auth, signInAnonymously } from './firebase';
import { ref, onValue, off } from 'firebase/database';

export default function App() {
  // State for current readings
  const [currentTemp, setCurrentTemp] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  
  // State for historical data
  const [tempHistory, setTempHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
   

    // Listen for latest readings
    const latestRef = ref(database, '/latest_reading');
    onValue(latestRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentTemp(data.temperature);
        setCurrentHumidity(data.humidity);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    });

    // Get historical data (last 10 readings)
    const historyRef = ref(database, '/sensor_data');
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const times = [];
        const temps = [];
        const humidities = [];
        
        // Get last 10 entries
        const entries = Object.entries(data);
        const last10 = entries.slice(Math.max(entries.length - 10, 0));
        
        last10.forEach(([key, value]) => {
          const date = new Date(parseInt(key) * 1000);
          times.push(date.getHours() + ':' + date.getMinutes());
          temps.push(value.temperature);
          humidities.push(value.humidity);
        });
        
        setTimeLabels(times);
        setTempHistory(temps);
        setHumidityHistory(humidities);
      }
    });

    // Cleanup listeners
    return () => {
      off(latestRef);
      off(historyRef);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
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
      
      <Text style={styles.timestamp}>Last updated: {lastUpdated}</Text>
      
      <Text style={styles.chartTitle}>Temperature History</Text>
      {tempHistory.length > 0 && (
        <LineChart
          data={{
            labels: timeLabels,
            datasets: [{ data: tempHistory }]
          }}
          width={Dimensions.get('window').width - 16}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#FF5733' }
          }}
          bezier
          style={styles.chart}
        />
      )}
      
      <Text style={styles.chartTitle}>Humidity History</Text>
      {humidityHistory.length > 0 && (
        <LineChart
          data={{
            labels: timeLabels,
            datasets: [{ data: humidityHistory }]
          }}
          width={Dimensions.get('window').width - 16}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#3498DB' }
          }}
          bezier
          style={styles.chart}
        />
      )}
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
  timestamp: {
    textAlign: 'center',
    color: '#666666',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});