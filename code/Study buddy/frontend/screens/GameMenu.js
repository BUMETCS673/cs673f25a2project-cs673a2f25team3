import { Button, View } from 'react-native';

// this page is not finished

export default function GameMenu({ navigation }) {
  return (
    <View>
      <Button title="Return Home" onPress={() => navigation.navigate('Home')} as="a" />
    </View>
  );
}