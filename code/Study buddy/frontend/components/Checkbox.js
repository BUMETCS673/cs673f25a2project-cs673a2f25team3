import { View, Text } from 'react-native';
import { styles } from '../styles/style';
import { Checkbox } from 'react-native-paper';
import { useState } from 'react';

/*
  25% framework
  5% AI
  70% manual
*/

// purpose: checkbox with custom styling that meets accessibility guidelines
// parameters: 
//    text: text next to the checkbox
// example: <CustomCheckbox text="Sound On" />
export const CustomCheckbox = ({text, isChecked, setChecked}) => {
    return(
        <View style={styles.checkboxOutline}>
            <Checkbox.Item 
                style={styles.checkbox} 
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                    setChecked(prev => !prev);
                }}
                color='white'
                uncheckedColor='white'

                label={text}
                labelStyle={styles.checkboxText}
                position='leading'
            />
        </View>
    );
    
}

