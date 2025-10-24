import { CustomCheckbox } from '../components/Checkbox';
import { SubmitButton } from '../components/FormSubmitButton';
import { NumericalInput } from './NumericalInput';
import { hoursToMs, msToHours } from '../util/calculateMs';
import { AuthContext } from "../AuthContext";
import React, { useState, useContext } from "react";
import { API_BASE_URL } from "@env";
export const exportForTesting = {
  isGoalValid
}

/*
  25% framework
  5% AI
  70% manual
*/

// Implimented settings: goal
export default function SettingsForm() {
  const [goalInHours, setGoalInHours] = useState(0);
	const [isChecked, setChecked] = useState("true");
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
      setGoalInHours(msToHours(data.goal));
    })
    .catch(err => {
      console.error("Failed to fetch goal", err);
    });
  }, []);
  
  const submit = () => {
    // use this function to move useState variables into backend / local storage
    var allIsValid = true;
    if (!isGoalValid(goalInHours)) {
      console.log('Goal is not valid value');
      allIsValid = false;
    }
    if (allIsValid) {
      // save values to database
      fetch(`${API_BASE_URL}/settings/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: 'light',
          goal: hoursToMs(goalInHours)
        })
      })
      .catch(err => {
        console.error("Failed to fetch goal", err);
      });
    }
  };

  return (
    <>
			<CustomCheckbox text="Sound On" isChecked={isChecked} setChecked={setChecked} />
			<NumericalInput text="Goal in hours per week" value={goalInHours} setValue={setGoalInHours} />
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