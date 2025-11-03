import { API_BASE_URL } from "@env";
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { hoursToMs } from "../util/calculateMs";

/*
  50% AI
  50% Manual
*/

export function getExp() {
  const [exp, setExp] = useState(null);
  const { token } = useContext(AuthContext);
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/buddy/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setExp(data.exp);
      })
      .catch(err => {
        console.error("Failed to fetch exp", err);
      });
  }, []);

  if (exp !== null) return exp;
  return 0;
}
