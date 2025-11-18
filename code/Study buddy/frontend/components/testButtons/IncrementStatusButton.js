import { TouchableOpacity, Text } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { styles } from '../../styles/style';
import { changeStatus } from '../../dataInterface/status';

/*
  100% manual
*/

export const IncrementStatusButton = () => {
  const { token } = useContext(AuthContext);
  const handlePress = async () => {
    await changeStatus(1, token);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.navigationButton}>Increment Status</Text>
    </TouchableOpacity>
  );
};