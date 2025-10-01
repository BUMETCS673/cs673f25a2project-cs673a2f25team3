import { styles } from '../styles/style';
import { LinearGradient } from 'expo-linear-gradient';

// purpose: a standardized background for every page
// parameters: 
//    children: put all components inside the background component
// example: 
//  <Background>
//    <Text>Hello</Text>
//  </Background>
export const Background = ({ children }) => (
  <LinearGradient style={styles.background} colors={['#d041a0', '#d3b3d1']} start={{x:0.1, y:0}} end={{x:0.9, y:0}}>
    {children}
  </LinearGradient>
);