/*
  30% AI
  70% Human
*/

import { View, Text, Alert } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { HomeBuddy } from '../components/buddies/buddy';
import { useContext, useCallback } from 'react';
import { AuthContext } from '../AuthContext'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DecrementStatusButton } from '../components/testButtons/DecrementStatusButton';
import { IncrementStatusButton } from '../components/testButtons/IncrementStatusButton';
import { PrintBuddyStatusButton } from '../components/testButtons/PrintBuddyStatusButton';

export default function Home() {
  const { logout, studyData, fetchStudyBuddyData } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    logout(); // clear login state
    navigation.replace('Login')
  };

  // -----------------------------------
  // Auto refresh + death detection
  // -----------------------------------
  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        // this changes the study data, which runs the callback again, causing a loop
        await fetchStudyBuddyData();

        if (studyData && studyData.status === 0) {
          Alert.alert("Your buddy died", "Try studying more to revive it! 😢");
        }
      };

      run();
    }, [studyData])
  );

  return (
    <Background>
      <View style={styles.card} testID="home-screen">
        <Text style={styles.cardH1} accessibilityRole='header'>Home</Text>
        {/* Jump straight to the timer so the refreshed StudyTimerInterface is shown immediately */}
        <HomeBuddy />

        {/* <NavigationButton text="Start Studying!" link="Studying" />
        <NavigationButton text="Game Menu" link="GameMenu" />
        <NavigationButton text="Statistics" link="Statistics" />
        <NavigationButton text="Settings" link="Settings" /> */}
        <IncrementStatusButton />
        <DecrementStatusButton />
        <PrintBuddyStatusButton />
        <NavigationButton text="Logout" onPress={handleLogout} />
      </View>
    </Background>
  );
}
