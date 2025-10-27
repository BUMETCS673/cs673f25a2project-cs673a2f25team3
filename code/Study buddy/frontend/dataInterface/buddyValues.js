import { API_BASE_URL } from "@env";
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

/*
  50% AI
  50% Manual
*/

export function getBuddyValues() {
  const [data, setData] = useState(null);
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
        console.error("Failed to fetch buddy", err);
      });
  }, []);

	const size = 200;
	const outlineWidth = 4;
  if (data !== null) {
    return {
			buddyType: "deer",
			outlineColor: "black",
			insideColor: "#8B4513",
			status: data.status,
			size: size,
			outlineWidth: outlineWidth
    }
  };
  return {buddyType: "deer", outlineColor: "black", insideColor: "#8B4513", status: 4, size: size, outlineWidth: outlineWidth};
}