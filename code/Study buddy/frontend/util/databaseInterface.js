import { hoursToMs, minutesToMs } from './calculateMs';
import { isSameWeek } from './compareTimes';
import { AuthContext } from "../AuthContext";
import React, { useState, useContext } from "react";
import { API_BASE_URL } from "@env";

/*
	20% AI
	80% manual
*/

export function getTimeStudied(date) {
	var timeStudied = 0;
	const studySessions = getStudySessions();

	studySessions.forEach(studySession => {
	if (isSameWeek(date, studySession.created_at)) timeStudied += studySession.duration
	});

	return timeStudied;
}

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

export function getTimeLeftInGoal() {
	return Math.max(0, getGoal() - getTimeStudied(Date.now()));
}