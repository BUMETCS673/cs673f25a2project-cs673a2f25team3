/*
  30% AI
  70% Human
*/

import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext'; 
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from "@env";


/*
  40% framework
  60% manual
*/

// Home page - this is the general page for navigation and the first page the user sees (after logging in)
export default function Home() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [status, setStatus] = useState(5);
    const { token } = useContext(AuthContext);

    // React.useEffect(() => {
    //   fetch(`${API_BASE_URL}/buddy/me`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`, 
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({name: "buddy"})
    //   })
    //   .catch(err => {
    //     console.error("Failed to fetch goal", err);
    //   });
    // }, []);

    // React.useEffect(() => {
    //   fetch(`${API_BASE_URL}/buddy/status`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({status: -1}),
    //   })
    // }, []);
  
    React.useEffect(() => {
      fetch(`${API_BASE_URL}/buddy/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
      })
      .catch(err => {
        console.error("Failed to fetch goal", err);
      });
    }, []);

  const handleLogout = () => {
    logout(); // clear login state
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // back to login page and clear stack
    });
  };

  return (
    <Background>
      <View style={styles.card}>
        <Text style={styles.cardH1} accessibilityRole='header'>Home</Text>
        <Text>{status}</Text>
        {/* Jump straight to the timer so the refreshed StudyTimerInterface is shown immediately */}
        <NavigationButton text="Start Studying!" link="Studying" />
        <NavigationButton text="Game Menu" link="GameMenu" />
        <NavigationButton text="Statistics" link="Statistics" />
        <NavigationButton text="Settings" link="Settings" />
        <NavigationButton text="Logout" onPress={handleLogout} />
      </View>
    </Background>
  );
}
