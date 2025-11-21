/*
  30% AI
  70% Human
*/
import { useCallback, useContext, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { HomeBuddy } from '../components/buddies/buddy';
import { AuthContext } from '../AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppIcon from '../components/icons/AppIcon';
import { iconWrapper } from '../styles/iconStyles';
import homeStyles from '../styles/homeStyles';
import { resetBuddy } from '../dataInterface/resetBuddy';

export default function Home() {
  const { logout, studyData, fetchStudyBuddyData, token } = useContext(AuthContext);
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

  const navItems = [
    { text: 'Start Studying!', link: 'Studying' },
    { text: 'Game Menu', link: 'GameMenu' },
    { text: 'Statistics', link: 'Statistics' },
    { text: 'Settings', link: 'Settings' },
  ];

  return (
    <Background align={false}>
      <View style={homeStyles.container}>
        
        {/* Header */}
        <View style={homeStyles.header}>
          <View style={iconWrapper}>
            <AppIcon />
          </View>

          <Text style={homeStyles.headerTitle}>Home</Text>
          <Text style={homeStyles.motto}>
            A balanced mind learns more efficiently
          </Text>
        </View>

        {/* Buddy */}
        <HomeBuddy />

        <NavigationButton text="Logout" onPress={handleLogout} />

      </View>
    </Background>
  );
}
