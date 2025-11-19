/*
  30% AI
  70% Human
*/

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { HomeBuddy } from '../components/buddies/buddy';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Home } from 'lucide-react-native';
import AppIcon from '../components/icons/AppIcon';
import { iconWrapper } from '../styles/iconStyles';

/*
  40% framework
  60% manual
*/

// Home page - this is the general page for navigation and the first page the user sees (after logging in)
export default function HomeScreen() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    logout(); // clear login state
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const navItems = [
    { text: 'Start Studying!', link: 'Studying' },
    { text: 'Game Menu', link: 'GameMenu' },
    { text: 'Statistics', link: 'Statistics' },
    { text: 'Settings', link: 'Settings' },
  ];

  return (
    <Background>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>

          <View style={iconWrapper}>
            <AppIcon />
          </View>

          <Text style={styles.headerTitle}>Home</Text>
          <Text style={styles.motto}>
            A balanced mind learns more efficiently
          </Text>
        </View>

        {/* Buddy */}
        <View style={{ alignItems: 'center', marginBottom: 15 }}>
          <HomeBuddy />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonGroup}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.text}
              style={styles.mainButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.link)}
            >
              <Text style={styles.buttonText}>{item.text}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.mainButton, styles.logoutButton]}
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  iconWrapper: {
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#F5C16C',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E67E22',
  },
  motto: {
    fontSize: 13,
    color: '#A0601A',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  buttonGroup: {
    marginTop: 10,
  },
  mainButton: {
    backgroundColor: '#E67E22',
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#E67E22',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#C0392B',
  },
});
