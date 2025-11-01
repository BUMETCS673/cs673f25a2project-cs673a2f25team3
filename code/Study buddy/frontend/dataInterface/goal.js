import { API_BASE_URL } from "@env";
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

/*
  50% AI
  50% Manual
*/

export function getGoal() {
  const [goalMin, setGoalMin] = useState(null);
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
        setGoalMin(data.goal);
      })
      .catch(err => {
        console.error("Failed to fetch goal", err);
      });
  }, []);

  if (goalMin !== null) return goalMin;
  return 5*60;
}
