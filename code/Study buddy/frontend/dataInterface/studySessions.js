import { API_BASE_URL } from "@env";
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

/*
  50% AI
  50% manual
*/

export async function getStudySessions(token) {
  var studySessions = null;

  await fetch(`${API_BASE_URL}/study/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  .then(res => res.json())
  .then(data => {
    studySessions = data;
  })
  .catch(err => {
    console.error("Failed to fetch goal", err);
  });

  if (Array.isArray(studySessions)) return studySessions;
  return [];
}
