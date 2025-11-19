/*
  30% AI
  70% Human
*/

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { HomeBuddy } from '../components/buddies/buddy';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import AppIcon from '../components/icons/AppIcon';
import { iconWrapper } from '../styles/iconStyles';
import styles from '../styles/homeStyles';  

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
        <View style={styles.buddyWrapper}>
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
