import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/style';
import { useNavigation } from '@react-navigation/native';

/*
  20% framework
  90% manual
*/

// purpose: button that redirects to a different page
// parameters: 
//    text: text on the button
//    submit: function that is called when clicked
// example: <SubmitButton text="Save" submit={submitForm} />
export const SubmitButton = ({text, submit}) => {
    return(
        <TouchableOpacity onPress={submit}>
            <Text style={styles.submitButton}>{text}</Text>
        </TouchableOpacity>
    );
}