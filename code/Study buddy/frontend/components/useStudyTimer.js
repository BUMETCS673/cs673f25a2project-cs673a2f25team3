/*
  70% AI
  30% Human
*/

import {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";
import { AuthContext } from "../AuthContext";
import { increaseExp } from "../dataInterface/exp";
import { changeStatus, getStatus } from "../dataInterface/status";
import { goalCompleted } from "../dataInterface/goal";
import {
  CIRCLE_BORDER_WIDTH,
  CIRCLE_DIAMETER,
  CIRCLE_MARKER_SIZE,
  MAX_MINUTES,
  TIMER_STORAGE_KEY,
} from "./studyTimerConstants";

// Encapsulates all Study Timer business logic and side effects.
export function useStudyTimer() {
  const { token } = useContext(AuthContext);

  // Local timer state.
  const [status, setStatus] = useState("idle"); // idle | running | paused | complete
  const [targetMinutes, setTargetMinutes] = useState(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [sessionStartISO, setSessionStartISO] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const progressIntervalRef = useRef(null);

  // Derived values for UI rendering.
  const totalTargetSeconds = targetMinutes ? targetMinutes * 60 : null;
  const minutesRemaining = totalTargetSeconds
    ? Math.max(totalTargetSeconds - elapsedSeconds, 0)
    : null;
  const progress = totalTargetSeconds
    ? Math.min(elapsedSeconds / totalTargetSeconds, 1)
    : 0;
  const remainingSeconds = totalTargetSeconds
    ? Math.max(totalTargetSeconds - elapsedSeconds, 0)
    : elapsedSeconds;
  // Show a countdown when a target is set; otherwise fall back to counting up.
  const timerDisplaySeconds =
    totalTargetSeconds !== null ? remainingSeconds : elapsedSeconds;
  const circleRadius = CIRCLE_DIAMETER / 2 - CIRCLE_BORDER_WIDTH;
  const circleAngle = progress * 2 * Math.PI - Math.PI / 2;
  const markerOffsetX =
    circleRadius * Math.cos(circleAngle) +
    CIRCLE_DIAMETER / 2 -
    CIRCLE_MARKER_SIZE / 2;
  const markerOffsetY =
    circleRadius * Math.sin(circleAngle) +
    CIRCLE_DIAMETER / 2 -
    CIRCLE_MARKER_SIZE / 2;

  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isComplete = status === "complete";

  const statusLabel = isComplete
    ? "Session Complete"
    : isPaused
    ? "Session Paused"
    : "Study Session Active";

  const statusMessage = isComplete
    ? "Great job! Session logged successfully."
    : isPaused
    ? "Take a breath and come back when you're ready."
    : "Stay focused and keep going!";

  const footerMessage = isComplete
    ? "All set - start another session when you'd like."
    : isPaused
    ? "Paused - take a breath and come back when ready."
    : "Timer is running. Your progress is saved automatically.";

  const calculateElapsedSeconds = useCallback(
    (now = Date.now()) => {
      if (status === "running" && startTimestamp) {
        const diff = Math.floor((now - startTimestamp) / 1000);
        return accumulatedSeconds + Math.max(0, diff);
      }
      return accumulatedSeconds;
    },
    [status, startTimestamp, accumulatedSeconds]
  );

  const stopProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Persist the current timer snapshot to the backend so other devices can resume later.
  const persistProgress = useCallback(
    async (statusOverride) => {
      if (!token || !targetMinutes || !sessionStartISO) return;
      try {
        const response = await fetch(`${API_BASE_URL}/study/progress`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            target_minutes: targetMinutes,
            elapsed_seconds: calculateElapsedSeconds(),
            session_start: sessionStartISO,
            status: statusOverride || status,
          }),
        });
        if (response.status === 404) return;
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || "Failed to store progress snapshot.");
        }
      } catch (err) {
        console.log("Failed to persist study progress", err);
      }
    },
    [token, targetMinutes, sessionStartISO, status, calculateElapsedSeconds]
  );

  // Remove the remote snapshot when we intentionally abandon the session.
  const clearProgressRecord = useCallback(async () => {
    stopProgressInterval();
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/study/progress`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 404) return;
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to clear progress snapshot.");
      }
    } catch (err) {
      console.log("Failed to clear study progress", err);
    }
  }, [token, stopProgressInterval]);

  // Hydrate in-progress timer from local storage.
  useEffect(() => {
    let cancelled = false;
    const loadState = async () => {
      try {
        const serialized = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
        if (!serialized) {
          return;
        }
        const saved = JSON.parse(serialized);
        if (cancelled) return;

        setStatus(saved.status || "idle");
        setTargetMinutes(saved.targetMinutes ?? null);
        setCustomMinutes(saved.customMinutes ?? "");
        setSessionStartISO(saved.sessionStartISO ?? null);
        setStartTimestamp(saved.startTimestamp ?? null);
        setAccumulatedSeconds(saved.accumulatedSeconds ?? 0);
      } catch (err) {
        console.log("Failed to hydrate study timer state", err);
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    loadState();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist timer snapshot locally while it is active.
  useEffect(() => {
    if (!hydrated) return;
    if (status === "idle" || status === "complete") {
      AsyncStorage.removeItem(TIMER_STORAGE_KEY).catch((err) =>
        console.log("Failed to clear study timer state", err)
      );
      return;
    }

    const stateToPersist = {
      status,
      targetMinutes,
      customMinutes,
      sessionStartISO,
      startTimestamp,
      accumulatedSeconds,
    };

    AsyncStorage.setItem(
      TIMER_STORAGE_KEY,
      JSON.stringify(stateToPersist)
    ).catch((err) => console.log("Failed to persist study timer state", err));
  }, [
    status,
    targetMinutes,
    customMinutes,
    sessionStartISO,
    startTimestamp,
    accumulatedSeconds,
    hydrated,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    setElapsedSeconds(calculateElapsedSeconds());
  }, [calculateElapsedSeconds, hydrated]);

  useEffect(() => {
    if (status !== "running") {
      setElapsedSeconds(calculateElapsedSeconds());
    }
  }, [status, calculateElapsedSeconds]);

  // Pull remote progress (if any) when no local timer is active.
  useEffect(() => {
    if (!hydrated || !token) return;
    if (status !== "idle") return;
    if (targetMinutes) return;

    let cancelled = false;
    const loadRemoteProgress = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/study/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (cancelled) return;
        if (response.status === 204 || response.status === 404) return;
        if (!response.ok) throw new Error("Failed to fetch study progress");

        const data = await response.json();
        if (!data) return;

        const {
          target_minutes,
          elapsed_seconds,
          session_start,
          status: remoteStatus,
          updated_at,
        } = data;

        if (!target_minutes || !session_start || !remoteStatus) return;

        let baseElapsed = Number(elapsed_seconds) || 0;
        const updatedAt = updated_at ? Date.parse(updated_at) : null;
        if (remoteStatus === "running" && updatedAt) {
          const delta = Math.max(
            0,
            Math.floor((Date.now() - updatedAt) / 1000)
          );
          baseElapsed += delta;
        }

        setTargetMinutes(target_minutes);
        setCustomMinutes(String(target_minutes));
        setSessionStartISO(session_start);
        setAccumulatedSeconds(baseElapsed);
        setElapsedSeconds(baseElapsed);
        if (remoteStatus === "running") {
          setStartTimestamp(Date.now());
          setStatus("running");
        } else if (remoteStatus === "paused") {
          setStartTimestamp(null);
          setStatus("paused");
        } else if (remoteStatus === "complete") {
          setStartTimestamp(null);
          setStatus("complete");
        }
      } catch (err) {
        console.log("Failed to load study progress", err);
      }
    };

    loadRemoteProgress();
    return () => {
      cancelled = true;
    };
  }, [hydrated, token, status, targetMinutes]);

  // Sync progress to backend at 30s intervals while running.
  useEffect(() => {
    if (!token || !hydrated) return;
    stopProgressInterval();
    if (!targetMinutes || !sessionStartISO) return;

    if (status === "running") {
      persistProgress("running");
      progressIntervalRef.current = setInterval(() => {
        persistProgress("running");
      }, 30000);
    } else if (status === "paused") {
      persistProgress("paused");
    } else if (status === "complete") {
      clearProgressRecord();
    } else if (status === "idle") {
      clearProgressRecord();
    }

    return stopProgressInterval;
  }, [
    status,
    token,
    hydrated,
    targetMinutes,
    sessionStartISO,
    persistProgress,
    clearProgressRecord,
    stopProgressInterval,
  ]);

  useEffect(() => {
    return () => {
      stopProgressInterval();
    };
  }, [stopProgressInterval]);

  const handleStartTimer = (minutes) => {
    const clamped = Math.min(MAX_MINUTES, Math.max(1, Math.round(minutes)));
    const now = Date.now();
    const startISO = new Date(now).toISOString();

    setTargetMinutes(clamped);
    setCustomMinutes(String(clamped));
    setSessionStartISO(startISO);
    setStartTimestamp(now);
    setAccumulatedSeconds(0);
    setElapsedSeconds(0);
    setStatus("running");
    setError("");
  };

  const handleCustomStart = () => {
    const parsed = parseInt(customMinutes, 10);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_MINUTES) {
      setError(`Please enter between 1 and ${MAX_MINUTES} minutes.`);
      return;
    }
    handleStartTimer(parsed);
  };

  const handlePauseResume = () => {
    if (status === "running") {
      const now = Date.now();
      const total = calculateElapsedSeconds(now);
      setAccumulatedSeconds(total);
      setStartTimestamp(null);
      setStatus("paused");
    } else if (status === "paused") {
      setStartTimestamp(Date.now());
      setStatus("running");
    }
    setError("");
  };

  const handleReset = async () => {
    setStatus("idle");
    setTargetMinutes(null);
    setCustomMinutes("");
    setSessionStartISO(null);
    setStartTimestamp(null);
    setAccumulatedSeconds(0);
    setElapsedSeconds(0);
    setError("");
    await clearProgressRecord();
  };

  const handleStop = useCallback(async () => {
    const now = Date.now();
    const totalSeconds = calculateElapsedSeconds(now);
    const endISO = new Date(now).toISOString();
    const startISO = sessionStartISO || new Date(now).toISOString();

    setAccumulatedSeconds(totalSeconds);
    setElapsedSeconds(totalSeconds);
    setStartTimestamp(null);

    if (!token) {
      setError("You must be logged in to record study sessions.");
      setStatus("paused");
      return;
    }

    const durationMinutes = Math.max(
      1,
      Math.round(
        (new Date(endISO).getTime() - new Date(startISO).getTime()) / 60000
      )
    );
    const payload = {
      duration: durationMinutes,
      start_time: startISO,
      end_time: endISO,
    };

    setIsSubmitting(true);
    setError("");
    try {
      const goalStartedFinished = await goalCompleted(token);
      const response = await fetch(`${API_BASE_URL}/study/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to record study session.");
      }

      increaseExp(payload.duration, token);
      const goalNowFinished = await goalCompleted(token);

      if ((await getStatus(token)) < 4 && !goalStartedFinished && goalNowFinished) {
        changeStatus(1, token);
      }

      setStatus("complete");
      await clearProgressRecord();
    } catch (err) {
      console.log("Failed to log study session", err);
      setError(err.message || "Failed to save study session.");
      setStatus("paused");
    } finally {
      setIsSubmitting(false);
    }
  }, [calculateElapsedSeconds, sessionStartISO, token, clearProgressRecord]);

  // Local ticking loop while the timer runs so UI stays responsive.
  useEffect(() => {
    if (status !== "running") return;

    const tick = () => {
      const next = calculateElapsedSeconds();
      setElapsedSeconds(next);

      if (totalTargetSeconds && next >= totalTargetSeconds && !isSubmitting) {
        handleStop();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [status, calculateElapsedSeconds, totalTargetSeconds, isSubmitting, handleStop]);

  const isCustomValid = () => {
    const value = parseInt(customMinutes, 10);
    return !Number.isNaN(value) && value >= 1 && value <= MAX_MINUTES;
  };

  const clearError = () => setError("");

  return {
    status,
    isIdle,
    isRunning,
    isPaused,
    isComplete,
    statusLabel,
    statusMessage,
    footerMessage,
    targetMinutes,
    customMinutes,
    setCustomMinutes,
    minutesRemaining,
    progress,
    markerOffsetX,
    markerOffsetY,
    elapsedSeconds,
    timerDisplaySeconds,
    remainingSeconds,
    error,
    hydrated,
    isSubmitting,
    handleStartTimer,
    handleCustomStart,
    handlePauseResume,
    handleReset,
    handleStop,
    isCustomValid,
    clearError,
  };
}
