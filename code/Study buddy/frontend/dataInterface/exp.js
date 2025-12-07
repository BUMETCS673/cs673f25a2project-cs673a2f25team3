import { API_BASE_URL } from "@env";

/*
  100% Manual
*/

export async function increaseExp(exp, token) {
  const response = await fetch(`${API_BASE_URL}/buddy/exp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({exp: exp}),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to update exp.");
  }
}
