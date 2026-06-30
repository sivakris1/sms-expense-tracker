import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Dashboard from './src/screens/Dashboard';

function App() {
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
    backgroundColor: '#0F0F12', // Matches dashboard background
  },
});

export default App;
