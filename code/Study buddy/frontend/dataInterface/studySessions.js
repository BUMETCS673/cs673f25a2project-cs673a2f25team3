import { API_BASE_URL } from "@env";
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

/*
  50% AI
  50% manual
*/

export function getStudySessions() {
  const [studySessions, setStudySessions] = useState(null);
  const { token } = useContext(AuthContext);
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/study/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setStudySessions(data);
      })
      .catch(err => {
        console.error("Failed to fetch goal", err);
      });
  }, []);

  if (studySessions !== null) return studySessions;
  return [];
}
