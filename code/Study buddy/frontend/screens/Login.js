import { Button, View } from 'react-native';

// this page is not finished

export default function Login({ navigation }) {
  return (
    <View>
      <Button title="Login" onPress={() => navigation.navigate('Home')} as="a" />
    </View>
  );
}