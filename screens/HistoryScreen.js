// screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ref, onValue, off, query, limitToLast, orderByKey } from 'firebase/database';
import { database } from '../firebase';

export default function HistoryScreen() {
  const [tempHistory, setTempHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    // Get historical data (last 10 readings)
    const historyRef = query(ref(database, '/sensor_data'), orderByKey(), limitToLast(10));
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const times = [];
        const temps = [];
        const humidities = [];
        
        Object.entries(data).forEach(([key, value]) => {
          const date = new Date(parseInt(key) * 1000);
          times.push(`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`);
          temps.push(value.temperature);
          humidities.push(value.humidity);
        });
        
        setTimeLabels(times);
        setTempHistory(temps);
        setHumidityHistory(humidities);
      }
    });

    // Cleanup listener
    return () => {
      off(historyRef);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Sensor History</Text>
      
      <Text style={styles.chartTitle}>Temperature History</Text>
      {tempHistory.length > 0 ? (
        <LineChart
          data={{
            labels: timeLabels,
            datasets: [{ data: tempHistory }]
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
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
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No temperature data available</Text>
        </View>
      )}
      
      <Text style={styles.chartTitle}>Humidity History</Text>
      {humidityHistory.length > 0 ? (
        <LineChart
          data={{
            labels: timeLabels,
            datasets: [{ data: humidityHistory }]
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
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
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No humidity data available</Text>
        </View>
      )}
      
      {timeLabels.length > 0 && (
        <View style={styles.dataTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Time</Text>
            <Text style={styles.tableHeaderCell}>Temperature (°C)</Text>
            <Text style={styles.tableHeaderCell}>Humidity (%)</Text>
          </View>
          {timeLabels.map((time, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{time}</Text>
              <Text style={styles.tableCell}>{tempHistory[index]}</Text>
              <Text style={styles.tableCell}>{humidityHistory[index]}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
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
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
  },
  dataTable: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginVertical: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
});