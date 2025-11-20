/*
  30% AI
  70% Human
*/

import { View, Text, Alert, Platform } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { HomeBuddy } from '../components/buddies/buddy';
import { useContext, useRef, useEffect, useCallback } from 'react';
import { AuthContext } from '../AuthContext'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DecrementStatusButton } from '../components/testButtons/DecrementStatusButton';
import { IncrementStatusButton } from '../components/testButtons/IncrementStatusButton';
import { PrintBuddyStatusButton } from '../components/testButtons/PrintBuddyStatusButton';

export default function Home() {
  const { logout, studyData, fetchStudyBuddyData } = useContext(AuthContext);
  const navigation = useNavigation();
  const prevStatusRef = useRef();

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  // -----------------------------------
  // Refresh data once when the screen is focused
  // -----------------------------------
  useFocusEffect(
    useCallback(() => {
      fetchStudyBuddyData();
    }, [])
  );

  // -----------------------------------
  // Show alert when Buddy status reaches 0 (triggered only on non-zero -> 0)
  // -----------------------------------
  useEffect(() => {
    if (!studyData) return;

    const prevStatus = prevStatusRef.current;
    const currentStatus = studyData.status;

    if (currentStatus === 0 && prevStatus !== 0) {
      const message = "Your buddy died. Try studying more to revive it! 😢";

      if (Platform.OS === 'web') {
        window.alert(message);
        resetBuddy(token);
      } else {
        Alert.alert("Your buddy died", message, [
          {text: 'Ok', onPress: async () => {await resetBuddy(token)}},
        ]);
      }
    }

    prevStatusRef.current = currentStatus;
  }, [studyData]);

  return (
    <Background>
      <View style={styles.card} testID="home-screen">
        <Text style={styles.cardH1} accessibilityRole='header'>Home</Text>
        <HomeBuddy />
        <NavigationButton text="Start Studying!" link="Studying" />
        <NavigationButton text="Game Menu" link="GameMenu" />
        <NavigationButton text="Statistics" link="Statistics" />
        <NavigationButton text="Settings" link="Settings" />
        <NavigationButton text="Logout" onPress={handleLogout} />
      </View>
    </Background>
  );
}
