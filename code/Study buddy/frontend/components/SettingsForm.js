import { SubmitButton } from '../components/FormSubmitButton';
import { CustomInput } from './CustomInput';
import { AuthContext } from "../AuthContext";
import React, { useState, useContext } from "react";
import { View, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { API_BASE_URL } from "@env";
import { NavigationButton } from './NavigationButton';
import { styles } from '../styles/style';

export const exportForTesting = {
  isGoalValid
}

/*
  25% framework
  5% AI
  70% manual
*/

export default function SettingsForm() {
  const [goalInMinutes, setGoalInMinutes] = useState(0);
  const [name, setName] = useState("Buddy");
  const [buddyType, setBuddyType] = useState("cat");
  const { token } = useContext(AuthContext);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/settings/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data => {
      setGoalInMinutes(data.goal);
    })
    .catch(err => {
      console.error("Failed to fetch settings", err);
    });
    fetch(`${API_BASE_URL}/buddy/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data => {
      setName(data.name);
      setBuddyType(data.type);
    })
    .catch(err => {
      fetch(`${API_BASE_URL}/buddy/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Buddy'
        })
      })
      .catch(err => {});
    });
  }, []);
  
  const submit = () => {
    var allIsValid = true;
    if (!isGoalValid(goalInMinutes)) {
      console.log('Goal is not valid value');
      allIsValid = false;
    }
    if (allIsValid) {
      fetch(`${API_BASE_URL}/settings/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: 'light',
          goal: goalInMinutes
        })
      })
      .catch(err => {
        console.error("Failed to change settings", err);
      });

      fetch(`${API_BASE_URL}/buddy/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          type: buddyType
        })
      })
      .catch(err => {
        console.error("Failed to update buddy", err);
      });
    }
  };

  const buddy = async () => {
    await fetch(`${API_BASE_URL}/buddy/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
  }

  return (
    <>
			<CustomInput text="Goal in minutes per week" value={goalInMinutes} setValue={setGoalInMinutes} inputMode='numeric' />
      <CustomInput text="Buddy name" value={name} setValue={setName} inputMode='text' />
      <View style={styles.inputOutline}>
        <Picker
          selectedValue={buddyType}
          onValueChange={(itemValue, itemIndex) =>
            setBuddyType(itemValue)
          }
          style={styles.inputPicker}
          >
          <Picker.Item label="Cat" value="cat" />
          <Picker.Item label="Deer" value="deer" />
        </Picker>
      </View>
			<SubmitButton text="Save" submit={submit} />
    </>
  );
}

function isGoalValid(goal) {
  if (
    goal == "" ||
    isNaN(goal) ||
    goal <= 0
  ) {
    return false;
  }
  return true;
}