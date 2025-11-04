import { API_BASE_URL } from "@env";

/*
  100% Manual
*/

export async function changeStatus(status, token) {
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
	var status;
	const response = await fetch(`${API_BASE_URL}/buddy/me`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`, 
			'Content-Type': 'application/json',
		},
	})
	.then(res => res.json())
	.then(data => {
		status = data.status;
	})
	.catch(err => {
		console.error("Failed to fetch status", err);
	});

	return status;
}
