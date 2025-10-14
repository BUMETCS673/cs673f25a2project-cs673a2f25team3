import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { Checkbox } from 'react-native-paper';
import { useState } from 'react';

/*
  30% framework
  70% manual
*/

// purpose: checkbox with custom styling that meets accessibility guidelines
// parameters: 
//    text: text next to the checkbox
// example: <CustomCheckbox text="Sound On" />
export const CustomCheckbox = (props) => {
    const [isChecked, setChecked] = useState(false);
    
    return(
        <View style={styles.checkboxOutline}>
            <Checkbox.Item 
                style={styles.checkbox} 
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                    setChecked(!isChecked);
                }}
                color='white'
                uncheckedColor='white'

                label={props.text}
                labelStyle={styles.checkboxText}
                position='leading'
            />
        </View>
    );
    
}

