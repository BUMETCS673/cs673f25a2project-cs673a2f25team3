import { Button, View } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View>
      <Button title="Start Studying" onPress={() => navigation.navigate('SelectStudyTime')} as="a" />
      <Button title="Game Menu" onPress={() => navigation.navigate('GameMenu')} as="a" />
      <Button title="Statistics" onPress={() => navigation.navigate('Statistics')} as="a" />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} as="a" />
      <Button title="Logout" onPress={() => navigation.navigate('Login')} as="a" />
    </View>
  );
}