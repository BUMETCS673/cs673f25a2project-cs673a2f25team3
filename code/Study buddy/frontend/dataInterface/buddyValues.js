import { API_BASE_URL } from "@env";
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { updateStatus } from "./status";

/*
  100% Manual
*/

const DEFAULT_BUDDY_DATA = {
  status: 4,
  exp: 0,
};

export function useBuddyValues() {
  const [data, setData] = useState(DEFAULT_BUDDY_DATA);
  const { token } = useContext(AuthContext);
  
  React.useEffect(() => {
    (async () => {
      await updateStatus(token);
    })();
  }, []);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/buddy/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
      .then(apiBuddy => {
        if (apiBuddy && typeof apiBuddy === "object") {
          setData(apiBuddy);
        } else {
          setData(DEFAULT_BUDDY_DATA);
        }
      })
      .catch(() => {
        setData(DEFAULT_BUDDY_DATA);
      });
  }, []);

  const status = Number.isFinite(data?.status)
    ? data.status
    : DEFAULT_BUDDY_DATA.status;
  const parsedExp = (() => {
    const raw = data?.exp;
    if (Number.isFinite(raw)) return raw;
    if (typeof raw === "string" && raw.trim().length > 0) {
      const asNumber = Number(raw);
      if (Number.isFinite(asNumber)) return asNumber;
    }
    return DEFAULT_BUDDY_DATA.exp;
  })();
  const size = Math.max(0, 100 + parsedExp / 2);

  return {
    buddyType: "deer",
    outlineColor: "black",
    insideColor: "#8B4513",
    status,
    size,
  };
}
