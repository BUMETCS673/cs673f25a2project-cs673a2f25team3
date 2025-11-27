import { View } from 'react-native';
import { styles } from '../styles/style';

export function Background({ children, align=true }) {
  return (
    <View style={align ? styles.background : styles.background2}>
      {children}
    </View>
  );
}
