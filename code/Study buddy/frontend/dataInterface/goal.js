import { API_BASE_URL } from "@env";
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { hoursToMs } from "../util/calculateMs";

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
