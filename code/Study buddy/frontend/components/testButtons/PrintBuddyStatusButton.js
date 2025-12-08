import { TouchableOpacity, Text } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { styles } from '../../styles/style';
import { getStatus } from '../../dataInterface/status';

/*
  100% manual
*/

export const PrintBuddyStatusButton = () => {
  const { token } = useContext(AuthContext);
  const handlePress = async () => {
    console.log("status = " + await getStatus(token));
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.navigationButton}>Print Status</Text>
    </TouchableOpacity>
  );
};