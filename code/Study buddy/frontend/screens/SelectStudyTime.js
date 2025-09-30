import { Button, View } from 'react-native';

export default function SelectStudyTime({ navigation }) {
  return (
    <View>
      <Button title="15 Minutes" onPress={() => navigation.navigate('Studying', {minutes: "10"})} as="a" />
      <Button title="30 Minutes" onPress={() => navigation.navigate('Studying', {minutes: "30"})} as="a" />
      <Button title="60 Minutes" onPress={() => navigation.navigate('Studying', {minutes: "60"})} as="a" />
      <Button title="Return Home" onPress={() => navigation.navigate('Home')} as="a" />
      <Button title="Test" onPress={() => navigation.navigate('Studying', {minutes: "0.2"})} as="a" />
    </View>
  );
}