import { API_BASE_URL } from "@env";
import { isSameWeek } from "../util/compareTimes";
import { goalCompleted } from "./goal";
import { weeksToMs } from "../util/calculateMs";
import { resetBuddy } from "./resetBuddy";

/*
  100% human, front-end safe version
  Handles case when Buddy does not exist in DB
  Only logs "Buddy does not exist" once
*/

let buddyChecked = false; // global flag to ensure the log appears only once

/**
 * Ensure the Buddy exists; if not, create a default Buddy
 * @param {string} token
 * @returns {object|undefined} buddy
 */
export async function ensureBuddyExists(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/buddy/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    if (!text) {
      if (!buddyChecked) {
        console.log("Buddy does not exist, creating default Buddy");
      }

      buddyChecked = true;

      const createRes = await fetch(`${API_BASE_URL}/buddy/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: "Buddy" }),
      });

      const createText = await createRes.text();
      if (!createText) {
        console.warn("Failed to create default Buddy");
        return undefined;
      }

      return JSON.parse(createText);
    }

    buddyChecked = true;
    return JSON.parse(text);
  } catch (err) {
    console.error("ensureBuddyExists failed", err);
    return undefined;
  }
}

/**
 * Update Buddy status
 * @param {number} status
 * @param {string} token
 */
export async function changeStatus(status, token) {
  await updateStatus(token);

  try {
    const response = await fetch(`${API_BASE_URL}/buddy/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const text = await response.text();
    if (!text) {
      console.warn("Buddy does not exist, cannot update status");
      return undefined;
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to change status", err);
    return undefined;
  }
}

/**
 * Get the current Buddy status
 * @param {string} token
 * @returns {number|undefined} status
 */
export async function getStatus(token) {
  const buddy = await ensureBuddyExists(token);
  if (!buddy) return undefined;

  await updateStatus(token);

  return buddy.status;
}

/**
 * Weekly automatic check and reset of Buddy status
 * @param {string} token
 */
export async function updateStatus(token) {
  try {
    const buddy = await ensureBuddyExists(token);
    if (!buddy) {
      console.warn("Buddy does not exist, cannot update status");
      return;
    }

    const last_updated = buddy.last_updated;
    const completed = await goalCompleted(token, Date.now() - weeksToMs(1));

    if (!isSameWeek(last_updated, Date.now()) && !completed) {
      const updateRes = await fetch(`${API_BASE_URL}/buddy/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: -1 }),
      });

      const updateText = await updateRes.text();
      if (!updateText) {
        console.warn("Buddy does not exist, cannot automatically reset status");
        return;
      }

      // Optional: parse the updated Buddy
      // const updatedBuddy = JSON.parse(updateText);
    }
  } catch (err) {
    console.error("Failed to update status", err);
  }
}
