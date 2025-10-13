import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationButton } from '../components/NavigationButton';
import { Background } from '../components/Background';
import { CustomCheckbox } from '../components/Checkbox';
import { useState } from 'react';

/*
  50% framework
  50% manual
*/

// this page is not finished

// Settings page - used to change font, style, and other important settings
// Implimented settings: none
export default function Settings({ navigation }) {
  return (
    <Background>
      <View style={styles.card}>
        <Text h1 style={styles.cardH1}>Settings</Text>
        <CustomCheckbox text="Sound On" />
        <NavigationButton text="Return Home" link="Home" />
      </View>
    </Background>
  );
}