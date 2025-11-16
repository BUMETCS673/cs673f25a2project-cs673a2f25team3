import { SubmitButton } from '../components/FormSubmitButton';
import { CustomInput } from './CustomInput';
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

export default function SettingsForm() {
  const [goalInMinutes, setGoalInMinutes] = useState(0);
  const [name, setName] = useState("Buddy");
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
          name: name
        })
      })
      .catch(err => {
        console.error("Failed to update buddy", err);
      });
    }
  };

  return (
    <>
			<CustomInput text="Goal in minutes per week" value={goalInMinutes} setValue={setGoalInMinutes} inputMode='numeric' />
      <CustomInput text="Buddy name" value={name} setValue={setName} inputMode='text' />
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