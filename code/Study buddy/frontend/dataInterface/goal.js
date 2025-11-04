import { API_BASE_URL } from "@env";
import { hoursToMs } from "../util/calculateMs";
import { getTimeStudiedInWeek } from './timeStudied';

/*
  50% AI
  50% Manual
*/

export async function getGoal(token) {
  var goalMs = null;
  await fetch(`${API_BASE_URL}/settings/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  .then(res => res.json())
  .then(data => {
    goalMs = data.goal;
  })
  .catch(err => {
    console.error("Failed to fetch goal", err);
  });

  if (goalMs !== null) return goalMs;
  return hoursToMs(5);
}

export async function goalCompleted(date, token) {
  return getTimeLeftInGoal(date, token) <= 0;
}

export async function goalCompleted(token) {
  return goalCompleted(Date.now(), token);
}

async function getTimeLeftInGoal(date, token) {
	return Math.max(0, await getGoal(token) - await getTimeStudiedInWeek(date, token));
}