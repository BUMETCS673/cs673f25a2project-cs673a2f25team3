import { API_BASE_URL } from "@env";
import { isSameWeek } from "../util/compareTimes";
import { goalCompleted } from "./goal";
import { weeksToMs } from "../util/calculateMs";

/*
  100% Manual
*/

export async function resetBuddy(token) {
  const response = await fetch(`${API_BASE_URL}/buddy/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to reset Buddy.");
  }
}