import { View } from 'react-native';
import { NavigationButton } from '../components/NavigationButton';

// this page is not finished

// Login page - this page handles login and redirects to home once logged in. If another page is visited without logging in first, it will redirect here
export default function Login({ navigation }) {
  return (
    <View>
      <NavigationButton text="Login" link="Home" />
    </View>
  );
}