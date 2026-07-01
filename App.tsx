import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, Text, ActivityIndicator } from 'react-native';
import { initDatabase } from './src/database/db';
import Dashboard from './src/screens/Dashboard';

function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        // Initialize encrypted database on boot
        await initDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database on boot:', error);
      }
    };
    setup();
  }, []);

  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F0F12" />
        <ActivityIndicator size="large" color="#FF4757" />
        <Text style={styles.loadingText}>Unlocking Vault...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F12" />
      <Dashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F12',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F0F12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '600',
  },
});

export default App;
