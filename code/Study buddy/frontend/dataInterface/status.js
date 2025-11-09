import { API_BASE_URL } from "@env";
import { isSameWeek } from "../util/compareTimes";
import { goalCompleted } from "./goal";
import { weeksToMs } from "../util/calculateMs";
import { resetBuddy } from "./resetBuddy";

/*
  100% Manual
*/

export async function changeStatus(status, token) {
	updateStatus(token);
  const response = await fetch(`${API_BASE_URL}/buddy/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({status: status}),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to update status.");
  }
}

export async function getStatus(token) {
	updateStatus(token);
	var status;
	await fetch(`${API_BASE_URL}/buddy/me`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`, 
			'Content-Type': 'application/json',
		},
	})
	.then(data => {
		status = data.status;
	})
	.catch(err => {
		console.error("Failed to fetch status", err);
	});

	if (status == 0) {
		resetBuddy(token);
	}

	return status;
}

export async function updateStatus(token) {
	var last_updated;
	await fetch(`${API_BASE_URL}/buddy/me`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`, 
			'Content-Type': 'application/json',
		},
	})
	.then(data => {
		last_updated = data.last_updated;
	})
	.catch(err => {
		console.error("Failed to fetch data", err);
	});

	if (!isSameWeek(last_updated, Date.now()) && !goalCompleted(token, Date.now() - weeksToMs(1))) {
		const response = await fetch(`${API_BASE_URL}/buddy/status`, {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({status: -1}),
		});

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			throw new Error(data?.error || "Failed to update status.");
		}
	}
}