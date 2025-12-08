import { TouchableOpacity, Text } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { styles } from '../../styles/style';
import { changeStatus } from '../../dataInterface/status';

/*
  100% manual
*/

export const IncrementStatusButton = () => {
  const { token, fetchStudyBuddyData } = useContext(AuthContext);

  const handlePress = async () => {
    try {
      await changeStatus(1, token);       
      await fetchStudyBuddyData();        
    } catch (err) {
      console.error("Failed to increment status:", err);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.navigationButton}>Increment Status</Text>
    </TouchableOpacity>
  );
};
