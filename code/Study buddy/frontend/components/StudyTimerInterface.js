import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

export default function StudyTimerInterface() {
  const [phase, setPhase] = useState('select');
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  useEffect(() => {
    let interval = null;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setPhase('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  const handleStartTimer = (minutes) => {
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setPhase('countdown');
    setIsRunning(true);
  };

  const handleCustomStart = () => {
    const minutes = parseInt(customMinutes);
    if (minutes > 0 && minutes <= 180) {
      handleStartTimer(minutes);
    }
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('select');
    setRemainingSeconds(0);
    setSelectedMinutes(0);
    setCustomMinutes('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  if (phase === 'select') {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Set Study Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter minutes (1–180)"
          keyboardType="numeric"
          value={customMinutes}
          onChangeText={setCustomMinutes}
        />
        <TouchableOpacity
          onPress={handleCustomStart}
          disabled={
            !customMinutes ||
            parseInt(customMinutes) <= 0 ||
            parseInt(customMinutes) > 180
          }
          style={[
            styles.button,
            (!customMinutes ||
              parseInt(customMinutes) <= 0 ||
              parseInt(customMinutes) > 180) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Start Study Session</Text>
        </TouchableOpacity>
        <Text style={styles.tip}>💡 Recommended: 25–60 minutes</Text>
        <Text style={styles.tip}>Max: 180 minutes</Text>
      </View>
    );
  }

  if (phase === 'countdown') {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Focus Time</Text>
        <Text style={styles.timer}>{formatTime(remainingSeconds)}</Text>
        <Text style={styles.tip}>
          {Math.ceil(remainingSeconds / 60)} minutes remaining
        </Text>

        <TouchableOpacity onPress={handlePauseResume} style={styles.button}>
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReset} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'complete') {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>🎉 Session Complete!</Text>
        <Text style={styles.tip}>You studied for {selectedMinutes} minutes!</Text>

        <TouchableOpacity onPress={handleReset} style={styles.button}>
          <Text style={styles.buttonText}>Start Another Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E67E22',
    marginBottom: 16,
  },
  input: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#F4A261',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  timer: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#E67E22',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#E67E22',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#E67E22',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#E67E22',
    fontSize: 16,
    fontWeight: '500',
  },
  tip: {
    color: '#7A7A7A',
    fontSize: 14,
    marginTop: 5,
  },
});
