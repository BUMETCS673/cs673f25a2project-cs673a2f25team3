import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/style';
import { Background } from '../components/Background';

export default function Login({ navigation }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ⚠️ If testing on Expo Go on a phone, replace localhost with your local IP
  const API_BASE_URL = 'http://172.17.208.1:3000/api/users'; // change it to your IPv4 address

  // check if its logged in
  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) setLoggedInUser(JSON.parse(user));
    };
    checkUser();
  }, []);

  const handleAuth = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        mode === 'login'
          ? `${API_BASE_URL}/login`
          : `${API_BASE_URL}/register`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      if (mode === 'register') {
        Alert.alert(
          '✅ Success',
          'Registration successful! Please log in.',
          [{ text: 'OK', onPress: () => setMode('login') }]
        );
      } else {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setLoggedInUser(data.user);

        Alert.alert(
          'Success',
          'Login successful!',
          [{ text: 'OK', onPress: () => navigation.navigate('Home', { user: data.user }) }]
        );
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setLoggedInUser(null);
    setMode('login');
    setUsername('');
    setPassword('');
    Alert.alert('Logged out', 'You have been logged out.');
  };

  // if loggin, show log out button
  if (loggedInUser) {
    return (
      <Background>
        <View style={[styles.card, { gap: 15 }]}>
          <Text style={styles.cardH1}>Welcome, {loggedInUser.username}</Text>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <View style={[styles.card, { gap: 15 }]}>
        <Text style={styles.cardH1}>
          {mode === 'login' ? 'Login' : 'Register'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {mode === 'login' ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          <Text style={{ color: '#007AFF', marginTop: 10 }}>
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}
