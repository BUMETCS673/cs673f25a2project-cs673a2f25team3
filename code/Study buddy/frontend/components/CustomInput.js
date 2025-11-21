import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { TextInput } from 'react-native-paper';

/*
  30% framework
  70% manual
*/

// purpose: input with custom styling that meets accessibility guidelines
// parameters: 
//    text: text next to the checkbox
// example: <CustomCheckbox text="Sound On" />
export const CustomInput = ({text, value, setValue, inputMode}) => {
  return(
    <View style={styles.inputOutline}>
      <Text style={styles.inputText}>{text}: </Text>
      <TextInput style={styles.inputBox} value={value} underlineColor="transparent" inputMode={inputMode} onChangeText={setValue}/>
    </View>
  );
}

