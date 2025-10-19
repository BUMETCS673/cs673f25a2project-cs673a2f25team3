import { CustomCheckbox } from '../components/Checkbox';
import { useState } from 'react';
import { SubmitButton } from '../components/FormSubmitButton';
import { NumericalInput } from './NumericalInput';
import { hoursToMs, minutesToMs } from '../util/calculateMs';

/*
  25% framework
  5% AI
  70% manual
*/

// Settings page - used to change font, style, and other important settings
// Implimented settings: none
export default function SettingsForm() {
  const [goal, setGoal] = useState("5");
	const [isChecked, setChecked] = useState("true");

  const submit = () => {
    // use this function to move useState variables into backend / local storage
    var allIsValid = true;
    if (!isGoalValid(goal)) {
      console.log('Goal is not valid value');
      allIsValid = false;
    }
    if (allIsValid) {
      const goalInMs = hoursToMsToMs(goal);

      // currently console.logs values. Change to add values to database
      console.log('Form start');
			console.log('Sound is ' + (isChecked ? "on" : "off"))
			console.log('Goal is ' + goalInMs);
			console.log('Form submitted');
    }
  };

  return (
    <>
			<CustomCheckbox text="Sound On" isChecked={isChecked} setChecked={setChecked} />
			<NumericalInput text="Goal in hours per week" value={goal} setValue={setGoal} />
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