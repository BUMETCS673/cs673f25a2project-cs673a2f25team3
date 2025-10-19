import { View } from 'react-native';
import { CustomCheckbox } from '../components/Checkbox';
import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { SubmitButton } from '../components/FormSubmitButton';

/*
  25% framework
  5% AI
  70% manual
*/

// Settings page - used to change font, style, and other important settings
// Implimented settings: none
export default function SettingsForm() {
  const [goal, setGoal] = useState("30");
	const [isChecked, setChecked] = useState("true");

  const submit = () => {
    // use this function to move useState variables into backend / local storage
    var allIsValid = true;
    if (!isGoalValid(goal)) {
      console.log('Goal is not valid value');
      allIsValid = false;
    }
    if (allIsValid) {
      console.log('Form start');
			console.log('Sound is ' + (isChecked ? "on" : "off"))
			console.log('Goal is ' + goal);
			console.log('Form submitted');
    }
  };

  return (
    <>
			<CustomCheckbox text="Sound On" isChecked={isChecked} setChecked={setChecked} />
			<TextInput value={goal} inputMode='numeric' onChangeText={setGoal}/>
			<SubmitButton text="Save" submit={submit} />
    </>
  );
}

function isGoalValid(goal) {
  if (goal == "") {
    return false;
  }
  return !isNaN(goal);
}