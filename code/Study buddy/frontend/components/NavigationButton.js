import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/style';
import { useNavigation } from '@react-navigation/native';

// purpose: button that redirects to a different page
// parameters: 
//    text: text on the button
//    link: routing name - see App.js
//    params (optional): parameters to send with link
// example: <NavigationButton text="15 Minutes" link="Studying" params={{minutes: "10"}} />
export const NavigationButton = (props) => {
    const navigation = useNavigation();

    if (Object.hasOwn(props, 'params')) {
        return(
            <TouchableOpacity onPress={() => navigation.navigate(props.link, props.params)} as="a">
                <Text style={styles.navigationButton}>{props.text}</Text>
            </TouchableOpacity>
        );
    } else {
        return(
            <TouchableOpacity onPress={() => navigation.navigate(props.link)} as="a">
                <Text style={styles.navigationButton}>{props.text}</Text>
            </TouchableOpacity>
        );
    }
    
}