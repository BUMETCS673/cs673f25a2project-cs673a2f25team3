import { API_BASE_URL } from "@env";
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

/*
  100% Manual
*/

export function useBuddyValues() {
  const [data, setData] = useState({
          status: 4,
          exp: 0
        });
  const { token } = useContext(AuthContext);
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/buddy/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
      })
      .catch(err => {
      });
  }, []);

  return {
			buddyType: "deer",
			outlineColor: "black",
			insideColor: "#8B4513",
			status: data.status,
			size: 100 + data.exp / 2
    }
}