import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StudyTimerInterface from '../components/StudyTimerInterface';

export default function Studying() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Focus Mode 🎯</Text>
      <StudyTimerInterface />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF8EE',
    paddingTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#E67E22',
    marginBottom: 20,
  },
});
