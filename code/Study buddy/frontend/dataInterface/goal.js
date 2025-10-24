import { API_BASE_URL } from "@env";
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { hoursToMs } from "../util/calculateMs";


export function getGoal() {
  const [goalMs, setGoalMs] = useState(null);
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
        setGoalMs(data.goal);
      })
      .catch(err => {
        console.error("Failed to fetch goal", err);
      });
  }, []);

  if (goalMs !== null) return goalMs;
  return hoursToMs(5);
}
