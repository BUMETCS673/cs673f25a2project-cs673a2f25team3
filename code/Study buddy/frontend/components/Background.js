import { View } from 'react-native';
import { styles } from '../styles/style';

export function Background({ children }) {
  return (
    <View style={styles.background}>
      {children}
    </View>
  );
}
